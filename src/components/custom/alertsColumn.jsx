import { formatTimestamp } from '@/utils/formatDisplayTime';

// Helper function to render threat status with appropriate styling
const getThreatStatusBadge = (threatStatus) => {
	const colorMap = {
		'Small packet flood detected':
			'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
		'suspicious':
			'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
	};

	return (
		<span
			className={`px-2 py-1 rounded-md text-xs font-medium ${
				colorMap[threatStatus] ||
				'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
			}`}
		>
			{threatStatus}
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
	{
		accessorKey: 'ingestionTime',
		header: 'Timestamp',
		cell: ({ row }) => {
					const value = row.getValue('ingestionTime');
					try {
						return value ? formatTimestamp(value) : '-';
					} catch (error) {
						console.error('Error formatting timestamp:', error);
						return value || '-';
					}
				}
	},
	{
		accessorKey: 'alertType',
		header: 'Alert Type',
		cell: ({ row }) => <div>{row.getValue('alertType')}</div>,
	},
	{
		accessorKey: 'id',
		header: 'Alert ID',
		cell: ({ row }) => <div>{row.getValue('id')}</div>,
	},

	// {
	// 	accessorKey: 'severity',
	// 	header: 'Severity',
	// 	cell: ({ row }) => (
	// 		<div className="text-blue-600 dark:text-blue-400">
	// 			{row.getValue('ip_src')}
	// 		</div>
	// 	),
	// 	filterFn: (row, id, value) => {
	// 		return value.includes(row.getValue(id));
	// 	},
	// },
	{
		accessorKey: 'severity',
		header: 'Severity',
		cell: ({ row }) => <div>{row.getValue('severity')}</div>,
	},
	{
		accessorKey: 'impactedAssets',
		header: 'Impacted Assets',
		cell: ({ row }) => getThreatStatusBadge(row.getValue('impactedAssets')),
	},

	// {
	// 	accessorKey: 'ip_proto',
	// 	header: 'IP Protocol',
	// 	cell: ({ row }) => <div>{row.getValue('ip_proto')}</div>,
	// },
	// {
	// 	accessorKey: 'detection_level',
	// 	header: 'Detection Level',
	// 	cell: ({ row }) => <div>{row.getValue('detection_level')}</div>,
	// },
];
