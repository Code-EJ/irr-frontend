/** @author Enzo Ribas (https://github.com/oEnzoRibas) */
import { useState } from "react";
import { isAxiosError } from "axios";
import { Navigate, useNavigate } from "react-router-dom";
import Card from "../components/Card";
import Button from "../components/Button";
import InputText from "../components/InputText";
import SimpleForm from "../components/SimpleForm";
import Logo from "../components/Logo";
import { authenticate } from "../features/identity/api";
import { session } from "../shared/api/session";
import { errorMessage } from "../shared/api/transport";
export default function Login() {
  const [error, setError] = useState("");
  const navigate = useNavigate();
  if (session.getToken()) return <Navigate to="/menu" replace />;
  return (
    <Card className="rounded-3xl shadow-lg max-w-md mx-auto w-full">
      <div className="flex justify-center">
        <Logo />
      </div>
      <h1 className="text-2xl font-bold text-green-950">Sign in to IRR</h1>
      <p className="my-3">
        Use your assigned account to access your organization.
      </p>
      <SimpleForm
        initialValues={{ email: "", password: "" }}
        onSubmit={async (values) => {
          setError("");
          try {
            session.setToken(await authenticate(values.email, values.password));
            navigate("/menu", { replace: true });
          } catch (err) {
            setError(
              isAxiosError(err) && err.response?.status === 401
                ? "Invalid email or password."
                : errorMessage(err),
            );
          }
        }}
      >
        {(formik) => (
          <>
            <InputText
              name="email"
              titulo="Email"
              type="email"
              autoComplete="username"
              required
            />
            <InputText
              name="password"
              titulo="Password"
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
              titulo={formik.isSubmitting ? "Signing in…" : "Sign in"}
              type="submit"
              disabled={formik.isSubmitting}
              className="w-full mt-4"
            />
          </>
        )}
      </SimpleForm>
    </Card>
  );
}
