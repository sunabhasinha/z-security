import { ApiStateContext } from '@/context/ApiStateContext';
import { useContext } from 'react';

export const useApiState = () => {
	const context = useContext(ApiStateContext);
	if (!context) {
		throw new Error('useApiState must be used within an ApiStateProvider');
	}
	return context;
};
