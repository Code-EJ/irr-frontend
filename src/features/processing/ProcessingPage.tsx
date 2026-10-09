/** @author Enzo Ribas (https://github.com/oEnzoRibas) */
import { useState } from "react";
import { Link } from "react-router-dom";
import Card from "../../components/Card";
import Button from "../../components/Button";
import Modal from "../../components/Modal";
import Pagination from "../../shared/ui/Pagination";
import { usePage } from "../../shared/ui/usePage";
import { errorMessage } from "../../shared/api/transport";
import { displayDecimal } from "../intake/quantities";
import { processing, type ProcessingKind, type Sorting, type Pressing } from "./api";
/** Posted documents remain readable after compensating reversals. */
export default function ProcessingPage({ kind }: { kind: ProcessingKind }) {
  const [page, setPage] = useState(0);
  const [revision, setRevision] = useState(0);
  const { data, busy, error } = usePage<Sorting | Pressing>(processing[kind], page, revision);
  const [detail, setDetail] = useState<Sorting | Pressing | null>(null);
  const [reversal, setReversal] = useState<{ id: string; key: string } | null>(null);
  const [saving, setSaving] = useState(false);
  const [failure, setFailure] = useState("");
  const title = kind === "sortings" ? "Triagem" : "Prensagem";
  const lines = detail ? (kind === "sortings" ? (detail as Sorting).sortedItems : (detail as Pressing).pressedBales) : [];
  return <Card>
    <div className="page-heading"><div><p className="eyebrow">PROCESSAMENTO</p><h1>{title}</h1><p className="page-description">Consulte operações registradas e seu histórico. Correções são feitas por reversão, preservando a rastreabilidade.</p></div><Link className="primary-link" to={`/${kind}/new`}>Registrar {title.toLowerCase()}</Link></div>
    {(error || failure) && <p role="alert">{error || failure} <Button titulo="Recarregar" onClick={() => { setFailure(""); setRevision(n => n + 1); }} /></p>}
    {busy ? <p role="status">Carregando operações…</p> : !error && <>
      <div className="table-scroll"><table><thead><tr><th>Data e hora</th><th>Situação</th><th>Ações</th></tr></thead><tbody>{data.items.map(item => {
        const date = kind === "sortings" ? (item as Sorting).sortingDate : (item as Pressing).pressingDate;
        return <tr key={item.id}><td>{date ? new Date(date).toLocaleString("pt-BR") : "—"}</td><td>{item.status === "REVERSED" ? "Revertida" : item.status === "POSTED" ? "Registrada" : "Histórico"}</td><td className="row-actions"><Button variant="secondary" titulo="Consultar" disabled={saving} onClick={async () => { setSaving(true); setFailure(""); try { setDetail(await processing.get(kind, item.id!)); } catch (err) { setFailure(errorMessage(err)); } finally { setSaving(false); } }} />{item.status === "POSTED" && <Button variant="secondary" titulo="Reverter" onClick={() => { setFailure(""); setReversal({ id: item.id!, key: crypto.randomUUID() }); }} />}</td></tr>;
      })}</tbody></table></div>{!data.items.length && <p className="empty-state">Nenhuma operação nesta página.</p>}<Pagination page={page} pages={data.pages} onChange={setPage} />
    </>}
    {detail && <Modal busy={false} label={`Detalhes da ${title.toLowerCase()}`} onClose={() => setDetail(null)}><Card><h2>Detalhes da {title.toLowerCase()}</h2><p>Identificador: {detail.id}</p><p>Situação: {detail.status === "REVERSED" ? "Revertida" : "Registrada"}</p><div className="table-scroll"><table><thead><tr><th>Origem</th><th>Subtipo</th><th>Peso (kg)</th><th>{kind === "sortings" ? "Volume (m³)" : "Volume inicial / final (m³)"}</th>{kind === "sortings" && <th>Rejeitos (kg / m³)</th>}</tr></thead><tbody>{lines?.map(line => <tr key={line.id}><td>{"inputItemId" in line ? line.inputItemId : "sortedItemId" in line ? line.sortedItemId : "—"}</td><td>{line.materialSubtypeId}</td><td>{displayDecimal(line.weightKg)}</td><td>{"volumeM3" in line ? displayDecimal(line.volumeM3) : `${displayDecimal("initialVolumeM3" in line ? line.initialVolumeM3 : undefined)} / ${displayDecimal("finalVolumeM3" in line ? line.finalVolumeM3 : undefined)}`}</td>{"rejectWeightKg" in line && <td>{displayDecimal(line.rejectWeightKg)} / {displayDecimal(line.rejectVolumeM3)}</td>}</tr>)}</tbody></table></div><Button titulo="Fechar detalhes" onClick={() => setDetail(null)} /></Card></Modal>}
    {reversal && <Modal label={`Reverter ${title.toLowerCase()}`} busy={saving} onClose={() => setReversal(null)}><Card><h2>Reverter {title.toLowerCase()}?</h2><p className="page-description">O histórico será mantido e os efeitos no estoque serão compensados. Se a saída já foi consumida, reverta primeiro as operações posteriores. Uma falha mantém esta confirmação para tentar novamente com a mesma chave.</p>{failure && <p role="alert">{failure}</p>}<div className="form-actions"><Button variant="secondary" titulo="Cancelar" disabled={saving} onClick={() => setReversal(null)} /><Button titulo="Confirmar reversão" disabled={saving} onClick={async () => { setSaving(true); setFailure(""); try { await processing.reverse(kind, reversal.id, reversal.key); setReversal(null); setRevision(n => n + 1); } catch (err) { setFailure(errorMessage(err)); } finally { setSaving(false); } }} /></div></Card></Modal>}
  </Card>;
}
