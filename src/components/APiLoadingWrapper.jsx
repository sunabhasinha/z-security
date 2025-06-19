// src/components/ApiLoadingWrapper.js
import React from 'react';
import Loader from './Loader';

const ApiLoadingWrapper = ({ loading, children }) => {
	return (
		<div className="relative min-h-screen">
			{loading && <Loader />}
			<div className={loading ? 'opacity-50 pointer-events-none' : ''}>
				{children}
			</div>
		</div>
	);
};

export default ApiLoadingWrapper;
