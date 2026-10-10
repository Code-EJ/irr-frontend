/** @author Enzo Ribas (https://github.com/oEnzoRibas) */
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { BarChart3 } from "lucide-react";
import Card from "../../components/Card";
import Button from "../../components/Button";
import { errorMessage } from "../../shared/api/transport";
import { displayDecimal } from "../intake/quantities";
import { defaultReportPeriod } from "./OperationalReportPage";
import ReportFiltersForm from "./ReportFiltersForm";
import type { ReportFilters } from "./api";
import { analyticsReport, type AnalyticsReport, type AnalyticsComparison, type AnalyticsProductivity } from "./analyticsApi";

/** Missing and undefined metrics remain unavailable, including zero-denominator percentages. */
const value = (decimal: string | null, unit = "") => decimal == null ? "Indisponível" : `${displayDecimal(decimal)}${unit ? " " + unit : ""}`;

function Comparison({ title, data }: { title: string; data: AnalyticsComparison }) {
  return <section className="analytics-card" aria-label={title}>
    <h3>{title}</h3>
    <p>{data.consideredExecutions} execuções consideradas · {data.excludedExecutions} excluídas por falta de valores pareados</p>
    <dl className="analytics-values">
      <div><dt>Planejado</dt><dd>{value(data.planned, data.unit)}</dd></div>
      <div><dt>Realizado</dt><dd>{value(data.actual, data.unit)}</dd></div>
      <div><dt>Desvio (realizado − planejado)</dt><dd>{value(data.signedDeviation, data.unit)}</dd></div>
      <div><dt>Desvio absoluto (magnitude)</dt><dd>{value(data.absoluteDeviation, data.unit)}</dd></div>
      <div><dt>Desvio percentual</dt><dd>{value(data.percentageDeviation, "%")}</dd></div>
    </dl>
    <p className="report-method">Somente execuções concluídas com ambos os valores, preservados no planejamento da execução. Percentual indisponível quando o total planejado é zero.</p>
  </section>;
}

function Productivity({ title, data }: { title: string; data: AnalyticsProductivity }) {
  return <div><dt>{title}</dt><dd>{value(data.value, data.unit)}</dd>
    <p>{data.consideredExecutions} execuções e {data.collectionCount} coletas consideradas · {data.excludedExecutions} execuções excluídas</p>
    <details className="report-duration-detail"><summary>Ver cálculo e qualidade dos dados</summary>
      <p>Numerador: {value(data.collectedWeightKg, "kg")} de coletas ativas vinculadas.</p>
      <p>Denominador: {value(data.denominator, data.unit === "kg/h" ? "s" : "km")} dessas mesmas execuções.</p>
      <p>Exclusões: {data.withoutLinkedCollections} sem coletas vinculadas; {data.missingDenominatorExecutions} sem denominador informado; {data.zeroDenominatorExecutions} com denominador zero.</p>
      <p>{data.unit === "kg/h" ? "Σ kg × 3600 ÷ Σ segundos reais." : "Σ kg ÷ Σ km informados."} O backend calcula a razão dos totais, sem média simples de produtividades individuais.</p>
    </details>
  </div>;
}

