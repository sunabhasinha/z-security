import React from 'react';
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Separator } from '@/components/ui/separator';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { useLocation } from 'react-router';

// Configuration for mapping routes to breadcrumb names
const breadcrumbNameMap = {
	'/': 'Home',
	'/login': 'Login',
	'/error': 'Error',
	'/alerts': 'Alerts',
	'/alerts/:id': 'Alert Details',
	'/incidents': 'Incidents',
	'/incidents/:id': 'Incident Details',
	'/threat-investigation': 'Threat Investigation',
	'/detection-rules': 'Detection Rules',
	'/devices': 'Devices',
	'/threat-intelligence': 'Threat Intelligence',
	'/action-submissions': 'Actions & Submissions',
	'/compliance-reporting': 'Compliance & Reporting',
	'/packet-forensics': 'Packet Forensics',
	'/sensor-management': 'Sensor Management',
	'/user-management': 'User Management',
	'/integrations': 'Integrations',
};

const Header = () => {
	const location = useLocation();
	const pathnames = location.pathname.split('/').filter((x) => x);

	// Function to find the matching breadcrumb name for a path
	const getBreadcrumbName = (path) => {
		// Check for exact match
		if (breadcrumbNameMap[path]) {
			return breadcrumbNameMap[path];
		}
		// Check for dynamic routes (e.g., /alerts/:id)
		const dynamicMatch = Object.keys(breadcrumbNameMap).find((key) => {
			const keyParts = key.split('/');
			const pathParts = path.split('/');
			if (keyParts.length !== pathParts.length) return false;
			return keyParts.every(
				(part, i) => part.startsWith(':') || part === pathParts[i]
			);
		});
		return (
			breadcrumbNameMap[dynamicMatch] ||
			path.charAt(0).toUpperCase() + path.slice(1) // Fallback: capitalize
		);
	};

	return (
		<header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
			<div className="flex items-center gap-2 px-4">
				<SidebarTrigger className="-ml-1" />
				<Separator orientation="vertical" className="mr-2 h-4" />
				<Breadcrumb>
					<BreadcrumbList>
						{/* Always show Home as the root breadcrumb */}
						<BreadcrumbItem className="hidden md:block">
							<BreadcrumbLink href="/">Home</BreadcrumbLink>
						</BreadcrumbItem>

						{/* Dynamically generate breadcrumbs for each route segment */}
						{pathnames.map((value, index) => {
							const to = `/${pathnames.slice(0, index + 1).join('/')}`;
							const isLast = index === pathnames.length - 1;
							const displayName = getBreadcrumbName(to);

							return (
								<React.Fragment key={to}>
									<BreadcrumbSeparator className="hidden md:block" />
									<BreadcrumbItem>
										{isLast ? (
											<BreadcrumbPage>{displayName}</BreadcrumbPage>
										) : (
											<BreadcrumbLink href={to}>{displayName}</BreadcrumbLink>
										)}
									</BreadcrumbItem>
								</React.Fragment>
							);
						})}
					</BreadcrumbList>
				</Breadcrumb>
			</div>
		</header>
	);
};

export default Header;
