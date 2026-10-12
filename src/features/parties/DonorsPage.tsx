/** @author Enzo Ribas (https://github.com/oEnzoRibas) */
import { useState } from "react";
import Card from "../../components/Card";
import Button from "../../components/Button";
import Modal from "../../components/Modal";
import Pagination from "../../shared/ui/Pagination";
import { usePage } from "../../shared/ui/usePage";
import { useSession } from "../identity/SessionProvider";
import { errorMessage } from "../../shared/api/transport";
import { donors, type Donor, type DonorCreate } from "./api";
const blank = (): DonorCreate => ({ name: "", document: "", donorType: "PF" });
const emptyAddress = {
  line1: "",
  line2: "",
  city: "",
  region: "",
  postalCode: "",
  countryCode: "BR",
};
const addressLabels = {
  line1: "Logradouro e número",
  line2: "Complemento",
  city: "Cidade",
  region: "Estado / região",
  postalCode: "CEP",
  countryCode: "País (sigla)",
};
export default function DonorsPage() {
  const manager = useSession().canManage;
  const [page, setPage] = useState(0);
  const [revision, setRevision] = useState(0);
  const { data, busy, error } = usePage(donors.list, page, revision);
  const [editing, setEditing] = useState<Donor | "new" | null>(null);
  const [values, setValues] = useState(blank);
  const [removing, setRemoving] = useState<Donor | null>(null);
  const [saving, setSaving] = useState(false);
  const [failure, setFailure] = useState("");
  function edit(item: Donor | "new") {
    setFailure("");
    setEditing(item);
    setValues(
      item === "new"
        ? blank()
        : {
            name: item.name ?? "",
            document: item.document ?? "",
            donorType: item.donorType ?? "PF",
            address: item.address,
          },
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
          <h1>Doadores</h1>
          <p className="page-description">
            Pessoas e empresas que contribuem com a sua organização.
          </p>
        </div>
        {manager && (
          <Button titulo="Adicionar doador" onClick={() => edit("new")} />
        )}
      </div>
      {(error || (!editing && failure)) && (
        <p role="alert">
          {error || failure}{" "}
          <Button variant="secondary" titulo="Recarregar" onClick={refresh} />
        </p>
      )}
      {busy ? (
        <p role="status">Carregando doadores…</p>
      ) : (
        !error && (
          <>
            <div className="table-scroll">
              <table>
                <thead>
                  <tr>
                    <th>Nome</th>
                    <th>Tipo</th>
                    <th>CPF / CNPJ</th>
                    {manager && <th>Ações</th>}
                  </tr>
                </thead>
                <tbody>
                  {data.items.map((item) => (
                    <tr key={item.id}>
                      <td>{item.name}</td>
                      <td>
                        {item.donorType === "PF"
                          ? "Pessoa física"
                          : "Pessoa jurídica"}
                      </td>
                      <td>{item.document}</td>
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
                Nenhum doador cadastrado nesta página.
              </p>
            )}
            <Pagination page={page} pages={data.pages} onChange={setPage} />
          </>
        )
      )}
      {editing && (
        <Modal
          label={editing === "new" ? "Adicionar doador" : "Editar doador"}
          busy={saving}
          onClose={() => setEditing(null)}
        >
          <Card>
            <h2 className="text-xl font-bold">
              {editing === "new" ? "Adicionar doador" : "Editar doador"}
            </h2>
            <form
              className="stack-form"
              onSubmit={async (e) => {
                e.preventDefault();
                setFailure("");
                const digits = values.document.replace(/\D/g, "");
                if (digits.length !== (values.donorType === "PF" ? 11 : 14)) {
                  setFailure(
                    "Informe um CPF com 11 dígitos ou um CNPJ com 14 dígitos, conforme o tipo selecionado.",
                  );
                  return;
                }
                setSaving(true);
                try {
                  if (editing === "new")
                    await donors.create({ ...values, document: digits });
                  else
                    await donors.update(editing.id!, {
                      name: values.name,
                      document: digits,
                      address: values.address,
                    });
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
                Tipo de doador
                <select
                  disabled={editing !== "new"}
                  value={values.donorType}
                  onChange={(e) =>
                    setValues({
                      ...values,
                      donorType: e.target.value as "PF" | "PJ",
                    })
                  }
                >
                  <option value="PF">Pessoa física</option>
                  <option value="PJ">Pessoa jurídica</option>
                </select>
              </label>
              <label>
                CPF / CNPJ
                <input
                  required
                  maxLength={20}
                  inputMode="numeric"
                  value={values.document}
                  onChange={(e) =>
                    setValues({ ...values, document: e.target.value })
                  }
                />
              </label>
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={!!values.address}
                  onChange={(e) =>
                    setValues({
                      ...values,
                      address: e.target.checked
                        ? { ...emptyAddress }
                        : undefined,
                    })
                  }
                />
                Informar endereço
              </label>
              {values.address &&
                Object.entries(addressLabels).map(([key, label]) => (
                  <label key={key}>
                    {label}
                    <input
                      required={key !== "line2"}
                      maxLength={
                        key === "countryCode"
                          ? 2
                          : key === "postalCode"
                            ? 20
                            : key === "city" || key === "region"
                              ? 100
                              : 255
                      }
                      pattern={key === "countryCode" ? "[A-Z]{2}" : undefined}
                      value={
                        values.address?.[key as keyof typeof emptyAddress] ?? ""
                      }
                      onChange={(e) =>
                        setValues({
                          ...values,
                          address: {
                            ...values.address!,
                            [key]:
                              key === "countryCode"
                                ? e.target.value.toUpperCase()
                                : e.target.value,
                          },
                        })
                      }
                    />
                  </label>
                ))}
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
                  titulo={saving ? "Salvando…" : "Salvar doador"}
                  disabled={saving}
                />
              </div>
            </form>
          </Card>
        </Modal>
      )}
      {removing && (
        <Modal
          label="Desativar doador"
          busy={saving}
          onClose={() => setRemoving(null)}
        >
          <Card>
            <h2 className="text-xl font-bold">Desativar {removing.name}?</h2>
            <p className="page-description">
              Doadores com histórico de doações devem permanecer disponíveis. A
              operação pode ser recusada para preservar esse histórico.
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
                    await donors.deactivate(removing.id!);
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
