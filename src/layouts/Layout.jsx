// src/layouts/Layout.jsx
import React, { useEffect } from 'react';
import { Outlet } from 'react-router';
import { AppSidebar } from '@/components/app-sidebar';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import Header from '@/components/Header';
import ApiLoadingWrapper from '@/components/APiLoadingWrapper';
import { useNavigate } from 'react-router';
import { useApiState } from '@/hooks/useApiState';
import { useAuth } from '@/hooks/useAuth';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { USER_INFO_API, USER_DETAILS } from '@/utils/constants';
import { buildQueryParams } from '@/utils/common';
import useApi from '@/hooks/useAPI';
import { useToast } from '../hooks/use-toast';
import { Toaster } from '@/components/ui/toaster';

const Layout = () => {
	const { error, isLoading, clearApiError } = useApiState();
	const { getAuthToken } = useAuth();
	const [getUserInfo, setUserInfo] = useLocalStorage(USER_DETAILS, null);
	const navigate = useNavigate();
	const { toast } = useToast();

	const token = getAuthToken();
	const localUserInfo = getUserInfo();
	const email = localUserInfo?.email || 'zspectuidev@gmail.com';
	const queryParams = buildQueryParams({ email });
	const userInfoUrl = token ? `${USER_INFO_API}${queryParams}` : null;

	const { data: userData, error: userError } = useApi(userInfoUrl, {}, [
		userInfoUrl,
	]);

	useEffect(() => {
		if (userData) {
			setUserInfo(userData);
		}
	}, [userData, setUserInfo]);

	useEffect(() => {
		if (!token) {
			navigate('/login');
		}
	}, [token, navigate]);

	// ✅ Handle all global API errors here
	useEffect(() => {
		const showError = userError || error;

		if (showError) {
			const status = showError?.response?.status;

			if (
				status === 401 || 
				showError?.message?.toLowerCase().includes('token')
			) {
				console.log('Token expired or invalid:', showError);
				navigate('/error', {
					state: {
						message:
							userError?.response?.data?.message ||
							userError?.message ||
							error?.response?.data?.message ||
							error?.message,
					},
				});
			} else {
				console.log('API Error:', showError.response?.data);
				const message =
					showError?.response?.data?.message ||
					showError?.message ||
					'Something went wrong. Please try again.';

				toast({
					title: 'API Error',
					description: message,
					variant: 'destructive',
				});
			}

			clearApiError(); // ✅ Reset error after handling
		}
	}, [userError, error, navigate, clearApiError]);

	return (
		<SidebarProvider>
			<AppSidebar />
			<SidebarInset>
				<Header />
				<main className="flex-1 overflow-auto p-4">
					<ApiLoadingWrapper loading={isLoading}>
						<Outlet />
					</ApiLoadingWrapper>
				</main>
			</SidebarInset>
			<Toaster toastOptions={{ position: 'top-right' }} />{' '}
			{/* ✅ Needed for toast to work */}
		</SidebarProvider>
	);
};

export default Layout;
