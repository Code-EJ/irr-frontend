/** @author Enzo Ribas (https://github.com/oEnzoRibas) */
import { useEffect, useRef, type ReactNode } from "react";
/** Uses the native dialog focus trap and restores focus when a workflow closes. */
export default function Modal({
  label,
  busy,
  onClose,
  children,
}: {
  label: string;
  busy: boolean;
  onClose: () => void;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const dialog = ref.current;
    const opener = document.activeElement;
    dialog?.showModal();
    return () => {
      dialog?.close();
      if (opener instanceof HTMLElement && opener.isConnected) opener.focus();
    };
  }, []);
  return (
    <dialog
      ref={ref}
      aria-label={label}
      className="workflow-dialog"
      onCancel={(event) => {
        event.preventDefault();
        if (!busy) onClose();
      }}
    >
      {children}
    </dialog>
  );
}
