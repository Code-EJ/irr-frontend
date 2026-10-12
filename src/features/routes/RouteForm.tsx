/** @author Enzo Ribas (https://github.com/oEnzoRibas) */
import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { MapPinned, ArrowUp, ArrowDown, Trash2 } from "lucide-react";
import Card from "../../components/Card";
import Button from "../../components/Button";
import ResourcePicker from "../../shared/ui/ResourcePicker";
import Pagination from "../../shared/ui/Pagination";
import { usePage } from "../../shared/ui/usePage";
import { errorMessage } from "../../shared/api/transport";
import { useSession } from "../identity/SessionProvider";
import { decimal, displayDecimal } from "../intake/quantities";
import {
  routes,
  geography,
  municipalityChoices,
  municipalityChoice,
  neighborhoodChoice,
  routeStatuses,
  type Route,
  type RouteRequest,
} from "./api";
import TerritoryDialog from "./TerritoryDialog";
type AreaDraft = { key: string; neighborhoodId: string; street: string };
const newArea = (): AreaDraft => ({
  key: crypto.randomUUID(),
  neighborhoodId: "",
  street: "",
});
const eventLabels: Record<string, string> = {
  CREATE: "Rota criada",
  UPDATE: "Planejamento atualizado",
  DEACTIVATE: "Rota inativada",
  PLAN: "Execução planejada",
  START: "Execução iniciada",
  COMPLETE: "Execução concluída",
  CANCEL: "Execução cancelada",
  COVERAGE: "Cobertura registrada",
};

function RouteHistory({ id, revision }: { id: string; revision: number }) {
  const [page, setPage] = useState(0);
  const load = useCallback((index: number) => routes.events(id, index), [id]);
  const { data, busy, error } = usePage(load, page, revision);
  return (
    <section className="route-section">
      <h2>Histórico de alterações</h2>
      {busy ? (
        <p role="status">Carregando histórico…</p>
      ) : error ? (
        <p role="alert">{error}</p>
      ) : (
        <>
          <ol className="route-history">
            {data.items.map((event) => (
              <li key={event.id}>
                <strong>{eventLabels[event.action] ?? event.action}</strong>
                <span>
                  {new Date(event.recordedAt).toLocaleString("pt-BR")} · Versão{" "}
                  {event.version}
                </span>
                {event.executionId && (
                  <Link to={"/route-executions/" + event.executionId}>
                    Consultar execução
                  </Link>
                )}
              </li>
            ))}
          </ol>
          <Pagination page={page} pages={data.pages} onChange={setPage} />
        </>
      )}
    </section>
  );
}

