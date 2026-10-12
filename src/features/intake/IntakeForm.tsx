/** @author Enzo Ribas (https://github.com/oEnzoRibas) */
import { useEffect, useState } from "react";
import {
  Link,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import {
  executions,
  completedExecutionChoices,
  executionChoice,
} from "../routes/api";
import Card from "../../components/Card";
import Button from "../../components/Button";
import ResourcePicker from "../../shared/ui/ResourcePicker";
import { errorMessage } from "../../shared/api/transport";
import {
  collections,
  donations,
  type Collection,
  type Donation,
  type CollectionRequest,
  type DonationCreate,
  type InputLine,
} from "./api";
import type { IntakeKind } from "./IntakeList";
import {
  decimal,
  sumWeights,
  displayDecimal,
  localDateTime,
  submittedInstant,
} from "./quantities";
import {
  donorChoices,
  donorChoice,
  teamChoices,
  teamChoice,
  driverChoices,
  vehicleChoices,
  vehicleChoice,
  documentChoices,
  documentChoice,
  subtypeChoices,
  subtypeChoice,
} from "./choices";
type Line = InputLine & { key: string };
type Draft = {
  date: string;
  donorId: string;
  vehicleId: string;
  driverId: string;
  proofAttachmentId: string;
  mtrGeneratorId: string;
  mtrDestinatorId: string;
  collectionDiaryId: string;
  teamMemberIds: string[];
  routeDescription: string;
  routeExecutionId: string;
  departureAt: string;
  arrivalAt: string;
  distanceKm: string;
  lines: Line[];
};
const newLine = (): Line => ({
  key: crypto.randomUUID(),
  materialSubtypeId: "",
  weightKg: "",
  volumeM3: "",
});
const blank = (): Draft => ({
  date: localDateTime(new Date().toISOString()),
  donorId: "",
  vehicleId: "",
  driverId: "",
  proofAttachmentId: "",
  mtrGeneratorId: "",
  mtrDestinatorId: "",
  collectionDiaryId: "",
  teamMemberIds: [],
  routeDescription: "",
  routeExecutionId: "",
  departureAt: "",
  arrivalAt: "",
  distanceKm: "",
  lines: [newLine()],
});
/** Explicit collection/donation form; shared input lines retain exact decimals and UUID references. */
export default function IntakeForm({ kind }: { kind: IntakeKind }) {
  const { id } = useParams();
  const [query] = useSearchParams();
  const incomingExecution =
    kind === "collections" && !id ? (query.get("executionId") ?? "") : "";
  const navigate = useNavigate();
  const [draft, setDraft] = useState(blank);
  const [loading, setLoading] = useState(!!id);
  const [loadError, setLoadError] = useState("");
  const [failure, setFailure] = useState("");
  const [saving, setSaving] = useState(false);
  const [revision, setRevision] = useState(0);
  const [boundExecution, setBoundExecution] = useState(false);
  const [executionLoading, setExecutionLoading] = useState(false);
  const [executionError, setExecutionError] = useState("");
  const [originalDates, setOriginalDates] = useState<{
    date?: string;
    departureAt?: string;
    arrivalAt?: string;
  }>({});
  useEffect(() => {
    let active = true;
    setDraft({ ...blank(), routeExecutionId: incomingExecution });
    setBoundExecution(false);
    setOriginalDates({});
    setLoading(!!id);
    setLoadError("");
    setFailure("");
    if (id)
      void (kind === "collections" ? collections : donations)
        .get(id)
        .then((record) => {
          if (!active) return;
          const c = record as Collection;
          const d = record as Donation;
          setBoundExecution(!!c.routeExecutionId);
          setOriginalDates({
            date: kind === "collections" ? c.realizationDate : d.donationDate,
            departureAt: c.departureAt,
            arrivalAt: c.arrivalAt,
          });
          setDraft({
            date: localDateTime(
              kind === "collections" ? c.realizationDate : d.donationDate,
            ),
            donorId: d.donorId ?? "",
            vehicleId: c.vehicleId ?? "",
            driverId: c.driverId ?? "",
            proofAttachmentId: d.proofAttachmentId ?? "",
            mtrGeneratorId: c.mtrGeneratorId ?? "",
            mtrDestinatorId: c.mtrDestinatorId ?? "",
            collectionDiaryId: c.collectionDiaryId ?? "",
            teamMemberIds: c.teamMemberIds ?? [],
            routeDescription: c.routeDescription ?? "",
            routeExecutionId: c.routeExecutionId ?? "",
            departureAt: localDateTime(c.departureAt),
            arrivalAt: localDateTime(c.arrivalAt),
            distanceKm: c.distanceKm ?? "",
            lines: (record.inputItems ?? [])
              .filter((line) => line.isActive !== false)
              .map((line) => ({
                key: crypto.randomUUID(),
                materialSubtypeId: line.materialSubtypeId ?? "",
                weightKg: line.weightKg ?? "",
                volumeM3: line.volumeM3 ?? "",
              })),
          });
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
  }, [kind, id, revision, incomingExecution]);
  useEffect(() => {
    let active = true;
    setExecutionError("");
    setExecutionLoading(!!draft.routeExecutionId);
    if (draft.routeExecutionId)
      void executions
        .get(draft.routeExecutionId)
        .then((execution) => {
          if (!active) return;
          if (execution.status !== "COMPLETED")
            throw new Error("Execution must be completed");
          setDraft((previous) => ({
            ...previous,
            vehicleId: execution.vehicleId,
            driverId: execution.driverId,
            teamMemberIds: execution.team.map((member) => member.teamMemberId!),
            departureAt: localDateTime(execution.startedAt),
            arrivalAt: localDateTime(execution.finishedAt),
            distanceKm:
              execution.distanceKm == null
                ? ""
                : displayDecimal(execution.distanceKm),
          }));
        })
        .catch((err) => {
          if (active) setExecutionError(errorMessage(err));
        })
        .finally(() => {
          if (active) setExecutionLoading(false);
        });
    return () => {
      active = false;
    };
  }, [draft.routeExecutionId, revision]);
  function update<K extends keyof Draft>(key: K, value: Draft[K]) {
    setDraft((previous) => ({ ...previous, [key]: value }));
  }
  function updateLine(key: string, changes: Partial<Line>) {
    setDraft((previous) => ({
      ...previous,
      lines: previous.lines.map((line) =>
        line.key === key ? { ...line, ...changes } : line,
      ),
    }));
  }
  let total = "—";
  try {
    if (draft.lines.length)
      total = displayDecimal(
        sumWeights(draft.lines.map((line) => line.weightKg)),
      );
  } catch {
    /* Incomplete input is expected while typing. */
  }
  return (
    <Card>
      <Link to={"/intake/" + kind} className="text-sm underline">
        Voltar para entradas
      </Link>
      <h1 className="mt-4">
        {id ? "Consultar / editar" : "Registrar"}{" "}
        {kind === "collections" ? "coleta" : "doação"}
      </h1>
      <p className="page-description">
        Informe pesos em kg e volumes em m³, com até quatro casas decimais.
        Entradas já utilizadas na triagem não podem ser alteradas.
      </p>
      {loading ? (
        <p role="status">Carregando entrada…</p>
      ) : loadError ? (
        <p role="alert">
          {loadError}{" "}
          <Button
            titulo="Tentar novamente"
            onClick={() => setRevision((n) => n + 1)}
          />
        </p>
      ) : (
        <form
          className="stack-form intake-form"
          onSubmit={async (e) => {
            e.preventDefault();
            if (executionLoading || executionError) return;
            setFailure("");
            let inputs: InputLine[];
            let totalWeightKg: string;
            let distanceKm: string | undefined;
            try {
              if (!draft.lines.length || draft.lines.length > 200)
                throw new Error("Informe de 1 a 200 itens de entrada.");
              inputs = draft.lines.map((line) => {
                if (!line.materialSubtypeId)
                  throw new Error("Selecione o material de todos os itens.");
                return {
                  materialSubtypeId: line.materialSubtypeId,
                  weightKg: decimal(line.weightKg),
                  volumeM3: decimal(line.volumeM3),
                };
              });
              totalWeightKg = sumWeights(inputs.map((line) => line.weightKg));
              if (totalWeightKg.split(".")[0].length > 11)
                throw new Error(
                  "O peso total ultrapassa o limite de 11 dígitos inteiros. Divida o recebimento em entradas menores.",
                );
              distanceKm = draft.distanceKm
                ? decimal(draft.distanceKm, 9, 3, true)
                : undefined;
              if (
                !draft.date ||
                !Number.isFinite(new Date(draft.date).getTime())
              )
                throw new Error("Informe a data e a hora da entrada.");
              if (kind === "collections") {
                if (!draft.vehicleId || !draft.driverId)
                  throw new Error("Selecione o veículo e o motorista.");
                if (
                  !!draft.departureAt !== !!draft.arrivalAt ||
                  (draft.departureAt &&
                    new Date(draft.arrivalAt) < new Date(draft.departureAt))
                )
                  throw new Error(
                    "Informe saída e chegada juntas, em ordem cronológica.",
                  );
                if (
                  draft.teamMemberIds.some((member) => !member) ||
                  draft.teamMemberIds.includes(draft.driverId) ||
                  new Set(draft.teamMemberIds).size !==
                    draft.teamMemberIds.length
                )
                  throw new Error(
                    "Selecione integrantes distintos para a equipe, sem repetir o motorista.",
                  );
              } else if (!draft.donorId) throw new Error("Selecione o doador.");
            } catch (err) {
              setFailure(
                err instanceof Error
                  ? err.message
                  : "Confira os campos informados.",
              );
              return;
            }
            setSaving(true);
            try {
              if (kind === "collections") {
                const payload: CollectionRequest = {
                  realizationDate: submittedInstant(
                    draft.date,
                    originalDates.date,
                  ),
                  totalWeightKg,
                  vehicleId: draft.vehicleId,
                  driverId: draft.driverId,
                  teamMemberIds: draft.teamMemberIds,
                  inputItems: inputs,
                  routeDescription: draft.routeDescription || undefined,
                  routeExecutionId: draft.routeExecutionId || undefined,
                  departureAt:
                    !draft.routeExecutionId && draft.departureAt
                      ? submittedInstant(
                          draft.departureAt,
                          originalDates.departureAt,
                        )
                      : undefined,
                  arrivalAt:
                    !draft.routeExecutionId && draft.arrivalAt
                      ? submittedInstant(
                          draft.arrivalAt,
                          originalDates.arrivalAt,
                        )
                      : undefined,
                  distanceKm: draft.routeExecutionId ? undefined : distanceKm,
                  mtrGeneratorId: draft.mtrGeneratorId || undefined,
                  mtrDestinatorId: draft.mtrDestinatorId || undefined,
                  collectionDiaryId: draft.collectionDiaryId || undefined,
                };
                if (id) await collections.update(id, payload);
                else await collections.create(payload);
              } else {
                const payload: DonationCreate = {
                  donationDate: submittedInstant(
                    draft.date,
                    originalDates.date,
                  ),
                  donorId: draft.donorId,
                  totalWeightKg,
                  proofAttachmentId: draft.proofAttachmentId || undefined,
                  inputItems: inputs,
                };
                if (id)
                  await donations.update(id, {
                    donationDate: payload.donationDate,
                    totalWeightKg,
                    inputItems: inputs,
                    proofAttachmentId: payload.proofAttachmentId,
                  });
                else await donations.create(payload);
              }
              navigate("/intake/" + kind);
            } catch (err) {
              setFailure(errorMessage(err));
            } finally {
              setSaving(false);
            }
          }}
        >
          {kind === "collections" && (
            <section className="route-section">
              <h2>Execução de rota</h2>
              <p className="route-muted">
                Vincule uma execução concluída para preservar o trajeto
                realizado, o veículo e a equipe. Uma coleta avulsa também pode
                ser registrada.
              </p>
              <ResourcePicker
                label="Execução concluída (opcional)"
                value={draft.routeExecutionId}
                onChange={(value) => update("routeExecutionId", value)}
                load={completedExecutionChoices}
                resolve={executionChoice}
                disabled={saving || boundExecution}
              />
              {boundExecution && (
                <p className="route-muted">
                  O vínculo original desta coleta é preservado.
                </p>
              )}
              {draft.routeExecutionId && (
                <Link to={"/route-executions/" + draft.routeExecutionId}>
                  Consultar execução vinculada →
                </Link>
              )}
              {executionLoading && (
                <p role="status">Carregando os dados da execução…</p>
              )}
              {executionError && (
                <p role="alert">
                  {executionError}{" "}
                  <Button
                    titulo="Recarregar execução"
                    onClick={() => setRevision((n) => n + 1)}
                  />
                </p>
              )}
            </section>
          )}
          <fieldset disabled={saving || executionLoading}>
            <legend>Dados da entrada</legend>
            <div className="form-grid">
              <label>
                Data e hora
                <input
                  type="datetime-local"
                  required
                  value={draft.date}
                  onChange={(e) => update("date", e.target.value)}
                />
              </label>
              {kind === "donations" ? (
                <ResourcePicker
                  label="Doador"
                  required
                  disabled={!!id}
                  value={draft.donorId}
                  onChange={(value) => update("donorId", value)}
                  load={donorChoices}
                  resolve={donorChoice}
                />
              ) : (
                <>
                  <ResourcePicker
                    label="Veículo"
                    disabled={!!draft.routeExecutionId}
                    required
                    value={draft.vehicleId}
                    onChange={(value) => update("vehicleId", value)}
                    load={vehicleChoices}
                    resolve={vehicleChoice}
                  />
                  <ResourcePicker
                    label="Motorista"
                    disabled={!!draft.routeExecutionId}
                    required
                    value={draft.driverId}
                    onChange={(value) => update("driverId", value)}
                    load={driverChoices}
                    resolve={teamChoice}
                  />
                </>
              )}
            </div>
            {kind === "donations" && id && (
              <p className="muted-note">
                O doador original é preservado nesta entrada.
              </p>
            )}
          </fieldset>
          {kind === "collections" && (
            <fieldset disabled={saving || !!draft.routeExecutionId}>
              <legend>Trajeto e equipe</legend>
              <label>
                Descrição do trajeto
                <textarea
                  maxLength={2000}
                  value={draft.routeDescription}
                  onChange={(e) => update("routeDescription", e.target.value)}
                />
              </label>
              <div className="form-grid">
                <label>
                  Saída
                  <input
                    type="datetime-local"
                    value={draft.departureAt}
                    onChange={(e) => update("departureAt", e.target.value)}
                  />
                </label>
                <label>
                  Chegada
                  <input
                    type="datetime-local"
                    value={draft.arrivalAt}
                    onChange={(e) => update("arrivalAt", e.target.value)}
                  />
                </label>
                <label>
                  Distância (km)
                  <input
                    inputMode="decimal"
                    value={draft.distanceKm}
                    onChange={(e) => update("distanceKm", e.target.value)}
                  />
                </label>
              </div>
              {draft.teamMemberIds.map((member, index) => (
                <div className="line-row" key={index}>
                  <ResourcePicker
                    label={"Integrante " + (index + 1)}
                    required
                    value={member}
                    onChange={(value) =>
                      update(
                        "teamMemberIds",
                        draft.teamMemberIds.map((entry, n) =>
                          n === index ? value : entry,
                        ),
                      )
                    }
                    load={teamChoices}
                    resolve={teamChoice}
                  />
                  <Button
                    variant="secondary"
                    titulo="Remover integrante"
                    onClick={() =>
                      update(
                        "teamMemberIds",
                        draft.teamMemberIds.filter((_, n) => n !== index),
                      )
                    }
                  />
                </div>
              ))}
              <Button
                variant="secondary"
                titulo="Adicionar integrante à coleta"
                onClick={() =>
                  update("teamMemberIds", [...draft.teamMemberIds, ""])
                }
              />
            </fieldset>
          )}
          <fieldset disabled={saving}>
            <legend>Materiais recebidos</legend>
            {draft.lines.map((line, index) => (
              <div className="intake-line" key={line.key}>
                <h3>Item {index + 1}</h3>
                <ResourcePicker
                  label={"Material do item " + (index + 1)}
                  required
                  value={line.materialSubtypeId}
                  onChange={(value) =>
                    updateLine(line.key, { materialSubtypeId: value })
                  }
                  load={subtypeChoices}
                  resolve={subtypeChoice}
                />
                <div className="form-grid">
                  <label>
                    Peso (kg)
                    <input
                      required
                      inputMode="decimal"
                      value={line.weightKg}
                      onChange={(e) =>
                        updateLine(line.key, { weightKg: e.target.value })
                      }
                    />
                  </label>
                  <label>
                    Volume (m³)
                    <input
                      required
                      inputMode="decimal"
                      value={line.volumeM3}
                      onChange={(e) =>
                        updateLine(line.key, { volumeM3: e.target.value })
                      }
                    />
                  </label>
                </div>
                <Button
                  variant="secondary"
                  titulo="Remover item"
                  disabled={draft.lines.length === 1}
                  onClick={() =>
                    update(
                      "lines",
                      draft.lines.filter((item) => item.key !== line.key),
                    )
                  }
                />
              </div>
            ))}
            <div className="form-actions">
              <Button
                variant="secondary"
                titulo="Adicionar material"
                disabled={draft.lines.length >= 200}
                onClick={() => update("lines", [...draft.lines, newLine()])}
              />
              <strong>Peso declarado: {total} kg</strong>
            </div>
          </fieldset>
          <fieldset disabled={saving}>
            <legend>Documentos (opcional)</legend>
            <p className="muted-note">
              Envie arquivos em Documentos antes de iniciar o registro.
              Selecione apenas comprovantes desta organização.
            </p>
            <div className="form-grid">
              {kind === "donations" ? (
                <ResourcePicker
                  label="Comprovante da doação"
                  value={draft.proofAttachmentId}
                  onChange={(value) => update("proofAttachmentId", value)}
                  load={documentChoices}
                  resolve={documentChoice}
                />
              ) : (
                <>
                  <ResourcePicker
                    label="MTR do gerador"
                    value={draft.mtrGeneratorId}
                    onChange={(value) => update("mtrGeneratorId", value)}
                    load={documentChoices}
                    resolve={documentChoice}
                  />
                  <ResourcePicker
                    label="MTR do destinatário"
                    value={draft.mtrDestinatorId}
                    onChange={(value) => update("mtrDestinatorId", value)}
                    load={documentChoices}
                    resolve={documentChoice}
                  />
                  <ResourcePicker
                    label="Diário da coleta"
                    value={draft.collectionDiaryId}
                    onChange={(value) => update("collectionDiaryId", value)}
                    load={documentChoices}
                    resolve={documentChoice}
                  />
                </>
              )}
            </div>
          </fieldset>
          {failure && <p role="alert">{failure}</p>}
          <div className="form-actions">
            <Button
              variant="secondary"
              titulo="Cancelar"
              disabled={saving}
              onClick={() => navigate("/intake/" + kind)}
            />
            <Button
              type="submit"
              titulo={saving ? "Salvando…" : "Salvar entrada"}
              disabled={saving || executionLoading || !!executionError}
            />
          </div>
        </form>
      )}
    </Card>
  );
}
