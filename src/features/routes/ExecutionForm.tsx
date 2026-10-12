/** @author Enzo Ribas (https://github.com/oEnzoRibas) */
import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import Card from "../../components/Card";
import Button from "../../components/Button";
import ResourcePicker from "../../shared/ui/ResourcePicker";
import { errorMessage } from "../../shared/api/transport";
import { useSession } from "../identity/SessionProvider";
import {
  vehicleChoices,
  vehicleChoice,
  driverChoices,
  teamChoice,
  teamChoices,
} from "../intake/choices";
import { localDateTime, submittedInstant } from "../intake/quantities";
import { executions, routeChoices, routeChoice } from "./api";

/** Assigns current fleet/staff to an active reusable plan; actual departure is recorded separately. */
export default function ExecutionForm() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { canManage } = useSession();
  const [routeId, setRouteId] = useState(params.get("routeId") ?? "");
  const [plannedStart, setPlannedStart] = useState(
    localDateTime(new Date().toISOString()),
  );
  const [vehicleId, setVehicleId] = useState("");
  const [driverId, setDriverId] = useState("");
  const [crew, setCrew] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  const [failure, setFailure] = useState("");
  return (
    <Card>
      <Link className="route-back" to="/route-executions">
        ← Voltar para execuções
      </Link>
      <div className="page-heading">
        <div>
          <p className="eyebrow">PROGRAMAÇÃO</p>
          <h1>Planejar execução</h1>
          <p className="page-description">
            Selecione a rota e a equipe desta saída. O planejamento utilizado
            será preservado no histórico.
          </p>
        </div>
      </div>
      {!canManage ? (
        <p role="alert">Somente a administração pode planejar execuções.</p>
      ) : (
        <form
          className="stack-form route-form"
          onSubmit={async (e) => {
            e.preventDefault();
            setFailure("");
            if (
              !routeId ||
              !vehicleId ||
              !driverId ||
              !plannedStart ||
              !Number.isFinite(new Date(plannedStart).getTime())
            ) {
              setFailure(
                "Informe a rota, a saída planejada, o veículo e o motorista.",
              );
              return;
            }
            if (
              crew.some((id) => !id) ||
              crew.includes(driverId) ||
              new Set(crew).size !== crew.length
            ) {
              setFailure(
                "Selecione integrantes distintos, sem repetir o motorista.",
              );
              return;
            }
            setBusy(true);
            try {
              const saved = await executions.create({
                routeId,
                plannedStartAt: submittedInstant(plannedStart),
                vehicleId,
                driverId,
                teamMemberIds: crew,
              });
              navigate("/route-executions/" + saved.id);
            } catch (err) {
              setFailure(errorMessage(err));
            } finally {
              setBusy(false);
            }
          }}
        >
          <fieldset disabled={busy}>
            <ResourcePicker
              label="Rota ativa"
              required
              value={routeId}
              onChange={setRouteId}
              load={routeChoices}
              resolve={routeChoice}
            />
            <label>
              Saída planejada
              <input
                type="datetime-local"
                required
                value={plannedStart}
                onChange={(e) => setPlannedStart(e.target.value)}
              />
            </label>
            <div className="form-grid">
              <ResourcePicker
                label="Veículo"
                required
                value={vehicleId}
                onChange={setVehicleId}
                load={vehicleChoices}
                resolve={vehicleChoice}
              />
              <ResourcePicker
                label="Motorista"
                required
                value={driverId}
                onChange={setDriverId}
                load={driverChoices}
                resolve={teamChoice}
              />
            </div>
            <section className="route-section">
              <h2>Equipe desta execução</h2>
              <p className="route-muted">
                O motorista já está registrado separadamente. A equipe adicional
                é opcional.
              </p>
              {crew.map((id, index) => (
                <div className="line-row" key={index}>
                  <ResourcePicker
                    label={"Integrante " + (index + 1)}
                    required
                    value={id}
                    load={teamChoices}
                    resolve={teamChoice}
                    onChange={(value) =>
                      setCrew((previous) =>
                        previous.map((member, n) =>
                          n === index ? value : member,
                        ),
                      )
                    }
                  />
                  <Button
                    titulo="Remover integrante"
                    variant="secondary"
                    onClick={() =>
                      setCrew((previous) =>
                        previous.filter((_, n) => n !== index),
                      )
                    }
                  />
                </div>
              ))}
              {crew.length < 100 && (
                <Button
                  titulo="Adicionar integrante"
                  variant="secondary"
                  onClick={() => setCrew((previous) => [...previous, ""])}
                />
              )}
            </section>
          </fieldset>
          {failure && <p role="alert">{failure}</p>}
          <div className="dialog-footer">
            <Link to="/route-executions">Cancelar</Link>
            <Button
              type="submit"
              titulo={busy ? "Salvando…" : "Planejar execução"}
              disabled={busy}
            />
          </div>
        </form>
      )}
    </Card>
  );
}
