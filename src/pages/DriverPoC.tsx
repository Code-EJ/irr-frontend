import React, { useState } from "react";
import Card from "../components/Card";
import { CreateDriverForm } from "../components/generics/CreateForm";
import { UpdateDriverForm } from "../components/generics/UpdateForm";
import { ListDriver } from "../components/generics/List";

export interface PageState {
  status: "list" | "create" | "update" | "view";
  id?: string;
}

export function DriverPage() {
  const [state, setState] = useState<PageState>({ status: "list" });

  function render() {
    switch(state.status) {
      case "list": return <ListDriver setState={setState}/>;
      case "create": return <CreateDriverForm />;
      case "update": return <UpdateDriverForm id={ state.id! } />;
      case "view": return <div>TODO: componente DriverView</div>
    } 
  }

  return (
    <Card className="rounded-[50px] shadow-lg d-flex flex-col w-full h-full"  width={undefined} bgColor={undefined} >
      <h1 className="text-center select-none text-4xl">Motoristas</h1>
      { state.status !== "list" ? <button className="p-1 bg-blue-400 rounded-md text-white shadow-md w-16" onClick={() => setState({ status: "list" })}>Voltar</button> : null }
      { render() }
    </Card>
  )
}

// ideia 
function Page({
  // todas as configurações necessáriaos para criar os componentes genericos a partir ddos List, CreateForm, UpdateForm, ViewForm, etc...
}) {
  
}