/** @author Enzo Ribas (https://github.com/oEnzoRibas) */
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Play, CheckCircle2, Ban } from "lucide-react";
import Card from "../../components/Card";
import Button from "../../components/Button";
import Modal from "../../components/Modal";
import { errorMessage } from "../../shared/api/transport";
import { useSession } from "../identity/SessionProvider";
import { decimal, displayDecimal } from "../intake/quantities";
import { executions, executionStatuses, type Execution } from "./api";
const timestamp = (value: string | undefined) =>
  value ? new Date(value).toLocaleString("pt-BR") : "Não registrado";

/** Operates explicit lifecycle commands without inferring distance, coverage or terminal corrections. */
export default function ExecutionPage() {
  const { id } = useParams();
  const { canManage } = useSession();
  const [record, setRecord] = useState<Execution | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [revision, setRevision] = useState(0);
  const [busy, setBusy] = useState(false);
  const [failure, setFailure] = useState("");
  const [command, setCommand] = useState<
    "start" | "complete" | "cancel" | null
  >(null);
  const [distance, setDistance] = useState("");
  const [reason, setReason] = useState("");
  useEffect(() => {
    let active = true;
    setLoading(true);
    setLoadError("");
    if (id)
      void executions
        .get(id)
        .then((item) => {
          if (active) setRecord(item);
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
  function open(action: typeof command) {
    setCommand(action);
    setFailure("");
    setDistance("");
    setReason("");
  }
  async function coverage(areaId: string, covered: boolean) {
    if (!record) return;
    setBusy(true);
    setFailure("");
    try {
      setRecord(await executions.coverage(record, areaId, covered));
    } catch (err) {
      setFailure(errorMessage(err));
    } finally {
      setBusy(false);
    }
  }
  return (
    <Card>
      <Link className="route-back" to="/route-executions">
        ← Voltar para execuções
      </Link>
      {loading ? (
        <p role="status">Carregando execução…</p>
      ) : loadError ? (
        <p role="alert">
          {loadError}{" "}
          <Button
            titulo="Tentar novamente"
            onClick={() => setRevision((n) => n + 1)}
          />
        </p>
      ) : (
        record && (
          <>
            <div className="page-heading">
              <div>
                <p className="eyebrow">EXECUÇÃO DE ROTA</p>
                <h1>{record.routeName}</h1>
                <p className="page-description">
                  {record.municipalityName} / {record.municipalityStateCode} ·
                  IBGE {record.municipalityIbgeCode}
                </p>
              </div>
              <span className="status-pill">
                {executionStatuses[record.status]}
              </span>
            </div>
            <div className="route-summary">
              <Link to={"/routes/" + record.routeId}>
                Consultar planejamento atual
              </Link>
              <span>Planejamento utilizado: versão {record.routeVersion}</span>
              <span>Execução: versão {record.version}</span>
            </div>
            {failure && !command && (
              <p role="alert">
                {failure}{" "}
                <Button
                  titulo="Recarregar execução"
                  disabled={busy}
                  onClick={() => setRevision((n) => n + 1)}
                  variant="secondary"
                />
              </p>
            )}
            <section className="route-facts">
              <div>
                <h2>Programação</h2>
                <dl>
                  <dt>Saída planejada</dt>
                  <dd>{timestamp(record.plannedStartAt)}</dd>
                  <dt>Distância planejada</dt>
                  <dd>
                    {record.plannedDistanceKm == null
                      ? "Não informada"
                      : displayDecimal(record.plannedDistanceKm) + " km"}
                  </dd>
                  <dt>Duração planejada</dt>
                  <dd>
                    {record.plannedDurationMinutes == null
                      ? "Não informada"
                      : record.plannedDurationMinutes + " minutos"}
                  </dd>
                </dl>
              </div>
              <div>
                <h2>Execução realizada</h2>
                <dl>
                  <dt>Saída registrada</dt>
                  <dd>{timestamp(record.startedAt)}</dd>
                  <dt>Chegada registrada</dt>
                  <dd>{timestamp(record.finishedAt)}</dd>
                  <dt>Distância informada</dt>
                  <dd>
                    {record.distanceKm == null
                      ? "Não informada"
                      : displayDecimal(record.distanceKm) + " km"}
                  </dd>
                  {record.status === "CANCELLED" && (
                    <>
                      <dt>Cancelamento</dt>
                      <dd>{timestamp(record.cancelledAt)}</dd>
                      <dt>Motivo</dt>
                      <dd>{record.cancellationReason}</dd>
                    </>
                  )}
                </dl>
              </div>
              <div>
                <h2>Veículo e equipe</h2>
                <dl>
                  <dt>Veículo</dt>
                  <dd>{record.vehicleLicensePlate}</dd>
                  <dt>Motorista</dt>
                  <dd>{record.driverName}</dd>
                  <dt>Integrantes</dt>
                  <dd>
                    {record.team.length
                      ? record.team.map((member) => member.name).join(", ")
                      : "Sem equipe adicional"}
                  </dd>
                </dl>
              </div>
            </section>
            <section className="route-section">
              <h2>Cobertura desta execução</h2>
              <p className="route-muted">
                Marque apenas as áreas atendidas. Uma conclusão não marca
                automaticamente áreas pendentes.
              </p>
              <ol className="route-coverage">
                {record.areas.map((area) => (
                  <li key={area.id}>
                    <span className="route-sequence">{area.sequence}</span>
                    <div>
                      <strong>{area.neighborhoodName}</strong>
                      <span>{area.street || "Cobertura do bairro"}</span>
                    </div>
                    <label>
                      <input
                        type="checkbox"
                        aria-label={
                          "Área atendida: " +
                          area.neighborhoodName +
                          (area.street ? " — " + area.street : "")
                        }
                        checked={area.covered ?? false}
                        disabled={busy || record.status !== "IN_PROGRESS"}
                        onChange={(e) =>
                          void coverage(area.id!, e.target.checked)
                        }
                      />
                      {area.covered ? "Atendida" : "Pendente"}
                    </label>
                  </li>
                ))}
              </ol>
            </section>
            <div className="route-actions route-command-bar">
              {record.status === "PLANNED" && (
                <Button
                  titulo="Iniciar execução"
                  disabled={busy}
                  onClick={() => open("start")}
                />
              )}
              {record.status === "IN_PROGRESS" && (
                <Button
                  titulo="Concluir execução"
                  disabled={busy}
                  onClick={() => open("complete")}
                />
              )}
              {canManage &&
                ["PLANNED", "IN_PROGRESS"].includes(record.status) && (
                  <Button
                    titulo="Cancelar execução"
                    variant="secondary"
                    disabled={busy}
                    onClick={() => open("cancel")}
                  />
                )}
              {record.status === "COMPLETED" && (
                <Link
                  className="route-link route-link-primary"
                  to={"/intake/collections/new?executionId=" + record.id}
                >
                  Registrar coleta desta execução
                </Link>
              )}
            </div>
            {command && (
              <Modal
                label="Operar execução"
                onClose={() => setCommand(null)}
                busy={busy}
                title={
                  command === "start"
                    ? "Iniciar execução"
                    : command === "complete"
                      ? "Concluir execução"
                      : "Cancelar execução"
                }
                description={
                  command === "start"
                    ? "A saída será registrada com o horário atual."
                    : command === "complete"
                      ? "A chegada será registrada e a execução ficará encerrada."
                      : "Informe por que esta execução não será continuada."
                }
                icon={
                  command === "start" ? (
                    <Play size={22} />
                  ) : command === "complete" ? (
                    <CheckCircle2 size={22} />
                  ) : (
                    <Ban size={22} />
                  )
                }
                tone={command === "cancel" ? "danger" : "default"}
              >
                <form
                  className="stack-form"
                  onSubmit={async (e) => {
                    e.preventDefault();
                    setFailure("");
                    let measurement: string | undefined;
                    try {
                      measurement = distance
                        ? decimal(distance, 9, 3, true)
                        : undefined;
                      if (command === "cancel" && !reason.trim())
                        throw new Error("Informe o motivo do cancelamento.");
                    } catch (err) {
                      setFailure(
                        err instanceof Error
                          ? err.message
                          : "Confira os dados.",
                      );
                      return;
                    }
                    setBusy(true);
                    try {
                      const updated =
                        command === "start"
                          ? await executions.start(record)
                          : command === "complete"
                            ? await executions.complete(record, measurement)
                            : await executions.cancel(record, reason.trim());
                      setRecord(updated);
                      setCommand(null);
                    } catch (err) {
                      setFailure(errorMessage(err));
                    } finally {
                      setBusy(false);
                    }
                  }}
                >
                  <div className="dialog-context">
                    <strong>{record.routeName}</strong>
                    <span>
                      {record.vehicleLicensePlate} · {record.driverName}
                    </span>
                  </div>
                  {command === "complete" && (
                    <>
                      <label>
                        Distância percorrida (km, opcional)
                        <input
                          inputMode="decimal"
                          value={distance}
                          disabled={busy}
                          onChange={(e) => setDistance(e.target.value)}
                          placeholder="Informe apenas se houver medição"
                        />
                      </label>
                      <p className="dialog-notice">
                        A distância ausente continuará sem informação. A
                        cobertura registrada será preservada.
                      </p>
                    </>
                  )}
                  {command === "cancel" && (
                    <label>
                      Motivo do cancelamento
                      <textarea
                        required
                        maxLength={500}
                        value={reason}
                        disabled={busy}
                        onChange={(e) => setReason(e.target.value)}
                      />
                    </label>
                  )}
                  {failure && (
                    <p role="alert">
                      {failure}{" "}
                      <Button
                        titulo="Recarregar execução"
                        variant="secondary"
                        disabled={busy}
                        onClick={() => {
                          setCommand(null);
                          setRevision((n) => n + 1);
                        }}
                      />
                    </p>
                  )}
                  <div className="dialog-footer">
                    <Button
                      titulo="Voltar"
                      variant="secondary"
                      disabled={busy}
                      onClick={() => setCommand(null)}
                    />
                    <Button
                      type="submit"
                      titulo={
                        busy
                          ? "Registrando…"
                          : command === "start"
                            ? "Confirmar saída"
                            : command === "complete"
                              ? "Confirmar conclusão"
                              : "Confirmar cancelamento"
                      }
                      variant={command === "cancel" ? "danger" : undefined}
                      disabled={busy}
                    />
                  </div>
                </form>
              </Modal>
            )}
          </>
        )
      )}
    </Card>
  );
}
