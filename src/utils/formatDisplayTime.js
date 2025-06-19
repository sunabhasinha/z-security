export const formatTimestamp = (dateString) => {
    try {
        const date = new Date(dateString);

        // Ensure the date is valid
        if (isNaN(date.getTime())) {
            throw new Error('Invalid date');
        }

        // Format the date as "Dec 27, 2024 10:01:05 AM"
        return new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'short',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true,
        }).format(date);
    } catch (error) {
        console.error('Error formatting timestamp:', error);
        return dateString || '-';
    }
};