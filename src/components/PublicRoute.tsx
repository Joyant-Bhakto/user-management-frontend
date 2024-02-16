import { Component, createEffect } from "solid-js";
import { useAuthContext } from "../context/AuthContext";
import { RouteSectionProps, useLocation, useNavigate } from "@solidjs/router";

export const PublicRoute: Component<RouteSectionProps> = (props) => {
  const navigate = useNavigate();
  const [user] = useAuthContext();
  const location = useLocation<{ next: string }>();

  createEffect(() => {
    if (user() !== null) {
      navigate(location.state?.next ?? "/", {
        replace: true,
      });
    }
  });

  return <>{props.children}</>;
};
