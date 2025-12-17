const API_URL = "https://node-hw12.vercel.app";

const getToken = () =>
  document.cookie
    .split("; ")
    .find((row) => row.startsWith("token="))
    ?.split("=")[1];

export const apiFetch = async (endpoint, options = {}) => {
  const res = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      authorization: `Bearer ${getToken()}`,
      ...(options.headers || {}),
    },
  });

  const contentType = res.headers.get("content-type");

  // Handle unauthorized
  if (res.status === 401) {
    throw new Error("UNAUTHORIZED");
  }

  // If the response is JSON, parse it
  if (contentType && contentType.includes("application/json")) {
    const data = await res.json();
    if (!res.ok) {
      // HTTP error with JSON body
      throw new Error(data.message || `HTTP ${res.status}`);
    }
    return data;
  } else {
    // If response is not JSON (like an HTML error page)
    const text = await res.text();
    throw new Error(`Unexpected response (HTTP ${res.status}):\n${text}`);
  }
};