/** Edits a complete ordered plan while current executions retain their own historical context. */
export default function RouteForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { canManage, account } = useSession();
  const [record, setRecord] = useState<Route | null>(null);
  const [loading, setLoading] = useState(!!id);
  const [loadError, setLoadError] = useState("");
  const [failure, setFailure] = useState("");
  const [saving, setSaving] = useState(false);
  const [revision, setRevision] = useState(0);
  const [name, setName] = useState("");
  const [municipality, setMunicipality] = useState("");
  const [status, setStatus] = useState<RouteRequest["status"]>("DRAFT");
  const [distance, setDistance] = useState("");
  const [duration, setDuration] = useState("");
  const [areas, setAreas] = useState<AreaDraft[]>([newArea()]);
  const [territory, setTerritory] = useState<
    "municipality" | "neighborhood" | null
  >(null);
  const [territoryRevision, setTerritoryRevision] = useState(0);
  useEffect(() => {
    let active = true;
    setLoadError("");
    setFailure("");
    setLoading(!!id);
    if (id)
      void routes
        .get(id)
        .then((item) => {
          if (!active) return;
          setRecord(item);
          setName(item.name);
          setMunicipality(item.municipalityId);
          setStatus(item.status);
          setDistance(
            item.plannedDistanceKm == null
              ? ""
              : displayDecimal(item.plannedDistanceKm),
          );
          setDuration(item.plannedDurationMinutes?.toString() ?? "");
          setAreas(
            item.areas.map((area) => ({
              key: area.id!,
              neighborhoodId: area.neighborhoodId!,
              street: area.street ?? "",
            })),
          );
        })
        .catch((err) => {
          if (active) setLoadError(errorMessage(err));
        })
        .finally(() => {
          if (active) setLoading(false);
        });
    return () => {
      active = false;
    };
  }, [id, revision]);
  const neighborhoodChoices = useCallback(
    async (page: number) => {
      const result = await geography.neighborhoods(municipality, page);
      return {
        ...result,
        items: result.items.map((item) => ({ id: item.id, label: item.name })),
      };
    },
    [municipality],
  );
  const editable = canManage && (!id || record?.isActive);
  function updateArea(key: string, changes: Partial<AreaDraft>) {
    setAreas((previous) =>
      previous.map((area) =>
        area.key === key ? { ...area, ...changes } : area,
      ),
    );
  }
  function reorder(index: number, direction: number) {
    setAreas((previous) => {
      const copy = [...previous];
      [copy[index], copy[index + direction]] = [
        copy[index + direction],
        copy[index],
      ];
      return copy;
    });
  }
  return (
    <Card>
      <Link className="route-back" to="/routes">
        ← Voltar para rotas
      </Link>
      <div className="page-heading">
        <div>
          <p className="eyebrow">PLANEJAMENTO</p>
          <h1>{id ? "Detalhes da rota" : "Nova rota"}</h1>
          <p className="page-description">
            Defina um município e organize bairros e ruas na ordem de cobertura.
          </p>
        </div>
        <MapPinned className="route-heading-icon" size={36} />
      </div>
      {loading ? (
        <p role="status">Carregando rota…</p>
      ) : loadError ? (
        <p role="alert">
          {loadError}{" "}
          <Button
            titulo="Tentar novamente"
            onClick={() => setRevision((n) => n + 1)}
          />
        </p>
      ) : !id && !canManage ? (
        <p role="alert">Somente a administração pode criar rotas.</p>
      ) : (
        <>
          {record && (
            <div className="route-summary">
              <span className="status-pill">
                {record.isActive ? routeStatuses[record.status] : "Inativa"}
              </span>
              <span>Versão {record.version}</span>
              <Link to={"/route-executions?routeId=" + record.id}>
                Consultar execuções desta rota →
              </Link>
            </div>
          )}
          <form
            className="stack-form route-form"
            onSubmit={async (e) => {
              e.preventDefault();
              if (!editable) return;
              setFailure("");
              let payload: RouteRequest;
              try {
                if (
                  !name.trim() ||
                  !municipality ||
                  !areas.length ||
                  areas.some((area) => !area.neighborhoodId)
                )
                  throw new Error(
                    "Informe o nome, o município e todas as áreas da rota.",
                  );
                const keys = areas.map(
                  (area) =>
                    area.neighborhoodId +
                    ":" +
                    area.street.trim().toLocaleLowerCase("pt-BR"),
                );
                if (new Set(keys).size !== keys.length)
                  throw new Error(
                    "Não repita a mesma combinação de bairro e rua.",
                  );
                const minutes = duration ? Number(duration) : undefined;
                if (
                  minutes !== undefined &&
                  (!Number.isSafeInteger(minutes) ||
                    minutes < 1 ||
                    minutes > 2147483647)
                )
                  throw new Error(
                    "Informe uma duração inteira positiva em minutos.",
                  );
                payload = {
                  name: name.trim(),
                  municipalityId: municipality,
                  status,
                  version: record?.version,
                  plannedDistanceKm: distance
                    ? decimal(distance, 9, 3, true)
                    : undefined,
                  plannedDurationMinutes: minutes,
                  areas: areas.map((area) => ({
                    neighborhoodId: area.neighborhoodId,
                    street: area.street.trim() || undefined,
                  })),
                };
              } catch (err) {
                setFailure(
                  err instanceof Error
                    ? err.message
                    : "Confira os dados da rota.",
                );
                return;
              }
              setSaving(true);
              try {
                const saved = id
                  ? await routes.update(id, payload)
                  : await routes.create(payload);
                navigate("/routes/" + saved.id, { replace: !id });
                setRevision((n) => n + 1);
              } catch (err) {
                setFailure(errorMessage(err));
              } finally {
                setSaving(false);
              }
            }}
          >
            <fieldset disabled={saving || !editable}>
              <div className="form-grid">
                <label>
                  Nome da rota
                  <input
                    required
                    maxLength={150}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </label>
                <label>
                  Situação
                  <select
                    value={status}
                    onChange={(e) =>
                      setStatus(e.target.value as RouteRequest["status"])
                    }
                  >
                    <option value="DRAFT">Rascunho</option>
                    <option value="ACTIVE">Ativa</option>
                  </select>
                </label>
              </div>
              <ResourcePicker
                key={"municipality-" + territoryRevision}
                label="Município"
                required
                value={municipality}
                disabled={!!id}
                load={municipalityChoices}
                resolve={municipalityChoice}
                onChange={(value) => {
                  setMunicipality(value);
                  setAreas([newArea()]);
                }}
              />
              {!id && account?.userRole === "ADMINISTRATOR" && (
                <Button
                  variant="secondary"
                  titulo="Cadastrar município"
                  onClick={() => setTerritory("municipality")}
                />
              )}
              {id && (
                <p className="route-muted">
                  O município desta rota é fixo. Para outro território, cadastre
                  uma nova rota.
                </p>
              )}
              <div className="form-grid">
                <label>
                  Distância planejada (km)
                  <input
                    inputMode="decimal"
                    value={distance}
                    onChange={(e) => setDistance(e.target.value)}
                    placeholder="Opcional"
                  />
                </label>
                <label>
                  Duração planejada (minutos)
                  <input
                    type="number"
                    min={1}
                    max={2147483647}
                    step={1}
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    placeholder="Opcional"
                  />
                </label>
              </div>
              <section className="route-section">
                <div className="section-heading">
                  <h2>Cobertura planejada</h2>
                  {municipality && account?.userRole === "ADMINISTRATOR" && (
                    <Button
                      variant="secondary"
                      titulo="Cadastrar bairro"
                      onClick={() => setTerritory("neighborhood")}
                    />
                  )}
                </div>
                <p className="route-muted">
                  Sem uma rua específica, a área representa a cobertura do
                  bairro informado.
                </p>
                {!municipality ? (
                  <p>Selecione o município para adicionar a cobertura.</p>
                ) : (
                  areas.map((area, index) => (
                    <div className="route-area-editor" key={area.key}>
                      <span className="route-sequence">{index + 1}</span>
                      <div className="route-area-fields">
                        <ResourcePicker
                          key={municipality + ":" + territoryRevision}
                          label={"Bairro da área " + (index + 1)}
                          required
                          value={area.neighborhoodId}
                          load={neighborhoodChoices}
                          resolve={neighborhoodChoice}
                          onChange={(value) =>
                            updateArea(area.key, { neighborhoodId: value })
                          }
                        />
                        <label>
                          Rua (opcional)
                          <input
                            maxLength={255}
                            value={area.street}
                            onChange={(e) =>
                              updateArea(area.key, { street: e.target.value })
                            }
                          />
                        </label>
                      </div>
                      <div className="route-area-tools">
                        <button
                          type="button"
                          aria-label={
                            "Mover área " + (index + 1) + " para cima"
                          }
                          disabled={index === 0}
                          onClick={() => reorder(index, -1)}
                        >
                          <ArrowUp size={18} />
                        </button>
                        <button
                          type="button"
                          aria-label={
                            "Mover área " + (index + 1) + " para baixo"
                          }
                          disabled={index === areas.length - 1}
                          onClick={() => reorder(index, 1)}
                        >
                          <ArrowDown size={18} />
                        </button>
                        <button
                          type="button"
                          aria-label={"Remover área " + (index + 1)}
                          disabled={areas.length === 1}
                          onClick={() =>
                            setAreas((previous) =>
                              previous.filter((item) => item.key !== area.key),
                            )
                          }
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  ))
                )}
                {municipality && areas.length < 200 && (
                  <Button
                    variant="secondary"
                    titulo="Adicionar área"
                    onClick={() =>
                      setAreas((previous) => [...previous, newArea()])
                    }
                  />
                )}
              </section>
            </fieldset>
            {failure && (
              <p role="alert">
                {failure}{" "}
                <Button
                  variant="secondary"
                  titulo="Recarregar rota"
                  disabled={saving}
                  onClick={() => setRevision((n) => n + 1)}
                />
              </p>
            )}
            {editable && (
              <div className="dialog-footer">
                <Link to="/routes">Voltar</Link>
                <Button
                  type="submit"
                  titulo={saving ? "Salvando…" : "Salvar planejamento"}
                  disabled={saving}
                />
              </div>
            )}
          </form>
          {id && <RouteHistory id={id} revision={revision} />}
        </>
      )}
      {territory && (
        <TerritoryDialog
          municipalityId={
            territory === "neighborhood" ? municipality : undefined
          }
          onClose={() => setTerritory(null)}
          onCreated={() => setTerritoryRevision((n) => n + 1)}
        />
      )}
    </Card>
  );
}
