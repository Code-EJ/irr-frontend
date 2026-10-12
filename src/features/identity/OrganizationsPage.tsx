/** @author Enzo Ribas (https://github.com/oEnzoRibas) */
import {useEffect,useState} from "react";
import {Link,useNavigate,useParams} from "react-router-dom";
import Card from "../../components/Card";
import Button from "../../components/Button";
import Modal from "../../components/Modal";
import Pagination from "../../shared/ui/Pagination";
import {usePage} from "../../shared/ui/usePage";
import {errorMessage} from "../../shared/api/transport";
import {accounts,organizationAdministration as administration,type Account,type Organization,type OrganizationInput} from "./api";
import {MembershipEditor} from "./MembershipPanel";
import {passwordError} from "./validation";
import {useSession} from "./SessionProvider";
import {Building2, UsersRound} from "lucide-react";

/** Bounded global administration, separate from the selected operational organization. */
export default function OrganizationsPage(){
  const [page,setPage]=useState(0),[revision,setRevision]=useState(0);
  const {data,busy,error}=usePage(administration.list,page,revision);
  return <Card className="identity-card"><p className="eyebrow">ADMINISTRAÇÃO GLOBAL</p><h1>Organizações</h1>
    <p>Gerencie as unidades operacionais e seus responsáveis. Cada organização mantém seus próprios dados.</p>
    <Link className="button button-primary" to="/organizations/new">Criar organização</Link>
    {busy?<p role="status">Carregando organizações…</p>:error?<><p role="alert">{error}</p><Button titulo="Tentar novamente" onClick={()=>setRevision(n=>n+1)}/></>:<>
      {!data.items.length&&<p>Nenhuma organização ativa cadastrada.</p>}
      <ul className="membership-list">{data.items.map(org=><li key={org.id}><div><strong>{org.name}</strong><p>{org.organizationType}</p></div><Link to={`/organizations/${org.id}`}>Gerenciar organização</Link></li>)}</ul>
      <Pagination page={page} pages={data.pages} onChange={setPage}/>
    </>}
  </Card>;
}

/** Reads details before editing; a failed read never becomes an accidental create operation. */
export function OrganizationPage(){
  const {id}=useParams();const [organization,setOrganization]=useState<Organization|null>(null);
  const [busy,setBusy]=useState(Boolean(id)),[error,setError]=useState(""),[revision,setRevision]=useState(0);
  useEffect(()=>{if(!id)return;let active=true;setBusy(true);setError("");
    administration.get(id).then(org=>{if(active)setOrganization(org);}).catch(err=>{if(active)setError(errorMessage(err));}).finally(()=>{if(active)setBusy(false);});
    return()=>{active=false;};
  },[id,revision]);
  if(busy)return <Card><p role="status">Carregando organização…</p></Card>;
  if(error)return <Card><p role="alert">{error}</p><Button titulo="Tentar novamente" onClick={()=>setRevision(n=>n+1)}/><Link to="/organizations">Voltar</Link></Card>;
  return <OrganizationEditor key={id??"new"} initial={organization}/>;
}

/** Keeps completed onboarding steps so retries never duplicate a created organization or user. */
function OrganizationEditor({initial}:{initial:Organization|null}){
  const state=useSession(),navigate=useNavigate();const [organization,setOrganization]=useState(initial);
  const [input,setInput]=useState<OrganizationInput>({name:initial?.name??"",organizationType:initial?.organizationType??"Cooperativa"});
  const [busy,setBusy]=useState(false),[error,setError]=useState(""),[notice,setNotice]=useState("");
  const [deactivate,setDeactivate]=useState(false),[manage,setManage]=useState(false),[member,setMember]=useState<Account|null>(null);
  return <Card className="identity-card"><Link to="/organizations">← Organizações</Link><p className="eyebrow">ADMINISTRAÇÃO GLOBAL</p><h1>{initial?"Gerenciar organização":"Nova organização"}</h1>
    {notice&&<p role="status">{notice}</p>}
    <form className="identity-form" onSubmit={async event=>{event.preventDefault();if(busy)return;setBusy(true);setError("");
      try{const value={name:input.name.trim(),organizationType:input.organizationType.trim()};
        if(organization?.id){setOrganization(await administration.update(organization.id,value));setNotice("Organização atualizada.");state.reload();}
        else{setOrganization(await administration.create(value));setNotice("Organização criada. Agora associe o responsável abaixo.");}
      }catch(err){setError(errorMessage(err));}finally{setBusy(false);}
    }}><fieldset disabled={busy||Boolean(organization&&!initial)}>
      <label>Nome da organização<input required maxLength={255} value={input.name} onChange={e=>setInput({...input,name:e.target.value})}/></label>
      <label>Tipo da organização<input required maxLength={50} value={input.organizationType} onChange={e=>setInput({...input,organizationType:e.target.value})}/></label>
      <p className="muted-note">O tipo descreve a unidade; as permissões são definidas pelos vínculos dos usuários.</p>
      <Button type="submit" titulo={busy?"Salvando…":organization?"Salvar organização":"Criar organização"}/>
    </fieldset></form>
    {error&&<p role="alert">{error}</p>}
    {organization?.id&&!initial&&<ResponsibleOnboarding organization={organization} onComplete={()=>{state.reload();navigate(`/organizations/${organization.id}`,{replace:true});}}/>}
    {initial?.id&&<section className="identity-security"><h2>Usuários e acesso</h2><p>Selecione um usuário para consultar, conceder ou revogar o vínculo.</p>
      <Button titulo="Gerenciar membros" onClick={()=>setManage(true)}/>
      <Button variant="secondary" titulo="Desativar organização" onClick={()=>setDeactivate(true)}/>
    </section>}
    {manage&&<Modal label="Selecionar membro" title="Gerenciar membros" description="Selecione uma conta para consultar ou alterar o vínculo." icon={<UsersRound size={23}/>} busy={false} onClose={()=>setManage(false)}><UserSelection onSelect={user=>{setMember(user);setManage(false);}}/><div className="dialog-footer"><Button variant="secondary" titulo="Fechar" onClick={()=>setManage(false)}/></div></Modal>}
    {member&&organization&&<MembershipEditor key={member.id} organization={organization} userId={member.id!} userName={member.fullName} onClose={()=>{setMember(null);state.reload();}}/>}
    {deactivate&&organization?.id&&<Modal label="Desativar organização" title="Desativar organização" description="Confirme o bloqueio de acesso à unidade." icon={<Building2 size={23}/>} tone="danger" busy={busy} onClose={()=>setDeactivate(false)}><div className="dialog-context"><small>Organização selecionada</small><strong>{organization.name}</strong></div><p className="dialog-notice dialog-notice-warning">Todos os acessos à unidade serão bloqueados. Os registros e o histórico serão preservados.</p>{error&&<p role="alert">{error}</p>}
      <div className="dialog-footer"><Button variant="secondary" titulo="Cancelar" disabled={busy} onClick={()=>setDeactivate(false)}/><Button variant="danger" titulo={busy?"Desativando…":"Confirmar desativação"} disabled={busy} onClick={()=>{setBusy(true);setError("");void administration.deactivate(organization.id!).then(()=>{state.reload();navigate("/organizations",{replace:true});}).catch(err=>setError(errorMessage(err))).finally(()=>setBusy(false));}}/></div>
    </Modal>}
  </Card>;
}

