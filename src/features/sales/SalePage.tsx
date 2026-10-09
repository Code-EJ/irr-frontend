/** @author Enzo Ribas (https://github.com/oEnzoRibas) */
import { useEffect, useRef, useState } from "react";
import { isAxiosError } from "axios";
import { Link, useNavigate, useParams } from "react-router-dom";
import Card from "../../components/Card";
import Button from "../../components/Button";
import Modal from "../../components/Modal";
import ResourcePicker from "../../shared/ui/ResourcePicker";
import Pagination from "../../shared/ui/Pagination";
import { usePage } from "../../shared/ui/usePage";
import { errorMessage } from "../../shared/api/transport";
import { documentChoice, documentChoices } from "../intake/choices";
import { decimal, displayDecimal, localDateTime, submittedInstant } from "../intake/quantities";
import { documents } from "../documents/api";
import { inventory } from "../processing/api";
import { buyerChoice, buyerChoices, sales, saleStatus, type Sale, type SaleLine } from "./api";
const emptyReferences = () => ({ buyerId: "", nfeAttachmentId: "", mtrAttachmentId: "", cdfAttachmentId: "" });
/** Keeps draft editing distinct from versioned, idempotent stock transitions. */
export default function SalePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [record, setRecord] = useState<Sale | null>(null);
  const [loading, setLoading] = useState(Boolean(id));
  const [loadError, setLoadError] = useState("");
  const [revision, setRevision] = useState(0);
  const [references, setReferences] = useState(emptyReferences);
  const [date, setDate] = useState(() => localDateTime(new Date().toISOString()));
  const [lines, setLines] = useState<SaleLine[]>([]);
  const [page, setPage] = useState(0);
  const [lotRevision, setLotRevision] = useState(0);
  const lots = usePage(inventory.lots, page, lotRevision);
  const [selectedLotId, setSelectedLotId] = useState("");
  const [saving, setSaving] = useState(false);
  const [failure, setFailure] = useState("");
  const [uncertainCreation, setUncertainCreation] = useState(false);
  const [confirmation, setConfirmation] = useState<{ action: "post" | "reverse" | "deactivate"; version: number; key: string } | null>(null);
  const creationAttempt = useRef(false);
  const draft = !id || record?.status === "DRAFT";
  useEffect(() => {
    let active = true;
    if (!id) return;
    setLoading(true); setLoadError(""); setFailure("");
    void sales.get(id).then(value => {
      if (!active) return;
      if (!value.saleDate || !value.buyerId || !value.items?.length || value.items.some(line => !line.stockLotId || !line.materialSubtypeId || line.weightKg === undefined || line.volumeM3 === undefined || line.unitPrice === undefined)) throw new Error("Incomplete sale response.");
      setRecord(value); setDate(localDateTime(value.saleDate));
      setReferences({ buyerId: value.buyerId, nfeAttachmentId: value.nfeAttachmentId ?? "", mtrAttachmentId: value.mtrAttachmentId ?? "", cdfAttachmentId: value.cdfAttachmentId ?? "" });
      setLines(value.items.map(line => ({ stockLotId: line.stockLotId!, materialSubtypeId: line.materialSubtypeId!, weightKg: line.weightKg!, volumeM3: line.volumeM3!, unitPrice: line.unitPrice! })));
    }).catch(err => { if (active) setLoadError(errorMessage(err)); }).finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [id, revision]);
  const savedLines = record?.items?.map(line => ({ stockLotId: line.stockLotId, materialSubtypeId: line.materialSubtypeId, weightKg: line.weightKg, volumeM3: line.volumeM3, unitPrice: line.unitPrice }));
  const dirty = Boolean(record && (date !== localDateTime(record.saleDate) || references.buyerId !== record.buyerId || references.nfeAttachmentId !== (record.nfeAttachmentId ?? "") || references.mtrAttachmentId !== (record.mtrAttachmentId ?? "") || references.cdfAttachmentId !== (record.cdfAttachmentId ?? "") || JSON.stringify(lines) !== JSON.stringify(savedLines)));
  function changeLine(index: number, field: "weightKg" | "volumeM3" | "unitPrice", value: string) { setLines(current => current.map((line, position) => position === index ? { ...line, [field]: value } : line)); }
  function confirm(action: "post" | "reverse" | "deactivate") {
    if (!record || !Number.isSafeInteger(record.version)) return;
    setFailure(""); setConfirmation({ action, version: record.version!, key: crypto.randomUUID() });
  }
  const actionTitle = confirmation?.action === "post" ? "Registrar venda" : confirmation?.action === "reverse" ? "Reverter venda" : "Desativar rascunho";
  if (loading) return <Card><p role="status">Carregando venda…</p></Card>;
  if (loadError) return <Card><p role="alert">{loadError}</p><Button titulo="Tentar novamente" onClick={() => setRevision(value => value + 1)} /><Link to="/sales">Voltar às vendas</Link></Card>;
  return <Card><div className="page-heading"><div><p className="eyebrow">COMERCIALIZAÇÃO</p><h1>{id ? "Detalhes da venda" : "Nova venda"}</h1><p className="page-description">{record ? `${saleStatus[record.status ?? ""]} · Total calculado pelo servidor: R$ ${displayDecimal(record.totalValue)}` : "Salve um rascunho antes de registrar a saída. O estoque só será consumido no registro."}</p></div><Link className="button button-secondary" to="/sales">Voltar às vendas</Link></div>
    {id && <Button variant="secondary" titulo="Recarregar e descartar alterações locais" disabled={saving} onClick={() => setRevision(value => value + 1)} />}
    <form className="resource-form" onSubmit={async event => {
      event.preventDefault(); if (saving || uncertainCreation || (!id && creationAttempt.current)) return; setFailure("");
      try {
        if (!lines.length) throw new Error("Adicione pelo menos um lote à venda.");
        const payload = { saleDate: submittedInstant(date, record?.saleDate), buyerId: references.buyerId, nfeAttachmentId: references.nfeAttachmentId || undefined, mtrAttachmentId: references.mtrAttachmentId || undefined, cdfAttachmentId: references.cdfAttachmentId || undefined, version: id ? record?.version : undefined, items: lines.map(line => ({ ...line, weightKg: decimal(line.weightKg), volumeM3: decimal(line.volumeM3, 11, 4, true), unitPrice: decimal(line.unitPrice, 11, 4, true) })) };
        setSaving(true); if (!id) creationAttempt.current = true;
        const saved = id ? await sales.update(id, payload) : await sales.create(payload);
        setRecord(saved); setRevision(value => value + 1); if (!id) navigate(`/sales/${saved.id}`);
      } catch (err) {
        if (!id && creationAttempt.current && (!isAxiosError(err) || !err.response || err.response.status >= 500)) setUncertainCreation(true);
        else creationAttempt.current = false;
        setFailure(isAxiosError(err) ? errorMessage(err) : err instanceof Error ? err.message : errorMessage(err));
      } finally { setSaving(false); }
    }}>
      <fieldset disabled={saving || !draft || uncertainCreation}><legend>Dados e comprovantes</legend><label>Data e hora da venda<input type="datetime-local" required value={date} onChange={event => setDate(event.target.value)} /></label><ResourcePicker label="Comprador" required value={references.buyerId} onChange={value => setReferences(current => ({ ...current, buyerId: value }))} load={buyerChoices} resolve={buyerChoice} />{(["nfeAttachmentId", "mtrAttachmentId", "cdfAttachmentId"] as const).map(field => <ResourcePicker key={field} label={{ nfeAttachmentId: "Nota fiscal (obrigatória para registrar)", mtrAttachmentId: "MTR (opcional)", cdfAttachmentId: "CDF (opcional)" }[field]} value={references[field]} onChange={value => setReferences(current => ({ ...current, [field]: value }))} load={documentChoices} resolve={documentChoice} />)}<p>Envie os comprovantes em <Link to="/documents">Documentos</Link> antes de selecioná-los. Alterações não salvas serão perdidas ao sair.</p></fieldset>
      <fieldset disabled={saving || !draft || uncertainCreation}><legend>Materiais e valores</legend>{draft && <><label>Lote para adicionar<select value={selectedLotId} disabled={lots.busy} onChange={event => setSelectedLotId(event.target.value)}><option value="">Selecione…</option>{lots.data.items.filter(lot => /[1-9]/.test(lot.availableWeightKg ?? "")).map(lot => <option key={lot.id} value={lot.id}>{lot.materialName} · {displayDecimal(lot.availableWeightKg)} kg · {lot.id?.slice(0,8)}</option>)}</select></label><Button variant="secondary" titulo="Adicionar lote" disabled={!selectedLotId || lots.busy} onClick={() => { const lot = lots.data.items.find(value => value.id === selectedLotId); if (!lot?.id || !lot.materialSubtypeId) return; setLines(current => [...current, { stockLotId: lot.id!, materialSubtypeId: lot.materialSubtypeId!, weightKg: "", volumeM3: "0", unitPrice: "0" }]); setSelectedLotId(""); }} /><p>O saldo exibido não é uma reserva. O servidor verifica a disponibilidade ao registrar.</p>{lots.busy && <p role="status">Carregando lotes…</p>}{lots.error && <p role="alert">{lots.error}</p>}<Button variant="secondary" titulo="Atualizar lotes" onClick={() => setLotRevision(value => value + 1)} /><Pagination page={page} pages={lots.data.pages} onChange={value => { setPage(value); setSelectedLotId(""); }} /></>}
      {lines.map((line, index) => <div className="sale-line" key={index}><h2>Item {index + 1}</h2><p>Lote: {line.stockLotId} · Subtipo: {line.materialSubtypeId}</p><div className="form-grid"><label>Peso do item {index + 1} (kg)<input required inputMode="decimal" value={line.weightKg} onChange={event => changeLine(index, "weightKg", event.target.value)} /></label><label>Volume do item {index + 1} (m³)<input required inputMode="decimal" value={line.volumeM3} onChange={event => changeLine(index, "volumeM3", event.target.value)} /></label><label>Preço do item {index + 1} (BRL/kg)<input required inputMode="decimal" value={line.unitPrice} onChange={event => changeLine(index, "unitPrice", event.target.value)} /></label></div>{draft && <Button variant="secondary" titulo={`Remover item ${index + 1}`} onClick={() => setLines(current => current.filter((_, position) => position !== index))} />}{!dirty && record?.items?.[index] && <p>Total da linha salva: R$ {displayDecimal(record.items[index].lineTotal)}</p>}</div>)}{!lines.length && <p className="empty-state">Adicione um lote para informar as quantidades.</p>}</fieldset>
      {failure && !confirmation && <p role="alert">{failure}</p>}{uncertainCreation && <p role="alert">O resultado da criação não pôde ser confirmado. Consulte a lista de vendas antes de criar outro rascunho; esta tela não reenviará a criação automaticamente.</p>}{draft && <Button type="submit" titulo={saving ? "Salvando…" : "Salvar rascunho"} disabled={saving || uncertainCreation || !lines.length} />}
    </form>
    {record && <section className="sale-lifecycle"><h2>Ações da venda</h2><p>{dirty ? "Há alterações não salvas. Salve o rascunho antes de registrar." : "As transições usam a versão salva. O registro consome estoque e impede novas edições."}</p>{record.status === "DRAFT" && <><Button titulo="Registrar venda" disabled={saving || dirty || !record.nfeAttachmentId} onClick={() => confirm("post")} />{!record.nfeAttachmentId && <p>Salve uma nota fiscal para habilitar o registro.</p>}<Button variant="secondary" titulo="Desativar rascunho" disabled={saving} onClick={() => confirm("deactivate")} /></>}{record.status === "POSTED" && <Button variant="secondary" titulo="Reverter venda" disabled={saving} onClick={() => confirm("reverse")} />}{record.status === "REVERSED" && <p>Venda revertida. O histórico permanece disponível para consulta.</p>}{(["nfeAttachmentId", "mtrAttachmentId", "cdfAttachmentId"] as const).map(field => record[field] && <Button key={field} variant="secondary" titulo={`Baixar ${{ nfeAttachmentId: "nota fiscal", mtrAttachmentId: "MTR", cdfAttachmentId: "CDF" }[field]}`} onClick={async () => { try { const metadata = await documents.get(record[field]!); const blob = await documents.download(record[field]!); const url = URL.createObjectURL(blob); const anchor = document.createElement("a"); anchor.href = url; anchor.download = metadata.fileName ?? "documento"; anchor.click(); setTimeout(() => URL.revokeObjectURL(url), 1000); } catch (err) { setFailure(errorMessage(err)); } }} />)}</section>}
    {confirmation && record && <Modal title={`${actionTitle}?`} label={actionTitle} description={confirmation.action === "post" ? "Registrar consome o estoque e bloqueia edições. A nota fiscal e as quantidades salvas serão verificadas pelo servidor." : confirmation.action === "reverse" ? "Reverter restaura as quantidades vendidas por uma movimentação compensatória. A venda original permanece no histórico." : "Somente rascunhos podem ser desativados. Nenhuma saída de estoque será gerada."} busy={saving} onClose={() => setConfirmation(null)}><p>Versão salva: {confirmation.version}. Se a venda mudou, cancele e recarregue antes de continuar.</p>{failure && <p role="alert">{failure}</p>}<div className="dialog-footer"><Button variant="secondary" titulo="Cancelar" disabled={saving} onClick={() => setConfirmation(null)} /><Button titulo="Confirmar ação" disabled={saving} onClick={async () => { setSaving(true); setFailure(""); try { if (confirmation.action === "deactivate") { await sales.deactivate(record.id!, confirmation.version); navigate("/sales"); } else { const result = await sales.transition(record.id!, confirmation.action, confirmation.version, confirmation.key); setRecord(result); setRevision(value => value + 1); } setConfirmation(null); } catch (err) { setFailure(errorMessage(err)); } finally { setSaving(false); } }} /></div></Modal>}
  </Card>;
}
