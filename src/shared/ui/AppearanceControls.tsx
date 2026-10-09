/** @author Enzo Ribas (https://github.com/oEnzoRibas) */
import { useEffect, useState } from "react";
import { Accessibility } from "lucide-react";
import Modal from "../../components/Modal";
import Button from "../../components/Button";
import { applyAppearance, defaultAppearance, readAppearance, saveAppearance, type Appearance } from "./appearance";

/** Provides keyboard-accessible visual preferences on both public and authenticated screens. */
export default function AppearanceControls() {
  const [value, setValue] = useState(readAppearance);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    applyAppearance(value);
    const media = typeof matchMedia === "function" ? matchMedia("(prefers-color-scheme: dark)") : null;
    const update = () => applyAppearance(value);
    media?.addEventListener("change", update);
    return () => media?.removeEventListener("change", update);
  }, [value]);
  useEffect(() => {
    const sync = () => setValue(readAppearance());
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, []);
  function change(next: Appearance) { setValue(next); saveAppearance(next); }
  return <>
    <button className="appearance-launcher" onClick={() => setOpen(true)} aria-haspopup="dialog">
      <Accessibility size={20} aria-hidden="true" /><span>Acessibilidade</span>
    </button>
    {open && <Modal label="Acessibilidade" title="Aparência e acessibilidade" description="Ajuste a leitura conforme sua preferência. As escolhas são salvas neste navegador." busy={false} onClose={() => setOpen(false)} icon={<Accessibility size={24} />}>
      <div className="appearance-settings">
        <label>Tema<select value={value.theme} onChange={event => change({ ...value, theme: event.target.value as Appearance["theme"] })}>
          <option value="system">Seguir o dispositivo</option><option value="light">Claro</option><option value="dark">Escuro</option>
        </select></label>
        <label>Tamanho da fonte<select value={value.scale} onChange={event => change({ ...value, scale: Number(event.target.value) as Appearance["scale"] })}>
          <option value={100}>Padrão (100%)</option><option value={125}>Ampliado (125%)</option><option value={150}>Grande (150%)</option><option value={200}>Muito grande (200%)</option>
        </select></label>
        <label className="appearance-toggle"><input type="checkbox" checked={value.contrast} onChange={event => change({ ...value, contrast: event.target.checked })} />Alto contraste</label>
        <p>Você também pode usar o zoom do navegador. Animações reduzidas seguem a configuração do dispositivo.</p>
        <div className="dialog-footer"><Button titulo="Restaurar padrão" variant="secondary" onClick={() => change({ ...defaultAppearance })} /><Button titulo="Concluir" onClick={() => setOpen(false)} /></div>
      </div>
    </Modal>}
  </>;
}
