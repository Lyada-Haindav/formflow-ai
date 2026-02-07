import { QueryClient } from "@tanstack/react-query";

export const throwIfResNotOk = (res: Response) => {
  if (!res.ok) {
    const text = res.text || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
};

export const apiRequest = async (
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<Response> => {
  const res = await fetch(url, {
    method,
    headers: data ? { "Content-Type": "application/json" } : {},
    body: data ? JSON.stringify(data) : undefined,
  });
  throwIfResNotOk(res);
  return res;
};

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn = (options: {
  on401: UnauthorizedBehavior,
}) => {
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    const res = await fetch(queryKey.join("/") as string, {
      headers: {},
    });
    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
      return null;
    }

    throwIfResNotOk(res);
    return await res.json();
  };
};

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
});
