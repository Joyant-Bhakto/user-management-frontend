import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Grid,
  TextField,
} from "@suid/material";
import { useAuthContext } from "../context/AuthContext";
import { JSX, createSignal } from "solid-js";
import { apiClient } from "../lib/http";
import { UpdateProfileRequest, UpdateProfileResponse } from "../types";
import { AxiosError, AxiosResponse } from "axios";
import toast from "solid-toast";

type FieldErrors = {
  email?: string[];
  password?: string[];
  username?: string[];
};

export default function ProfilePage() {
  const [user, { login, logout }] = useAuthContext();
  const [fieldErrors, setFieldErrors] = createSignal<FieldErrors>(
    {} as FieldErrors
  );

  const handleUpdate: JSX.EventHandler<HTMLFormElement, SubmitEvent> = async (
    e
  ) => {
    e.preventDefault();

    const formData = new FormData(e.target as HTMLFormElement);

    const username = formData.get("username");
    const email = formData.get("email");
    const password = formData.get("password");

    try {
      const response = await apiClient.put<
        UpdateProfileResponse,
        AxiosResponse<UpdateProfileResponse>,
        UpdateProfileRequest
      >(`/api/users`, {
        email: email ? (email as string) : undefined,
        password: password ? (password as string) : undefined,
        username: username ? (username as string) : undefined,
      });

      const userData = response.data.user;
      login(userData);
      toast.success(response.data.message);
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

  const emailDefault = user()?.email;
  const usernameDefault = user()?.username;

  const handleDeleteProfile = async () => {
    const yes = confirm("Are you sure you want to delete your profile?");

    if (yes) {
      try {
        await apiClient.delete("/api/users");
        toast.success("Profile deleted successfully");
        logout();
      } catch (error) {
        toast.error((error as Error).message);
      }
    }
  };

  return (
    <div class="h-screen  justify-center flex">
      <Grid item lg={6} mt={5}>
        <form onSubmit={handleUpdate}>
          <Card>
            <CardHeader title={"Update your profile"} />

            <CardContent>
              <div class="flex gap-y-4 flex-col">
                <div>
                  <TextField
                    fullWidth
                    name="username"
                    label={"Username"}
                    defaultValue={usernameDefault}
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
                    defaultValue={emailDefault}
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
              <Button type={"submit"}>Update</Button>

              <div class={"flex-1"} />

              <Button color={"error"} onClick={handleDeleteProfile}>
                Delete Account
              </Button>
            </CardActions>
          </Card>
        </form>
      </Grid>
    </div>
  );
}
