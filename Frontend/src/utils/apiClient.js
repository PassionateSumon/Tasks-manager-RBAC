export const apiClient = async (url, method, options = {}) => {
  const base_url =
    import.meta.env.VITE_DEV_ENVIRONMENT === "true"
      ? import.meta.env.VITE_DEV_SERVER
      : import.meta.env.VITE_PRODUCTION_SERVER;

  try {
    const response = await fetch(`${base_url}/${url}`, {
      method,
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
      ...options,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `HTTP Error: ${response.status}`);
    }

    const data = await response.json();

    return data;
  } catch (error) {
    console.error("API Error:", error.message);
    throw error; // Rethrow to allow calling code to handle the error
  } finally {
  }
};
