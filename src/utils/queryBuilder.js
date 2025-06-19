export function buildQueryParams(params = {}) {
	const searchParams = new URLSearchParams();

	Object.entries(params).forEach(([key, value]) => {
		if (value !== undefined && value !== null) {
			if (Array.isArray(value)) {
				value.forEach((item) => searchParams.append(key, item));
			} else {
				searchParams.append(key, value);
			}
		}
	});

	const queryString = searchParams.toString();
	return queryString ? `?${queryString}` : '';
}
