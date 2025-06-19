// src/hooks/useAuth.js
import { useLocalStorage } from './useLocalStorage';
import { ID_TOKEN_KEY } from '@/utils/constants';

export const useAuth = () => {
	const [getAuthToken, setAuthToken, removeAuthToken] = useLocalStorage(
		ID_TOKEN_KEY,
		null
	);
	return { getAuthToken, setAuthToken, removeAuthToken };
};
