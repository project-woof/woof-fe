import { Outlet, createRootRoute } from "@tanstack/react-router";
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
  component: () => (
    <>
      <Header isAuthenticated={useAuth()} />

      <Outlet />
      <TanStackRouterDevtools />
    </>
  ),
});
