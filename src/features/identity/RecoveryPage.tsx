/** @author Enzo Ribas (https://github.com/oEnzoRibas) */
import {useEffect,useState,type ReactNode} from "react";
import {Link,useNavigate} from "react-router-dom";
import {isAxiosError} from "axios";
import Card from "../../components/Card";
import Button from "../../components/Button";
import {requestRecovery,confirmRecovery} from "./api";
import {passwordError} from "./validation";
import {session} from "../../shared/api/session";
import {errorMessage} from "../../shared/api/transport";

/** Public recovery keeps recipients out of success messages and does not disclose account state. */
export default function RecoveryPage(){
  const [email,setEmail]=useState(""),[busy,setBusy]=useState(false),[error,setError]=useState(""),[sent,setSent]=useState(false);
  return <RecoveryLayout><h1>Recuperar senha</h1><p>Informe seu e-mail para solicitar um link de redefinição.</p>
    {sent?<p role="status">Se houver uma conta ativa para este e-mail, enviaremos as instruções. Verifique também a pasta de spam. Aguarde um minuto antes de solicitar outro link.</p>:<form className="identity-form" onSubmit={async event=>{event.preventDefault();if(busy)return;setBusy(true);setError("");
      try{await requestRecovery(email.trim());setEmail("");setSent(true);}catch(err){setError(recoveryError(err));}finally{setBusy(false);}
    }}><fieldset disabled={busy}><label>E-mail<input required type="email" autoComplete="email" maxLength={255} value={email} onChange={e=>setEmail(e.target.value)}/></label>{error&&<p role="alert">{error}</p>}<Button type="submit" titulo={busy?"Solicitando…":"Enviar instruções"}/></fieldset></form>}
    <Link to="/login">Voltar para entrar</Link>
  </RecoveryLayout>;
}

/** Reads a fragment once into component memory and immediately removes it from browser history. */
export function ResetPasswordPage(){
  const navigate=useNavigate();
  const [token,setToken]=useState(()=>new URLSearchParams(window.location.hash.slice(1)).get("token")??"");
  const [password,setPassword]=useState(""),[confirmation,setConfirmation]=useState(""),[busy,setBusy]=useState(false),[error,setError]=useState("");
  const [invalid,setInvalid]=useState(!/^[A-Za-z0-9_-]{43}$/.test(token));
  useEffect(()=>{window.history.replaceState(window.history.state,"",window.location.pathname+window.location.search);},[]);
  return <RecoveryLayout><h1>Redefinir senha</h1>
    {invalid?<><p role="alert">Este link é inválido, expirou ou já foi utilizado. Solicite um novo link para continuar.</p><Link to="/forgot-password">Solicitar outro link</Link></>:<form className="identity-form" onSubmit={async event=>{event.preventDefault();if(busy)return;const failure=passwordError(password,confirmation);setError(failure);if(failure)return;setBusy(true);
      try{await confirmRecovery(token,password);setToken("");setPassword("");setConfirmation("");session.clear();navigate("/login",{replace:true,state:{passwordChanged:true}});}
      catch(err){if(isAxiosError(err)&&err.response?.status===400){setInvalid(true);setToken("");setPassword("");setConfirmation("");}else setError(recoveryError(err));}finally{setBusy(false);}
    }}><fieldset disabled={busy}><label>Nova senha<input required type="password" autoComplete="new-password" minLength={8} maxLength={72} value={password} onChange={e=>setPassword(e.target.value)}/></label><label>Confirmar nova senha<input required type="password" autoComplete="new-password" value={confirmation} onChange={e=>setConfirmation(e.target.value)}/></label>
      <p className="muted-note">Use pelo menos 8 caracteres e menos de 72 bytes. A alteração encerra as sessões anteriores.</p>{error&&<p role="alert">{error}</p>}<Button type="submit" titulo={busy?"Redefinindo…":"Salvar nova senha"}/>
    </fieldset></form>}
    <Link to="/login">Voltar para entrar</Link>
  </RecoveryLayout>;
}
function recoveryError(error:unknown){
  if(isAxiosError(error)&&error.response?.status===503)return "A recuperação está temporariamente indisponível. Tente novamente mais tarde ou entre em contato com o administrador.";
  if(isAxiosError(error)&&error.response?.status===429)return "Aguarde um minuto antes de tentar novamente.";
  return errorMessage(error);
}
function RecoveryLayout({children}:{children:ReactNode}){
  return <main className="restricted-account"><Card className="identity-card"><p className="eyebrow">IRR · SEGURANÇA DA CONTA</p>{children}</Card></main>;
}