/** Presents approved, auditable server metrics with their matched cohorts and definitions. */
export default function AnalyticsPage() {
  const [draft, setDraft] = useState<ReportFilters>(defaultReportPeriod);
  const [applied, setApplied] = useState<ReportFilters>(draft);
  const [revision, setRevision] = useState(0);
  const [data, setData] = useState<AnalyticsReport | null>(null);
  const [busy, setBusy] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => {
    let active = true;
    setBusy(true); setData(null); setError("");
    void analyticsReport(applied).then(result => { if (active) setData(result); })
      .catch(err => { if (active) setError(errorMessage(err)); })
      .finally(() => { if (active) setBusy(false); });
    return () => { active = false; };
  }, [applied, revision]);
  return <Card>
    <div className="page-heading"><div><p className="eyebrow">INDICADORES AUDITÁVEIS</p>
      <h1 className="report-title"><BarChart3 aria-hidden="true" size={28}/> Analytics da operação</h1>
      <p className="page-description">Compare o planejamento e os resultados usando apenas dados comprovados da organização.</p>
      <Link className="primary-link" to="/reports/operations">Consultar relatório operacional →</Link>
    </div></div>
    <ReportFiltersForm draft={draft} onChange={setDraft} busy={busy} onApply={() => setApplied({ ...draft })}
      onReset={() => { const period = defaultReportPeriod(); setDraft(period); setApplied(period); }}/>
    <p className="report-method">Até 366 dias no horário de Brasília. Execuções pela conclusão; vendas pela data da venda. A produtividade usa as coletas vinculadas às execuções selecionadas, mesmo quando a coleta tem outra data.</p>
    {busy && <p role="status">Carregando indicadores…</p>}
    {error && <div className="report-notice"><p role="alert">{error}</p><Button titulo="Tentar novamente" onClick={() => setRevision(n => n + 1)}/></div>}
    {data && !busy && <section aria-label="Resultados de Analytics">
      <div className="report-summary"><div><h2>Resultados e qualidade dos dados</h2>
        <p>{data.from.split("-").reverse().join("/")} a {data.to.split("-").reverse().join("/")} · {data.completedExecutions} execuções concluídas</p></div>
        <Button titulo="Atualizar indicadores" variant="secondary" onClick={() => setRevision(n => n + 1)}/>
      </div>
      {data.completedExecutions === 0 && <p className="report-notice">Nenhuma execução concluída corresponde ao período e aos filtros. Indicadores sem dados ficam indisponíveis.</p>}
      <h2 className="analytics-heading">Planejado × realizado</h2>
      <div className="analytics-comparisons"><Comparison title="Distância" data={data.distanceComparison}/><Comparison title="Duração em segundos" data={data.durationComparison}/></div>
      <h2 className="analytics-heading">Cobertura e produtividade</h2>
      <dl className="report-metrics">
        <div><dt>Cobertura por quantidade de trechos</dt><dd>{value(data.coverage.percentage, "%")}</dd>
          <p>{data.coverage.coveredSections} trechos atendidos de {data.coverage.declaredSections} declarados</p>
          <p>{data.coverage.consideredExecutions} execuções consideradas · {data.coverage.excludedExecutions} sem trechos declarados</p>
          <p>{data.coverage.duplicateRows} linhas duplicadas desconsideradas · {data.coverage.conflictingSections} trechos com estados conflitantes</p>
          <p className="report-method">Trechos únicos por execução. Atendidos ÷ declarados × 100. Representa quantidade de trechos, não distância percorrida nem área geográfica. Sem declarações ou com estados conflitantes, o percentual fica indisponível.</p>
        </div>
        <Productivity title="Produtividade por hora" data={data.hourlyProductivity}/>
        <Productivity title="Produtividade por quilômetro" data={data.distanceProductivity}/>
        <div><dt>Receita de vendas registradas</dt><dd>{data.revenue.available ? value(data.revenue.amount, "BRL") : "Indisponível"}</dd>
          {data.revenue.available ? <><p>{data.revenue.consideredSales} vendas consideradas · {data.revenue.excludedDraftSales} rascunhos excluídos · {data.revenue.excludedReversedSales} vendas revertidas excluídas</p>
            <p className="report-method">Soma dos totais oficiais de vendas registradas e não revertidas, pela data da venda. Uma reversão posterior recalcula o período histórico.</p></> :
            <p className="report-method">Receita indisponível com filtros de município, rota ou veículo: as vendas não possuem vínculo comprovado com essas dimensões. Limpe esses filtros para consultar a receita da organização.</p>}
        </div>
      </dl>
      <div className="report-notice"><h3>Integridade e rastreabilidade</h3>
        <p>Valores ausentes não são estimados nem substituídos por zero. Zero informado continua sendo um dado válido; divisões por zero ficam indisponíveis.</p>
        <p>{data.unlinkedCollectionsInPeriod} coletas ativas sem execução vinculada no período da organização{data.vehicleId ? " e do veículo" : ""}. Elas não entram na produtividade e não têm município ou rota comprovados.</p>
        <p>Os grupos considerados em kg/h e kg/km podem diferir; consulte os denominadores e as exclusões. Alterações e inativações de coletas recalculam os resultados.</p>
        <p>Fórmulas calculadas no backend, com razões arredondadas a seis casas decimais após a agregação.</p>
      </div>
      <p className="report-method">Definição {data.definitionVersion} · Atualizado em {new Date(data.generatedAt).toLocaleString("pt-BR", { timeZone: data.timezone })} · Horário de Brasília</p>
    </section>}
  </Card>;
}
