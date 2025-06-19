// src/pages/AlertsPage.jsx
import { DataTable } from '../components/custom/DataTable';
import { columns } from '../components/custom/alertsColumn';
import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router';
import { buildQueryParams } from '@/utils/common';
import AlertTableGraph from '../components/charts/AlertTableGraph';
import useApi from '../hooks/useAPI';
import { downloadBase64Csv } from '../utils/downloadCSV';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import {
	USER_DETAILS,
	ALERT_TABLE_DATA_API,
	ALERT_TABLE_GRAPH,
} from '@/utils/constants';

export default function AlertsPage() {
	const navigate = useNavigate();
	const [getUserInfo] = useLocalStorage(USER_DETAILS, null);

	const [offset, setOffset] = useState(0);
	const [minLogId, setMinLogId] = useState(null);
	const [canPreviousPage, setCanPreviousPage] = useState(false);
	const [canNextPage, setCanNextPage] = useState(true);
	const [totalPages, setTotalPages] = useState(0);
	const [currentPage, setCurrentPage] = useState(1);
	const [selectedFilters, setSelectedFilters] = useState([]);
	const [wildFilter, setWildFilter] = useState('');
	const [lastResponse, setLastResponse] = useState(null);
	const [timeRange, setTimeRange] = useState(null);
	const [chartData, setChartData] = useState([]);
	const [tableData, setTableData] = useState([]);

	const limit = 10;

	const { startTimeInit, endTimeInit } = useMemo(() => {
		const now = new Date();
		const utcOffsetMs = 5.5 * 60 * 60 * 1000;
		const endTime = new Date(now.getTime() - utcOffsetMs)
			.toISOString()
			.slice(0, 19);
		const startTime = new Date(
			now.getTime() - (24 * 60 * 60 * 1000 + utcOffsetMs)
		)
			.toISOString()
			.slice(0, 19);
		return { startTimeInit: startTime, endTimeInit: endTime };
	}, []);

	const [startTime, setStartTime] = useState(startTimeInit);
	const [endTime, setEndTime] = useState(endTimeInit);

	const { organization } = getUserInfo() || {};
	const memoizedFilterKey = useMemo(
		() => JSON.stringify(selectedFilters),
		[selectedFilters]
	);

	// Memoized table endpoint with all dynamic query params
	const tableEndpoint = useMemo(() => {
		const queryMap = {
			orgId: organization?.id,
			offset: offset.toString(),
			limit: limit.toString(),
			start_time: startTime,
			end_time: endTime,
		};

		if (minLogId !== null) queryMap.min_log_id = minLogId.toString();
		if (wildFilter) queryMap.wild_filter = wildFilter;
		selectedFilters.forEach(({ key, value }) => {
			queryMap[`${key}__like`] = value;
		});

		const queryString = buildQueryParams(queryMap);
		console.log('Query String:', queryString);
		const fullUrl = `${ALERT_TABLE_DATA_API}${queryString}`;
		console.log('Table API:', fullUrl);
		return fullUrl;
	}, [
		organization?.id,
		offset,
		limit,
		startTime,
		endTime,
		minLogId,
		wildFilter,
		memoizedFilterKey,
		JSON.stringify(selectedFilters),
	]);

	const graphEndpoint = useMemo(() => {
		console.log('Start time: in alerts ', startTime);
		console.log('End time: in alerts', endTime);
		const query = buildQueryParams({
			org_id: organization?.id,
			zoom_minutes: '1',
			start_time: startTime,
			end_time: endTime,
		});
		const fullUrl = `${ALERT_TABLE_GRAPH}${query}`;
		console.log('Graph API:', fullUrl);
		return fullUrl;
	}, [organization?.id, startTime, endTime]);

	// Fetch table data
	const { data: alertsData, loading: isFetching } = useApi(tableEndpoint, {}, [
		tableEndpoint,
	]);

	// Fetch chart data
	const { data: chartApiData } = useApi(graphEndpoint, {}, [graphEndpoint]);

	useEffect(() => {
		if (alertsData?.data && alertsData?.data.length > 0) {
			const normalized = Array.isArray(alertsData.data)
				? alertsData.data
				: [alertsData.data];
			setTableData(normalized);
			setCanNextPage(
				alertsData.data?.length >= limit && alertsData.metadata?.has_more
			);
			setCanPreviousPage(offset > 0);
			const total = alertsData.metadata?.total || 0;
			setTotalPages(Math.ceil(total / limit) || 1);
			setCurrentPage(Math.floor(offset / limit) + 1);
		} else {
			// ✅ explicitly clear data if no results
			setTableData([]);
			setCanNextPage(false);
			setCanPreviousPage(offset > 0);
			setTotalPages(1);
			setCurrentPage(1);
		}
		setLastResponse(alertsData); // optional: move outside if needed always
	}, [alertsData]);

	useEffect(() => {
		if (chartApiData && chartApiData.length > 0) {
			const normalized = Array.isArray(chartApiData)
				? chartApiData
				: [chartApiData];
			setChartData(normalized);
		}
	}, [chartApiData]);

	const handleNextPage = () => {
		if (lastResponse?.metadata?.minimum_id) {
			setMinLogId(lastResponse.metadata.minimum_id);
			setOffset((prev) => prev + limit);
		}
	};

	const handlePreviousPage = () => {
		if (offset > 0) {
			setOffset((prev) => prev - limit);
		}
	};

	const handleFilterChange = (filters) => {
		setSelectedFilters(filters);
		setOffset(0);
		setMinLogId(null);
	};

	const handleSearchChange = (value) => {
		setWildFilter(value);
		setOffset(0);
		setMinLogId(null);
	};

	const handleTimeRangeChange = (range) => {
		console.log('Time range changed:', range);
		setStartTime(range.start);
		setEndTime(range.end);
		setOffset(0);
		setMinLogId(null);
		setTimeRange(range);
	};

	const { executeFetch: fetchExport } = useApi(
		'',
		{ responseType: 'json' },
		[]
	);

	const handleExportCSV = async () => {
		const exportQuery = buildQueryParams({
			orgId: organization?.id,
			offset: offset.toString(),
			limit: limit.toString(),
			start_time: startTime,
			end_time: endTime,
			export_csv: '1',
		});

		const exportUrl = `/ui_get_alerts${exportQuery}`;

		try {
			const result = await fetchExport(exportUrl, { responseType: 'json' });
			if (result?.isBase64Encoded && result?.body) {
				downloadBase64Csv(result.body, 'alerts_table.csv');
			} else {
				console.warn('Invalid CSV response format');
			}
		} catch (err) {
			console.error('CSV export failed:', err);
		}
	};

	const filterOptions = (lastResponse?.metadata?.allowed_filters || [])
		.filter((key) => key !== 'org_id')
		.map((key) => ({
			key,
			label: key
				.split('_')
				.map((w) => w[0].toUpperCase() + w.slice(1))
				.join(' '),
		}));

	return (
		<div className="flex flex-col h-full">
			<div className="mb-8">
				<AlertTableGraph
					chartData={chartData}
					onTimeRangeChange={handleTimeRangeChange}
				/>
			</div>
			<DataTable
				data={tableData}
				columns={columns}
				filterOptions={filterOptions}
				onRowClick={(cell) => {
					const rowData = cell.getContext().row.original;
					navigate(`/alerts/${rowData.id}`);
				}}
				onNextPage={handleNextPage}
				onPreviousPage={handlePreviousPage}
				canNextPage={canNextPage}
				canPreviousPage={canPreviousPage}
				totalPages={totalPages}
				currentPage={currentPage}
				onFilterChange={handleFilterChange}
				onSearchChange={handleSearchChange}
				downloadFileName="alerts_table.csv"
				onExportCSV={handleExportCSV}
				limit={limit}
			/>
		</div>
	);
}
