/** @author Enzo Ribas (https://github.com/oEnzoRibas) */
import { useState } from "react";
import Card from "../../components/Card";
import Button from "../../components/Button";
import Modal from "../../components/Modal";
import Pagination from "../../shared/ui/Pagination";
import { usePage } from "../../shared/ui/usePage";
import { useSession } from "../identity/SessionProvider";
import { errorMessage } from "../../shared/api/transport";
import { team, teamRoles, type TeamMember, type TeamRequest } from "./api";
export default function TeamPage() {
  const manager = useSession().membership?.role === "MANAGER";
  const [page, setPage] = useState(0);
  const [revision, setRevision] = useState(0);
  const { data, busy, error } = usePage(team.list, page, revision);
  const [editing, setEditing] = useState<TeamMember | "new" | null>(null);
  const [values, setValues] = useState<TeamRequest>({
    name: "",
    role: "DRIVER",
  });
  const [removing, setRemoving] = useState<TeamMember | null>(null);
  const [saving, setSaving] = useState(false);
  const [failure, setFailure] = useState("");
  function edit(item: TeamMember | "new") {
    setFailure("");
    setEditing(item);
    setValues(
      item === "new"
        ? { name: "", role: "DRIVER" }
        : { name: item.name ?? "", role: item.role ?? "DRIVER" },
    );
  }
  function refresh() {
    setPage(0);
    setRevision((n) => n + 1);
  }
  return (
    <Card>
      <div className="page-heading">
        <div>
          <p className="eyebrow">CADASTROS</p>
          <h1>Equipe operacional</h1>
          <p className="page-description">
            Motoristas, ajudantes e operadores. Este cadastro não cria contas de
            acesso.
          </p>
        </div>
        {manager && (
          <Button titulo="Adicionar integrante" onClick={() => edit("new")} />
        )}
      </div>
      {(error || (!editing && failure)) && (
        <p role="alert">
          {error || failure}{" "}
          <Button variant="secondary" titulo="Recarregar" onClick={refresh} />
        </p>
      )}
      {busy ? (
        <p role="status">Carregando equipe…</p>
      ) : (
        !error && (
          <>
            <div className="table-scroll">
              <table>
                <thead>
                  <tr>
                    <th>Nome</th>
                    <th>Função</th>
                    {manager && <th>Ações</th>}
                  </tr>
                </thead>
                <tbody>
                  {data.items.map((item) => (
                    <tr key={item.id}>
                      <td>{item.name}</td>
                      <td>
                        {teamRoles[item.role as keyof typeof teamRoles] ??
                          "Não informada"}
                      </td>
                      {manager && (
                        <td className="row-actions">
                          <Button
                            variant="secondary"
                            titulo="Editar"
                            onClick={() => edit(item)}
                          />
                          <Button
                            variant="secondary"
                            titulo="Desativar"
                            onClick={() => {
                              setFailure("");
                              setRemoving(item);
                            }}
                          />
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {!data.items.length && (
              <p className="empty-state">
                Nenhum integrante cadastrado nesta página.
              </p>
            )}
            <Pagination page={page} pages={data.pages} onChange={setPage} />
          </>
        )
      )}
      {editing && (
        <Modal
          label={
            editing === "new" ? "Adicionar integrante" : "Editar integrante"
          }
          busy={saving}
          onClose={() => setEditing(null)}
        >
          <Card>
            <h2 className="text-xl font-bold">
              {editing === "new" ? "Adicionar integrante" : "Editar integrante"}
            </h2>
            <form
              className="stack-form"
              onSubmit={async (e) => {
                e.preventDefault();
                setSaving(true);
                setFailure("");
                try {
                  if (editing === "new") await team.create(values);
                  else await team.update(editing.id!, values);
                  setEditing(null);
                  refresh();
                } catch (err) {
                  setFailure(errorMessage(err));
                } finally {
                  setSaving(false);
                }
              }}
            >
              <label>
                Nome
                <input
                  required
                  maxLength={255}
                  value={values.name}
                  onChange={(e) =>
                    setValues({ ...values, name: e.target.value })
                  }
                />
              </label>
              <label>
                Função
                <select
                  value={values.role}
                  onChange={(e) =>
                    setValues({ ...values, role: e.target.value })
                  }
                >
                  {Object.entries(teamRoles).map(([key, label]) => (
                    <option key={key} value={key}>
                      {label}
                    </option>
                  ))}
                </select>
              </label>
              <p className="muted-note">
                A função não pode mudar quando o integrante já está vinculado a
                coletas.
              </p>
              {failure && <p role="alert">{failure}</p>}
              <div className="form-actions">
                <Button
                  variant="secondary"
                  titulo="Cancelar"
                  disabled={saving}
                  onClick={() => setEditing(null)}
                />
                <Button
                  type="submit"
                  titulo={saving ? "Salvando…" : "Salvar integrante"}
                  disabled={saving}
                />
              </div>
            </form>
          </Card>
        </Modal>
      )}
      {removing && (
        <Modal
          label="Desativar integrante"
          busy={saving}
          onClose={() => setRemoving(null)}
        >
          <Card>
            <h2 className="text-xl font-bold">Desativar {removing.name}?</h2>
            <p className="page-description">
              Integrantes vinculados a coletas não podem ser desativados.
            </p>
            <div className="form-actions">
              <Button
                variant="secondary"
                titulo="Cancelar"
                disabled={saving}
                onClick={() => setRemoving(null)}
              />
              <Button
                titulo="Confirmar desativação"
                disabled={saving}
                onClick={async () => {
                  setSaving(true);
                  try {
                    await team.deactivate(removing.id!);
                    refresh();
                  } catch (err) {
                    setFailure(errorMessage(err));
                  } finally {
                    setRemoving(null);
                    setSaving(false);
                  }
                }}
              />
            </div>
          </Card>
        </Modal>
      )}
    </Card>
  );
}
