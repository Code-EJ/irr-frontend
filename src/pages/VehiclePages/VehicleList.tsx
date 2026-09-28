/** @author Enzo Ribas (https://github.com/oEnzoRibas) */
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Card from "../../components/Card";
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
      <div className="flex justify-between gap-4 items-center">
        <h1 className="text-2xl font-bold">Vehicles</h1>
        {manager && (
          <Link className="underline" to="/vehicle-create">
            Add vehicle
          </Link>
        )}
      </div>
      <form
        className="flex flex-wrap items-end gap-4 my-5"
        onSubmit={(event) => {
          event.preventDefault();
          setPage(0);
          setFilters({ ...query });
        }}
      >
        <label>
          License plate
          <input
            className="block border rounded p-2"
            value={query.licensePlate}
            onChange={(event) =>
              setQuery({ ...query, licensePlate: event.target.value })
            }
          />
        </label>
        <label>
          Model
          <input
            className="block border rounded p-2"
            value={query.model}
            onChange={(event) =>
              setQuery({ ...query, model: event.target.value })
            }
          />
        </label>
        <Button type="submit" titulo="Search" disabled={busy} />
      </form>
      {error && (
        <p role="alert" className="text-red-800 my-3">
          {error}{" "}
          <Button titulo="Retry" onClick={() => setRevision((n) => n + 1)} />
        </p>
      )}
      {busy ? (
        <p role="status">Loading vehicles…</p>
      ) : (
        !error && (
          <>
            <p className="my-3">{data.total} vehicles</p>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr>
                    <th className="p-2">License plate</th>
                    <th>Model</th>
                    {manager && <th>Actions</th>}
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
                            Edit
                          </Link>
                          <button
                            className="underline text-red-800"
                            onClick={() => setSelected(item)}
                          >
                            Deactivate
                          </button>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {data.items.length === 0 && <p>No vehicles match these filters.</p>}
            <div className="flex items-center gap-4 mt-5">
              <Button
                titulo="Previous"
                disabled={page === 0}
                onClick={() => setPage((n) => n - 1)}
              />
              <span>
                Page {page + 1} of {Math.max(1, data.pages)}
              </span>
              <Button
                titulo="Next"
                disabled={page + 1 >= data.pages}
                onClick={() => setPage((n) => n + 1)}
              />
            </div>
          </>
        )
      )}
      {selected && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Deactivate vehicle"
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-5"
        >
          <Card className="rounded-2xl max-w-md">
            <h2 className="text-xl font-bold">
              Deactivate {selected.licensePlate}?
            </h2>
            <p className="my-4">
              The backend will reject this action if the vehicle is referenced
              by an operational record.
            </p>
            <div className="flex gap-3">
              <Button
                titulo="Cancel"
                disabled={busy}
                onClick={() => setSelected(null)}
              />
              <Button
                titulo="Confirm deactivation"
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
        </div>
      )}
    </Card>
  );
}
