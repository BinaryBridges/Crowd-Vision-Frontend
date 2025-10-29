/**
 * Formats a Unix timestamp (milliseconds) to a readable date string
 * @param timestamp - Unix timestamp in milliseconds
 * @param format - 'short' (12 Dec 2025), 'long' (December 12, 2025), or 'datetime' (2025-10-04 8:48 PM)
 * @returns Formatted date string
 */
export function formatDate(
	timestamp: number,
	format: 'short' | 'long' | 'datetime' = 'datetime'
): string {
	const date = new Date(timestamp);

	if (isNaN(date.getTime())) {
		return '-';
	}

	if (format === 'datetime') {
		const year = date.getFullYear();
		const month = String(date.getMonth() + 1).padStart(2, '0');
		const day = String(date.getDate()).padStart(2, '0');

		let hours = date.getHours();
		const minutes = String(date.getMinutes()).padStart(2, '0');
		const ampm = hours >= 12 ? 'PM' : 'AM';
		hours = hours % 12;
		hours = hours ? hours : 12;

		return `${year}-${month}-${day} ${hours}:${minutes} ${ampm}`;
	}

	const day = date.getDate();
	const year = date.getFullYear();

	if (format === 'long') {
		const monthLong = date.toLocaleString('en-US', { month: 'long' });
		return `${monthLong} ${day}, ${year}`;
	}

	const monthShort = date.toLocaleString('en-US', { month: 'short' });
	return `${day} ${monthShort} ${year}`;
}

/**
 * Formats timestamp for display in tables as datetime
 * @param timestamp - Unix timestamp in milliseconds
 * @returns Formatted string like "2025-10-04 8:48 PM"
 */
export function formatTableDate(timestamp: number): string {
	return formatDate(timestamp, 'datetime');
}
