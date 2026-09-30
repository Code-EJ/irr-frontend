/** @author Enzo Ribas (https://github.com/oEnzoRibas) */
import { useEffect, useState } from "react";
import type { Page } from "../api/page";
import { errorMessage } from "../api/transport";
/** Ignores responses after a scoped view unmounts; transport also cancels scope changes. */
export function usePage<T>(
  load: (page: number) => Promise<Page<T>>,
  page: number,
  revision: number,
) {
  const [data, setData] = useState<Page<T>>({ items: [], pages: 0, total: 0 });
  const [busy, setBusy] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => {
    let active = true;
    setBusy(true);
    setError("");
    void load(page)
      .then((result) => {
        if (active) setData(result);
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
  }, [load, page, revision]);
  return { data, busy, error };
}
