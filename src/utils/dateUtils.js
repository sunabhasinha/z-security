// src/utils/dateUtils.js

/**
 * Converts a date string from 'YYYY-MM-DD HH:MM:SS' to 'DD-MM-YYYY'
 * @param {string} dateString - The input date string (e.g., '2025-04-11 16:30:02')
 * @returns {string} - The formatted date string (e.g., '11-04-2025')
 * @throws {Error} - If the input date string is invalid
 */
export function formatDate(dateString) {
	if (!dateString || typeof dateString !== 'string') {
		throw new Error('Invalid date string: Input must be a non-empty string');
	}

	// Regular expression to validate the expected format (YYYY-MM-DD HH:MM:SS)
	const dateRegex = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/;
	if (!dateRegex.test(dateString)) {
		throw new Error(
			'Invalid date format: Expected format is YYYY-MM-DD HH:MM:SS'
		);
	}

	// Split the date part from the time part
	const [datePart] = dateString.split(' ');
	const [year, month, day] = datePart.split('-');

	// Validate that the components are numeric and reasonable
	const yearNum = parseInt(year, 10);
	const monthNum = parseInt(month, 10);
	const dayNum = parseInt(day, 10);

	if (
		isNaN(yearNum) ||
		isNaN(monthNum) ||
		isNaN(dayNum) ||
		monthNum < 1 ||
		monthNum > 12 ||
		dayNum < 1 ||
		dayNum > 31
	) {
		throw new Error('Invalid date components');
	}

	// Create a Date object to validate the date
	const date = new Date(`${year}-${month}-${day}`);
	if (
		date.getFullYear() !== yearNum ||
		date.getMonth() + 1 !== monthNum ||
		date.getDate() !== dayNum
	) {
		throw new Error('Invalid date: Date does not exist');
	}

	// Format to DD-MM-YYYY with leading zeros
	return `${day.padStart(2, '0')}-${month.padStart(2, '0')}-${year}`;
}

export function getFormattedTime(datetimeStr) {
	try {
		// Parse the datetime string
		const date = new Date(datetimeStr);
		// Check if the date is valid
		if (isNaN(date)) return 'Invalid datetime format';
		// Format to 12-hour time with AM/PM, removing leading zero
		return date
			.toLocaleTimeString('en-US', {
				hour: 'numeric',
				minute: '2-digit',
				hour12: true,
			})
			.replace(/^0/, '');
	} catch {
		return 'Invalid datetime format';
	}
}

// Example usage
const datetimeStr = '2025-04-22 11:00:00';
