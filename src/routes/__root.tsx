import { Outlet, createRootRoute, useRouter } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

import Header from "../components/Header";
import { useEffect, useState } from "react";

const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

useEffect(() => {
  const checkAuth = () => {
    const authCookie = document.cookie.includes("auth_token=");
    setIsAuthenticated(authCookie);
  };

  checkAuth();
  const interval = setInterval(checkAuth, 1000);

  return () => clearInterval(interval);
}, []);

  return isAuthenticated;
};

export const Route = createRootRoute({
  beforeLoad: ({ location, navigate }) => {
    const isAuthenticated = document.cookie.includes("auth_token=");
    if (!isAuthenticated && location.pathname !== "/login") {
      navigate({ to: "/login" });
    }
  },
  component: () => (
    <>
      <Header isAuthenticated={useAuth()} />

      <Outlet />
      <TanStackRouterDevtools />
    </>
  ),
});