/** Selection pages are bounded and retain failure/retry states instead of loading every user. */
export function UserSelection({onSelect}:{onSelect:(user:Account)=>void}){
  const [page,setPage]=useState(0),[revision,setRevision]=useState(0);const {data,busy,error}=usePage(accounts.list,page,revision);
  return <section><h2>Selecionar usuário existente</h2>{busy?<p role="status">Carregando usuários…</p>:error?<><p role="alert">{error}</p><Button titulo="Recarregar usuários" onClick={()=>setRevision(n=>n+1)}/></>:<>
    {!data.items.length&&<p>Nenhum usuário ativo disponível.</p>}
    <ul className="membership-list">{data.items.map(user=><li key={user.id}><span>{user.fullName}<small>{user.email}</small></span><Button variant="secondary" titulo="Selecionar" aria-label={`Selecionar ${user.fullName}`} onClick={()=>onSelect(user)}/></li>)}</ul>
    <Pagination page={page} pages={data.pages} onChange={setPage}/>
  </>}</section>;
}

/** Organization, identity and membership remain separate resources with explicit partial progress. */
export function ResponsibleOnboarding({organization,onComplete}:{organization:Organization,onComplete:()=>void}){
  const [mode,setMode]=useState<"existing"|"create">("existing"),[user,setUser]=useState<Account|null>(null);
  const [name,setName]=useState(""),[email,setEmail]=useState(""),[password,setPassword]=useState(""),[confirmation,setConfirmation]=useState("");
  const [busy,setBusy]=useState(false),[error,setError]=useState("");
  return <section className="identity-security"><h2>Administrador da Organização</h2><p>A organização já foi criada. Se uma etapa falhar, tente novamente aqui para continuar sem duplicar os cadastros.</p>
    {!user&&<><div className="form-actions"><Button variant="secondary" titulo="Usar usuário existente" disabled={busy} onClick={()=>setMode("existing")}/><Button variant="secondary" titulo="Criar responsável" disabled={busy} onClick={()=>setMode("create")}/></div>
      {mode==="existing"?<UserSelection onSelect={setUser}/>:<form className="identity-form" onSubmit={async event=>{event.preventDefault();if(busy)return;const failure=passwordError(password,confirmation);setError(failure);if(failure)return;setBusy(true);
        try{setUser(await accounts.create({fullName:name.trim(),email:email.trim(),password,userRole:"ORGANIZATION"}));setPassword("");setConfirmation("");}
        catch(err){setError(errorMessage(err));}finally{setBusy(false);}
      }}><fieldset disabled={busy}><label>Nome do responsável<input required maxLength={255} value={name} onChange={e=>setName(e.target.value)}/></label><label>E-mail do responsável<input required type="email" maxLength={255} value={email} onChange={e=>setEmail(e.target.value)}/></label>
        <label>Senha inicial<input required type="password" autoComplete="new-password" value={password} onChange={e=>setPassword(e.target.value)}/></label><label>Confirmar senha inicial<input required type="password" autoComplete="new-password" value={confirmation} onChange={e=>setConfirmation(e.target.value)}/></label><Button type="submit" titulo={busy?"Criando…":"Criar conta do responsável"}/>
      </fieldset></form>}</>}
    {user&&<><p>Responsável selecionado: <strong>{user.fullName}</strong> · {user.email}</p><p>A permissão de Administrador da Organização permite administrar somente esta organização. O perfil global da conta permanece inalterado.</p>
      <Button titulo={busy?"Associando…":"Confirmar responsável"} disabled={busy} onClick={()=>{setBusy(true);setError("");void administration.grant(organization.id!,user.id!,"MANAGER").then(onComplete).catch(err=>setError(errorMessage(err))).finally(()=>setBusy(false));}}/>
      <Button variant="secondary" titulo="Selecionar outra pessoa" disabled={busy} onClick={()=>setUser(null)}/>
    </>}
    {error&&<p role="alert">{error}</p>}
    <p className="muted-note">Se sair antes de concluir, retome em Organizações → Gerenciar membros. A organização e as contas já criadas serão preservadas.</p>
  </section>;
}
