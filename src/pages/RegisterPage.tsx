import { useNavigate } from "@solidjs/router";
import {
  Alert,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Grid,
  TextField,
} from "@suid/material";
import { JSX, Show, createSignal } from "solid-js";
import { apiClient } from "../lib/http";
import { RegisterRequest, RegisterResponse } from "../types";
import { AxiosError, AxiosResponse } from "axios";
import toast from "solid-toast";

type FieldErrors = {
  email?: string[];
  password?: string[];
  username?: string[];
};

export default function RegisterPage() {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = createSignal<string>();
  const [fieldErrors, setFieldErrors] = createSignal<FieldErrors>(
    {} as FieldErrors
  );

  const handleLogin: JSX.EventHandler<HTMLFormElement, SubmitEvent> = async (
    e
  ) => {
    e.preventDefault();

    const formData = new FormData(e.target as HTMLFormElement);

    const email = formData.get("email");
    const username = formData.get("username");
    const password = formData.get("password");

    try {
      const response = await apiClient.post<
        RegisterResponse,
        AxiosResponse<RegisterResponse>,
        RegisterRequest
      >(`/api/auth/register`, {
        email: email as string,
        password: password as string,
        username: username as string,
      });

      toast.success(response.data.message);
      navigate("/auth/login");
    } catch (error) {
      const err = error as AxiosError<{
        errors: {
          email?: string[];
          username?: string[];
          password?: string[];
        };
      }>;

      if (err.response?.status === 422) {
        const fieldErrorsData = err.response.data.errors;

        if (fieldErrorsData.email !== undefined) {
          setFieldErrors((prev) => {
            return {
              ...prev,
              email: fieldErrorsData.email,
            };
          });
        }

        if (fieldErrorsData.username !== undefined) {
          setFieldErrors((prev) => {
            return {
              ...prev,
              username: fieldErrorsData.username,
            };
          });
        }

        if (fieldErrorsData.password !== undefined) {
          setFieldErrors((prev) => {
            return {
              ...prev,
              password: fieldErrorsData.password,
            };
          });
        }
      }
    }
  };

  const handleAlertDismiss = () => {
    setErrorMessage(undefined);
  };

  const handleGoToLogin = () => {
    navigate("/auth/login");
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
            <CardHeader title={"Sign up to start"} />

            <CardContent>
              <div class="flex gap-y-4 flex-col">
                <div>
                  <TextField
                    fullWidth
                    name="username"
                    label={"Username"}
                    helperText={fieldErrors().username}
                    error={fieldErrors().username !== undefined}
                  />
                </div>

                <div>
                  <TextField
                    fullWidth
                    name="email"
                    type={"email"}
                    label={"Email"}
                    helperText={fieldErrors().email}
                    error={fieldErrors().email !== undefined}
                  />
                </div>

                <div>
                  <TextField
                    label={"Password"}
                    type={"password"}
                    fullWidth
                    name="password"
                    helperText={fieldErrors().password}
                    error={fieldErrors().password !== undefined}
                  />
                </div>
              </div>
            </CardContent>

            <CardActions>
              <Button onClick={handleGoToLogin}>
                Already have an account?
              </Button>

              <div class="flex-1" />
              <Button type={"submit"}>Register</Button>
            </CardActions>
          </Card>
        </form>
      </Grid>
    </div>
  );
}
