'use client';

import { ChevronRight } from 'lucide-react';
import { DynamicIcon } from 'lucide-react/dynamic';

import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
	SidebarGroup,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarMenuSub,
	SidebarMenuSubButton,
	SidebarMenuSubItem,
} from '@/components/ui/sidebar';

export function NavMain({ items }) {
	return (
		<SidebarGroup>
			<SidebarGroupLabel>Platform</SidebarGroupLabel>
			<SidebarMenu>
				{items.map((item) => (
					<Collapsible
						key={item.label}
						asChild
						defaultOpen={item.isActive}
						className="group/collapsible"
					>
						<SidebarMenuItem>
							<CollapsibleTrigger asChild>
								<SidebarMenuButton tooltip={item.label} onClick={item.onClick}>
									{item.icon && (
										<DynamicIcon
											name={item.icon.toLowerCase()}
											color="red"
											size={48}
										/>
									)}
									<span>{item.label}</span>
									{!!item.submenus.length && (
										<ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
									)}{' '}
								</SidebarMenuButton>
							</CollapsibleTrigger>
							<CollapsibleContent>
								<SidebarMenuSub>
									{item.submenus?.map((subItem) => (
										<SidebarMenuSubItem key={subItem.label}>
											<SidebarMenuSubButton asChild>
												<div onClick={subItem.onClick}>
													{subItem.icon && (
														<DynamicIcon
															name={subItem.icon.toLowerCase()}
															color="red"
															size={48}
														/>
													)}
													<span>{subItem.label}</span>
												</div>
											</SidebarMenuSubButton>
										</SidebarMenuSubItem>
									))}
								</SidebarMenuSub>
							</CollapsibleContent>
						</SidebarMenuItem>
					</Collapsible>
				))}
			</SidebarMenu>
		</SidebarGroup>
	);
}
