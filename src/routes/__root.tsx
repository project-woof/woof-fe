import { Outlet, createRootRoute } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { AuthProvider } from "@/context/authContext";

import Header from "../components/Header";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

export const Route = createRootRoute({
  component: () => (
    <>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <Header />
          <Outlet />
        </AuthProvider>
        <TanStackRouterDevtools />
      </QueryClientProvider>
    </>
  ),
});
