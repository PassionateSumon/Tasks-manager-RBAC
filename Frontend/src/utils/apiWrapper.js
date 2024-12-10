const BASE_URL =
  import.meta.env.VITE_DEV_ENVIRONMENT === "true"
    ? import.meta.env.VITE_DEV_SERVER
    : import.meta.env.VITE_PRODUCTION_SERVER;

export const useApi = async (lastPart, method, options) => {
  const response = await fetch(`${BASE_URL}/${lastPart}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    credentials: "include",
    ...options,
  });
  const result = await response.json();
  return result;
};

