import ky, { HTTPError, type KyResponse } from "ky";
import type { Options } from "node_modules/ky/distribution/types/options";

export async function fetcher(
  endpoint: string,
  options: Options = {}
): Promise<KyResponse> {
  try {
    const res = await ky(import.meta.env.VITE_API_URL + endpoint, options);
    return res;
  } catch (err: any) {
    const error = err as HTTPError;
    const parseErr = (await error.response.json()) as { error: string };
    throw new Error(
      parseErr.error || "An error occurred during data fetching."
    );
  }
}
