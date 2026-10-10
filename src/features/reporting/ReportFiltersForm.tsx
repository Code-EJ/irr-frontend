/** @author Enzo Ribas (https://github.com/oEnzoRibas) */
import Button from "../../components/Button";
import ResourcePicker from "../../shared/ui/ResourcePicker";
import { municipalityChoices, municipalityChoice } from "../routes/api";
import { reportRouteChoices, reportRouteChoice, reportVehicleChoices, reportVehicleChoice, type ReportFilters } from "./api";

/** Reuses the same explicit historical dimensions for operations and analytics. */
export default function ReportFiltersForm({ draft, onChange, onApply, onReset, busy }: {
  draft: ReportFilters;
  onChange: (value: ReportFilters) => void;
  onApply: () => void;
  onReset: () => void;
  busy: boolean;
}) {
  const field = (name: "municipalityId" | "routeId" | "vehicleId", value: string) => onChange({ ...draft, [name]: value || undefined });
  return <form className="report-filters" onSubmit={event => { event.preventDefault(); onApply(); }}>
    <label>Data inicial<input type="date" required value={draft.from} max={draft.to} onChange={event => onChange({ ...draft, from: event.target.value })}/></label>
    <label>Data final<input type="date" required value={draft.to} min={draft.from} onChange={event => onChange({ ...draft, to: event.target.value })}/></label>
    <ResourcePicker label="Município (opcional)" value={draft.municipalityId ?? ""} onChange={id => field("municipalityId", id)} load={municipalityChoices} resolve={municipalityChoice}/>
    <ResourcePicker label="Rota (opcional)" value={draft.routeId ?? ""} onChange={id => field("routeId", id)} load={reportRouteChoices} resolve={reportRouteChoice}/>
    <ResourcePicker label="Veículo (opcional)" value={draft.vehicleId ?? ""} onChange={id => field("vehicleId", id)} load={reportVehicleChoices} resolve={reportVehicleChoice}/>
    <div className="report-filter-actions"><Button type="submit" titulo="Aplicar filtros" disabled={busy}/><Button titulo="Limpar filtros" variant="secondary" onClick={onReset}/></div>
  </form>;
}
