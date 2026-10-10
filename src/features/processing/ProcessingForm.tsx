/** @author Enzo Ribas (https://github.com/oEnzoRibas) */
import { useEffect, useRef, useState } from "react";
import { isAxiosError } from "axios";
import { Link, useNavigate } from "react-router-dom";
import Card from "../../components/Card";
import Button from "../../components/Button";
import Pagination from "../../shared/ui/Pagination";
import { usePage } from "../../shared/ui/usePage";
import type { Page } from "../../shared/api/page";
import { errorMessage } from "../../shared/api/transport";
import { collections, donations, type Collection, type Donation } from "../intake/api";
import { decimal, displayDecimal, submittedInstant } from "../intake/quantities";
import { commandIdentity, inventory, processing, type Lot, type ProcessingKind, type ProcessingPayload } from "./api";
const noSources = async (): Promise<Page<Donation | Collection>> => ({items: [], pages: 0, total: 0});
const noLots = async (): Promise<Page<Lot>> => ({items: [], pages: 0, total: 0});
/** Explicit source lines are posted in one atomic batch; the ledger validates concurrent availability. */
export default function ProcessingForm({ kind }: { kind: ProcessingKind }) {
  const navigate = useNavigate();
  const [origin, setOrigin] = useState<"donations" | "collections">("donations");
  const [page, setPage] = useState(0);
  const [revision, setRevision] = useState(0);
  const sources = usePage<Donation | Collection>(kind === "pressings" ? noSources : origin === "donations" ? donations.list : collections.list, page, revision);
  const lots = usePage(kind === "sortings" ? noLots : inventory.lots, page, revision);
  const [sourceId, setSourceId] = useState("");
  const [source, setSource] = useState<Donation | Collection | null>(null);
  const [sourceBusy, setSourceBusy] = useState(false);
  const [sourceError, setSourceError] = useState("");
  const [itemId, setItemId] = useState("");
  const [lot, setLot] = useState<Lot | null>(null);
  const [sortingType, setSortingType] = useState<"GROSS" | "PRIMARY" | "FINE">("PRIMARY");
  const [weight, setWeight] = useState("");
  const [volume, setVolume] = useState("");
  const [rejectWeight, setRejectWeight] = useState("0");
  const [rejectVolume, setRejectVolume] = useState("0");
  const [finalVolume, setFinalVolume] = useState("");
  const [batch, setBatch] = useState<{ payload: ProcessingPayload; label: string }[]>([]);
  const [operationDate, setOperationDate] = useState("");
  const [saving, setSaving] = useState(false);
  const [failure, setFailure] = useState("");
  const key = useRef(commandIdentity());
  const requestActive = useRef(false);
  const [uncertainCommand, setUncertainCommand] = useState<ProcessingPayload | null>(null);
  const editingDisabled = saving || Boolean(uncertainCommand);
  const sorting = kind === "sortings";
  const title = sorting ? "triagem" : "prensagem";
  useEffect(() => {
    let active = true;
    setSource(null); setItemId(""); setSourceError("");
    if (!sourceId || !sorting) { setSourceBusy(false); return; }
    setSourceBusy(true);
    void (origin === "donations" ? donations : collections).get(sourceId).then(value => { if (active) setSource(value); }).catch(err => { if (active) setSourceError(errorMessage(err)); }).finally(() => { if (active) setSourceBusy(false); });
    return () => { active = false; };
  }, [sourceId, origin, sorting, revision]);
  const item = source?.inputItems?.find(value => value.id === itemId);
  const loading = sorting ? sources.busy : lots.busy;
  const loadError = sorting ? sources.error : lots.error;
  const eligibleLots = lots.data.items.filter(value => value.sortedItemId && /[1-9]/.test(value.availableWeightKg ?? "") && /[1-9]/.test(value.availableVolumeM3 ?? ""));
  /** Validates one explicit line without inferring remaining stock from its original receipt. */
  function currentPayload(): ProcessingPayload {
    const weightKg = decimal(weight), volumeM3 = decimal(volume);
    let payload: ProcessingPayload;
    if (sorting) {
      if (!item?.id || !item.materialSubtypeId) throw new Error("Selecione um item da entrada.");
      payload = { sortingType, sortedItems: [{ inputItemId: item.id, materialSubtypeId: item.materialSubtypeId, weightKg, volumeM3, rejectWeightKg: decimal(rejectWeight, 11, 4, true), rejectVolumeM3: decimal(rejectVolume, 11, 4, true), destinationType: "STOCK" }] };
    } else {
      if (!lot?.sortedItemId || !lot.materialSubtypeId) throw new Error("Selecione um lote de triagem.");
      payload = { pressedBales: [{ sortedItemId: lot.sortedItemId, materialSubtypeId: lot.materialSubtypeId, weightKg, initialVolumeM3: volumeM3, finalVolumeM3: decimal(finalVolume), destinationType: "STOCK" }] };
    }
    return payload;
  }
  function addLine() {
    setFailure("");
    try {
      const payload = currentPayload();
      setBatch(current => [...current, { payload, label: sorting ? `${origin === "donations" ? "Doação" : "Coleta"} · ${sourceId.slice(0,8)} · ${itemId.slice(0,8)}` : `${lot?.materialName} · ${lot?.id?.slice(0,8)}` }]);
      setWeight(""); setVolume(""); setRejectWeight("0"); setRejectVolume("0"); setFinalVolume("");
    } catch (err) { setFailure(err instanceof Error ? err.message : errorMessage(err)); }
  }
  return <Card><h1>Registrar {title}</h1><p className="page-description">{sorting ? "Separe uma entrada em material aproveitável e rejeitos. Os valores originais não representam o saldo restante: o servidor verifica a disponibilidade ao registrar." : "Selecione um lote de triagem disponível. O peso é conservado e o volume final deve ser menor que o inicial. A disponibilidade será verificada novamente ao registrar."}</p>
    <form className="resource-form" onSubmit={async e => {
      e.preventDefault(); if (requestActive.current) return; setFailure("");
      let submitted: ProcessingPayload | null = null;
      try {
        let payload = uncertainCommand;
        if (!payload) {
          if (batch.length && (weight || volume || finalVolume || rejectWeight !== "0" || rejectVolume !== "0")) throw new Error("Adicione o item em edição ao lote antes de registrar, ou limpe suas quantidades.");
          const entries = batch.length ? batch.map(entry => entry.payload) : [currentPayload()];
          const date = operationDate ? submittedInstant(operationDate) : undefined;
          payload = sorting
            ? { sortingType, sortingDate: date, sortedItems: entries.flatMap(entry => "sortedItems" in entry ? entry.sortedItems ?? [] : []) }
            : { pressingDate: date, pressedBales: entries.flatMap(entry => "pressedBales" in entry ? entry.pressedBales ?? [] : []) };
        }
        submitted = payload; requestActive.current = true; setSaving(true); await processing.create(kind, payload, key.current(payload)); navigate(`/${kind}`);
      } catch (err) {
        if (submitted && (uncertainCommand || !isAxiosError(err) || !err.response || err.response.status >= 500 || err.response.status === 408)) setUncertainCommand(submitted);
        setFailure(isAxiosError(err) ? errorMessage(err) : submitted ? "Não foi possível confirmar a resposta do registro." : err instanceof Error ? err.message : errorMessage(err));
      } finally { requestActive.current = false; setSaving(false); }
    }}>
      <fieldset disabled={editingDisabled}><legend>Origem do material</legend>
        {sorting && <><label>Tipo de entrada<select value={origin} onChange={e => { setOrigin(e.target.value as typeof origin); setSourceId(""); setPage(0); }}><option value="donations">Doação</option><option value="collections">Coleta</option></select></label><label>Entrada<select required={!batch.length} value={sourceId} disabled={loading} onChange={e => setSourceId(e.target.value)}><option value="">Selecione…</option>{sourceId && !sources.data.items.some(value => value.id === sourceId) && <option value={sourceId}>{sourceId}</option>}{sources.data.items.map(value => <option key={value.id} value={value.id}>{new Date(("donationDate" in value ? value.donationDate : (value as Collection).realizationDate) ?? "").toLocaleString("pt-BR")} · {value.id?.slice(0,8)}</option>)}</select></label>{sourceBusy && <p role="status">Carregando itens…</p>}{sourceError && <p role="alert">{sourceError}</p>}<label>Item recebido<select required={!batch.length} value={itemId} disabled={sourceBusy} onChange={e => setItemId(e.target.value)}><option value="">Selecione…</option>{source?.inputItems?.filter(value => value.isActive !== false).map(value => <option key={value.id} value={value.id}>{value.materialSubtypeId?.slice(0,8)} · {displayDecimal(value.weightKg)} kg · {displayDecimal(value.volumeM3)} m³ (original)</option>)}</select></label><label>Etapa da triagem<select value={sortingType} onChange={e => setSortingType(e.target.value as typeof sortingType)}><option value="GROSS">Grosseira</option><option value="PRIMARY">Primária</option><option value="FINE">Fina</option></select></label></>}
        {!sorting && <label>Lote de triagem<select required={!batch.length} value={lot?.id ?? ""} disabled={loading} onChange={e => setLot(eligibleLots.find(value => value.id === e.target.value) ?? null)}><option value="">Selecione…</option>{lot && !eligibleLots.some(value => value.id === lot.id) && <option value={lot.id}>{lot.materialName} · {lot.id?.slice(0,8)}</option>}{eligibleLots.map(value => <option key={value.id} value={value.id}>{value.materialName} · {displayDecimal(value.availableWeightKg)} kg · {displayDecimal(value.availableVolumeM3)} m³ · {value.id?.slice(0,8)}</option>)}</select></label>}
        {!loading && !loadError && (sorting ? !sources.data.items.length : !eligibleLots.length) && <p className="empty-state">{sorting ? "Nenhuma entrada nesta página. Registre uma coleta ou doação para iniciar a triagem." : "Nenhum lote de triagem disponível nesta página. Confira as próximas páginas ou registre uma triagem."}</p>}{loading && <p role="status">Carregando origens…</p>}{loadError && <p role="alert">{loadError}</p>}<Button type="button" variant="secondary" titulo="Atualizar origens" onClick={() => setRevision(n => n + 1)} /><Pagination page={page} pages={sorting ? sources.data.pages : lots.data.pages} onChange={setPage} />
      </fieldset>
      <fieldset disabled={editingDisabled}><legend>Quantidades do registro</legend><p>Use até quatro casas decimais, sem separador de milhar. Destino: estoque. Deixe a data em branco para usar o momento do registro no servidor.</p><label>Data e hora da operação (opcional)<input type="datetime-local" value={operationDate} onChange={e => setOperationDate(e.target.value)} /></label><p>A data informada usa o fuso deste dispositivo. Ela identifica quando a operação ocorreu; o histórico de auditoria registra quando foi enviada.</p><label>Peso {sorting ? "bruto" : "do fardo"} (kg)<input required={!batch.length} inputMode="decimal" value={weight} onChange={e => setWeight(e.target.value)} /></label><label>Volume {sorting ? "bruto" : "inicial"} (m³)<input required={!batch.length} inputMode="decimal" value={volume} onChange={e => setVolume(e.target.value)} /></label>{sorting ? <><label>Peso de rejeitos (kg)<input required={!batch.length} inputMode="decimal" value={rejectWeight} onChange={e => setRejectWeight(e.target.value)} /></label><label>Volume de rejeitos (m³)<input required={!batch.length} inputMode="decimal" value={rejectVolume} onChange={e => setRejectVolume(e.target.value)} /></label></> : <label>Volume final (m³)<input required={!batch.length} inputMode="decimal" value={finalVolume} onChange={e => setFinalVolume(e.target.value)} /></label>}</fieldset>
      <Button variant="secondary" titulo="Adicionar item ao lote" disabled={editingDisabled || loading || sourceBusy || Boolean(loadError || sourceError)} onClick={addLine} />
      {batch.length > 0 && <section aria-label="Itens do lote"><h2>Itens do lote ({batch.length})</h2><p>Todos os itens serão registrados juntos. Se algum item for rejeitado, a operação inteira será recusada.</p>{batch.map((entry, index) => {
        const line = "sortedItems" in entry.payload ? entry.payload.sortedItems?.[0] : "pressedBales" in entry.payload ? entry.payload.pressedBales?.[0] : undefined;
        return <div className="sale-line" key={index}><h3>Item {index + 1} · {entry.label}</h3><p>{displayDecimal(line?.weightKg)} kg · {displayDecimal(line && "volumeM3" in line ? line.volumeM3 : line && "initialVolumeM3" in line ? line.initialVolumeM3 : undefined)} m³{line && "finalVolumeM3" in line ? ` → ${displayDecimal(line.finalVolumeM3)} m³` : ""}{line && "rejectWeightKg" in line ? ` · Rejeitos: ${displayDecimal(line.rejectWeightKg)} kg / ${displayDecimal(line.rejectVolumeM3)} m³` : ""}</p><Button variant="secondary" titulo={`Remover item ${index + 1}`} disabled={editingDisabled} onClick={() => setBatch(current => current.filter((_, position) => position !== index))} /></div>;
      })}</section>}
      {uncertainCommand && <p role="status">O resultado do registro está pendente de confirmação. A edição foi bloqueada para evitar outra operação. Reenvie o mesmo registro para consultar o resultado com segurança. Se sair ou recarregar a página, consulte o histórico antes de registrar novamente.</p>}
      {failure && <p role="alert">{failure}</p>}<div className="form-actions"><Link className="button button-secondary" to={`/${kind}`}>Voltar</Link><Button type="submit" titulo={saving ? "Registrando…" : "Registrar " + title} disabled={saving || (!uncertainCommand && (loading || sourceBusy || Boolean(loadError || sourceError)))} /></div>
    </form></Card>;
}
