import { Outlet, createRootRoute } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { PaginationProvider } from "@/context/paginationContext";
import { AuthProvider } from "@/context/authContext";

import Header from "../components/Header";
import { Toaster } from "@/components/ui/sonner";

const queryClient = new QueryClient();

export const Route = createRootRoute({
	component: () => (
		<>
			<QueryClientProvider client={queryClient}>
				<AuthProvider>
					<div className="flex flex-col min-h-screen">
						<Header />
						<main className="flex-grow">
							<PaginationProvider>
								<Outlet />
							</PaginationProvider>
						</main>
						<Toaster />
					</div>
				</AuthProvider>
				<TanStackRouterDevtools />
			</QueryClientProvider>
		</>
	),
});
