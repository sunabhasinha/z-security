// src/hooks/useAPI.js
import { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import useApiClient from './useApiClient';
import { useApiState } from './useApiState';

// src/hooks/useAPI.js
const useApi = (initialUrl = '', options = {}, deps = []) => {
	const { apiClient } = useApiClient();
	const [data, setData] = useState(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const { startLoading, stopLoading, setApiError, clearApiError } =
		useApiState();

	const cancelTokenRef = useRef(null);
	const isMountedRef = useRef(false);

	const fetchData = useCallback(
		async (urlToFetch = initialUrl, manualOptions = options) => {
			if (!urlToFetch) return;
			console.log('[useAPI] Calling:', urlToFetch);

			startLoading();
			clearApiError();
			setLoading(true);
			setError(null);

			if (cancelTokenRef.current) {
				cancelTokenRef.current.cancel('Request canceled due to new fetch');
			}
			cancelTokenRef.current = axios.CancelToken.source();

			const {
				method = 'get',
				data: payload = null,
				headers = {},
				...rest
			} = manualOptions;

			try {
				const response = await apiClient.request({
					url: urlToFetch,
					method,
					data: payload,
					headers,
					cancelToken: cancelTokenRef.current.token,
					...rest,
				});

				if (isMountedRef.current) {
					setData(response?.data || response);
					return response?.data || response;
				}
			} catch (err) {
				if (!axios.isCancel(err)) {
					if (isMountedRef.current) {
						setError(err);
						setData(null);
					}
					setApiError(err);
				}
			} finally {
				stopLoading();
				if (isMountedRef.current) {
					setLoading(false);
				}
			}
		},
		[
			apiClient,
			initialUrl,
			options,
			startLoading,
			stopLoading,
			setApiError,
			clearApiError,
		]
	);

	useEffect(() => {
		isMountedRef.current = true;
		if (initialUrl) {
			fetchData(initialUrl); // ✅ always use latest initialUrl
		}

		return () => {
			isMountedRef.current = false;
			if (cancelTokenRef.current) {
				cancelTokenRef.current.cancel('Component unmounted');
			}
		};
	}, deps); // ✅ triggers on latest initialUrl

	return {
		data,
		loading,
		error,
		executeFetch: fetchData,
	};
};

export default useApi;
