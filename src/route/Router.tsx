/** @author Enzo Ribas (https://github.com/oEnzoRibas) */
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Link,
  Outlet,
} from "react-router-dom";
import {
  SessionProvider,
  useSession,
} from "../features/identity/SessionProvider";
import { session } from "../shared/api/session";
import Login from "../pages/Login";
import VehicleList from "../pages/VehiclePages/VehicleList";
import VehicleForm from "../features/fleet/VehicleForm";
import Button from "../components/Button";
import Card from "../components/Card";
import BackgroundImage from "../components/BackgroundImage";
function Protected() {
  const state = useSession();
  if (!session.getToken()) return <Navigate to="/login" replace />;
  if (state.loading) return <p role="status">Loading your account…</p>;
  if (state.error)
    return (
      <Card>
        <p role="alert">{state.error}</p>
        <Button titulo="Retry" onClick={state.reload} />
        <Button titulo="Sign out" onClick={() => session.clear()} />
      </Card>
    );
  return (
    <div className="min-h-screen bg-stone-100 text-green-950">
      <header className="bg-white shadow px-6 py-4 flex flex-wrap items-center gap-5">
        <Link className="font-bold text-xl" to="/menu">
          IRR
        </Link>
        <Link to="/vehicle-list">Vehicles</Link>
        <label className="flex items-center gap-2">
          Organization
          <select
            aria-label="Organization"
            className="border rounded p-2 max-w-xs"
            value={state.organization?.id ?? ""}
            onChange={(event) => state.select(event.target.value)}
          >
            <option value="">Select an organization</option>
            {state.organizations.map((org) => (
              <option key={org.id} value={org.id}>
                {org.name}
              </option>
            ))}
          </select>
        </label>
        <span className="ml-auto">
          {state.account?.fullName}{" "}
          {state.membership && "· " + state.membership.role}
        </span>
        <Button titulo="Sign out" onClick={() => session.clear()} />
      </header>
      <main className="p-4 md:p-8">
        <Outlet key={state.organization?.id ?? "no-organization"} />
      </main>
    </div>
  );
}
function Scoped({ manager = false }: { manager?: boolean }) {
  const state = useSession();
  if (!state.organization)
    return (
      <Card>
        <h1 className="text-xl font-bold">Select an organization</h1>
        <p className="my-3">
          {state.organizations.length
            ? "Choose an organization in the header to continue."
            : "You have no active organization memberships. Contact an administrator."}
        </p>
      </Card>
    );
  if (manager && state.membership?.role !== "MANAGER")
    return (
      <Card>
        <p role="alert">Only organization managers can maintain vehicles.</p>
        <Link to="/vehicle-list">Back to vehicles</Link>
      </Card>
    );
  return <Outlet />;
}
function Home() {
  return (
    <Card className="rounded-3xl max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold">IRR workspace</h1>
      <p className="my-4">
        Select an organization and open a supported workflow.
      </p>
      <Link className="underline" to="/vehicle-list">
        Manage vehicles
      </Link>
      <h2 className="text-xl font-bold mt-8">Integration in progress</h2>
      <p className="mt-2">
        Materials, intake, processing, inventory, sales and reports are being
        integrated in Master Plan order. Their legacy screens are unavailable
        until verified against the final API.
      </p>
    </Card>
  );
}
export default function AppRouter() {
  return (
    <BrowserRouter>
      <SessionProvider>
        <Routes>
          <Route
            path="/login"
            element={
              <BackgroundImage>
                <Login />
              </BackgroundImage>
            }
          />
          <Route element={<Protected />}>
            <Route path="/menu" element={<Home />} />
            <Route element={<Scoped />}>
              <Route path="/vehicle-list" element={<VehicleList />} />
              <Route element={<Scoped manager />}>
                <Route path="/vehicle-create" element={<VehicleForm />} />
                <Route path="/vehicle-update/:id" element={<VehicleForm />} />
              </Route>
            </Route>
            <Route path="*" element={<Home />} />
          </Route>
          <Route path="/" element={<Navigate to="/menu" replace />} />
        </Routes>
      </SessionProvider>
    </BrowserRouter>
  );
}
