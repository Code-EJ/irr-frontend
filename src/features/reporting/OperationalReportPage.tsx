/** @author Enzo Ribas (https://github.com/oEnzoRibas) */
import { useEffect, useState } from "react";
import { BarChart3, CheckCircle2, Gauge, Timer, Scale } from "lucide-react";
import Card from "../../components/Card";
import Button from "../../components/Button";
import ReportFiltersForm from "./ReportFiltersForm";
import { errorMessage } from "../../shared/api/transport";
import { displayDuration } from "./duration";
import { displayDecimal } from "../intake/quantities";
import { operationalReport,
  type ReportFilters, type OperationalReport } from "./api";
/** Calendar defaults follow the report timezone instead of the browser timezone. */
export function defaultReportPeriod(now = new Date()): ReportFilters {
  const parts = new Intl.DateTimeFormat("en-CA", {timeZone:"America/Sao_Paulo",year:"numeric",month:"2-digit",day:"2-digit"}).formatToParts(now);
  const value = (key: string) => parts.find(part => part.type === key)!.value;
  const prefix = `${value("year")}-${value("month")}`;
  return {from: prefix + "-01", to: prefix + "-" + value("day")};
}
/** Shows approved facts with their actual applied period, provenance and measurement completeness. */
export default function OperationalReportPage() {
  const [draft, setDraft] = useState<ReportFilters>(defaultReportPeriod);
  const [applied, setApplied] = useState<ReportFilters>(draft);
  const [revision, setRevision] = useState(0);
  const [data, setData] = useState<OperationalReport | null>(null);
  const [busy, setBusy] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => {
    let active = true;
    setBusy(true); setData(null); setError("");
    void operationalReport(applied).then(result => {if (active) setData(result);})
      .catch(err => {if (active) setError(errorMessage(err));})
      .finally(() => {if (active) setBusy(false);});
    return () => {active = false;};
  }, [applied, revision]);
  return <Card>
    <div className="page-heading"><div><p className="eyebrow">ACOMPANHAMENTO</p>
      <h1 className="report-title"><BarChart3 aria-hidden="true" size={28}/> Relatório operacional</h1>
      <p className="page-description">Acompanhe os resultados da organização, com os dados informados pela equipe.</p></div></div>
    <ReportFiltersForm draft={draft} onChange={setDraft} onApply={() => setApplied({...draft})} busy={busy}
      onReset={() => {const period=defaultReportPeriod();setDraft(period);setApplied(period);}}/>
    <p className="report-method">Período de até 366 dias, no horário de Brasília. Execuções pela conclusão; coletas pela realização. Rotas e veículos inativos continuam disponíveis para consulta histórica.</p>
    {busy && <p role="status">Carregando relatório…</p>}
    {error && <div className="report-notice"><p role="alert">{error}</p><Button titulo="Tentar novamente" onClick={() => setRevision(n => n+1)}/></div>}
    {data && !busy && <section aria-label="Resultados do relatório">
      <div className="report-summary"><div><h2>Resultados do período</h2><p>{data.from.split("-").reverse().join("/")} a {data.to.split("-").reverse().join("/")}</p></div>
        <Button variant="secondary" titulo="Atualizar resultados" onClick={() => setRevision(n => n+1)}/></div>
      {data.completedExecutions === 0 && data.collectionCount === 0 && <p className="report-notice">Nenhuma execução concluída ou coleta ativa corresponde aos filtros deste período.</p>}
      <dl className="report-metrics">
        <div><dt><CheckCircle2 aria-hidden="true"/>Execuções concluídas</dt><dd>{data.completedExecutions}</dd><p>Contadas uma vez por execução.</p></div>
        <div><dt><Gauge aria-hidden="true"/>Distância informada</dt><dd>{data.reportedDistanceKm == null ? "Sem informação" : displayDecimal(data.reportedDistanceKm)+" km"}</dd><p>{data.measuredExecutions} com medição · {data.missingDistanceExecutions} sem informação</p></div>
        <div><dt><Timer aria-hidden="true"/>Duração real</dt><dd title={displayDecimal(data.durationSeconds) + " segundos exatos"}>{displayDuration(data.durationSeconds)}</dd><p>Tempo entre início e conclusão. A partir de uma hora, exibido em minutos completos.</p><details className="report-duration-detail"><summary>Ver segundos exatos</summary><p>{displayDecimal(data.durationSeconds)} s</p></details></div>
        <div><dt><Scale aria-hidden="true"/>Peso coletado</dt><dd>{displayDecimal(data.collectedWeightKg)} kg</dd><p>{data.collectionCount} coletas ativas</p></div>
      </dl>
      <div className="report-notice"><h3>Como interpretar</h3><p>Os totais são recalculados após alterações. Distâncias ausentes não são estimadas; zero significa uma medição informada.</p>
        <p>{data.municipalityId || data.routeId ? "Coletas sem vínculo com uma execução são excluídas quando há filtro de município ou rota." : `${data.unlinkedCollections} coletas sem vínculo com uma execução estão incluídas no peso; elas não possuem município ou rota comprovados.`}</p>
        <p>Duração em meses e anos usa equivalências aproximadas de 30 e 365 dias. Consulte o valor original em “Ver segundos exatos”.</p>
        <p>O peso considera a data da coleta, mesmo quando a execução vinculada foi concluída em outro período.</p></div>
      <p className="report-method">Atualizado em {new Date(data.generatedAt).toLocaleString("pt-BR",{timeZone:data.timezone})} · Horário de Brasília</p>
    </section>}
  </Card>;
}
