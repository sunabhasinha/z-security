import * as React from 'react';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarRail,
} from '@/components/ui/sidebar';
import { useApiService } from '@/hooks/useApiService';
import { useNavigate } from 'react-router';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import useApi from '@/hooks/useAPI';
import {
	MENU_CACHE_KEY,
	REFRESH_TOKEN_KEY,
	ID_TOKEN_KEY,
	COGNITO_URL,
	MENU_URL,
	AUTH_ERROR,
	ICON_BASE_PATH,
	USER_DETAILS,
} from '@/utils/constants';

const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

export function AppSidebar({ ...props }) {
	const navigate = useNavigate();
	const apiService = useApiService();

	const [getCachedData, setCachedData, removeCacheData] = useLocalStorage(
		MENU_CACHE_KEY,
		{ data: null, timestamp: null }
	);
	const [getAccessToken, setAccessToken, removeAccessToken] = useLocalStorage(
		'accessToken',
		null
	);
	const [getUserInfo] = useLocalStorage(USER_DETAILS, null);

	const cached = getCachedData();
	const shouldUseCache =
		cached.data && Date.now() - cached.timestamp < CACHE_DURATION;
	const menuUrl = shouldUseCache ? null : MENU_URL;

	const { data: freshMenuData } = useApi(menuUrl, {}, [menuUrl]);

	React.useEffect(() => {
		if (freshMenuData && !shouldUseCache) {
			setCachedData({ data: freshMenuData, timestamp: Date.now() });
		}
	}, [freshMenuData, shouldUseCache, setCachedData]);

	const data = shouldUseCache ? cached.data : freshMenuData;

	const labelToPath = (label) => {
		const routeOverrides = {
			Home: '/',
		};
		if (routeOverrides[label]) return routeOverrides[label];

		return (
			'/' +
			label
				.toLowerCase()
				.replace(/ & /g, '-')
				.replace(/\s+/g, '-')
				.replace(/[^\w-]/g, '')
		);
	};

	const menuItems = data
		? data.map((item) => ({
				...item,
				onClick: () => {
					if (!item.submenus.length) navigate(labelToPath(item.label));
				},
				submenus:
					item.submenus?.map((sub) => ({
						...sub,
						onClick: () => navigate(labelToPath(sub.label)),
					})) || [],
		  }))
		: [];

	const handleLogout = async () => {
		const payload = {
			AccessToken: getAccessToken(),
		};

		try {
			const response = await fetch(COGNITO_URL, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/x-amz-json-1.1',
					'X-Amz-Target': 'AWSCognitoIdentityProviderService.GlobalSignOut',
				},
				body: JSON.stringify(payload),
			});

			const data = await response.json();

			if (!response.ok) {
				throw new Error(data.message || AUTH_ERROR);
			}
			if (data) {
				removeAccessToken();
				removeCacheData();
				useLocalStorage(REFRESH_TOKEN_KEY)[2]();
				useLocalStorage(ID_TOKEN_KEY)[2]();
				navigate('/login');
			}
		} catch (error) {
			navigate('/error', {
				state: { message: error.response?.data?.message || error.message },
			});
		}
	};

	const userInfo = getUserInfo() || {};

	const USER_DATA = {
		name: userInfo?.role?.name || 'Admin',
		email: userInfo?.user?.email || 'zspectuidev@gmail.com',
		avatar: '/avatars/shadcn.jpg',
	};

	return (
		<Sidebar collapsible="icon" {...props}>
			<SidebarContent>{data && <NavMain items={menuItems} />}</SidebarContent>
			<SidebarFooter>
				<NavUser user={USER_DATA} onLogout={handleLogout} />
			</SidebarFooter>
			<SidebarRail />
		</Sidebar>
	);
}
