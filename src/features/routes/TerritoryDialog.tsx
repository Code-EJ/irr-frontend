/** @author Enzo Ribas (https://github.com/oEnzoRibas) */
import { useState } from "react";
import { MapPin } from "lucide-react";
import Modal from "../../components/Modal";
import Button from "../../components/Button";
import { errorMessage } from "../../shared/api/transport";
import { geography } from "./api";
const states =
  "AC AL AP AM BA CE DF ES GO MA MT MS MG PA PB PR PE PI RJ RN RS RO RR SC SP SE TO".split(
    " ",
  );
/** Registers only explicitly reviewed shared identities; never infers territory from free text. */
export default function TerritoryDialog({
  municipalityId,
  onClose,
  onCreated,
}: {
  municipalityId?: string;
  onClose: () => void;
  onCreated: () => void;
}) {
  const [name, setName] = useState("");
  const [ibgeCode, setIbgeCode] = useState("");
  const [stateCode, setStateCode] = useState("MG");
  const [busy, setBusy] = useState(false);
  const [failure, setFailure] = useState("");
  return (
    <Modal
      label="Cadastro territorial"
      onClose={onClose}
      busy={busy}
      title={municipalityId ? "Cadastrar bairro" : "Cadastrar município"}
      description="Este cadastro territorial é compartilhado entre as organizações."
      icon={<MapPin size={22} />}
    >
      <form
        className="stack-form"
        onSubmit={async (e) => {
          e.preventDefault();
          setFailure("");
          setBusy(true);
          try {
            if (municipalityId)
              await geography.createNeighborhood({
                municipalityId,
                name: name.trim(),
              });
            else
              await geography.createMunicipality({
                name: name.trim(),
                ibgeCode,
                stateCode,
              });
            onCreated();
            onClose();
          } catch (err) {
            setFailure(errorMessage(err));
          } finally {
            setBusy(false);
          }
        }}
      >
        <label>
          Nome
          <input
            required
            maxLength={150}
            value={name}
            disabled={busy}
            onChange={(e) => setName(e.target.value)}
          />
        </label>
        {!municipalityId && (
          <>
            <div className="form-grid">
              <label>
                UF
                <select
                  value={stateCode}
                  disabled={busy}
                  onChange={(e) => setStateCode(e.target.value)}
                >
                  {states.map((state) => (
                    <option key={state}>{state}</option>
                  ))}
                </select>
              </label>
              <label>
                Código IBGE
                <input
                  required
                  inputMode="numeric"
                  pattern="[0-9]{7}"
                  maxLength={7}
                  value={ibgeCode}
                  disabled={busy}
                  onChange={(e) => setIbgeCode(e.target.value)}
                />
              </label>
            </div>
            <p className="dialog-notice">
              Confira o nome, a UF e o código de sete dígitos no cadastro
              oficial do IBGE antes de salvar.
            </p>
          </>
        )}
        {failure && <p role="alert">{failure}</p>}
        <div className="dialog-footer">
          <Button
            variant="secondary"
            titulo="Cancelar"
            disabled={busy}
            onClick={onClose}
          />
          <Button
            type="submit"
            titulo={busy ? "Salvando…" : "Salvar cadastro"}
            disabled={busy}
          />
        </div>
      </form>
    </Modal>
  );
}
