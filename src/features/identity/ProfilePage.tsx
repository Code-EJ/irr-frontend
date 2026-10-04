/** @author Enzo Ribas (https://github.com/oEnzoRibas) */
import {useState} from "react";
import {Link} from "react-router-dom";
import {isAxiosError} from "axios";
import Card from "../../components/Card";
import Button from "../../components/Button";
import {useSession} from "./SessionProvider";
import {updateProfile} from "./api";
import {errorMessage} from "../../shared/api/transport";
export const roleLabels = {ADMINISTRATOR:"Administrador Geral",REPRESENTATIVE:"Representante",ORGANIZATION:"Organização",CITY_HALL:"Prefeitura"};
/** Self-service profile never exposes role or organization write controls. */
export default function ProfilePage() {
  const {account,reload} = useSession();
  const [fullName,setName]=useState(account?.fullName ?? "");
  const [email,setEmail]=useState(account?.email ?? "");
  const [busy,setBusy]=useState(false);
  const [error,setError]=useState("");
  return <Card className="identity-card">
    <p className="eyebrow">PERFIL E SEGURANÇA</p><h1>Minha conta</h1>
    <p className="page-description">Mantenha seus dados atualizados. Seu e-mail é usado para entrar na plataforma.</p>
    <p className="status-pill">{roleLabels[account?.userRole ?? "REPRESENTATIVE"]}</p>
    <form className="identity-form" onSubmit={async event=>{
      event.preventDefault(); if(busy) return; setBusy(true);setError("");
      try {await updateProfile({fullName:fullName.trim(),email:email.trim()}); reload();}
      catch(err){setError(isAxiosError(err)&&err.response?.status===409?"Este e-mail já está em uso. Informe outro endereço.":errorMessage(err));}
      finally{setBusy(false);}
    }}>
      <fieldset disabled={busy}>
        <label>Nome completo<input required maxLength={255} autoComplete="name" value={fullName} onChange={e=>setName(e.target.value)}/></label>
        <label>E-mail<input required type="email" maxLength={255} autoComplete="email" value={email} onChange={e=>setEmail(e.target.value)}/></label>
        {error&&<p role="alert">{error}</p>}
        <Button type="submit" titulo={busy?"Salvando…":"Salvar perfil"}/>
      </fieldset>
    </form>
    <div className="identity-security"><h2>Segurança da conta</h2><p>Ao alterar a senha, todas as suas sessões serão encerradas.</p><Link className="button button-secondary" to="/profile/password">Alterar senha</Link></div>
  </Card>;
}
