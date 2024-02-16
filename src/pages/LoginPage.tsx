import {
  Grid,
  Card,
  Alert,
  Button,
  TextField,
  CardHeader,
  CardActions,
  CardContent,
} from "@suid/material";
import { apiClient } from "../lib/http";
import { AxiosError, AxiosResponse } from "axios";
import { useAuthContext } from "../context/AuthContext";
import { createSignal, Show, type JSX } from "solid-js";
import { LoginRequest, LoginResponse } from "../types";
import toast from "solid-toast";
import { useNavigate } from "@solidjs/router";

export default function LoginPage() {
  const navigate = useNavigate();
  const [, { login }] = useAuthContext();
  const [errorMessage, setErrorMessage] = createSignal<string>();

  const handleLogin: JSX.EventHandler<HTMLFormElement, SubmitEvent> = async (
    e
  ) => {
    e.preventDefault();

    const formData = new FormData(e.target as HTMLFormElement);

    const email = formData.get("email");
    const password = formData.get("password");

    try {
      const response = await apiClient.post<
        LoginResponse,
        AxiosResponse<LoginResponse>,
        LoginRequest
      >(`/api/auth/login`, {
        email: email as string,
        password: password as string,
      });

      const userData = response.data.user;
      login(userData);
      toast.success(response.data.message);
    } catch (error) {
      const err = error as AxiosError<{
        message: string;
      }>;

      if (err.response?.status === 401) {
        const errorMessageData = err.response.data.message;
        setErrorMessage(errorMessageData);
      }
    }
  };

  const handleAlertDismiss = () => {
    setErrorMessage(undefined);
  };

  const handleGoToRegister = () => {
    navigate("/auth/register");
  };

  return (
    <div class="h-screen w-screen items-center justify-center flex">
      <Grid item lg={4}>
        <form onSubmit={handleLogin}>
          <Show when={errorMessage() !== undefined}>
            <Alert severity="error" onClose={handleAlertDismiss}>
              {errorMessage()}
            </Alert>
          </Show>
          <Card>
            <CardHeader title={"Sign in to start"} />

            <CardContent>
              <div class="flex gap-y-4 flex-col">
                <div>
                  <TextField
                    fullWidth
                    name="email"
                    type={"email"}
                    label={"Email"}
                  />
                </div>

                <div>
                  <TextField
                    label={"Password"}
                    type={"password"}
                    fullWidth
                    name="password"
                  />
                </div>
              </div>
            </CardContent>

            <CardActions>
              <Button onClick={handleGoToRegister}>
                Dont have an account?
              </Button>

              <div class="flex-1" />
              <Button type={"submit"}>Login</Button>
            </CardActions>
          </Card>
        </form>
      </Grid>
    </div>
  );
}
