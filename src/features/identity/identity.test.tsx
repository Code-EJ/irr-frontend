// @vitest-environment jsdom
/** @author Enzo Ribas (https://github.com/oEnzoRibas) */
import {afterEach,beforeEach,expect,it,vi} from "vitest";
import {cleanup,render,screen,waitFor} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {MemoryRouter,Routes,Route} from "react-router-dom";
import {AxiosError,AxiosHeaders} from "axios";
import PasswordPage from "./PasswordPage";
import ProfilePage from "./ProfilePage";
import {SessionProvider,useSession} from "./SessionProvider";
import {apiClient} from "../../shared/api/client";
import {session} from "../../shared/api/session";
import {passwordError} from "./validation";
beforeEach(()=>{localStorage.clear();session.setToken("test-session");});
afterEach(()=>{cleanup();vi.restoreAllMocks();session.clear();});
function Inspector(){const state=useSession();return <p>{state.loading?"loading":state.error||state.account?.fullName}</p>;}
it("validates confirmation and UTF-8 hashing limits",()=>{
  expect(passwordError("a".repeat(71),"a".repeat(71))).toBe("");
  expect(passwordError("é".repeat(36),"é".repeat(36))).not.toBe("");
  expect(passwordError("password1","different")).toContain("coincidem");
});
it("loads restricted accounts without requesting organization access",async()=>{
  const paths:string[]=[];
  apiClient.defaults.adapter=async config=>{paths.push(config.url!);return {config,data:{id:"account",fullName:"Restricted",mustChangePassword:true},status:200,statusText:"OK",headers:new AxiosHeaders()};};
  render(<SessionProvider><Inspector/></SessionProvider>);
  await screen.findByText("Restricted");expect(paths).toEqual(["/users/me"]);
});
it("does not submit mismatched passwords and clears revoked sessions after success",async()=>{
  const requests:string[]=[];
  apiClient.defaults.adapter=async config=>{requests.push(config.url!);expect(JSON.parse(config.data)).toEqual({currentPassword:"old-password",newPassword:"new-password"});return {config,data:null,status:204,statusText:"No Content",headers:new AxiosHeaders()};};
  const user=userEvent.setup();
  render(<MemoryRouter initialEntries={["/password"]}><Routes><Route path="/password" element={<PasswordPage mandatory/>}/><Route path="/login" element={<p>Login after change</p>}/></Routes></MemoryRouter>);
  await user.type(screen.getByLabelText("Senha atual"),"old-password");
  await user.type(screen.getByLabelText("Nova senha"),"new-password");
  await user.type(screen.getByLabelText("Confirmar nova senha"),"wrong-password");
  await user.click(screen.getByRole("button",{name:"Salvar nova senha"}));
  expect(screen.getByRole("alert").textContent).toContain("coincidem");expect(requests).toHaveLength(0);
  await user.clear(screen.getByLabelText("Confirmar nova senha"));await user.type(screen.getByLabelText("Confirmar nova senha"),"new-password");
  await user.click(screen.getByRole("button",{name:"Salvar nova senha"}));
  await screen.findByText("Login after change");expect(session.getToken()).toBeNull();expect([...Object.values(localStorage)]).not.toContain("new-password");
});
it("keeps the session after wrong current password and displays a safe error",async()=>{
  apiClient.defaults.adapter=async config=>{throw new AxiosError("Forbidden","403",config,undefined,{config,data:{},status:403,statusText:"Forbidden",headers:new AxiosHeaders()});};
  const user=userEvent.setup();render(<MemoryRouter><PasswordPage/></MemoryRouter>);
  await user.type(screen.getByLabelText("Senha atual"),"wrong-password");await user.type(screen.getByLabelText("Nova senha"),"new-password");await user.type(screen.getByLabelText("Confirmar nova senha"),"new-password");
  await user.click(screen.getByRole("button",{name:"Salvar nova senha"}));
  expect((await screen.findByRole("alert")).textContent).toContain("incorreta");expect(session.getToken()).toBe("test-session");
});
it("updates the shared account after a profile save without writable role fields",async()=>{
  let name="Before";let saves=0;
  apiClient.defaults.adapter=async config=>{
    if(config.method==="put"){const body=JSON.parse(config.data);expect(Object.keys(body).sort()).toEqual(["email","fullName"]);name=body.fullName;saves++;}
    return {config,data:config.url==="/organizations"?{content:[],totalElements:0}:{id:"account",fullName:name,email:"account@example.invalid",userRole:"REPRESENTATIVE",mustChangePassword:false},status:200,statusText:"OK",headers:new AxiosHeaders()};
  };
  function LoadedProfile(){const s=useSession();return s.loading?null:<ProfilePage/>;}
  render(<MemoryRouter><SessionProvider><Inspector/><LoadedProfile/></SessionProvider></MemoryRouter>);
  const user=userEvent.setup();await screen.findByDisplayValue("Before");await user.clear(screen.getByLabelText("Nome completo"));await user.type(screen.getByLabelText("Nome completo"),"After");await user.click(screen.getByRole("button",{name:"Salvar perfil"}));
  await waitFor(()=>expect(saves).toBe(1));await screen.findByDisplayValue("After");expect(screen.queryByLabelText("Perfil na plataforma")).toBeNull();
});
