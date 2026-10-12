/** @author Enzo Ribas (https://github.com/oEnzoRibas) */
import { useCallback, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { CalendarClock } from "lucide-react";
import Card from "../../components/Card";
import Button from "../../components/Button";
import Pagination from "../../shared/ui/Pagination";
import ResourcePicker from "../../shared/ui/ResourcePicker";
import { usePage } from "../../shared/ui/usePage";
import { useSession } from "../identity/SessionProvider";
import {
  executions,
  executionStatuses,
  routeChoices,
  routeChoice,
  type ExecutionStatus,
} from "./api";

/** Lists dated operations and preserved history independently of current route planning. */
export default function ExecutionsPage() {
  const [params, setParams] = useSearchParams();
  const { canManage } = useSession();
  const routeId = params.get("routeId") ?? "";
  const [status, setStatus] = useState<ExecutionStatus | "">("");
  const [page, setPage] = useState(0);
  const [revision, setRevision] = useState(0);
  const load = useCallback(
    (index: number) => executions.list(index, routeId, status),
    [routeId, status],
  );
  const { data, busy, error } = usePage(load, page, revision);
  return (
    <Card>
      <div className="page-heading">
        <div>
          <p className="eyebrow">OPERAÇÃO</p>
          <h1>Execuções de rotas</h1>
          <p className="page-description">
            Acompanhe as saídas planejadas, a cobertura declarada e o histórico
            de cada operação.
          </p>
        </div>
        <div className="route-actions">
          <Link className="route-link" to="/routes">
            Planejamentos
          </Link>
          {canManage && (
            <Link
              className="route-link route-link-primary"
              to={
                "/route-executions/new" + (routeId ? "?routeId=" + routeId : "")
              }
            >
              <CalendarClock size={18} />
              Planejar execução
            </Link>
          )}
        </div>
      </div>
      <div className="form-grid route-filters">
        <ResourcePicker
          label="Filtrar por rota"
          value={routeId}
          load={routeChoices}
          resolve={routeChoice}
          onChange={(id) => {
            setParams(id ? { routeId: id } : {});
            setPage(0);
          }}
        />
        <label>
          Situação
          <select
            value={status}
            onChange={(e) => {
              setStatus(e.target.value as ExecutionStatus | "");
              setPage(0);
            }}
          >
            <option value="">Todas</option>
            {Object.entries(executionStatuses).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </label>
      </div>
      {error && (
        <p role="alert">
          {error}{" "}
          <Button
            titulo="Recarregar"
            onClick={() => setRevision((n) => n + 1)}
            variant="secondary"
          />
        </p>
      )}
      {busy ? (
        <p role="status">Carregando execuções…</p>
      ) : (
        !error && (
          <>
            <div className="table-scroll">
              <table>
                <thead>
                  <tr>
                    <th>Saída planejada</th>
                    <th>Rota / município</th>
                    <th>Veículo / motorista</th>
                    <th>Situação</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {data.items.map((item) => (
                    <tr key={item.id}>
                      <td>
                        {new Date(item.plannedStartAt).toLocaleString("pt-BR")}
                      </td>
                      <td>
                        <strong>{item.routeName}</strong>
                        <small className="route-muted">
                          {item.municipalityName} / {item.municipalityStateCode}
                        </small>
                      </td>
                      <td>
                        {item.vehicleLicensePlate}
                        <small className="route-muted">{item.driverName}</small>
                      </td>
                      <td>
                        <span className="status-pill">
                          {executionStatuses[item.status]}
                        </span>
                      </td>
                      <td>
                        <Link to={"/route-executions/" + item.id}>
                          Consultar execução →
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {!data.items.length && (
              <div className="route-empty">
                <CalendarClock size={32} />
                <h2>Nenhuma execução encontrada</h2>
                <p>
                  As execuções planejadas aparecerão aqui. Ajuste os filtros ou
                  planeje uma nova saída.
                </p>
              </div>
            )}
            <Pagination page={page} pages={data.pages} onChange={setPage} />
          </>
        )
      )}
    </Card>
  );
}
