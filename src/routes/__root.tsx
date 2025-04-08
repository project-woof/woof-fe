import { Outlet, createRootRoute } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { AuthProvider } from "@/context/authContext";
import { Toaster } from "@/components/ui/sonner";

import Header from "../components/Header";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

export const Route = createRootRoute({
	component: () => (
		<>
			<QueryClientProvider client={queryClient}>
				<AuthProvider>
					<div className="flex flex-col min-h-screen">
						<Header />
						<main className="flex-grow">
							<Outlet />
						</main>
						<Toaster />
					</div>
				</AuthProvider>
				<TanStackRouterDevtools />
			</QueryClientProvider>
		</>
	),
});
