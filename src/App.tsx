import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import { Route, Router } from "@solidjs/router";
import { PrivateRoute } from "./components/PrivateRoute";
import { NotFound } from "./pages/NotFound";
import { PublicRoute } from "./components/PublicRoute";
import ProfilePage from "./pages/ProfilePage";

function App() {
  return (
    <Router>
      <Route path={"/"} component={PrivateRoute}>
        <Route path={"/"} component={HomePage} />
        <Route path={"/profile"} component={ProfilePage} />
      </Route>
      <Route path={"/auth"} component={PublicRoute}>
        <Route path="/login" component={LoginPage} />
        <Route path="/register" component={RegisterPage} />
      </Route>
      <Route path="*" component={NotFound} />
    </Router>
  );
}

export default App;
