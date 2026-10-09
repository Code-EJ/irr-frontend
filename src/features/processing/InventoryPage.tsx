/** @author Enzo Ribas (https://github.com/oEnzoRibas) */
import { useState } from "react";
import Card from "../../components/Card";
import Button from "../../components/Button";
import Pagination from "../../shared/ui/Pagination";
import { usePage } from "../../shared/ui/usePage";
import { displayDecimal } from "../intake/quantities";
import { inventory, type Balance, type Lot, type Movement } from "./api";
const labels: Record<string, string> = { SORTING: "Triagem", PRESSING: "Prensagem", SALE: "Venda", REVERSE_SORTING: "Reversão de triagem", REVERSE_PRESSING: "Reversão de prensagem", REVERSAL: "Reversão" };
/** Reads authoritative balances and signed movements without deriving or editing stock locally. */
export default function InventoryPage() {
  const [tab, setTab] = useState<"balances" | "lots" | "movements">("balances");
  const [page, setPage] = useState(0);
  const [revision, setRevision] = useState(0);
  const { data, busy, error } = usePage<Balance | Lot | Movement>(inventory[tab], page, revision);
  return <Card><div className="page-heading"><div><p className="eyebrow">ESTOQUE</p><h1>Estoque da organização</h1><p className="page-description">Saldos e lotes disponíveis são mantidos pelo servidor. Movimentações preservam o histórico, inclusive correções.</p></div><Button variant="secondary" titulo="Atualizar estoque" onClick={() => setRevision(n => n + 1)} /></div><div className="workflow-tabs" role="group" aria-label="Consulta de estoque">{(["balances", "lots", "movements"] as const).map(value => <Button key={value} variant="secondary" aria-pressed={tab === value} titulo={{ balances: "Saldos", lots: "Lotes", movements: "Movimentações" }[value]} onClick={() => { setTab(value); setPage(0); }} />)}</div>
    {error && <p role="alert">{error}</p>}{busy ? <p role="status">Carregando estoque…</p> : !error && <><div className="table-scroll"><table><thead><tr><th>{tab === "movements" ? "Operação" : "Material"}</th>{tab !== "balances" && <th>{tab === "lots" ? "Origem / lote" : "Data e hora"}</th>}<th>{tab === "movements" ? "Variação de peso (kg)" : "Peso disponível (kg)"}</th><th>{tab === "movements" ? "Variação de volume (m³)" : "Volume disponível (m³)"}</th></tr></thead><tbody>{data.items.map((value, index) => {
      if (tab === "balances") { const row = value as Balance; return <tr key={row.materialSubtypeId ?? index}><td>{row.materialName}</td><td>{displayDecimal(row.weightKg)}</td><td>{displayDecimal(row.volumeM3)}</td></tr>; }
      if (tab === "lots") { const row = value as Lot; return <tr key={row.id}><td>{row.materialName}</td><td>{row.sortedItemId ? "Triagem" : "Prensagem"} · {row.id}</td><td>{displayDecimal(row.availableWeightKg)}</td><td>{displayDecimal(row.availableVolumeM3)}</td></tr>; }
      const row = value as Movement; return <tr key={row.id}><td>{labels[row.kind ?? ""] ?? row.kind} · {row.operationId}<br />Subtipo: {row.materialSubtypeId}</td><td>{row.occurredAt ? new Date(row.occurredAt).toLocaleString("pt-BR") : "—"}</td><td>{displayDecimal(row.weightDeltaKg)}</td><td>{displayDecimal(row.volumeDeltaM3)}</td></tr>;
    })}</tbody></table></div>{!data.items.length && <p className="empty-state">Nenhum registro nesta página.</p>}<Pagination page={page} pages={data.pages} onChange={setPage} /></>}
  </Card>;
}
