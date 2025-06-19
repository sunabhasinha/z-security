import React, { useEffect } from 'react';
import useApi from '@/hooks/useAPI';
import { useApiService } from '@/hooks/useApiService';
import { ALERT_DETAILS_API, USER_DETAILS } from '../utils/constants';
import { useParams } from 'react-router';
import { buildQueryParams } from '../utils/common';
import { useState } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';

function formatTimestamp(datetimeStr) {
	try {
		const date = new Date(datetimeStr);
		if (isNaN(date)) return 'Invalid datetime';
		return date
			.toLocaleString('en-US', {
				hour: 'numeric',
				minute: '2-digit',
				hour12: true,
				month: 'short',
				day: 'numeric',
				year: 'numeric',
			})
			.replace(/^0/, '');
	} catch {
		return 'Invalid datetime';
	}
}

// Component for a single data field
function DataField({ label, value }) {
	if (value === null || value === '' || value === undefined) {
		return null; // Skip empty or null fields
	}
	return (
		<div className="flex justify-between py-2 border-b border-gray-200">
			<span className="text-gray-600 font-medium">{label}:</span>
			<span className="text-gray-800">{value.toString()}</span>
		</div>
	);
}

// Component for a section card
function DataSection({ title, children }) {
	const hasChildren = React.Children.toArray(children).some(
		(child) => child !== null
	);
	if (!hasChildren) return null; // Skip empty sections
	return (
		<div className="bg-white rounded-lg shadow-md p-6">
			<h2 className="text-lg font-semibold text-gray-800 mb-4">{title}</h2>
			<div className="space-y-2">{children}</div>
		</div>
	);
}

// Copy to clipboard utility
function copyToClipboard(text) {
	navigator.clipboard
		.writeText(text)
		.then(() => {
			alert('Copied to clipboard!');
		})
		.catch((err) => {
			console.error('Failed to copy:', err);
		});
}

// Main Log Details component
export default function AlertPageDetails() {
	const { id: alertId } = useParams(); // Extract log_id from URL
	const [logData, setLogData] = useState(null);
	const [getUserInfo] = useLocalStorage(USER_DETAILS, null);
	const [noData, setNoData] = useState(null);

	const { organization } = getUserInfo() || {};

	const queryMap = {
		log_id: alertId,
		org_id: organization?.id,
	};

	const queryParams = buildQueryParams(queryMap);
	const alertDetailsEndpoint = `${ALERT_DETAILS_API}${queryParams}`;

	const { data: alertDetailsData, loading: isFetching } = useApi(
		alertDetailsEndpoint,
		{},
		[alertId]
	);

	useEffect(() => {
		console.log('Alert Details Data:', alertDetailsData);
		if (alertDetailsData?.data && alertDetailsData?.data.length > 0) {
			const normalized = Array.isArray(alertDetailsData.data)
				? alertDetailsData.data
				: [alertDetailsData.data];
			setLogData(normalized[0]);
		} else if (alertDetailsData?.message) {
			setLogData(null);
			setNoData(alertDetailsData.message);
		}
	}, [alertDetailsData]);

	if (noData) {
		return (
			<div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
				<div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-6 rounded shadow-md max-w-lg w-full text-center">
					<h2 className="text-xl font-semibold mb-2">No Data Available</h2>
					<p>{noData}</p>
				</div>
			</div>
		);
	}
	if (logData) {
		return (
			<div className="container mx-auto p-6 bg-gray-100 min-h-screen">
				<h1 className="text-2xl font-bold text-gray-800 mb-6">
					Alert Meta data
				</h1>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					{/* General Information */}
					<DataSection title="General Information">
						<div className="flex justify-between py-2 border-b border-gray-200">
							<span className="text-gray-600 font-medium">Log ID:</span>
							<div className="flex items-center space-x-2">
								<span className="text-gray-800">{logData.log_id}</span>
								<button
									onClick={() => copyToClipboard(logData.log_id)}
									className="text-blue-500 hover:text-blue-700 text-sm"
								>
									Copy
								</button>
							</div>
						</div>
						<DataField label="Sensor ID" value={logData.sensor_id} />
						<DataField label="Organization ID" value={logData.org_id} />
						<DataField
							label="Detection Level"
							value={logData.detection_level}
						/>
						<DataField
							label="Timestamp"
							value={formatTimestamp(logData.timestamp)}
						/>
						<DataField label="Threat Level" value={logData.threat_level} />
						<DataField label="Threat Status" value={logData.threat_status} />
						<DataField label="Direction" value={logData.direction} />
					</DataSection>

					{/* Ethernet Details */}
					<DataSection title="Ethernet Details">
						<DataField label="Destination MAC" value={logData.ethernet_dst} />
						<DataField label="Source MAC" value={logData.ethernet_src} />
						<DataField label="Ethernet Type" value={logData.ethernet_type} />
					</DataSection>

					{/* IP Details */}
					<DataSection title="IP Details">
						<DataField label="IP Version" value={logData.ip_version} />
						<DataField label="IP Header Length" value={logData.ip_ihl} />
						<DataField label="Type of Service" value={logData.ip_tos} />
						<DataField label="IP Length" value={logData.ip_len} />
						<DataField label="IP ID" value={logData.ip_id} />
						<DataField label="IP Flag Value" value={logData.ip_flag_value} />
						<DataField
							label="IP Flag Meaning"
							value={logData.ip_flag_meaning}
						/>
						<DataField label="IP Fragment Offset" value={logData.ip_frag} />
						<DataField label="Time to Live" value={logData.ip_ttl} />
						<DataField label="Protocol" value={logData.ip_proto} />
						<DataField label="Checksum" value={logData.ip_chksum} />
						<DataField label="Source IP" value={logData.ip_src} />
						<DataField label="Destination IP" value={logData.ip_dst} />
					</DataSection>

					{/* ICMP Details */}
					<DataSection title="ICMP Details">
						<DataField label="ICMP Type" value={logData.icmp_type} />
						<DataField label="ICMP Code" value={logData.icmp_code} />
						<DataField label="ICMP Checksum" value={logData.icmp_chksum} />
						<DataField label="ICMP ID" value={logData.icmp_id} />
						<DataField label="ICMP Sequence" value={logData.icmp_seq} />
						<DataField label="Original Timestamp" value={logData.icmp_ts_ori} />
						<DataField label="Receive Timestamp" value={logData.icmp_ts_rx} />
						<DataField label="Transmit Timestamp" value={logData.icmp_ts_tx} />
						<DataField label="Gateway" value={logData.icmp_gw} />
					</DataSection>

					{/* UDP Details */}
					<DataSection title="UDP Details">
						<DataField label="Source Port" value={logData.udp_sport} />
						<DataField label="Destination Port" value={logData.udp_dport} />
						<DataField label="UDP Length" value={logData.udp_len} />
						<DataField label="UDP Checksum" value={logData.udp_chksum} />
					</DataSection>

					{/* Payload Details */}
					<DataSection title="Payload Details">
						<DataField label="Payload Length" value={logData.payload_length} />
						<div className="flex justify-between py-2 border-b border-gray-200">
							<span className="text-gray-600 font-medium">Payload Hash:</span>
							<div className="flex items-center space-x-2">
								<span className="text-gray-800 truncate max-w-xs">
									{logData.payload_hash}
								</span>
								<button
									onClick={() => copyToClipboard(logData.payload_hash)}
									className="text-blue-500 hover:text-blue-700 text-sm"
								>
									Copy
								</button>
							</div>
						</div>
					</DataSection>
				</div>
			</div>
		);
	}
}
