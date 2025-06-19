// src/context/ApiStateContext.js
import React, { createContext, useState } from 'react';

export const ApiStateContext = createContext();

export const ApiStateProvider = ({ children }) => {
	const [loadingCount, setLoadingCount] = useState(0);
	const [error, setError] = useState(null);

	const startLoading = () => setLoadingCount((prev) => prev + 1);
	const stopLoading = () => setLoadingCount((prev) => Math.max(prev - 1, 0));
	const setApiError = (err) => setError(err);
	const clearApiError = () => setError(null);

	const isLoading = loadingCount > 0;

	return (
		<ApiStateContext.Provider
			value={{
				startLoading,
				stopLoading,
				isLoading,
				setApiError,
				clearApiError,
				error,
			}}
		>
			{children}
		</ApiStateContext.Provider>
	);
};
