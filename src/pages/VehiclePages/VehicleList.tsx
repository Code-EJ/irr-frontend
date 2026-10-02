/** @author Enzo Ribas (https://github.com/oEnzoRibas) */
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Card from "../../components/Card";
import Modal from "../../components/Modal";
import Button from "../../components/Button";
import { fleet, type Vehicle } from "../../features/fleet/api";
import { useSession } from "../../features/identity/SessionProvider";
import { errorMessage } from "../../shared/api/transport";
export default function VehicleList() {
  const { membership } = useSession();
  const manager = membership?.role === "MANAGER";
  const [page, setPage] = useState(0);
  const [query, setQuery] = useState({ licensePlate: "", model: "" });
  const [filters, setFilters] = useState(query);
  const [data, setData] = useState<{
    items: Vehicle[];
    total: number;
    pages: number;
  }>({ items: [], total: 0, pages: 0 });
  const [busy, setBusy] = useState(true);
  const [error, setError] = useState("");
  const [revision, setRevision] = useState(0);
  const [selected, setSelected] = useState<Vehicle | null>(null);
  useEffect(() => {
    let active = true;
    setBusy(true);
    setError("");
    void fleet
      .list(page, filters.licensePlate, filters.model)
      .then((result) => {
        if (active) {
          setData(result);
          if (page > 0 && result.items.length === 0) setPage(page - 1);
        }
      })
      .catch((err) => {
        if (active) setError(errorMessage(err));
      })
      .finally(() => {
        if (active) setBusy(false);
      });
    return () => {
      active = false;
    };
  }, [page, filters, revision]);
  return (
    <Card className="rounded-3xl shadow w-full max-w-5xl mx-auto">
      <div className="page-heading">
        <div>
          <p className="eyebrow">FROTA</p>
          <h1>Veículos</h1>
          <p className="page-description">
            Consulte e organize os veículos da sua operação.
          </p>
        </div>
        {manager && (
          <Link className="primary-link" to="/vehicle-create">
            Adicionar veículo
          </Link>
        )}
      </div>
      <form
        className="filter-bar"
        onSubmit={(event) => {
          event.preventDefault();
          setPage(0);
          setFilters({ ...query });
        }}
      >
        <label>
          Placa
          <input
            className="block border rounded p-2"
            value={query.licensePlate}
            onChange={(event) =>
              setQuery({ ...query, licensePlate: event.target.value })
            }
          />
        </label>
        <label>
          Modelo
          <input
            className="block border rounded p-2"
            value={query.model}
            onChange={(event) =>
              setQuery({ ...query, model: event.target.value })
            }
          />
        </label>
        <Button type="submit" titulo="Buscar" disabled={busy} />
      </form>
      {error && (
        <p role="alert" className="text-red-800 my-3">
          {error}{" "}
          <Button
            titulo="Tentar novamente"
            onClick={() => setRevision((n) => n + 1)}
          />
        </p>
      )}
      {busy ? (
        <p role="status">Carregando veículos…</p>
      ) : (
        !error && (
          <>
            <p className="my-3">
              {data.total.toLocaleString("pt-BR")}{" "}
              {data.total === 1 ? "veículo" : "veículos"}
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr>
                    <th className="p-2">Placa</th>
                    <th>Modelo</th>
                    {manager && <th>Ações</th>}
                  </tr>
                </thead>
                <tbody>
                  {data.items.map((item) => (
                    <tr className="border-t" key={item.id}>
                      <td className="p-2">{item.licensePlate}</td>
                      <td>{item.model}</td>
                      {manager && (
                        <td className="flex gap-4 py-2">
                          <Link
                            className="underline"
                            to={"/vehicle-update/" + item.id}
                          >
                            Editar
                          </Link>
                          <button
                            className="underline text-red-800"
                            onClick={() => setSelected(item)}
                          >
                            Desativar
                          </button>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {data.items.length === 0 && (
              <p>Nenhum veículo encontrado com esses filtros.</p>
            )}
            <div className="flex items-center gap-4 mt-5">
              <Button
                variant="secondary"
                titulo="Anterior"
                disabled={page === 0}
                onClick={() => setPage((n) => n - 1)}
              />
              <span>
                Página {page + 1} de {Math.max(1, data.pages)}
              </span>
              <Button
                variant="secondary"
                titulo="Próxima"
                disabled={page + 1 >= data.pages}
                onClick={() => setPage((n) => n + 1)}
              />
            </div>
          </>
        )
      )}
      {selected && (
        <Modal
          label="Desativar veículo"
          busy={busy}
          onClose={() => setSelected(null)}
        >
          <Card className="rounded-2xl max-w-md">
            <h2 className="text-xl font-bold">
              Desativar {selected.licensePlate}?
            </h2>
            <p className="my-4">
              Veículos vinculados a registros operacionais não podem ser
              desativados. O histórico será preservado.
            </p>
            <div className="flex gap-3">
              <Button
                titulo="Cancelar"
                disabled={busy}
                onClick={() => setSelected(null)}
              />
              <Button
                titulo="Confirmar desativação"
                disabled={busy}
                onClick={async () => {
                  setBusy(true);
                  setError("");
                  try {
                    await fleet.deactivate(selected.id);
                    setSelected(null);
                    setRevision((n) => n + 1);
                  } catch (err) {
                    setError(errorMessage(err));
                    setSelected(null);
                  } finally {
                    setBusy(false);
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
