import { baseURL } from "@/utils/baseUrl";
import { notifications } from "@mantine/notifications";
import { IconX } from "@tabler/icons";

type RequestOptions = {
	method?: string;
	headers?: Record<string, string>;
	body?: unknown;
	cookie?: string;
	params?: Record<string, string | number | boolean | undefined | null>;
	cache?: RequestCache;
	next?: NextFetchRequestConfig;
};

function buildUrlWithParams(
	url: string,
	params?: RequestOptions["params"],
): string {
	if (!params) return url;
	const filteredParams = Object.fromEntries(
		Object.entries(params).filter(
			([, value]) => value !== undefined && value !== null,
		),
	);
	if (Object.keys(filteredParams).length === 0) return url;
	const queryString = new URLSearchParams(
		filteredParams as Record<string, string>,
	).toString();
	return `${url}?${queryString}`;
}

// Create a separate function for getting server-side cookies that can be imported where needed
export function getServerCookies() {
	if (typeof window !== "undefined") return "";

	// Dynamic import next/headers only on server-side
	return import("next/headers").then(async ({ cookies }) => {
		try {
			const cookieStore = await cookies();
			return cookieStore
				.getAll()
				.map((c) => `${c.name}=${c.value}`)
				.join("; ");
		} catch (error) {
			console.error("Failed to access cookies:", error);
			return "";
		}
	});
}

async function fetchApi<T>(
	url: string,
	options: RequestOptions = {},
): Promise<T> {
	const {
		method = "GET",
		headers = {},
		body,
		cookie,
		params,
		cache = "no-store",
		next,
	} = options;

	// Get cookies from the request when running on server
	let cookieHeader = cookie;
	if (typeof window === "undefined" && !cookie) {
		cookieHeader = await getServerCookies();
	}

	const fullUrl = buildUrlWithParams(`${baseURL}${url}`, params);

	const response = await fetch(fullUrl, {
		method,
		headers: {
			"Content-Type": "application/json",
			Accept: "application/json",
			...headers,
			...(cookieHeader ? { Cookie: cookieHeader } : {}),
		},
		body: body ? JSON.stringify(body) : undefined,
		credentials: "include",
		cache,
		next,
	});

	if (!response.ok) {
		const message = (await response.json()).message || response.statusText;
		if (typeof window !== "undefined") {
			notifications.show({
				id: "fetchApi-error",
				autoClose: 2000,
				color: "red",
				icon: <IconX size="1rem" />,
				message: "APIの実行に失敗しました。",
				title: "エラー",
			});
		}
		throw new Error(message);
	}

	return response.json();
}

export const api = {
	get: <T,>(url: string, options?: RequestOptions): Promise<T> => {
		return fetchApi<T>(url, { ...options, method: "GET" });
	},
	post: <T,>(
		url: string,
		body?: unknown,
		options?: RequestOptions,
	): Promise<T> => {
		return fetchApi<T>(url, { ...options, method: "POST", body });
	},
	put: <T,>(
		url: string,
		body?: unknown,
		options?: RequestOptions,
	): Promise<T> => {
		return fetchApi<T>(url, { ...options, method: "PUT", body });
	},
	patch: <T,>(
		url: string,
		body?: unknown,
		options?: RequestOptions,
	): Promise<T> => {
		return fetchApi<T>(url, { ...options, method: "PATCH", body });
	},
	delete: <T,>(url: string, options?: RequestOptions): Promise<T> => {
		return fetchApi<T>(url, { ...options, method: "DELETE" });
	},
};
