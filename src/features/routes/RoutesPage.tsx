/** @author Enzo Ribas (https://github.com/oEnzoRibas) */
import { useCallback, useState } from "react";
import { Link } from "react-router-dom";
import { MapPinned, Archive } from "lucide-react";
import Card from "../../components/Card";
import Button from "../../components/Button";
import Modal from "../../components/Modal";
import Pagination from "../../shared/ui/Pagination";
import { usePage } from "../../shared/ui/usePage";
import { errorMessage } from "../../shared/api/transport";
import { useSession } from "../identity/SessionProvider";
import { routes, routeStatuses, type Route } from "./api";

/** Shows current plans and retained history without granting local members management controls. */
export default function RoutesPage() {
  const { canManage } = useSession();
  const [page, setPage] = useState(0);
  const [revision, setRevision] = useState(0);
  const [includeInactive, setIncludeInactive] = useState(false);
  const load = useCallback(
    (index: number) => routes.list(index, includeInactive),
    [includeInactive],
  );
  const { data, busy, error } = usePage(load, page, revision);
  const [removing, setRemoving] = useState<Route | null>(null);
  const [saving, setSaving] = useState(false);
  const [failure, setFailure] = useState("");
  function reload() {
    setFailure("");
    setRevision((n) => n + 1);
  }
  return (
    <Card>
      <div className="page-heading">
        <div>
          <p className="eyebrow">OPERAÇÃO</p>
          <h1>Rotas de coleta</h1>
          <p className="page-description">
            Planeje a cobertura territorial. Cada execução preserva o plano
            utilizado naquela data.
          </p>
        </div>
        <div className="route-actions">
          <Link className="route-link" to="/route-executions">
            Ver execuções
          </Link>
          {canManage && (
            <Link className="route-link route-link-primary" to="/routes/new">
              <MapPinned size={18} />
              Nova rota
            </Link>
          )}
        </div>
      </div>
      <label className="route-toggle">
        <input
          type="checkbox"
          checked={includeInactive}
          onChange={(e) => {
            setIncludeInactive(e.target.checked);
            setPage(0);
          }}
        />
        Incluir rotas inativas
      </label>
      {(error || (!removing && failure)) && (
        <p role="alert">
          {error || failure}{" "}
          <Button titulo="Recarregar" onClick={reload} variant="secondary" />
        </p>
      )}
      {busy ? (
        <p role="status">Carregando rotas…</p>
      ) : (
        !error && (
          <>
            <div className="table-scroll">
              <table>
                <thead>
                  <tr>
                    <th>Rota</th>
                    <th>Município</th>
                    <th>Cobertura planejada</th>
                    <th>Situação</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {data.items.map((item) => (
                    <tr key={item.id}>
                      <td>
                        <strong>{item.name}</strong>
                      </td>
                      <td>
                        {item.municipalityName} / {item.municipalityStateCode}
                        <small className="route-muted">
                          IBGE {item.municipalityIbgeCode}
                        </small>
                      </td>
                      <td>
                        {item.areas.length}{" "}
                        {item.areas.length === 1 ? "área" : "áreas"}
                      </td>
                      <td>
                        <span className="status-pill">
                          {item.isActive
                            ? routeStatuses[item.status]
                            : "Inativa"}
                        </span>
                      </td>
                      <td>
                        <div className="route-actions">
                          <Link to={"/routes/" + item.id}>
                            Consultar
                            {canManage && item.isActive ? " / editar" : ""}
                          </Link>
                          <Link to={"/route-executions?routeId=" + item.id}>
                            Execuções
                          </Link>
                          {canManage && item.isActive && (
                            <Button
                              variant="secondary"
                              titulo="Inativar"
                              onClick={() => {
                                setRemoving(item);
                                setFailure("");
                              }}
                            />
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {!data.items.length && (
              <div className="route-empty">
                <MapPinned size={32} />
                <h2>Nenhuma rota nesta página</h2>
                <p>
                  {canManage
                    ? "Crie uma rota para organizar bairros e ruas da operação."
                    : "As rotas cadastradas pela administração aparecerão aqui."}
                </p>
              </div>
            )}
            <Pagination page={page} pages={data.pages} onChange={setPage} />
          </>
        )
      )}
      {removing && (
        <Modal
          label="Inativar rota"
          onClose={() => setRemoving(null)}
          busy={saving}
          title="Inativar rota"
          description="O histórico das execuções será preservado."
          icon={<Archive size={22} />}
          tone="danger"
        >
          {removing && (
            <>
              <div className="dialog-context">
                <strong>{removing.name}</strong>
                <span>
                  {removing.municipalityName} / {removing.municipalityStateCode}
                </span>
              </div>
              <p className="dialog-notice">
                Execuções planejadas ou em andamento precisam ser concluídas ou
                canceladas antes da inativação.
              </p>
              {failure && <p role="alert">{failure}</p>}
              <div className="dialog-footer">
                <Button
                  titulo="Voltar"
                  variant="secondary"
                  disabled={saving}
                  onClick={() => setRemoving(null)}
                />
                <Button
                  titulo={saving ? "Inativando…" : "Inativar rota"}
                  variant="danger"
                  disabled={saving}
                  onClick={async () => {
                    setSaving(true);
                    setFailure("");
                    try {
                      await routes.deactivate(removing.id, removing.version);
                      setRemoving(null);
                      reload();
                    } catch (err) {
                      setFailure(errorMessage(err));
                    } finally {
                      setSaving(false);
                    }
                  }}
                />
              </div>
            </>
          )}
        </Modal>
      )}
    </Card>
  );
}
