/** @author Enzo Ribas (https://github.com/oEnzoRibas) */
import Button from "../../components/Button";
export default function Pagination({
  page,
  pages,
  busy,
  onChange,
}: {
  page: number;
  pages: number;
  busy?: boolean;
  onChange: (page: number) => void;
}) {
  return (
    <div className="pagination">
      <Button
        variant="secondary"
        titulo="Anterior"
        disabled={busy || page === 0}
        onClick={() => onChange(page - 1)}
      />
      <span>
        Página {page + 1} de {Math.max(1, pages)}
      </span>
      <Button
        variant="secondary"
        titulo="Próxima"
        disabled={busy || page + 1 >= pages}
        onClick={() => onChange(page + 1)}
      />
    </div>
  );
}
