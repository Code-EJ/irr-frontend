/** @author Enzo Ribas (https://github.com/oEnzoRibas) */
import {useState} from "react";
import {Link,useNavigate} from "react-router-dom";
import {isAxiosError} from "axios";
import Card from "../../components/Card";
import Button from "../../components/Button";
import {changePassword} from "./api";
import {passwordError} from "./validation";
import {session} from "../../shared/api/session";
import {errorMessage} from "../../shared/api/transport";
/** Keeps credentials only in component memory and clears the revoked session after success. */
export default function PasswordPage({mandatory=false}:{mandatory?:boolean}) {
  const [currentPassword,setCurrent]=useState("");
  const [newPassword,setNew]=useState("");
  const [confirmation,setConfirmation]=useState("");
  const [busy,setBusy]=useState(false);
  const [error,setError]=useState("");
  const navigate=useNavigate();
  return <Card className="identity-card">
    <p className="eyebrow">SEGURANÇA</p><h1>{mandatory?"Defina sua nova senha":"Alterar senha"}</h1>
    <p className="page-description">{mandatory?"Sua senha é temporária. Escolha uma nova senha para continuar.":"Confirme sua senha atual para proteger a conta."} Após a alteração, entre novamente em todos os dispositivos.</p>
    <form className="identity-form" onSubmit={async event=>{
      event.preventDefault();if(busy)return;
      const failure=passwordError(newPassword,confirmation)|| (newPassword===currentPassword?"A nova senha deve ser diferente da atual.":"");
      setError(failure);if(failure)return;setBusy(true);
      try{await changePassword({currentPassword,newPassword});setCurrent("");setNew("");setConfirmation("");session.clear();navigate("/login",{replace:true,state:{passwordChanged:true}});}
      catch(err){setError(isAxiosError(err)&&err.response?.status===403?"A senha atual está incorreta.":errorMessage(err));setCurrent("");}
      finally{setBusy(false);}
    }}>
      <fieldset disabled={busy}>
        <label>Senha atual<input required type="password" autoComplete="current-password" value={currentPassword} onChange={e=>setCurrent(e.target.value)}/></label>
        <label>Nova senha<input required minLength={8} maxLength={72} type="password" autoComplete="new-password" aria-describedby="password-help" value={newPassword} onChange={e=>setNew(e.target.value)}/></label>
        <p id="password-help" className="muted-note">Use pelo menos 8 caracteres e menos de 72 bytes. Acentos e símbolos podem ocupar mais de um byte.</p>
        <label>Confirmar nova senha<input required type="password" autoComplete="new-password" value={confirmation} onChange={e=>setConfirmation(e.target.value)}/></label>
        {error&&<p role="alert">{error}</p>}
        <div className="form-actions"><Button type="submit" titulo={busy?"Alterando…":"Salvar nova senha"}/>{mandatory?<Button variant="secondary" titulo="Sair" onClick={()=>session.clear()}/>:<Link to="/profile">Cancelar</Link>}</div>
      </fieldset>
    </form>
  </Card>;
}
