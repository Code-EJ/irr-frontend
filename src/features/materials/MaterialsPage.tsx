/** @author Enzo Ribas (https://github.com/oEnzoRibas) */
import { useEffect, useState } from "react";
import { isAxiosError } from "axios";
import Button from "../../components/Button";
import Card from "../../components/Card";
import Modal from "../../components/Modal";
import { useSession } from "../identity/SessionProvider";
import { errorMessage } from "../../shared/api/transport";
import { catalog, type CatalogEntry, type CatalogLevel } from "./api";

const labels = {
  categories: "Categorias",
  types: "Tipos",
  subtypes: "Subtipos",
};
type Selection = { id: string; name: string };
type Props = {
  level: CatalogLevel;
  parent?: Selection;
  selected?: Selection | null;
  onSelect?: (item: Selection | null) => void;
};

/** Renders one level of the material hierarchy, never a generic business CRUD workflow. */
function CatalogPanel({ level, parent, selected, onSelect }: Props) {
  const manager = useSession().membership?.role === "MANAGER";
  const [page, setPage] = useState(0);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("");
  const [revision, setRevision] = useState(0);
  const [rows, setRows] = useState<{
    items: CatalogEntry[];
    pages: number;
    total: number;
  }>({ items: [], pages: 0, total: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState<CatalogEntry | "new" | null>(null);
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);
  const [conflict, setConflict] = useState(false);
  const [removing, setRemoving] = useState<CatalogEntry | null>(null);
  useEffect(() => {
    let active = true;
    setLoading(true);
    setError("");
    void catalog
      .list(level, page, filter, parent?.id)
      .then((data) => {
        if (active) {
          setRows(data);
          if (page > 0 && !data.items.length) setPage(page - 1);
        }
      })
      .catch((err) => {
        if (active) setError(errorMessage(err));
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [level, parent?.id, page, filter, revision]);

  return (
    <Card className="catalog-panel min-w-0">
      <h2 className="text-xl font-bold">{labels[level]}</h2>
      {parent && <p className="text-sm my-2">Em {parent.name}</p>}
      <form
        className="flex gap-2 my-4"
        onSubmit={(event) => {
          event.preventDefault();
          setPage(0);
          setFilter(query);
        }}
      >
        <label className="min-w-0 flex-1">
          Buscar {labels[level].toLowerCase()}
          <input
            className="border rounded p-2 w-full"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </label>
        <Button
          className="self-end"
          type="submit"
          titulo="Buscar"
          disabled={loading}
        />
      </form>
      {manager && (
        <Button
          titulo={
            "Adicionar " +
            { categories: "categoria", types: "tipo", subtypes: "subtipo" }[
              level
            ]
          }
          onClick={() => {
            setEditing("new");
            setName("");
            setError("");
            setConflict(false);
          }}
        />
      )}
      {error && !editing && (
        <p role="alert" className="text-red-800 my-3">
          {error}{" "}
          <button
            className="underline"
            onClick={() => setRevision((n) => n + 1)}
          >
            Recarregar
          </button>
        </p>
      )}
      {loading ? (
        <p role="status" className="my-3">
          Carregando {labels[level].toLowerCase()}…
        </p>
      ) : (
        !error && (
          <>
            <p className="text-sm my-3">
              {rows.total.toLocaleString("pt-BR")}{" "}
              {rows.total === 1 ? "registro" : "registros"}
            </p>
            <ul>
              {rows.items.map((item) => (
                <li
                  key={item.id}
                  className={
                    "border-t py-3 " +
                    (selected?.id === item.id ? "bg-green-50" : "")
                  }
                >
                  {onSelect ? (
                    <button
                      className="font-semibold underline text-left"
                      aria-pressed={selected?.id === item.id}
                      onClick={() => onSelect(item)}
                    >
                      {item.name}
                    </button>
                  ) : (
                    <span className="font-semibold">{item.name}</span>
                  )}
                  {manager && (
                    <div className="flex gap-4 text-sm mt-2">
                      <button
                        className="underline"
                        aria-label={"Editar " + item.name}
                        onClick={() => {
                          setEditing(item);
                          setName(item.name);
                          setError("");
                          setConflict(false);
                        }}
                      >
                        Editar
                      </button>
                      <button
                        className="underline text-red-800"
                        aria-label={"Desativar " + item.name}
                        onClick={() => {
                          setRemoving(item);
                          setError("");
                        }}
                      >
                        Desativar
                      </button>
                    </div>
                  )}
                </li>
              ))}
            </ul>
            {!rows.items.length && <p>Nenhum registro encontrado.</p>}
            <div className="flex items-center gap-2 mt-4">
              <Button
                variant="secondary"
                titulo="Anterior"
                disabled={page === 0}
                onClick={() => setPage((n) => n - 1)}
              />
              <span>
                {page + 1}/{Math.max(1, rows.pages)}
              </span>
              <Button
                variant="secondary"
                titulo="Próxima"
                disabled={page + 1 >= rows.pages}
                onClick={() => setPage((n) => n + 1)}
              />
            </div>
          </>
        )
      )}
      {editing && (
        <Modal
          label={(editing === "new" ? "Adicionar " : "Editar ") + labels[level]}
          busy={saving}
          onClose={() => {
            setEditing(null);
            setError("");
          }}
        >
          <Card className="rounded-2xl w-full max-w-md">
            <h3 className="text-xl font-bold">
              {editing === "new" ? "Adicionar" : "Editar"}{" "}
              {
                { categories: "categoria", types: "tipo", subtypes: "subtipo" }[
                  level
                ]
              }
            </h3>
            <form
              onSubmit={async (event) => {
                event.preventDefault();
                setSaving(true);
                setError("");
                try {
                  const saved =
                    editing === "new"
                      ? await catalog.create(level, name, parent?.id)
                      : await catalog.update(
                          level,
                          editing.id,
                          name,
                          editing.version,
                        );
                  if (selected?.id === saved.id) onSelect?.(saved);
                  setEditing(null);
                  setRevision((n) => n + 1);
                } catch (err) {
                  setError(errorMessage(err));
                  setConflict(
                    isAxiosError(err) && err.response?.status === 409,
                  );
                } finally {
                  setSaving(false);
                }
              }}
            >
              <label className="block my-4">
                Nome
                <input
                  className="border rounded p-2 w-full"
                  required
                  maxLength={100}
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                />
              </label>
              {error && (
                <p role="alert" className="text-red-800 my-3">
                  {error}
                </p>
              )}
              {conflict && editing !== "new" && (
                <Button
                  titulo="Recarregar versão atual"
                  disabled={saving}
                  onClick={async () => {
                    setSaving(true);
                    try {
                      const current = await catalog.get(level, editing.id);
                      setEditing(current);
                      setName(current.name);
                      setRows((previous) => ({
                        ...previous,
                        items: previous.items.map((item) =>
                          item.id === current.id ? current : item,
                        ),
                      }));
                      if (selected?.id === current.id) onSelect?.(current);
                      setConflict(false);
                      setError("");
                    } catch (err) {
                      setError(errorMessage(err));
                    } finally {
                      setSaving(false);
                    }
                  }}
                />
              )}
              <div className="flex gap-3 mt-4">
                <Button
                  variant="secondary"
                  titulo="Cancelar"
                  disabled={saving}
                  onClick={() => {
                    setEditing(null);
                    setError("");
                  }}
                />
                <Button
                  type="submit"
                  titulo="Salvar material"
                  disabled={saving || (conflict && editing !== "new")}
                />
              </div>
            </form>
          </Card>
        </Modal>
      )}
      {removing && (
        <Modal
          label="Desativar material"
          busy={saving}
          onClose={() => setRemoving(null)}
        >
          <Card className="rounded-2xl max-w-md">
            <h3 className="text-xl font-bold">Desativar {removing.name}?</h3>
            <p className="my-4">
              Os tipos e subtipos vinculados também serão desativados. Materiais
              utilizados em operações ou no estoque não podem ser desativados. O
              histórico será preservado.
            </p>
            <div className="flex gap-3">
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
                    await catalog.deactivate(level, removing.id);
                    if (selected?.id === removing.id) onSelect?.(null);
                    setRemoving(null);
                    setRevision((n) => n + 1);
                  } catch (err) {
                    setError(errorMessage(err));
                    setRemoving(null);
                  } finally {
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

export default function MaterialsPage() {
  const [category, setCategory] = useState<Selection | null>(null);
  const [type, setType] = useState<Selection | null>(null);
  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-3">Catálogo de materiais</h1>
      <p className="mb-6">
        Escolha uma categoria e um tipo para consultar os subtipos da sua
        organização.
      </p>
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        <CatalogPanel
          level="categories"
          selected={category}
          onSelect={(value) => {
            setCategory(value);
            setType(null);
          }}
        />
        {category ? (
          <CatalogPanel
            key={category.id}
            level="types"
            parent={category}
            selected={type}
            onSelect={setType}
          />
        ) : (
          <Card className="catalog-placeholder">
            <p>Selecione uma categoria para visualizar os tipos.</p>
          </Card>
        )}
        {type ? (
          <CatalogPanel key={type.id} level="subtypes" parent={type} />
        ) : (
          <Card className="catalog-placeholder">
            <p>Selecione um tipo para visualizar os subtipos.</p>
          </Card>
        )}
      </div>
    </div>
  );
}
