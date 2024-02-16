import {
  For,
  JSX,
  Match,
  ResourceFetcher,
  Switch,
  createResource,
  createSignal,
} from "solid-js";
import { GetUserResponse } from "../types";
import { apiClient } from "../lib/http";
import {
  Card,
  CircularProgress,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@suid/material";
import { ArrowBack, ChevronLeft, ChevronRight } from "@suid/icons-material";
import { OutlinedTextFieldProps } from "@suid/material/TextField";
import useDebounce from "../hooks/useDebounce";

type QueryParams = {
  page?: number;
  limit?: number;
  query?: string;
};

const fetchData: ResourceFetcher<QueryParams, GetUserResponse, true> = async (
  k,
  { value, refetching }
) => {
  if (refetching) {
    return value as GetUserResponse;
  }

  const response = await apiClient.get<GetUserResponse>("api/users", {
    params: {
      page: k.page,
      query: k.query,
      per_page: k.limit,
    },
  });

  return response.data;
};

export default function HomePage() {
  const [page, setPage] = createSignal(1);
  const [limit, setLimit] = createSignal(15);
  const [query, setQuery] = createSignal("");
  const debouncedQuery = useDebounce(query, 500);

  const [users] = createResource(
    () => ({
      limit: limit(),
      page: page(),
      query: debouncedQuery(),
    }),
    fetchData
  );

  const handlePreviousPage = () => {
    setPage((prev) => prev - 1);
  };

  const handleNextPage = () => {
    setPage((prev) => prev + 1);
  };

  const handleFilter: OutlinedTextFieldProps["onChange"] = (e) => {
    setQuery(e.target.value);
  };

  return (
    <div class={"mt-5"}>
      <TextField
        value={query()}
        onChange={handleFilter}
        placeholder="Enter email or username"
        class={"w-80"}
      />

      <Switch>
        <Match when={users.loading && users() === undefined}>
          <CircularProgress />
        </Match>

        <Match when={users.error}>
          <Typography>{users.error.message}</Typography>
        </Match>

        <Match when={users.state === "ready"}>
          <Card class="mt-5">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Username</TableCell>
                  <TableCell>Email</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                <For each={users()?.data}>
                  {(user) => {
                    return (
                      <TableRow>
                        <TableCell>{user.id}</TableCell>
                        <TableCell>{user.username}</TableCell>
                        <TableCell>{user.email}</TableCell>
                      </TableRow>
                    );
                  }}
                </For>
              </TableBody>
            </Table>

            <div class={"flex items-center gap-x-4 justify-center"}>
              <IconButton disabled={page() === 1} onClick={handlePreviousPage}>
                <ChevronLeft />
              </IconButton>

              <Typography>{page()}</Typography>

              <IconButton
                disabled={page() >= (users()?.current_page ?? 1)}
                onClick={handleNextPage}
              >
                <ChevronRight />
              </IconButton>
            </div>
          </Card>
        </Match>
      </Switch>
    </div>
  );
}
