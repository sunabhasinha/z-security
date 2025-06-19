'use client';

import { useState, useRef } from 'react';
import { format, subDays, subHours } from 'date-fns';
import { CalendarIcon, Calendar as CalendarIconItem } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function TimeFramePicker({ onTimeRangeChange }) {
	const [selectedOption, setSelectedOption] = useState('last24');
	const [isCustomRange, setIsCustomRange] = useState(false);
	const [startDate, setStartDate] = useState(new Date());
	const [endDate, setEndDate] = useState(new Date());
	const [startTime, setStartTime] = useState('00:00:00');
	const [endTime, setEndTime] = useState('23:59:59');
	const customRangeRef = useRef(null);

	const formatDateTime = (date) => date.toISOString().slice(0, 19);

	const calculateTimeRange = (overrideOption = null) => {
		const now = new Date();
		let start;
		let end = now;
		const effectiveOption = overrideOption || selectedOption;

		if (effectiveOption === 'custom' && startDate && endDate) {
			const [startHours, startMinutes, startSeconds] = startTime
				.split(':')
				.map(Number);
			const [endHours, endMinutes, endSeconds] = endTime.split(':').map(Number);

			start = new Date(startDate);
			start.setHours(startHours, startMinutes, startSeconds);

			end = new Date(endDate);
			end.setHours(endHours, endMinutes, endSeconds);
		} else {
			switch (effectiveOption) {
				case 'last24':
					start = subHours(now, 24);
					break;
				case 'last7':
					start = subDays(now, 7);
					break;
				case 'last30':
					start = subDays(now, 30);
					break;
				default:
					start = subHours(now, 24);
			}
		}
		return {
			start: formatDateTime(start),
			end: formatDateTime(end),
		};
	};

	const handleOptionChange = (value) => {
		setSelectedOption(value);
		const isCustom = value === 'custom';
		setIsCustomRange(isCustom);

		if (!isCustom) {
			const range = calculateTimeRange(value);
			onTimeRangeChange(range); // Trigger API for preset options
		}
	};

	const handleApply = () => {
		const range = calculateTimeRange('custom');
		onTimeRangeChange(range); // Trigger API for custom on Apply
		setIsCustomRange(false);
	};

	return (
		<div className="relative w-full space-y-2 z-50">
			<div className="w-full">
				<Select value={selectedOption} onValueChange={handleOptionChange}>
					<SelectTrigger id="timeframe" className="w-full">
						<CalendarIconItem className="mr-2 h-4 w-4" />
						<SelectValue placeholder="Select time range" key={selectedOption} />
					</SelectTrigger>
					<SelectContent className="w-[var(--radix-select-trigger-width)] z-50">
						<SelectItem value="last24">Last 24 hours</SelectItem>
						<SelectItem value="last7">Last 7 days</SelectItem>
						<SelectItem value="last30">Last 30 days</SelectItem>
						<SelectItem value="custom">Custom time range</SelectItem>
					</SelectContent>
				</Select>
			</div>

			{isCustomRange && (
				<div
					ref={customRangeRef}
					className="absolute top-full right-0 w-[calc(100vw-2rem)] max-w-lg bg-white border border-border rounded-md shadow-lg p-4 z-50 mx-4"
				>
					<div className="space-y-4">
						<div className="grid grid-cols-2 gap-4">
							<div className="space-y-2">
								<Label htmlFor="startDate">Start date (Local)</Label>
								<Popover>
									<PopoverTrigger asChild>
										<Button
											variant="outline"
											className={cn(
												'w-full justify-start text-left font-normal'
											)}
										>
											<CalendarIcon className="mr-2 h-4 w-4" />
											{format(startDate, 'PPP')}
										</Button>
									</PopoverTrigger>
									<PopoverContent className="w-auto p-0 z-50">
										<Calendar
											mode="single"
											selected={startDate}
											onSelect={setStartDate}
											initialFocus
										/>
									</PopoverContent>
								</Popover>
							</div>
							<div className="space-y-2">
								<Label htmlFor="startTime">Start time (Local)</Label>
								<Input
									type="time"
									step="1"
									value={startTime}
									onChange={(e) => setStartTime(e.target.value)}
								/>
							</div>
						</div>

						<div className="grid grid-cols-2 gap-4">
							<div className="space-y-2">
								<Label htmlFor="endDate">End date (Local)</Label>
								<Popover>
									<PopoverTrigger asChild>
										<Button
											variant="outline"
											className={cn(
												'w-full justify-start text-left font-normal'
											)}
										>
											<CalendarIcon className="mr-2 h-4 w-4" />
											{format(endDate, 'PPP')}
										</Button>
									</PopoverTrigger>
									<PopoverContent className="w-auto p-0 z-50">
										<Calendar
											mode="single"
											selected={endDate}
											onSelect={setEndDate}
											initialFocus
										/>
									</PopoverContent>
								</Popover>
							</div>
							<div className="space-y-2">
								<Label htmlFor="endTime">End time (Local)</Label>
								<Input
									type="time"
									step="1"
									value={endTime}
									onChange={(e) => setEndTime(e.target.value)}
								/>
							</div>
						</div>

						<div className="flex justify-end">
							<Button onClick={handleApply}>Apply</Button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
