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
  beforeLoad: ({ location, navigate }) => {
    const isAuthenticated = document.cookie.includes("auth_token=");
    
    // If not authenticated and not on login or signup page, redirect to login
    if (!isAuthenticated && location.pathname !== "/login" && location.pathname !== "/signup") {
      navigate({ to: "/login" });
      return;
    }
    
    // If authenticated but no is_petsitter field in profile (except on signup page), redirect to signup
    if (isAuthenticated && location.pathname !== "/signup") {
      const userProfile = JSON.parse(localStorage.getItem('userProfile') || '{}');
      if (userProfile.is_petsitter === undefined) {
        navigate({ 
          to: "/signup",
          search: { fromLogin: "true" }
        });
        return;
      }
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
