import { Component, createEffect } from "solid-js";
import { useAuthContext } from "../context/AuthContext";
import { RouteSectionProps, useLocation, useNavigate } from "@solidjs/router";
import { AppBar, Button, Container, Toolbar } from "@suid/material";
import { apiClient } from "../lib/http";

export const PrivateRoute: Component<RouteSectionProps> = (props) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, { logout }] = useAuthContext();

  createEffect(() => {
    if (user() === null) {
      navigate("/auth/login", {
        replace: true,
        state: {
          next: location.pathname,
        },
      });
    }
  });

  const handleLogout = async () => {
    try {
      await apiClient.post("/api/auth/logout");

      logout();
    } catch (error) {}
  };

  const handleGotoProfileUpdate = () => {
    navigate("/profile");
  };

  const handleGotoHome = () => {
    navigate("/");
  };

  return (
    <div>
      <AppBar position="relative">
        <Toolbar>
          <Button class="!text-white" onClick={handleGotoHome}>
            Home
          </Button>
          <div class="flex-1" />

          <Button class="!text-white !mr-5" onClick={handleGotoProfileUpdate}>
            Update profile
          </Button>
          <Button class="!text-white" onClick={handleLogout}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth={"lg"}>{props.children}</Container>
    </div>
  );
};
