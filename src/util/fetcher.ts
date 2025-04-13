import ky, { HTTPError, type KyResponse, type Options } from "ky";

export async function fetcher(
	endpoint: string,
	options: Options = {},
): Promise<KyResponse> {
	try {
		const token = localStorage.getItem("bearer_token");
		let headers: Headers;
		if (options.headers instanceof Headers) {
			headers = options.headers;
		} else {
			headers = new Headers();
		}
		if (token) {
			headers.set("Authorization", `Bearer ${token}`);
		}
		options.headers = headers;
		const res = await ky(import.meta.env.VITE_API_URL + endpoint, options);
		return res;
	} catch (err: any) {
		const error = err as HTTPError;
		const parseErr = (await error.response.json()) as { error: string };
		throw new Error(
			parseErr.error || "An error occurred during data fetching.",
		);
	}
}
