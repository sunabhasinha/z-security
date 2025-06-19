import { cn } from '@/lib/utils';
import React from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useNavigate } from 'react-router';
import { useAuth } from '../hooks/useAuth';
import { useLocalStorage } from '../hooks/useLocalStorage';
import {
	CognitoUserPool,
	CognitoUser,
	AuthenticationDetails,
} from 'amazon-cognito-identity-js';

// Configure Cognito User Pool
const poolData = {
	UserPoolId: 'ap-south-1_VTVPbWLiK', // Replace with your Cognito User Pool ID, e.g., 'us-east-1_aB12cDe34'
	ClientId: '5icfk2ov2h2iahpklqc749fkjb', // Replace with your Cognito App Client ID, e.g., '5icfk2ov2h2iahpklqc749fkjb'
};
const userPool = new CognitoUserPool(poolData);

const LoginForm = () => {
	const navigate = useNavigate();
	const { setAuthToken } = useAuth();
	const [getRefreshToken, setRefreshToken] = useLocalStorage(
		'refreshToken',
		null
	);
	const [getAccessToken, setAccessToken] = useLocalStorage('accessToken', null);
	const [isLoading, setIsLoading] = React.useState(false);
	const [username, setUsername] = React.useState('');
	const [password, setPassword] = React.useState('');
	const [error, setError] = React.useState(null);

	async function onSubmit(event) {
		event.preventDefault();
		setIsLoading(true);
		setError(null);

		// Configure Cognito User and Authentication Details
		const authenticationData = {
			Username: username,
			Password: password,
		};
		const authenticationDetails = new AuthenticationDetails(authenticationData);

		const userData = {
			Username: username,
			Pool: userPool,
		};
		const cognitoUser = new CognitoUser(userData);

		try {
			// Authenticate with Cognito using SRP
			const result = await new Promise((resolve, reject) => {
				cognitoUser.authenticateUser(authenticationDetails, {
					onSuccess: (result) => resolve(result),
					onFailure: (err) =>
						reject(new Error(err.message || 'Authentication failed')),
				});
			});

			// Store tokens
			const idToken = result.getIdToken().getJwtToken();
			const accessToken = result.getAccessToken().getJwtToken();
			const refreshToken = result.getRefreshToken().getToken();

			setAuthToken(idToken); // Sets idToken for API calls
			setAccessToken(accessToken);
			setRefreshToken(refreshToken);

			// Navigate to home page
			navigate('/');
		} catch (error) {
			setError(error.message);
			navigate('/error', {
				state: { message: error.message || 'Authentication failed' },
			});
		} finally {
			setIsLoading(false);
		}
	}

	return (
		<div className="flex items-center justify-center min-h-screen bg-gray-50">
			<div className="w-full max-w-[460px] m-auto rounded-lg border border-purple-100 p-8">
				<form onSubmit={onSubmit} className="space-y-6">
					<div className="space-y-2">
						<Label htmlFor="username" className="text-base text-gray-700">
							Username
						</Label>
						<Input
							id="username"
							placeholder="Enter your username"
							type="text"
							autoCapitalize="none"
							autoComplete="username"
							autoCorrect="off"
							disabled={isLoading}
							value={username}
							onChange={(e) => setUsername(e.target.value)}
							required
							className="h-12 rounded-md border-gray-200 text-base placeholder:text-gray-400"
						/>
					</div>
					<div className="space-y-2">
						<Label htmlFor="password" className="text-base text-gray-700">
							Password
						</Label>
						<Input
							id="password"
							placeholder="Enter your password"
							type="password"
							autoComplete="current-password"
							disabled={isLoading}
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							required
							className="h-12 rounded-md border-gray-200 text-base placeholder:text-gray-400"
						/>
					</div>
					<div className="flex items-center space-x-2">
						<Checkbox id="human" className="h-5 w-5 rounded border-gray-300" />
						<Label
							htmlFor="human"
							className="text-base font-normal leading-none text-gray-700"
						>
							Are you a human?
						</Label>
					</div>
					{error && <div className="text-red-500 text-sm">{error}</div>}
					<Button
						type="submit"
						disabled={isLoading}
						className="h-12 w-full rounded-md bg-[#4A90E2] text-base font-medium hover:bg-[#357ABD]"
					>
						{isLoading ? 'Loading...' : 'Login'}
					</Button>
				</form>
			</div>
		</div>
	);
};

export default LoginForm;
