import Button from "../components/Button";
import Card from "../components/Card";
import InputText from "../components/InputText";
import React, { useState } from "react";

const handleRegister = () => {
  console.log("register");
};

const RegisterUserAdmin = () => {
    const [showPassword, setShowPassword] = useState(false);
  
    const VisibilityPassword = () => {
      setShowPassword(!showPassword);
    };
  
    return (
      <div style={{ display: "flex", justifyContent: "center", marginTop: "50px" }}>
        <Card width="600px">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: "20px",
            }}
          >
            <div style={{ flex: "1", minWidth: "250px" }}>
              <InputText titulo="Nome do Usuário" />
              <InputText titulo="Função" />
            </div>
            
            <div style={{ flex: "1", minWidth: "250px" }}>
              <InputText titulo="E-mail" />
              <div style={{ position: "relative" }}>
                <InputText
                  titulo="Senha"
                />
                <button
                  style={{
                    position: "absolute",
                    right: "10px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "#007BFF",
                  }}
                  onClick={VisibilityPassword}
                >
                  {showPassword ? "Ocultar" : "Mostrar"}
                </button>
              </div>
            </div>
          </div>
  
          <div style={{ display: "flex", justifyContent: "center", marginTop: "30px" }}>
            <Button
              titulo="Cadastrar"
              onClick={() => alert("Usuário cadastrado com sucesso!")}
            />
          </div>
        </Card>
      </div>
    );
  };
  
  export default RegisterUserAdmin;

