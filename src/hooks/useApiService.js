// src/services/apiService.js
import useApiClient from './useApiClient';

export const useApiService = () => {
	const { apiClient } = useApiClient();

	return {
		get: (url, config = {}) => apiClient.get(url, config),
		post: (url, data, config = {}) => apiClient.post(url, data, config),
		put: (url, data, config = {}) => apiClient.put(url, data, config),
		delete: (url, config = {}) => apiClient.delete(url, config),
	};
};
