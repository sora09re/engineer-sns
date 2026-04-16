export const fetcher = async (url: string) => {
	const response = await fetch(url);
	if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
	return response.json();
};

export const api = {
	post: async <T = unknown>(url: string, body?: unknown): Promise<T> => {
		const response = await fetch(url, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: body ? JSON.stringify(body) : undefined,
		});
		if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
		return response.json();
	},

	delete: async <T = unknown>(url: string, params?: Record<string, string>): Promise<T> => {
		const fullUrl = params ? `${url}?${new URLSearchParams(params).toString()}` : url;
		const response = await fetch(fullUrl, { method: "DELETE" });
		if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
		return response.json();
	},
};
