/** @author Enzo Ribas (https://github.com/oEnzoRibas) */
import { useState } from "react";
import Card from "../../components/Card";
import Button from "../../components/Button";
import Modal from "../../components/Modal";
import Pagination from "../../shared/ui/Pagination";
import { usePage } from "../../shared/ui/usePage";
import { useSession } from "../identity/SessionProvider";
import { errorMessage } from "../../shared/api/transport";
import { buyers, type Buyer } from "./api";
export default function BuyersPage() {
  const manager = useSession().canManage;
  const [page, setPage] = useState(0);
  const [revision, setRevision] = useState(0);
  const { data, busy, error } = usePage(buyers.list, page, revision);
  const [editing, setEditing] = useState<Buyer | "new" | null>(null);
  const [removing, setRemoving] = useState<Buyer | null>(null);
  const [name, setName] = useState("");
  const [document, setDocument] = useState("");
  const [saving, setSaving] = useState(false);
  const [failure, setFailure] = useState("");
  function edit(item: Buyer | "new") { setFailure(""); setEditing(item); setName(item === "new" ? "" : item.name ?? ""); setDocument(item === "new" ? "" : item.document ?? ""); }
  function refresh() { setPage(0); setRevision(value => value + 1); }
  return <Card>
    <div className="page-heading"><div><p className="eyebrow">CADASTROS</p><h1>Compradores</h1><p className="page-description">Pessoas e empresas que adquirem materiais da organização.</p></div>{manager && <Button titulo="Adicionar comprador" onClick={() => edit("new")} />}</div>
    {(error || (!editing && !removing && failure)) && <p role="alert">{error || failure}</p>}<Button variant="secondary" titulo="Atualizar compradores" onClick={refresh} />
    {busy ? <p role="status">Carregando compradores…</p> : !error && <><div className="table-scroll"><table><thead><tr><th>Nome</th><th>CPF / CNPJ</th>{manager && <th>Ações</th>}</tr></thead><tbody>{data.items.map(item => <tr key={item.id}><td>{item.name}</td><td>{item.document || "Não informado"}</td>{manager && <td className="row-actions"><Button variant="secondary" titulo="Editar" onClick={() => edit(item)} /><Button variant="secondary" titulo="Desativar" onClick={() => { setFailure(""); setRemoving(item); }} /></td>}</tr>)}</tbody></table></div>{!data.items.length && <p className="empty-state">Nenhum comprador nesta página.</p>}<Pagination page={page} pages={data.pages} onChange={setPage} /></>}
    {editing && manager && <Modal title={editing === "new" ? "Adicionar comprador" : "Editar comprador"} label="Comprador" busy={saving} onClose={() => setEditing(null)}><form className="stack-form" onSubmit={async event => {
      event.preventDefault(); if (saving) return; setFailure("");
      const digits = document.replace(/\D/g, "");
      if (digits && ![11,14].includes(digits.length)) { setFailure("Informe um CPF com 11 dígitos ou CNPJ com 14 dígitos, ou deixe o documento em branco."); return; }
      setSaving(true);
      try { const payload = { name: name.trim(), document: digits }; if (editing === "new") await buyers.create(payload); else await buyers.update(editing.id!, payload); setEditing(null); refresh(); }
      catch (err) { setFailure(errorMessage(err)); } finally { setSaving(false); }
    }}><fieldset disabled={saving}><label>Nome<input required maxLength={255} value={name} onChange={event => setName(event.target.value)} /></label><label>CPF / CNPJ (opcional)<input maxLength={20} inputMode="numeric" value={document} onChange={event => setDocument(event.target.value)} /></label></fieldset>{failure && <p role="alert">{failure}</p>}<div className="dialog-footer"><Button variant="secondary" titulo="Cancelar" disabled={saving} onClick={() => setEditing(null)} /><Button type="submit" titulo="Salvar comprador" disabled={saving} /></div></form></Modal>}
    {removing && manager && <Modal title="Desativar comprador?" label="Desativar comprador" description="Compradores vinculados a vendas devem permanecer disponíveis para preservar o histórico. O servidor recusará a desativação quando houver vínculo." busy={saving} onClose={() => setRemoving(null)}>{failure && <p role="alert">{failure}</p>}<div className="dialog-footer"><Button variant="secondary" titulo="Cancelar" disabled={saving} onClick={() => setRemoving(null)} /><Button titulo="Confirmar desativação" disabled={saving} onClick={async () => { setSaving(true); setFailure(""); try { await buyers.deactivate(removing.id!); setRemoving(null); refresh(); } catch (err) { setFailure(errorMessage(err)); } finally { setSaving(false); } }} /></div></Modal>}
  </Card>;
}
