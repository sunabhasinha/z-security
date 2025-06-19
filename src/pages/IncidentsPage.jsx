import { DataTable } from '../components/custom/DataTable';
import { columns } from '../components/custom/incidentColumn';
import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router';
import { buildQueryParams } from '@/utils/common';
import { useAuth } from '../hooks/useAuth';
import { downloadBase64Csv } from '../utils/downloadCSV';
import {
	USER_DETAILS,
	INCIDENT_TABLE_DATA_API,
	INCIDENT_TABLE_GRAPH,
} from '@/utils/constants';
import IncidentTableGraph from '../components/charts/IncidetTableGraph';
import useApi from '@/hooks/useAPI';
import { useApiService } from '@/hooks/useApiService';
import { useLocalStorage } from '@/hooks/useLocalStorage';

export default function IncidentsPage() {
	const navigate = useNavigate();
	const [getUserInfo] = useLocalStorage(USER_DETAILS, null);
	const { data, execute } = useApi();
		const [tableData, setTableData] = useState([]);
		const apiService = useApiService();
		const [offset, setOffset] = useState(0);
		const [minLogId, setMinLogId] = useState(null);
		const [min_id, setMinId] = useState(null);
		const [canPreviousPage, setCanPreviousPage] = useState(false);
		const { getAuthToken, setAuthToken } = useAuth();
		const [timeRange, setTimeRange] = useState(null);
		const [canNextPage, setCanNextPage] = useState(true);
		const [totalPages, setTotalPages] = useState(0);
		const [currentPage, setCurrentPage] = useState(1);
		const [selectedFilters, setSelectedFilters] = useState([]);
		// const [isFetching, setIsFetching] = useState(false); // Track if API call is ongoing
		const [wildFilter, setWildFilter] = useState('');
		const limit = 10;
		const [chartData, setChartData] = useState([]);

		const { executeFetch: fetchExport } = useApi(
			'',
			{ responseType: 'json' },
			[]
		);
	
		// Store the last response safely
		const [lastResponse, setLastResponse] = useState(null);

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
					const fullUrl = `${INCIDENT_TABLE_DATA_API}${queryString}`;
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
						const query = buildQueryParams({
							orgId: organization?.id,
							zoom_minutes: '1',
							start_time: startTime,
							end_time: endTime,
						});
						const fullUrl = `${INCIDENT_TABLE_GRAPH}${query}`;
						return fullUrl;
					}, [organization?.id, startTime, endTime]);
		
			const { data: incidentsData, loading: isFetching } = useApi(tableEndpoint, {}, [
				tableEndpoint
			]);

			const { data: chartApiData } = useApi(graphEndpoint, {}, [
				graphEndpoint
			]);


	useEffect(() => {
		if (incidentsData?.data && incidentsData?.data.length > 0) {
			const normalized = Array.isArray(incidentsData.data)
				? incidentsData.data
				: [incidentsData.data];
			setTableData(normalized);
			setLastResponse(incidentsData);
			setCanNextPage(
				incidentsData.data?.length >= limit && incidentsData.metadata?.has_more
			);
			setCanPreviousPage(offset > 0);

			const total = incidentsData.metadata?.total || 0;
			setTotalPages(Math.ceil(total / limit) || 1);
			setCurrentPage(Math.floor(offset / limit) + 1);
		} else {
			setTableData([]);
			setCanNextPage(false);
			setCanPreviousPage(offset > 0);
			setTotalPages(1);
			setCurrentPage(1);
		}
		setLastResponse(incidentsData);
	}, [incidentsData]);

	useEffect(() => {
		if (chartApiData && chartApiData.length > 0) {
			const normalized = Array.isArray(chartApiData)
				? chartApiData
				: [chartApiData];
			setChartData(normalized);
			console.log('Chart data:', normalized);
		}
	}, [chartApiData]);

	const handleNextPage = () => {
		if (lastResponse?.metadata?.minimum_id) {
			setMinId(lastResponse.metadata.minimum_id);
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
		// console.log('Time range changed:', range);
		setStartTime(range.start);
		setEndTime(range.end);
		setOffset(0);
		setMinLogId(null);
		setTimeRange(range);
	};

	const handleExportCSV = async () => {
			const exportQuery = buildQueryParams({
				orgId: organization?.id,
				offset: offset.toString(),
				limit: limit.toString(),
				start_time: startTime,
				end_time: endTime,
				export_csv: '1',
			});
	
			const exportUrl = `${INCIDENT_TABLE_DATA_API}${exportQuery}`;
	
			try {
				const result = await fetchExport(exportUrl, { responseType: 'json' });
				if (result?.isBase64Encoded && result?.body) {
					downloadBase64Csv(result.body, 'incidents_table.csv');
				} else {
					// console.warn('Invalid CSV response format');
				}
			} catch (err) {
				console.error('CSV export failed:', err);
			}
		};

	const filterOptions = (lastResponse?.metadata?.allowed_filters || [])
		.filter((key) => key !== 'orgId')
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
				<IncidentTableGraph 
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
					navigate(`/incident/${rowData.id}`);
				}}
				onNextPage={handleNextPage}
				onPreviousPage={handlePreviousPage}
				canNextPage={canNextPage}
				canPreviousPage={canPreviousPage}
				totalPages={totalPages}
				currentPage={currentPage}
				onSearchChange={handleSearchChange}
				onFilterChange={handleFilterChange}
				downloadFileName="incidents_table.csv"
				limit={limit}
				onExportCSV={handleExportCSV}
			/>
		</div>
	);
}
