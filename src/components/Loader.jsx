// src/components/Loader.js
import React from 'react';

const Loader = () => {
	return (
		<div className="absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-50 z-10">
			<div className="w-16 h-16 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
		</div>
	);
};

export default Loader;
