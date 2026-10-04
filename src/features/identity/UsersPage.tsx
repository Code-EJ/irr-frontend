/** @author Enzo Ribas (https://github.com/oEnzoRibas) */
import {useState} from "react";
import {Link} from "react-router-dom";
import Card from "../../components/Card";
import Button from "../../components/Button";
import Pagination from "../../shared/ui/Pagination";
import {usePage} from "../../shared/ui/usePage";
import {accounts} from "./api";
import {roleLabels} from "./ProfilePage";
/** Paginates platform accounts without relying on a selected organization. */
export default function UsersPage(){
  const [page,setPage]=useState(0);
  const [revision,setRevision]=useState(0);
  const {data,busy,error}=usePage(accounts.list,page,revision);
  return <Card>
    <div className="page-heading"><div><p className="eyebrow">ADMINISTRAÇÃO</p><h1>Usuários</h1><p className="page-description">Contas ativas e vínculos com organizações.</p></div><Link className="button button-primary" to="/users/new">Criar usuário</Link></div>
    {error?<p role="alert">{error} <Button titulo="Tentar novamente" onClick={()=>setRevision(n=>n+1)}/></p>:busy?<p role="status">Carregando usuários…</p>:<>
      {!data.items.length?<p>Nenhum usuário encontrado.</p>:<div className="table-scroll"><table><thead><tr><th>Nome</th><th>E-mail</th><th>Perfil</th><th>Segurança</th><th>Ações</th></tr></thead><tbody>{data.items.map(user=><tr key={user.id}><td>{user.fullName}</td><td>{user.email}</td><td>{roleLabels[user.userRole??"REPRESENTATIVE"]}</td><td>{user.mustChangePassword?"Troca de senha pendente":"Ativo"}</td><td><Link to={`/users/${user.id}`}>Ver conta</Link></td></tr>)}</tbody></table></div>}
      <Pagination page={page} pages={data.pages} busy={busy} onChange={setPage}/>
    </>}
  </Card>;
}
