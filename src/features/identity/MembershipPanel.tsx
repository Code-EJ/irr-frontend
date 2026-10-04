/** @author Enzo Ribas (https://github.com/oEnzoRibas) */
import {useEffect,useState} from "react";
import {isAxiosError} from "axios";
import Button from "../../components/Button";
import Modal from "../../components/Modal";
import Pagination from "../../shared/ui/Pagination";
import {usePage} from "../../shared/ui/usePage";
import {errorMessage} from "../../shared/api/transport";
import {organizationAdministration as administration,type Membership,type Organization} from "./api";
/** Explicit metadata discovery never changes the administrator's own organization context. */
export default function MembershipPanel({userId}:{userId:string}){
  const [page,setPage]=useState(0);
  const [revision,setRevision]=useState(0);
  const {data,busy,error}=usePage(administration.list,page,revision);
  const [selected,setSelected]=useState<Organization|null>(null);
  return <section className="identity-security"><h2>Vínculos com organizações</h2><p>Administradores Gerais têm acesso global. Os vínculos abaixo definem as permissões locais dos demais usuários.</p>
    {error?<p role="alert">{error}<Button titulo="Recarregar organizações" onClick={()=>setRevision(n=>n+1)}/></p>:busy?<p role="status">Carregando organizações…</p>:<>
      {!data.items.length&&<p>Nenhuma organização ativa disponível.</p>}
      <ul className="membership-list">{data.items.map(org=><li key={org.id}><span>{org.name}</span><Button variant="secondary" titulo="Gerenciar vínculo" aria-label={`Gerenciar vínculo com ${org.name}`} onClick={()=>setSelected(org)}/></li>)}</ul>
      <Pagination page={page} pages={data.pages} onChange={setPage}/>
    </>}
    {selected?.id&&<MembershipEditor key={selected.id} organization={selected} userId={userId} onClose={()=>setSelected(null)}/>}
  </section>;
}
export function MembershipEditor({organization,userId,onClose}:{organization:Organization,userId:string,onClose:()=>void}){
  const [membership,setMembership]=useState<Membership|null>(null);
  const [role,setRole]=useState<"MEMBER"|"MANAGER">("MEMBER");
  const [busy,setBusy]=useState(true);
  const [error,setError]=useState("");
  const [loaded,setLoaded]=useState(false);
  const [confirmRevoke,setConfirmRevoke]=useState(false);
  const [revision,setRevision]=useState(0);
  const [notice,setNotice]=useState("");
  useEffect(()=>{
    let active=true;setBusy(true);setError("");setLoaded(false);
    administration.membership(organization.id!,userId).then(value=>{if(active){setMembership(value);setRole(value.role??"MEMBER");setLoaded(true);}}).catch(err=>{
      if(!active)return;
      if(isAxiosError(err)&&err.response?.status===404){setMembership(null);setLoaded(true);}
      else setError(errorMessage(err));
    }).finally(()=>{if(active)setBusy(false);});
    return()=>{active=false;};
  },[organization.id,userId,revision]);
  async function save(revoke:boolean){
    if(busy)return;setBusy(true);setError("");setNotice("");
    try{
      if(revoke){await administration.revoke(organization.id!,userId);setMembership(previous=>previous?{...previous,active:false}:null);setNotice("Vínculo revogado.");}
      else{setMembership(await administration.grant(organization.id!,userId,role));setNotice("Vínculo atualizado.");}
      setConfirmRevoke(false);
    }catch(err){setError(errorMessage(err));}finally{setBusy(false);}
  }
  return <Modal label="Gerenciar vínculo" busy={busy} onClose={onClose}>
    <h2>{organization.name}</h2><p>{membership?.active?`Vínculo ativo: ${membership.role==="MANAGER"?"Administrador da Organização":"Membro"}`:"Sem vínculo ativo"}</p>
    {busy&&<p role="status">Aguarde…</p>}{error&&<p role="alert">{error}</p>}{notice&&<p role="status">{notice}</p>}
    {!loaded&&!busy&&<Button titulo="Tentar novamente" onClick={()=>setRevision(n=>n+1)}/>}
    <fieldset disabled={busy||!loaded} className="identity-form">
      <label>Permissão na organização<select value={role} onChange={e=>setRole(e.target.value as "MEMBER"|"MANAGER")}><option value="MEMBER">Membro</option><option value="MANAGER">Administrador da Organização</option></select></label>
      <p className="muted-note">Administradores da Organização podem alterar os dados operacionais da organização. Nenhum vínculo concede administração da plataforma.</p>
      <Button titulo="Salvar vínculo" onClick={()=>void save(false)}/>
      {membership?.active&&(confirmRevoke?<div role="alert"><p>Revogar o acesso a esta organização? O histórico será preservado.</p><Button titulo="Confirmar revogação" onClick={()=>void save(true)}/><Button variant="secondary" titulo="Cancelar revogação" onClick={()=>setConfirmRevoke(false)}/></div>:<Button variant="secondary" titulo="Revogar vínculo" onClick={()=>setConfirmRevoke(true)}/>)}
    </fieldset><Button variant="secondary" titulo="Fechar" disabled={busy} onClick={onClose}/>
  </Modal>;
}
