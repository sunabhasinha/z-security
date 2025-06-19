// src/main.jsx
import React from 'react';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router';
import './index.css';
import Layout from './layouts/Layout';
// import { AuthProvider } from './context/AuthContext';
import { ApiStateProvider } from './context/ApiStateContext';
import { useAuth } from './hooks/useAuth';
// Pages
import AlertsPage from './pages/AlertsPage';
import HomePage from './pages/HomePage';
import Login from './pages/Login';
import ErrorPage from './pages/ErrorPage';
import IncidentsPage from './pages/IncidentsPage';
import AlertDetailsPage from './pages/AlertDetailsPage';

// Placeholder components for new routes
const ThreatInvestigationPage = () => <div>Threat Investigation Page</div>;
const DetectionRulesPage = () => <div>Detection Rules Page</div>;
const DevicesPage = () => <div>Devices Page</div>;
const ThreatIntelligencePage = () => <div>Threat Intelligence Page</div>;
const ActionsSubmissionsPage = () => <div>Actions & Submissions Page</div>;
const ComplianceReportingPage = () => <div>Compliance & Reporting Page</div>;
const PacketForensicsPage = () => <div>Packet Forensics Page</div>;
const SensorManagementPage = () => <div>Sensor Management Page</div>;
const UserManagementPage = () => <div>User Management Page</div>;
const IntegrationsPage = () => <div>Integrations Page</div>;

// ProtectedRoute Component
const ProtectedRoute = ({ element }) => {
	const { getAuthToken } = useAuth();
	const token = getAuthToken();

	if (!token) {
		return <Navigate to="/login" replace />;
	}

	return element;
};

createRoot(document.getElementById('root')).render(
	<StrictMode>
		<ApiStateProvider>
			<BrowserRouter>
				<Routes>
					{/* Public Route */}
					<Route path="/login" element={<Login />} />
					<Route path="/error" element={<ErrorPage />} />

					{/* All routes under Layout are protected */}
					<Route element={<ProtectedRoute element={<Layout />} />}>
						<Route path="/" element={<HomePage />} />
						<Route path="/alerts" element={<AlertsPage />} />
						<Route path="/alerts/:id" element={<AlertDetailsPage />} />
						<Route path="/incidents" element={<IncidentsPage />} />
						<Route
							path="/threat-investigation"
							element={<ThreatInvestigationPage />}
						/>
						<Route path="/detection-rules" element={<DetectionRulesPage />} />
						<Route path="/devices" element={<DevicesPage />} />
						<Route
							path="/threat-intelligence"
							element={<ThreatIntelligencePage />}
						/>
						<Route
							path="/action-submissions"
							element={<ActionsSubmissionsPage />}
						/>
						<Route
							path="/compliance-reporting"
							element={<ComplianceReportingPage />}
						/>
						<Route path="/packet-forensics" element={<PacketForensicsPage />} />
						<Route
							path="/sensor-management"
							element={<SensorManagementPage />}
						/>
						<Route path="/user-management" element={<UserManagementPage />} />
						<Route path="/integrations" element={<IntegrationsPage />} />
					</Route>
				</Routes>
			</BrowserRouter>
		</ApiStateProvider>
	</StrictMode>
);
