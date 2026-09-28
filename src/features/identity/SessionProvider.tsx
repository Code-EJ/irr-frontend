/** @author Enzo Ribas (https://github.com/oEnzoRibas) */
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { session } from "../../shared/api/session";
import { errorMessage } from "../../shared/api/transport";
import {
  currentAccount,
  organizations,
  membership,
  type Account,
  type Organization,
  type Membership,
} from "./api";
type State = {
  account: Account | null;
  organizations: Organization[];
  organization: Organization | null;
  membership: Membership | null;
  loading: boolean;
  error: string;
  select: (id: string) => void;
  reload: () => void;
};
const Context = createContext<State | null>(null);
/** Loads permissions from the backend; platform role never substitutes for membership. */
export function SessionProvider({ children }: { children: ReactNode }) {
  const [revision, setRevision] = useState(0);
  const [state, setState] = useState<Omit<State, "select" | "reload">>({
    account: null,
    organizations: [],
    organization: null,
    membership: null,
    loading: true,
    error: "",
  });
  useEffect(() => session.subscribe(() => setRevision((n) => n + 1)), []);
  useEffect(() => {
    let active = true;
    if (!session.getToken()) {
      setState({
        account: null,
        organizations: [],
        organization: null,
        membership: null,
        loading: false,
        error: "",
      });
      return;
    }
    setState({
      account: null,
      organizations: [],
      organization: null,
      membership: null,
      loading: true,
      error: "",
    });
    void (async () => {
      const [account, items] = await Promise.all([
        currentAccount(),
        organizations(),
      ]);
      if (!active) return;
      const selected =
        items.find((org) => org.id === session.getOrganization()) ?? null;
      const access = selected?.id ? await membership(selected.id) : null;
      if (active)
        setState({
          account,
          organizations: items,
          organization: selected,
          membership: access,
          loading: false,
          error: "",
        });
    })().catch((error) => {
      if (active)
        setState({
          account: null,
          organizations: [],
          organization: null,
          membership: null,
          loading: false,
          error: errorMessage(error),
        });
    });
    return () => {
      active = false;
    };
  }, [revision]);
  return (
    <Context.Provider
      value={{
        ...state,
        select: (id) => session.selectOrganization(id || null),
        reload: () => setRevision((n) => n + 1),
      }}
    >
      {children}
    </Context.Provider>
  );
}
export function useSession() {
  const state = useContext(Context);
  if (!state) throw new Error("SessionProvider is required.");
  return state;
}
