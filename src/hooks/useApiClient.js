import { useMemo, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from './useAuth';
import { useLocalStorage } from './useLocalStorage';
import {
	COGNITO_URL,
	CLIENT_ID,
	AUTH_FLOW,
	BASE_URL,
	NO_REFRESH_TOKEN,
	REFRESH_TOKEN_KEY,
} from '@/utils/constants';

const useApiClient = () => {
	const { getAuthToken, setAuthToken } = useAuth();
	const [getRefreshToken, setRefreshToken] = useLocalStorage(
		REFRESH_TOKEN_KEY,
		null
	);

	const apiClient = useMemo(() => {
		return axios.create({
			baseURL: BASE_URL,
			timeout: 60000, // Increased to 1 minute (60 seconds)
		});
	}, []);

	const setTokens = useCallback(
		({ idToken, refreshToken: newRefreshToken }) => {
			if (idToken) setAuthToken(idToken);
			if (newRefreshToken) setRefreshToken(newRefreshToken);
		},
		[setAuthToken, setRefreshToken]
	);

	const refreshAuthToken = useCallback(async () => {
		const currentRefreshToken = getRefreshToken();
		if (!currentRefreshToken) throw new Error(NO_REFRESH_TOKEN);

		try {
			const response = await axios.post(
				`${COGNITO_URL}`,
				{
					ClientId: CLIENT_ID,
					AuthFlow: AUTH_FLOW,
					AuthParameters: { REFRESH_TOKEN: currentRefreshToken },
				},
				{
					headers: {
						'Content-Type': 'application/x-amz-json-1.1',
						'X-Amz-Target': 'AWSCognitoIdentityProviderService.InitiateAuth',
					},
				}
			);
			console.log('Token refresh response:', response);
			const { id_token, refresh_token: newRefreshToken } =
				response.data.AuthenticationResult || response.data;
			setTokens({
				idToken: id_token,
				refreshToken: newRefreshToken || currentRefreshToken,
			});
			return id_token;
		} catch (error) {
			console.error(
				'Token refresh failed:',
				error.response?.data || error.message
			);
			throw error; // Propagate error to caller
		}
	}, [setTokens, getRefreshToken]);

	apiClient.interceptors.request.use(
		(config) => {
			const token = getAuthToken();
			if (token) config.headers['Authorization'] = `Bearer ${token}`;
			config.headers['Content-Type'] = 'application/json';
			return config;
		},
		(error) => Promise.reject(error)
	);

	let isRefreshing = false;
	let failedQueue = [];

	const processQueue = (error, token = null) => {
		failedQueue.forEach((prom) =>
			error ? prom.reject(error) : prom.resolve(token)
		);
		failedQueue = [];
	};

	apiClient.interceptors.response.use(
		(response) => {
			console.log('Response:', response);
			return response;
		},
		async (error) => {
			const originalRequest = error?.config;
			if (error.response?.status === 401 && !originalRequest._retry) {
				if (isRefreshing) {
					return new Promise((resolve, reject) => {
						failedQueue.push({ resolve, reject });
					})
						.then((token) => {
							originalRequest.headers['Authorization'] = `Bearer ${token}`;
							return apiClient(originalRequest);
						})
						.catch((err) => {
							throw err; // Propagate refresh error
						});
				}

				originalRequest._retry = true;
				isRefreshing = true;
				try {
					const newToken = await refreshAuthToken();
					console.log('Refreshed token:', newToken);
					originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
					processQueue(null, newToken);
					return apiClient(originalRequest); // Retry original request
				} catch (refreshError) {
					console.log('Refresh error:', refreshError);
					processQueue(refreshError, null);
					throw refreshError; // Propagate refresh failure
				} finally {
					isRefreshing = false;
				}
			}
			throw error; // Propagate all other errors
		}
	);

	return { apiClient, refreshAuthToken };
};

export default useApiClient;
