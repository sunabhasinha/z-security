import { formatTimestamp } from '@/utils/formatDisplayTime';

// Helper function to render severity level with appropriate styling
const getSeverityBadge = (severityLevel) => {
	const colorMap = {
		LOW: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
		MEDIUM:
			'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
		HIGH: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
		CRITICAL:
			'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
	};

	return (
		<span
			className={`px-2 py-1 rounded-md text-xs font-medium ${
				colorMap[severityLevel] ||
				'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
			}`}
		>
			{severityLevel}
		</span>
	);
};


// Define the columns for the alert data table, mapping all alertData keys
export const columns = [
	// {
	// 	id: 'select',
	// 	header: ({ table }) => (
	// 		<Checkbox
	// 			checked={
	// 				table.getIsAllPageRowsSelected() ||
	// 				(table.getIsSomePageRowsSelected() && 'indeterminate')
	// 			}
	// 			onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
	// 			aria-label="Select all"
	// 		/>
	// 	),
	// 	cell: ({ row }) => (
	// 		<Checkbox
	// 			checked={row.getIsSelected()}
	// 			onCheckedChange={(value) => row.toggleSelected(!!value)}
	// 			aria-label="Select row"
	// 		/>
	// 	),
	// 	enableSorting: false,
	// 	enableHiding: false,
	// },
	// {
	// 	accessorKey: 'id',
	// 	header: 'ID',
	// 	cell: ({ row }) => <div>{row.getValue('id')}</div>,
	// },
	{
		accessorKey: 'timestamp',
		header: 'TIME STAMP',
		cell: ({ row }) => {
			const value = row.getValue('timestamp');
			try {
				return value ? formatTimestamp(value) : '-';
			} catch (error) {
				console.error('Error formatting timestamp:', error);
				return value || '-';
			}
		},
	},
	{
		accessorKey: 'incidentId',
		header: 'INCIDENT ID',
		cell: ({ row }) => <div>{row.getValue('incidentId')}</div>,
	},
	{
		accessorKey: 'title',
		header: 'TITLE',
		cell: ({ row }) => <div>{row.getValue('title')}</div>,
	},
	{
		accessorKey: 'severity',
		header: 'SEVERITY',
		cell: ({ row }) => <div>{row.getValue('severity')}</div>,
	},
	{
		accessorKey: 'eventCount',
		header: 'Involved Assets#',
		cell: ({ row }) => <div>{row.getValue('eventCount')}</div>,
	},
	{
		accessorKey: '',
		header: 'STATUS',
		cell: ({ row }) => <div>OPEN</div>,
	},
	// {
	// 	accessorKey: 'incident_guid',
	// 	header: 'Incident GUID',
	// 	cell: ({ row }) => <div>{row.getValue('incident_guid')}</div>,
	// },
	// {
	// 	accessorKey: 'orgId',
	// 	header: 'Organization ID',
	// 	cell: ({ row }) => <div>{row.getValue('orgId')}</div>,
	// },
	// {
	// 	accessorKey: 'start_time',
	// 	header: 'Start Time',
	// 	cell: ({ getValue }) => {
	// 		const value = getValue();
	// 		try {
	// 			return value ? formatDate(value) : '-';
	// 		} catch (error) {
	// 			console.error('Error formatting start_time:', error);
	// 			return value || '-';
	// 		}
	// 	},
	// },
	// {
	// 	accessorKey: 'end_time',
	// 	header: 'End Time',
	// 	cell: ({ getValue }) => {
	// 		const value = getValue();
	// 		try {
	// 			return value ? formatDate(value) : '-';
	// 		} catch (error) {
	// 			console.error('Error formatting end_time:', error);
	// 			return value || '-';
	// 		}
	// 	},
	// },
	// {
	// 	accessorKey: 'severity_score',
	// 	header: 'Severity Score',
	// 	cell: ({ row }) => <div>{row.getValue('severity_score').toFixed(2)}</div>,
	// },
	// {
	// 	accessorKey: 'severity_level',
	// 	header: 'Severity Level',
	// 	cell: ({ row }) => getSeverityBadge(row.getValue('severity_level')),
	// },
	// {
	// 	accessorKey: 'severity_color',
	// 	header: 'Severity Color',
	// 	cell: ({ row }) => (
	// 		<div
	// 			className="w-6 h-6 rounded"
	// 			style={{ backgroundColor: row.getValue('severity_color') }}
	// 		></div>
	// 	),
	// },
	// {
	// 	accessorKey: 'event_count',
	// 	header: 'Event Count',
	// 	cell: ({ row }) => <div>{row.getValue('event_count')}</div>,
	// },
	// {
	// 	accessorKey: 'unique_ips',
	// 	header: 'Unique IPs',
	// 	cell: ({ row }) => (
	// 		<div className="text-blue-600 dark:text-blue-400">
	// 			{row.getValue('unique_ips')}
	// 		</div>
	// 	),
	// },
	// {
	// 	accessorKey: 'unique_macs',
	// 	header: 'Unique MACs',
	// 	cell: ({ row }) => (
	// 		<div className="text-blue-600 dark:text-blue-400">
	// 			{row.getValue('unique_macs')}
	// 		</div>
	// 	),
	// },
	// {
	// 	accessorKey: 'protocols',
	// 	header: 'Protocols',
	// 	cell: ({ row }) => <div>{row.getValue('protocols').join(', ') || '-'}</div>,
	// },
	// {
	// 	accessorKey: 'contributing_factors',
	// 	header: 'Contributing Factors',
	// 	cell: ({ row }) => (
	// 		<div>
	// 			{row.getValue('contributing_factors').length
	// 				? row.getValue('contributing_factors').join('; ')
	// 				: '-'}
	// 		</div>
	// 	),
	// },
	// {
	// 	accessorKey: 'created_at',
	// 	header: 'Created At',
	// 	cell: ({ getValue }) => {
	// 		const value = getValue();
	// 		try {
	// 			return value ? formatDate(value) : '-';
	// 		} catch (error) {
	// 			console.error('Error formatting created_at:', error);
	// 			return value || '-';
	// 		}
	// 	},
	// }
];
