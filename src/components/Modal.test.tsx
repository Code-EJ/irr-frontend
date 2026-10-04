// @vitest-environment jsdom
/** @author Enzo Ribas (https://github.com/oEnzoRibas) */
import {useState} from "react";
import {afterEach,beforeEach,expect,it} from "vitest";
import {cleanup,fireEvent,render,screen} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Modal from "./Modal";

beforeEach(()=>{
  Object.defineProperty(HTMLDialogElement.prototype,"showModal",{configurable:true,value:function(this:HTMLDialogElement){this.setAttribute("open","");}});
  Object.defineProperty(HTMLDialogElement.prototype,"close",{configurable:true,value:function(this:HTMLDialogElement){this.removeAttribute("open");}});
});
afterEach(cleanup);

/** Exercises dismissal and focus rather than mirroring presentation CSS. */
function Workflow(){
  const [open,setOpen]=useState(false),[busy,setBusy]=useState(false);
  return <><button onClick={()=>setOpen(true)}>Open workflow</button>{open&&<Modal label="Gerenciar vínculo" title="Gerenciar vínculo" description="Descrição do fluxo" busy={busy} onClose={()=>setOpen(false)}>
    <label>Campo<input/></label><button onClick={()=>setBusy(true)}>Start request</button>
  </Modal>}</>;
}

it("labels the dialog, focuses its form and restores the opener after dismissal",async()=>{
  const user=userEvent.setup();render(<Workflow/>);const opener=screen.getByRole("button",{name:"Open workflow"});
  await user.click(opener);const dialog=screen.getByRole("dialog",{name:"Gerenciar vínculo"});
  expect(document.getElementById(dialog.getAttribute("aria-describedby")!)?.textContent).toBe("Descrição do fluxo");
  expect(document.activeElement).toBe(screen.getByLabelText("Campo"));
  await user.click(screen.getByRole("button",{name:"Fechar gerenciar vínculo"}));expect(screen.queryByRole("dialog")).toBeNull();expect(document.activeElement).toBe(opener);
  await user.click(opener);fireEvent(screen.getByRole("dialog"),new Event("cancel",{bubbles:true,cancelable:true}));expect(screen.queryByRole("dialog")).toBeNull();
});

it("blocks the close button and Escape cancellation while a mutation is in flight",async()=>{
  const user=userEvent.setup();render(<Workflow/>);await user.click(screen.getByRole("button",{name:"Open workflow"}));await user.click(screen.getByRole("button",{name:"Start request"}));
  const close=screen.getByRole("button",{name:"Fechar gerenciar vínculo"}) as HTMLButtonElement;expect(close.disabled).toBe(true);
  await user.click(close);const cancel=new Event("cancel",{bubbles:true,cancelable:true});fireEvent(screen.getByRole("dialog"),cancel);
  expect(cancel.defaultPrevented).toBe(true);expect(screen.getByRole("dialog")).not.toBeNull();
});
