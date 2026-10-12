/** @author Enzo Ribas (https://github.com/oEnzoRibas) */
import { useState } from "react";
import { Link } from "react-router-dom";
import Card from "../../components/Card";
import Button from "../../components/Button";
import Pagination from "../../shared/ui/Pagination";
import { usePage } from "../../shared/ui/usePage";
import { displayDecimal } from "../intake/quantities";
import { sales, saleStatus } from "./api";
export default function SalesPage() {
  const [page, setPage] = useState(0);
  const [revision, setRevision] = useState(0);
  const { data, busy, error } = usePage(sales.list, page, revision);
  return <Card><div className="page-heading"><div><p className="eyebrow">COMERCIALIZAÇÃO</p><h1>Vendas</h1><p className="page-description">Prepare rascunhos, vincule os documentos e registre a saída. Rascunhos não reservam estoque.</p></div><Link className="primary-link" to="/sales/new">Nova venda</Link></div><Button variant="secondary" titulo="Atualizar vendas" onClick={() => setRevision(value => value + 1)} />{error && <p role="alert">{error}</p>}{busy ? <p role="status">Carregando vendas…</p> : !error && <><div className="table-scroll"><table><thead><tr><th>Data e hora</th><th>Situação</th><th>Total (BRL)</th><th>Ações</th></tr></thead><tbody>{data.items.map(item => <tr key={item.id}><td>{item.saleDate ? new Date(item.saleDate).toLocaleString("pt-BR") : "—"}</td><td>{saleStatus[item.status ?? ""] ?? "Não informado"}</td><td>R$ {displayDecimal(item.totalValue)}</td><td><Link className="button button-secondary" to={`/sales/${item.id}`}>Consultar venda</Link></td></tr>)}</tbody></table></div>{!data.items.length && <p className="empty-state">Nenhuma venda nesta página.</p>}<Pagination page={page} pages={data.pages} onChange={setPage} /></>}</Card>;
}
