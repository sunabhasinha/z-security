'use client';

import { useState } from 'react';
import {
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	useReactTable,
} from '@tanstack/react-table';

import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
	X,
	Filter,
	Download,
	ChevronLeft,
	ChevronRight,
	MoreHorizontal,
} from 'lucide-react';
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function DataTable({
	columns,
	data,
	searchKey = 'title',
	filterOptions = [],
	onRowClick,
	onNextPage,
	onPreviousPage,
	canNextPage,
	canPreviousPage,
	totalPages = 0,
	currentPage = 1,
	onFilterChange,
	onSearchChange,
	onExportCSV,
	limit = 10,
	onExport
}) {
	const [sorting, setSorting] = useState([]);
	const [columnFilters, setColumnFilters] = useState([]);
	const [columnVisibility, setColumnVisibility] = useState({});
	const [rowSelection, setRowSelection] = useState({});
	const [activeFilters, setActiveFilters] = useState([]);
	const [editingFilter, setEditingFilter] = useState(null);
	const [filterInputValue, setFilterInputValue] = useState('');
	const [selectedFilterKey, setSelectedFilterKey] = useState(null);
	const [searchValue, setSearchValue] = useState('');
	const [offset, setOffset] = useState(null);

	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		onSortingChange: setSorting,
		getSortedRowModel: getSortedRowModel(),
		onColumnFiltersChange: setColumnFilters,
		getFilteredRowModel: getFilteredRowModel(),
		onColumnVisibilityChange: setColumnVisibility,
		onRowSelectionChange: setRowSelection,
		manualFiltering: true,
		manualPagination: true,
		state: {
			sorting,
			columnFilters,
			columnVisibility,
			rowSelection,
		},
	});

	// Add a filter
	const addFilter = (key, value) => {
		if (!value.trim()) return;

		const newFilter = { key, value };
		const newFilters = [...activeFilters, newFilter];
		setActiveFilters(newFilters);
		setFilterInputValue('');
		setSelectedFilterKey(null);

		// Notify parent
		onFilterChange?.(newFilters);
	};

	// Remove a filter
	const removeFilter = (key, value) => {
		const newFilters = activeFilters.filter(
			(filter) => !(filter.key === key && filter.value === value)
		);
		setActiveFilters(newFilters);

		// Notify parent
		onFilterChange?.(newFilters);
	};

	// Handle filter input change
	const handleFilterInputChange = (e) => {
		setFilterInputValue(e.target.value);
	};

	// Handle filter input submit (Enter key)
	const handleFilterInputSubmit = (e) => {
		if (e.key === 'Enter' && selectedFilterKey && filterInputValue.trim()) {
			addFilter(selectedFilterKey, filterInputValue.trim());
		}
	};

	// Handle filter selection from dropdown
	const handleFilterSelect = (key) => {
		setSelectedFilterKey(key);
		setFilterInputValue('');
	};

	// Handle search input change
	const handleSearchInputChange = (e) => {
		const newValue = e.target.value;
		setSearchValue(newValue);

		// ✅ Trigger empty search immediately when cleared
		if (newValue.trim() === '') {
			onSearchChange?.('');
		}
	};

	// Handle search submit (Enter key)
	const handleSearchSubmit = (e) => {
		if (e.key === 'Enter') {
			onSearchChange?.(searchValue.trim());
		}
	};

	// Generate pagination buttons
	const generatePaginationButtons = () => {
		const buttons = [];

		// Previous button
		buttons.push(
			<Button
				key="prev"
				variant="outline"
				size="sm"
				onClick={() => onPreviousPage()}
				disabled={!canPreviousPage}
			>
				<ChevronLeft className="h-4 w-4 mr-1" />
				Previous
			</Button>
		);

		// First page
		buttons.push(
			<Button
				key="1"
				variant={currentPage === 1 ? 'default' : 'outline'}
				size="sm"
				onClick={() => {
					setOffset(0);
					onPreviousPage();
				}}
				className="px-3"
			>
				1
			</Button>
		);

		// Ellipsis and middle pages
		if (totalPages > 5) {
			if (currentPage > 3) {
				buttons.push(
					<Button
						key="ellipsis1"
						variant="outline"
						size="sm"
						disabled
						className="px-3"
					>
						<MoreHorizontal className="h-4 w-4" />
					</Button>
				);
			}

			// Show pages around current page
			const startPage = Math.max(2, currentPage - 1);
			const endPage = Math.min(totalPages - 1, currentPage + 1);

			for (let i = startPage; i <= endPage; i++) {
				buttons.push(
					<Button
						key={i}
						variant={currentPage === i ? 'default' : 'outline'}
						size="sm"
						onClick={() => {
							const newOffset = (i - 1) * limit;
							setOffset(newOffset);
							if (newOffset < offset) {
								onPreviousPage();
							} else {
								onNextPage();
							}
						}}
						className="px-3"
					>
						{i}
					</Button>
				);
			}

			if (currentPage < totalPages - 2) {
				buttons.push(
					<Button
						key="ellipsis2"
						variant="outline"
						size="sm"
						disabled
						className="px-3"
					>
						<MoreHorizontal className="h-4 w-4" />
					</Button>
				);
			}
		} else {
			// Show all pages for small page counts
			for (let i = 2; i < totalPages; i++) {
				buttons.push(
					<Button
						key={i}
						variant={currentPage === i ? 'default' : 'outline'}
						size="sm"
						onClick={() => {
							const newOffset = (i - 1) * limit;
							setOffset(newOffset);
							if (newOffset < offset) {
								onPreviousPage();
							} else {
								onNextPage();
							}
						}}
						className="px-3"
					>
						{i}
					</Button>
				);
			}
		}

		// Last page (if more than 1 page)
		if (totalPages > 1) {
			buttons.push(
				<Button
					key={totalPages}
					variant={currentPage === totalPages ? 'default' : 'outline'}
					size="sm"
					onClick={() => {
						const newOffset = (totalPages - 1) * limit;
						setOffset(newOffset);
						onNextPage();
					}}
					className="px-3"
				>
					{totalPages}
				</Button>
			);
		}

		// Next button
		buttons.push(
			<Button
				key="next"
				variant="outline"
				size="sm"
				onClick={() => onNextPage()}
				disabled={!canNextPage}
			>
				Next
				<ChevronRight className="h-4 w-4 ml-1" />
			</Button>
		);

		return buttons;
	};

	// Handle export to CSV
	const handleExport = () => {
		if (!data || data.length === 0) {
			alert('No data available to export.');
			return;
		}
		if (onExport) {
            onExport(data); // Pass the data or any relevant information
        }
	};

	return (
		<div className="space-y-4">
			<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
				<div className="flex flex-wrap items-center gap-2">
					<div className="text-sm font-medium">Filters:</div>
					{activeFilters.map((filter, index) => (
						<Badge
							key={index}
							variant="outline"
							className="flex items-center gap-1 px-3 py-1"
						>
							{filter.key}: {filter.value}
							<X
								className="h-3 w-3 cursor-pointer ml-1"
								onClick={() => removeFilter(filter.key, filter.value)}
							/>
						</Badge>
					))}
					{selectedFilterKey && (
						<div className="flex items-center">
							<Badge
								variant="outline"
								className="flex items-center gap-1 px-3 py-1"
							>
								{selectedFilterKey}:
								<Input
									className="h-5 w-auto min-w-[80px] ml-1 p-1 text-xs"
									value={filterInputValue}
									onChange={handleFilterInputChange}
									onKeyDown={handleFilterInputSubmit}
									autoFocus
								/>
							</Badge>
						</div>
					)}
				</div>

				<div className="flex flex-wrap items-center gap-2">
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="outline" className="h-10 gap-2">
								<Filter className="h-4 w-4" />
								Filters
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end" className="w-[200px]">
							{filterOptions.map((filterOption) => (
								<div
									key={filterOption.key}
									className="flex items-center py-1 px-2 cursor-pointer hover:bg-muted rounded-md"
									onClick={() => handleFilterSelect(filterOption.key)}
								>
									{filterOption.label}
								</div>
							))}
						</DropdownMenuContent>
					</DropdownMenu>

					<div className="relative w-full sm:w-auto">
						<Input
							placeholder="Search"
							value={searchValue}
							onChange={handleSearchInputChange}
							onKeyDown={handleSearchSubmit}
							className="h-10 w-full sm:w-[200px] pl-8"
						/>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className="absolute left-2.5 top-2.5 h-5 w-5 text-gray-500"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
							/>
						</svg>
					</div>
					<Button
						variant="outline"
						className="h-10 gap-2"
						onClick={onExportCSV}
					>
						<Download className="h-4 w-4" />
						Export
					</Button>
				</div>
			</div>

			<div className="rounded-md border">
				<Table>
					<TableHeader>
						{table.getHeaderGroups().map((headerGroup) => (
							<TableRow key={headerGroup.id}>
								{headerGroup.headers.map((header) => (
									<TableHead key={header.id}>
										{header.isPlaceholder
											? null
											: flexRender(
													header.column.columnDef.header,
													header.getContext()
											  )}
									</TableHead>
								))}
							</TableRow>
						))}
					</TableHeader>
					<TableBody>
						{table?.getRowModel()?.rows?.length > 0 ? (
							table.getRowModel().rows.map((row, index) => (
								<TableRow
									key={row.id}
									data-state={row.getIsSelected() && 'selected'}
									className={index % 2 === 1 ? 'bg-muted/50' : ''}
								>
									{row.getVisibleCells().map((cell) => (
										<TableCell key={cell.id} onClick={() => onRowClick(cell)}>
											{flexRender(
												cell.column.columnDef.cell,
												cell.getContext()
											)}
										</TableCell>
									))}
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell
									colSpan={columns.length}
									className="h-24 text-center"
								>
									No results.
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>

			<div className="flex items-center justify-between">
				<div className="text-sm text-muted-foreground">
					{/* {table.getFilteredSelectedRowModel().rows.length} of{' '}
					{table.getFilteredRowModel().rows.length} row(s) selected. */}
				</div>
				<div className="flex items-center space-x-2">
					{generatePaginationButtons()}
				</div>
			</div>
		</div>
	);
}
