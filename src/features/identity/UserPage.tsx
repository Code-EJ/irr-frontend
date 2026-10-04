/** @author Enzo Ribas (https://github.com/oEnzoRibas) */
import {useEffect,useState} from "react";
import {Link,useNavigate,useParams} from "react-router-dom";
import {isAxiosError} from "axios";
import Card from "../../components/Card";
import Button from "../../components/Button";
import Modal from "../../components/Modal";
import {accounts,type Account,type PartnerInput} from "./api";
import {roleLabels} from "./ProfilePage";
import {passwordError} from "./validation";
import {errorMessage} from "../../shared/api/transport";
import MembershipPanel from "./MembershipPanel";
import {useSession} from "./SessionProvider";
import {session} from "../../shared/api/session";
/** Loads administrative details from the API, including when reached by a direct URL. */
export default function UserPage(){
  const {id}=useParams();
  const [account,setAccount]=useState<Account|null>(null);
  const [busy,setBusy]=useState(Boolean(id));
  const [error,setError]=useState("");
  const [revision,setRevision]=useState(0);
  useEffect(()=>{
    if(!id)return;let active=true;setBusy(true);setError("");setAccount(null);
    accounts.get(id).then(value=>{if(active)setAccount(value);}).catch(err=>{if(active)setError(errorMessage(err));}).finally(()=>{if(active)setBusy(false);});
    return()=>{active=false;};
  },[id,revision]);
  if(busy)return <Card><p role="status">Carregando conta…</p></Card>;
  if(error)return <Card><p role="alert">{error}</p><Button titulo="Tentar novamente" onClick={()=>setRevision(n=>n+1)}/><Link to="/users">Voltar para usuários</Link></Card>;
  return <AccountEditor key={id??"new"} account={account} onUpdated={setAccount}/>;
}
function AccountEditor({account,onUpdated}:{account:Account|null,onUpdated:(value:Account)=>void}){
  const navigate=useNavigate();
  const state=useSession();
  const [input,setInput]=useState<PartnerInput>({fullName:account?.fullName??"",email:account?.email??"",userRole:account?.userRole??"REPRESENTATIVE"});
  const [password,setPassword]=useState("");
  const [confirmation,setConfirmation]=useState("");
  const [busy,setBusy]=useState(false);
  const [error,setError]=useState("");
  const [notice,setNotice]=useState("");
  const [action,setAction]=useState<"reset"|"deactivate"|null>(null);

  function open(action:"reset"|"deactivate"|null){setPassword("");setConfirmation("");setError("");setAction(action);}
  return <Card className="identity-card">
    <Link to="/users">← Usuários</Link><p className="eyebrow">ADMINISTRAÇÃO</p><h1>{account?"Detalhes da conta":"Criar usuário"}</h1>
    {account?.mustChangePassword&&<p className="status-pill">Troca de senha pendente</p>}
    {notice&&<p role="status">{notice}</p>}
    {<form className="identity-form" onSubmit={async event=>{
      event.preventDefault();if(busy)return;const failure=!account?passwordError(password,confirmation):"";setError(failure);if(failure)return;setBusy(true);setNotice("");
      try{
        const data={...input,fullName:input.fullName.trim(),email:input.email.trim()};
        if(account?.id){onUpdated(await accounts.update(account.id,data));setNotice("Conta atualizada.");if(account.id===state.account?.id) state.reload();}
        else{const created=await accounts.create({...data,userRole:data.userRole,password});setPassword("");setConfirmation("");navigate(`/users/${created.id}`,{replace:true});}
      }catch(err){setError(isAxiosError(err)&&err.response?.status===409?"Este e-mail já está em uso ou a alteração removeria o último Administrador Geral ativo.":errorMessage(err));}
      finally{setBusy(false);}
    }}>
      <fieldset disabled={busy}>
        <label>Nome completo<input required maxLength={255} value={input.fullName} onChange={e=>setInput({...input,fullName:e.target.value})}/></label>
        <label>E-mail<input required type="email" maxLength={255} autoComplete="off" value={input.email} onChange={e=>setInput({...input,email:e.target.value})}/></label>
        <label>Perfil na plataforma<select value={input.userRole} onChange={e=>setInput({...input,userRole:e.target.value as PartnerInput["userRole"]})}>{(["ADMINISTRATOR","REPRESENTATIVE","ORGANIZATION","CITY_HALL"] as const).map(role=><option key={role} value={role}>{roleLabels[role]}</option>)}</select></label>
        {!account&&<><p>Defina uma senha inicial e compartilhe-a por um canal seguro.</p><PasswordFields password={password} confirmation={confirmation} setPassword={setPassword} setConfirmation={setConfirmation}/></>}
        {!action&&error&&<p role="alert">{error}</p>}
        <Button type="submit" titulo={busy?"Salvando…":account?"Salvar usuário":"Criar usuário"}/>
      </fieldset>
    </form>}
    {account?.id&&<>
      {<div className="identity-security"><h2>Segurança e acesso</h2><div className="form-actions"><Button variant="secondary" titulo="Redefinir senha" disabled={busy} onClick={()=>open("reset")}/><Button variant="secondary" titulo="Desativar usuário" disabled={busy} onClick={()=>open("deactivate")}/></div></div>}
      <MembershipPanel userId={account.id}/>
    </>}
    {action&&<Modal label={action==="reset"?"Redefinir senha":"Desativar usuário"} busy={busy} onClose={()=>open(null)}>
      <h2>{action==="reset"?"Redefinir senha":"Desativar usuário"}</h2><p>{account?.fullName}</p>
      <p>{action==="reset"?"Todas as sessões serão encerradas. A pessoa deverá trocar esta senha temporária antes de acessar a plataforma.":"O acesso será bloqueado imediatamente. O histórico será preservado. Esta tela não permite reativar a conta."}</p>
      <form className="identity-form" onSubmit={async event=>{
        event.preventDefault();if(busy)return;const failure=action==="reset"?passwordError(password,confirmation):"";setError(failure);if(failure)return;setBusy(true);
        try{
          if(action==="reset"){await accounts.reset(account!.id!,password);if(account!.id===state.account?.id){session.clear();navigate("/login",{replace:true});return;}onUpdated({...account!,mustChangePassword:true});open(null);setNotice("Senha redefinida. Compartilhe a senha temporária por um canal seguro.");}
          else{await accounts.deactivate(account!.id!);if(account!.id===state.account?.id) session.clear();navigate("/users",{replace:true});}
        }catch(err){setError(isAxiosError(err)&&err.response?.status===409?"Não é possível remover o último Administrador Geral ativo. Cadastre outro administrador primeiro.":errorMessage(err));}finally{setBusy(false);}
      }}><fieldset disabled={busy}>
        {action==="reset"&&<PasswordFields password={password} confirmation={confirmation} setPassword={setPassword} setConfirmation={setConfirmation}/>}
        {error&&<p role="alert">{error}</p>}<div className="form-actions"><Button type="submit" titulo={busy?"Aguarde…":action==="reset"?"Confirmar redefinição":"Confirmar desativação"}/><Button variant="secondary" titulo="Cancelar" onClick={()=>open(null)}/></div>
      </fieldset></form>
    </Modal>}
  </Card>;
}
function PasswordFields({password,confirmation,setPassword,setConfirmation}:{password:string,confirmation:string,setPassword:(value:string)=>void,setConfirmation:(value:string)=>void}){
  return <><label>Senha<input required type="password" minLength={8} maxLength={72} autoComplete="new-password" value={password} onChange={e=>setPassword(e.target.value)}/></label><label>Confirmar senha<input required type="password" autoComplete="new-password" value={confirmation} onChange={e=>setConfirmation(e.target.value)}/></label><p className="muted-note">Use pelo menos 8 caracteres e menos de 72 bytes.</p></>;
}
