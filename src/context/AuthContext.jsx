// // src/context/AuthContext.js
// import React, { createContext, useState, useEffect } from 'react';
// import axios from 'axios';

// export const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
// 	const [authToken, setAuthToken] = useState(null);
// 	const [isLoading, setIsLoading] = useState(true); // Track initial loading state

// 	const COGNITO_DOMAIN = 'https://cognito-idp.ap-south-1.amazonaws.com/';
// 	const CLIENT_ID = '5icfk2ov2h2iahpklqc749fkjb';
// 	const AUTH_FLOW = 'REFRESH_TOKEN_AUTH';

// 	const refreshAuthToken = async () => {
// 		const refreshToken = localStorage.getItem('refreshToken');
// 		if (!refreshToken) {
// 			setIsLoading(false);
// 			return null;
// 		}

// 		try {
// 			const response = await axios.post(
// 				`${COGNITO_DOMAIN}`,
// 				{
// 					ClientId: CLIENT_ID,
// 					AuthFlow: AUTH_FLOW,
// 					AuthParameters: { REFRESH_TOKEN: refreshToken },
// 				},
// 				{
// 					headers: {
// 						'Content-Type': 'application/x-amz-json-1.1',
// 						'X-Amz-Target': 'AWSCognitoIdentityProviderService.InitiateAuth',
// 					},
// 					// withCredentials: true, /** this will lead to CORS error, use this when trying to implement http only cookie */
// 				}
// 			);

// 			const { id_token, refresh_token: newRefreshToken } =
// 				response.data.AuthenticationResult || response.data;
// 			setAuthToken(id_token);
// 			if (newRefreshToken)
// 				localStorage.setItem('refreshToken', newRefreshToken);
// 			return id_token;
// 		} catch (error) {
// 			console.error(
// 				'Initial token refresh failed:',
// 				error.response?.data || error.message
// 			);
// 			localStorage.removeItem('refreshToken'); // Clear invalid refresh token
// 			return null;
// 		} finally {
// 			setIsLoading(false);
// 		}
// 	};

// 	useEffect(() => {
// 		refreshAuthToken(); // Attempt to restore authToken on mount
// 	}, []);

// 	return (
// 		<AuthContext.Provider value={{ authToken, setAuthToken, isLoading }}>
// 			{children}
// 		</AuthContext.Provider>
// 	);
// };
