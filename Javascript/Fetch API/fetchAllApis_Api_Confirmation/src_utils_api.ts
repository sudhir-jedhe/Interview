export async function fetchAllApis(apis: string[]) {
    try {
        const promises = apis.map(api => fetchWithTimeout(api));
        const results = await Promise.allSettled(promises);

        const data = await Promise.all(
            results
                .filter((result): result is PromiseFulfilledResult<Response> => result.status === 'fulfilled')
                .map(result => result.value.json())
        );

        const errors = results
            .filter((result): result is PromiseRejectedResult => result.status === 'rejected')
            .map(result => result.reason);

        return { data, errors };
    } catch (error) {
        console.error("Unexpected error:", error);
        throw error;
    }
}

async function fetchWithTimeout(url: string, options: RequestInit = {}, timeout = 5000): Promise<Response> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
        const response = await fetch(url, { ...options, signal: controller.signal });
        clearTimeout(timeoutId);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response;
    } catch (error) {
        if (error instanceof Error) {
            if (error.name === 'AbortError') {
                throw new Error(`Request timed out for ${url}`);
            }
        }
        throw error;
    }
}

