import { Calendar, Home, Inbox, Search, Settings } from 'lucide-react';

import {
	Sidebar,
	SidebarContent,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarMenuSub,
	SidebarMenuSubItem,
} from '@/components/ui/sidebar';
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from '@/components/ui/collapsible';

// Menu items.
const items = [
	{
		title: 'Home',
		url: '#',
		icon: Home,
	},
	{
		title: 'Inbox',
		url: '#',
		icon: Inbox,
	},
	{
		title: 'Calendar',
		url: '#',
		icon: Calendar,
	},
	{
		title: 'Search',
		url: '#',
		icon: Search,
	},
	{
		title: 'Settings',
		url: '#',
		icon: Settings,
	},
];

export function AppSidebar() {
	return (
		<Sidebar>
			<SidebarContent>
				<SidebarGroup>
					<SidebarGroupLabel>Application</SidebarGroupLabel>
					<SidebarGroupContent>
						<SidebarMenu>
							{items.map((item) => (
								<Collapsible defaultOpen className="group/collapsible">
									<SidebarMenuItem key={item.title}>
										<CollapsibleTrigger asChild>
											<SidebarMenuButton>
												<a href={item.url}>
													<item.icon />
													<span>{item.title}</span>
												</a>
											</SidebarMenuButton>
										</CollapsibleTrigger>
										<CollapsibleContent>
											<SidebarMenuSub>
												<SidebarMenuSubItem></SidebarMenuSubItem>
											</SidebarMenuSub>
										</CollapsibleContent>
										<SidebarMenuButton asChild></SidebarMenuButton>
									</SidebarMenuItem>
								</Collapsible>
							))}
							{/* <Collapsible defaultOpen className="group/collapsible">
								<SidebarMenuItem>
									<CollapsibleTrigger asChild>
										<SidebarMenuButton />
									</CollapsibleTrigger>
									<CollapsibleContent>
										<SidebarMenuSub>
											<SidebarMenuSubItem />
										</SidebarMenuSub>
									</CollapsibleContent>
								</SidebarMenuItem>
							</Collapsible> */}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>
		</Sidebar>
	);
}
