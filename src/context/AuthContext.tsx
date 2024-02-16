import { User } from "../types";
import {
  on,
  useContext,
  ParentProps,
  createEffect,
  createSignal,
  createContext,
} from "solid-js";

const storeAuthData = localStorage.getItem("user");
const parsedAuthData =
  storeAuthData !== null ? (JSON.parse(storeAuthData) as User) : null;

export const makeAuthContext = () => {
  const [user, setUser] = createSignal<User | null>(parsedAuthData);

  createEffect(
    on(
      user,
      (loggedInUserData) => {
        if (!!loggedInUserData) {
          localStorage.setItem("user", JSON.stringify(loggedInUserData));
        } else {
          localStorage.removeItem("user");
        }
      },
      { defer: true }
    )
  );

  return [
    user,
    {
      login(loggedInUserData: User) {
        setUser(loggedInUserData);
      },
      logout() {
        setUser(null);
      },
    },
  ] as const;
};

type AuthContextData = ReturnType<typeof makeAuthContext>;
export const AuthContext = createContext<AuthContextData>([
  () => null,
  {
    login: (_: User) => {},
    logout: () => {},
  },
]);
export const useAuthContext = () => useContext(AuthContext);

export default function AuthProvider(props: ParentProps) {
  const auth = makeAuthContext();

  return (
    <AuthContext.Provider value={auth}>{props.children}</AuthContext.Provider>
  );
}
