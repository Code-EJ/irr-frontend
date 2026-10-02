/** @author Enzo Ribas (https://github.com/oEnzoRibas) */
import { useEffect, useState } from "react";
import type { Page } from "../api/page";
import { errorMessage } from "../api/transport";
import { usePage } from "./usePage";
import Pagination from "./Pagination";
import Button from "../../components/Button";
export type Choice = { id: string; label: string };
/** Keeps reference choices paginated and hydrates existing selections without loading every record. */
export default function ResourcePicker({
  label,
  value,
  onChange,
  load,
  resolve,
  required = false,
  disabled = false,
}: {
  label: string;
  value: string;
  onChange: (id: string) => void;
  load: (page: number) => Promise<Page<Choice>>;
  resolve: (id: string) => Promise<Choice>;
  required?: boolean;
  disabled?: boolean;
}) {
  const [page, setPage] = useState(0);
  const [revision, setRevision] = useState(0);
  const { data, busy, error } = usePage(load, page, revision);
  const [selected, setSelected] = useState<Choice | null>(null);
  const [selectionError, setSelectionError] = useState("");
  useEffect(() => {
    let active = true;
    setSelected(null);
    setSelectionError("");
    if (value)
      void resolve(value)
        .then((item) => {
          if (active) setSelected(item);
        })
        .catch((err) => {
          if (active) setSelectionError(errorMessage(err));
        });
    return () => {
      active = false;
    };
  }, [resolve, value, revision]);
  return (
    <div className="reference-picker">
      <label>
        {label}
        <select
          required={required}
          disabled={disabled || busy}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        >
          <option value="">Selecione...</option>
          {value && !data.items.some((item) => item.id === value) && (
            <option value={value}>
              {selected?.label ?? "Referência indisponível"}
            </option>
          )}
          {data.items.map((item) => (
            <option key={item.id} value={item.id}>
              {item.label}
            </option>
          ))}
        </select>
      </label>
      {busy && <p role="status">Carregando opções…</p>}
      {(error || selectionError) && (
        <p role="alert">
          {error || selectionError}{" "}
          <Button
            variant="secondary"
            titulo="Recarregar opções"
            onClick={() => setRevision((n) => n + 1)}
          />
        </p>
      )}
      {!busy && !error && (
        <>
          <small>
            {data.items.length} {data.items.length === 1 ? "opção" : "opções"}{" "}
            nesta página
          </small>
          {data.pages > 1 && (
            <Pagination page={page} pages={data.pages} onChange={setPage} />
          )}
        </>
      )}
    </div>
  );
}
