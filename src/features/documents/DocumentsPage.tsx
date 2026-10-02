/** @author Enzo Ribas (https://github.com/oEnzoRibas) */
import { useRef, useState } from "react";
import Card from "../../components/Card";
import Button from "../../components/Button";
import Modal from "../../components/Modal";
import Pagination from "../../shared/ui/Pagination";
import { usePage } from "../../shared/ui/usePage";
import { errorMessage } from "../../shared/api/transport";
import { documents, type Attachment } from "./api";
export default function DocumentsPage() {
  const [page, setPage] = useState(0);
  const [revision, setRevision] = useState(0);
  const { data, busy, error } = usePage(documents.list, page, revision);
  const [editing, setEditing] = useState<Attachment | null>(null);
  const [name, setName] = useState("");
  const [removing, setRemoving] = useState<Attachment | null>(null);
  const [saving, setSaving] = useState(false);
  const [failure, setFailure] = useState("");
  const input = useRef<HTMLInputElement>(null);
  function refresh() {
    setPage(0);
    setRevision((n) => n + 1);
  }
  return (
    <Card>
      <p className="eyebrow">COMPROVANTES</p>
      <h1>Documentos</h1>
      <p className="page-description">
        Envie comprovantes e documentos de transporte. PDF, PNG ou JPEG, até 10
        MiB.
      </p>
      <form
        className="filter-bar"
        onSubmit={async (e) => {
          e.preventDefault();
          const file = input.current?.files?.[0];
          if (!file) return;
          setFailure("");
          if (
            file.size > 10 * 1024 * 1024 ||
            !["application/pdf", "image/png", "image/jpeg"].includes(file.type)
          ) {
            setFailure("Selecione um PDF, PNG ou JPEG de até 10 MiB.");
            return;
          }
          setSaving(true);
          try {
            await documents.upload(file);
            if (input.current) input.current.value = "";
            refresh();
          } catch (err) {
            setFailure(errorMessage(err));
          } finally {
            setSaving(false);
          }
        }}
      >
        <label>
          Arquivo
          <input
            ref={input}
            type="file"
            required
            accept="application/pdf,image/png,image/jpeg"
            disabled={saving}
          />
        </label>
        <Button
          type="submit"
          titulo={saving ? "Enviando…" : "Enviar documento"}
          disabled={saving}
        />
      </form>
      <p className="muted-note">
        Somente quem enviou o arquivo ou um gestor pode renomeá-lo ou excluí-lo.
        Documentos vinculados a operações não podem ser excluídos.
      </p>
      {(error || (!editing && failure)) && (
        <p role="alert">
          {error || failure}{" "}
          <Button variant="secondary" titulo="Recarregar" onClick={refresh} />
        </p>
      )}
      {busy ? (
        <p role="status">Carregando documentos…</p>
      ) : (
        !error && (
          <>
            <div className="table-scroll">
              <table>
                <thead>
                  <tr>
                    <th>Arquivo</th>
                    <th>Enviado em</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {data.items.map((item) => (
                    <tr key={item.id}>
                      <td>{item.fileName}</td>
                      <td>
                        {item.createdAt
                          ? new Date(item.createdAt).toLocaleString("pt-BR")
                          : "—"}
                      </td>
                      <td className="row-actions">
                        <Button
                          variant="secondary"
                          titulo="Baixar"
                          disabled={saving}
                          onClick={async () => {
                            setSaving(true);
                            setFailure("");
                            try {
                              const blob = await documents.download(item.id!);
                              const url = URL.createObjectURL(blob);
                              const link = document.createElement("a");
                              link.href = url;
                              link.download = (
                                item.fileName ?? "documento"
                              ).replace(/[\\/]/g, "_");
                              document.body.append(link);
                              link.click();
                              link.remove();
                              setTimeout(() => URL.revokeObjectURL(url), 1000);
                            } catch (err) {
                              setFailure(errorMessage(err));
                            } finally {
                              setSaving(false);
                            }
                          }}
                        />
                        <Button
                          variant="secondary"
                          titulo="Renomear"
                          disabled={saving}
                          onClick={() => {
                            setFailure("");
                            setName(item.fileName ?? "");
                            setEditing(item);
                          }}
                        />
                        <Button
                          variant="secondary"
                          titulo="Excluir"
                          disabled={saving}
                          onClick={() => {
                            setFailure("");
                            setRemoving(item);
                          }}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {!data.items.length && (
              <p className="empty-state">Nenhum documento nesta página.</p>
            )}
            <Pagination page={page} pages={data.pages} onChange={setPage} />
          </>
        )
      )}
      {editing && (
        <Modal
          label="Renomear documento"
          busy={saving}
          onClose={() => setEditing(null)}
        >
          <Card>
            <h2 className="text-xl font-bold">Renomear documento</h2>
            <form
              className="stack-form"
              onSubmit={async (e) => {
                e.preventDefault();
                setSaving(true);
                setFailure("");
                try {
                  await documents.rename(editing.id!, name);
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
                Nome do arquivo
                <input
                  required
                  maxLength={255}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </label>
              {failure && <p role="alert">{failure}</p>}
              <div className="form-actions">
                <Button
                  variant="secondary"
                  titulo="Cancelar"
                  disabled={saving}
                  onClick={() => setEditing(null)}
                />
                <Button type="submit" titulo="Salvar nome" disabled={saving} />
              </div>
            </form>
          </Card>
        </Modal>
      )}
      {removing && (
        <Modal
          label="Excluir documento"
          busy={saving}
          onClose={() => setRemoving(null)}
        >
          <Card>
            <h2 className="text-xl font-bold">Excluir {removing.fileName}?</h2>
            <p className="page-description">
              Esta ação remove o documento disponível e solicita a exclusão do
              arquivo. Documentos em uso serão preservados.
            </p>
            <div className="form-actions">
              <Button
                variant="secondary"
                titulo="Cancelar"
                disabled={saving}
                onClick={() => setRemoving(null)}
              />
              <Button
                titulo="Confirmar exclusão"
                disabled={saving}
                onClick={async () => {
                  setSaving(true);
                  try {
                    await documents.remove(removing.id!);
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
