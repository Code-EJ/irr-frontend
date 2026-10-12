/** @author Enzo Ribas (https://github.com/oEnzoRibas) */
import { useState } from "react";
import { isAxiosError } from "axios";
import { Link, Navigate, useNavigate, useLocation } from "react-router-dom";
import Card from "../components/Card";
import InstitutionalFooter from "../components/InstitutionalFooter";
import Button from "../components/Button";
import InputText from "../components/InputText";
import SimpleForm from "../components/SimpleForm";
import { Recycle, ArrowUpRight } from "lucide-react";
import { authenticate } from "../features/identity/api";
import { session } from "../shared/api/session";
import { errorMessage } from "../shared/api/transport";
export default function Login() {
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  if (session.getToken()) return <Navigate to="/menu" replace />;
  return (
    <div className="login-layout">
      <section className="login-story">
        <div className="brand">
          <Recycle size={32} />
          <span>
            IRR<small>Instituto Referência em Resíduos</small>
          </span>
        </div>
        <div>
          <span className="status-pill">Cuidar. Reciclar. Transformar.</span>
          <h2>
            Novos ciclos.
            <br />
            Mais possibilidades.
          </h2>
          <p>
            Uma gestão conectada para transformar resíduos em oportunidades.
          </p>
          <Recycle
            className="login-symbol"
            aria-hidden="true"
            strokeWidth={1}
          />
        </div>
        <span className="login-footnote">
          Juntos por um futuro mais sustentável <ArrowUpRight size={18} />
        </span>
      </section>
      <main className="login-form">
        <Card className="login-card">
          <h1 className="text-2xl font-bold text-green-950">
            Bem-vindo ao IRR
          </h1>
          <p className="my-3">
            Entre com sua conta para acessar sua organização.
          </p>
          {location.state?.passwordChanged && <p role="status">Senha alterada. Entre com sua nova senha.</p>}
          <SimpleForm
            initialValues={{ email: "", password: "" }}
            onSubmit={async (values) => {
              setError("");
              try {
                session.setToken(
                  await authenticate(values.email, values.password),
                );
                navigate("/menu", { replace: true });
              } catch (err) {
                setError(
                  isAxiosError(err) && err.response?.status === 401
                    ? "E-mail ou senha inválidos."
                    : errorMessage(err),
                );
              }
            }}
          >
            {(formik) => (
              <>
                <InputText
                  name="email"
                  titulo="E-mail"
                  type="email"
                  autoComplete="username"
                  required
                />
                <InputText
                  name="password"
                  titulo="Senha"
                  type="password"
                  autoComplete="current-password"
                  required
                />
                {error && (
                  <p role="alert" className="text-red-800 my-3">
                    {error}
                  </p>
                )}
                <Button
                  titulo={
                    formik.isSubmitting ? "Entrando…" : "Entrar na plataforma"
                  }
                  type="submit"
                  disabled={formik.isSubmitting}
                  className="w-full mt-4"
                />
              </>
            )}
          </SimpleForm>
          <p className="login-help"><Link to="/forgot-password">Esqueci minha senha</Link></p>
          <p className="login-help">
            Precisa de acesso? Entre em contato com o administrador da sua
            organização.
          </p>
        </Card>
        <InstitutionalFooter />
      </main>
    </div>
  );
}
