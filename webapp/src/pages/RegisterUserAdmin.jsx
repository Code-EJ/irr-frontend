import React from "react";
import Card from "../components/Card";
import InputText from "../components/InputText";
import Button from "../components/Button";

const RegisterUserAdmin = () => {
  return (
    <div
      style={{
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "30px",
        boxSizing: "border-box",
      }}
    >
      <Card width="100%">
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            maxWidth: "900px",
            margin: "0 auto",
            gap: "20px",
            backgroundColor: "lightgray",
            borderRadius: "20px",
            padding: "20px",
          }}
        >
          <h2
            style={{
              alignSelf: "flex-start",
              marginLeft: "10px",
              color: "#4B4B4B",
              fontSize: "24px",
            }}
          >
            Cadastrar Usuário
          </h2>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "space-between",
              width: "100%",
              gap: "20px",
            }}
          >
            <div style={{ flex: "1", minWidth: "300px" }}>
              <InputText titulo="Nome" />
              <InputText titulo="Função" />
            </div>

            <div style={{ flex: "1", minWidth: "300px" }}>
              <InputText titulo="E-mail" />
              <InputText titulo="Senha" />

              <div style={{ marginTop: "20px", textAlign: "right" }}>
                <Button
                  titulo="Cadastrar"
                  onClick={() => alert("Usuário cadastrado com sucesso!")}
                  style={{
                    display: "flex",
                    backgroundColor: "#004d00",
                    padding: "10px 20px",
                    borderRadius: "20px",
                  }}
                />
              </div>
            </div>
          </div>

          <div style={{ marginTop: "30px", marginRight: "15px", alignSelf: "flex-end" }}>
            <img
              src="/src/logo.svg"
              alt="Logo"
              style={{ width: "100px", height: "auto" }}
            />
          </div>
        </div>
      </Card>
    </div>
  );
};

export default RegisterUserAdmin;
