const DEFAULT_API_BASE_URL = "https://bswrxstidata-production.up.railway.app";

export function getApiBaseUrl() {
	const envBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim();
	if (envBaseUrl) {
		return envBaseUrl.replace(/\/$/, "");
	}

	if (typeof window !== "undefined") {
		const { hostname } = window.location;
		if (hostname === "localhost" || hostname === "127.0.0.1") {
			return "http://localhost:3000";
		}
	}

	return DEFAULT_API_BASE_URL;
}

export function apiUrl(path: string) {
	return `${getApiBaseUrl()}${path.startsWith("/") ? path : `/${path}`}`;
}
