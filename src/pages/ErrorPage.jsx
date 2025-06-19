import React from 'react';
import { useLocation, useNavigate } from 'react-router';
import { Button } from '@/components/ui/button';
import {
	ID_TOKEN_KEY,
	REFRESH_TOKEN_KEY,
	ACCESS_TOKEN_KEY,
	MENU_CACHE_KEY,
} from '@/utils/constants';
import { useLocalStorage } from '@/hooks/useLocalStorage';

const ErrorPage = ({
	defaultMessage = 'An error occurred. Please try again.',
}) => {
	const { state } = useLocation();
	const navigate = useNavigate();
	const message = state?.message || defaultMessage;

	const [, , removeAccessToken] = useLocalStorage(ACCESS_TOKEN_KEY, null);
	const [, , removeIdToken] = useLocalStorage(ID_TOKEN_KEY, null);
	const [, , removeRefreshToken] = useLocalStorage(REFRESH_TOKEN_KEY, null);
	const [, , removeMenuCache] = useLocalStorage(MENU_CACHE_KEY, null);

	const handleRedirect = () => {
		removeMenuCache();
		removeIdToken();
		removeRefreshToken();
		removeAccessToken();
		navigate('/login');
	};

	return (
		<div className="flex flex-col items-center justify-center h-screen bg-gray-100">
			<div className="bg-white p-8 rounded-lg shadow-md text-center">
				<h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
				<p className="text-gray-700 mb-6">{message}</p>
				<Button
					onClick={handleRedirect}
					className="bg-[#4A90E2] text-white hover:bg-[#357ABD]"
				>
					Go to Login
				</Button>
			</div>
		</div>
	);
};

export default ErrorPage;
