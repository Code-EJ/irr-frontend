/** @author Enzo Ribas (https://github.com/oEnzoRibas) */
import { useEffect, useId, useRef, type ReactNode } from "react";
import { X } from "lucide-react";
/** Provides a consistent responsive surface while retaining native focus trapping and focus restoration. */
export default function Modal({
  label,
  busy,
  onClose,
  children,
  title,
  description,
  icon,
  tone = "default",
}: {
  label: string;
  busy: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
  description?: string;
  icon?: ReactNode;
  tone?: "default" | "danger";
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const descriptionId = useId();
  useEffect(() => {
    const dialog = ref.current;
    const opener = document.activeElement;
    dialog?.showModal();
    dialog?.querySelector<HTMLElement>(".workflow-dialog-content input:not(:disabled), .workflow-dialog-content select:not(:disabled)")?.focus();
    return () => {
      dialog?.close();
      if (opener instanceof HTMLElement && opener.isConnected) opener.focus();
    };
  }, []);
  return (
    <dialog
      ref={ref}
      aria-label={title ? undefined : label}
      aria-labelledby={title ? titleId : undefined}
      aria-describedby={description ? descriptionId : undefined}
      className={`workflow-dialog workflow-dialog-${tone}`}
      onCancel={(event) => {
        event.preventDefault();
        if (!busy) onClose();
      }}
    >
      <button className="dialog-close" type="button" aria-label={`Fechar ${label.toLocaleLowerCase("pt-BR")}`} disabled={busy} onClick={onClose}><X size={20} aria-hidden="true" /></button>
      {title && <header className="dialog-header">
        {icon && <span className="dialog-icon" aria-hidden="true">{icon}</span>}
        <div><h2 id={titleId}>{title}</h2>{description && <p id={descriptionId}>{description}</p>}</div>
      </header>}
      <div className="workflow-dialog-content">{children}</div>
    </dialog>
  );
}
