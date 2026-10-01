/** @author Enzo Ribas (https://github.com/oEnzoRibas) */
import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import Card from "../../components/Card";
import Button from "../../components/Button";
import Modal from "../../components/Modal";
import Pagination from "../../shared/ui/Pagination";
import { usePage } from "../../shared/ui/usePage";
import { errorMessage } from "../../shared/api/transport";
import { collections, donations, type Collection, type Donation } from "./api";
import { displayDecimal } from "./quantities";
export type IntakeKind = "donations" | "collections";
export default function IntakeList({ kind }: { kind: IntakeKind }) {
  const [page, setPage] = useState(0);
  const [revision, setRevision] = useState(0);
  const { data, busy, error } = usePage<Collection | Donation>(
    kind === "collections" ? collections.list : donations.list,
    page,
    revision,
  );
  const [selected, setSelected] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [failure, setFailure] = useState("");
  return (
    <Card>
      <div className="page-heading">
        <div>
          <p className="eyebrow">RECEBIMENTO</p>
          <h1>Entradas de resíduos</h1>
          <p className="page-description">
            Registre os materiais recebidos. A entrada será disponibilizada para
            triagem.
          </p>
        </div>
        <Link className="primary-link" to={"/intake/" + kind + "/new"}>
          {kind === "collections" ? "Registrar coleta" : "Registrar doação"}
        </Link>
      </div>
      <nav className="workflow-tabs" aria-label="Tipo de entrada">
        <NavLink to="/intake/donations">Doações</NavLink>
        <NavLink to="/intake/collections">Coletas</NavLink>
      </nav>
      {(error || failure) && (
        <p role="alert">
          {error || failure}{" "}
          <Button
            variant="secondary"
            titulo="Recarregar"
            onClick={() => {
              setFailure("");
              setRevision((n) => n + 1);
            }}
          />
        </p>
      )}
      {busy ? (
        <p role="status">Carregando entradas…</p>
      ) : (
        !error && (
          <>
            <div className="table-scroll">
              <table>
                <thead>
                  <tr>
                    <th>Data e hora</th>
                    <th>Peso total (kg)</th>
                    <th>Itens</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {data.items.map((item) => {
                    const date =
                      kind === "collections"
                        ? (item as Collection).realizationDate
                        : (item as Donation).donationDate;
                    return (
                      <tr key={item.id}>
                        <td>
                          {date ? new Date(date).toLocaleString("pt-BR") : "—"}
                        </td>
                        <td>{displayDecimal(item.totalWeightKg)}</td>
                        <td>
                          {item.inputItems?.filter(
                            (line) => line.isActive !== false,
                          ).length ?? 0}
                        </td>
                        <td className="row-actions">
                          <Link
                            className="button button-secondary"
                            to={"/intake/" + kind + "/" + item.id}
                          >
                            Consultar / editar
                          </Link>
                          <Button
                            variant="secondary"
                            titulo="Desativar"
                            onClick={() => {
                              setFailure("");
                              setSelected(item.id!);
                            }}
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            {!data.items.length && (
              <p className="empty-state">Nenhuma entrada nesta página.</p>
            )}
            <Pagination page={page} pages={data.pages} onChange={setPage} />
          </>
        )
      )}
      {selected && (
        <Modal
          label="Desativar entrada"
          busy={saving}
          onClose={() => setSelected(null)}
        >
          <Card>
            <h2 className="text-xl font-bold">Desativar entrada?</h2>
            <p className="page-description">
              A entrada e seus itens ficarão inativos. Se algum item já tiver
              sido utilizado na triagem, a alteração será recusada para
              preservar o histórico.
            </p>
            <div className="form-actions">
              <Button
                variant="secondary"
                titulo="Cancelar"
                disabled={saving}
                onClick={() => setSelected(null)}
              />
              <Button
                titulo="Confirmar desativação"
                disabled={saving}
                onClick={async () => {
                  setSaving(true);
                  try {
                    await (
                      kind === "collections" ? collections : donations
                    ).deactivate(selected);
                    setPage(0);
                    setRevision((n) => n + 1);
                  } catch (err) {
                    setFailure(errorMessage(err));
                  } finally {
                    setSaving(false);
                    setSelected(null);
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
