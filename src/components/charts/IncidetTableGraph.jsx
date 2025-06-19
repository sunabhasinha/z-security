'use client';

import { useState, useEffect } from 'react';
import { format, parseISO } from 'date-fns';
import { Line, LineChart, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import { Calendar } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from '@/components/ui/chart';
import TimeFramePicker from '../custom/timePicker';

// This is how you would use the actual API data from your JSON
// This component assumes the API data is in the format you provided
export default function IncidentTableGraph({
	chartData = [],
	onTimeRangeChange,
}) {
	const [data, setData] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		// In a real app, you would fetch this from your API
		// For this example, we'll use the data structure you provided
		// const apiData = [
		// 	{ time: '2025-04-22 11:00:00', count: 0 },
		// 	// ... rest of your data
		// ];

		// Transform the data to include both incidents and alerts
		// In this example, we're using count as incidents and adding mock alerts
		const transformedData = chartData.map((item) => ({
			time: item.time,
			incidents: item.count,
			alerts: Math.floor(Math.random() * 30) + 10, // Mock data for alerts
		}));

		setData(transformedData);
		setLoading(false);
	}, [chartData]);

	const chartConfig = {
		incidents: {
			label: 'Incidents',
			color: 'hsl(200, 100%, 40%)',
		},
		alerts: {
			label: 'Alerts',
			color: 'hsl(320, 70%, 30%)',
		},
	};

	const formatXAxis = (tickItem) => {
		try {
			const date = parseISO(tickItem);
			return format(date, 'h:mm a');
		} catch (e) {
			return tickItem;
		}
	};

	if (loading) {
		return <div>Loading chart data...</div>;
	}

	return (
		<Card className="w-full">
			<CardHeader className="flex flex-row items-center justify-between pb-2">
				<CardTitle className="text-lg font-medium">
					Most recent Incidents and Alerts
				</CardTitle>
				<div className="w-1/5">
					<TimeFramePicker onTimeRangeChange={onTimeRangeChange} />
				</div>
			</CardHeader>
			<CardContent>
				<div className="h-[300px]">
					<ChartContainer
						style={{ height: '-webkit-fill-available', width: '100%' }}
						config={chartConfig}
					>
						<ResponsiveContainer width="100%">
							<LineChart
								data={data}
								margin={{ top: 5, right: 10, left: 10, bottom: 0 }}
								baseValue={0}
							>
								<XAxis
									dataKey="time"
									tickFormatter={formatXAxis}
									tickLine={false}
									axisLine={false}
									minTickGap={60}
									tickMargin={10}
								/>
								<YAxis
									tickLine={false}
									axisLine={false}
									tickMargin={10}
									domain={[0, 'auto']}
									allowDecimals={false}
								/>
								<Line
									type="monotone"
									dataKey="incidents"
									stroke="var(--color-incidents)"
									strokeWidth={2}
									dot={false}
									activeDot={{ r: 4 }}
									isAnimationActive={false}
								/>
								<Line
									type="monotone"
									dataKey="alerts"
									stroke="var(--color-alerts)"
									strokeWidth={2}
									dot={false}
									activeDot={{ r: 4 }}
									isAnimationActive={false}
								/>
								<ChartTooltip
									content={<ChartTooltipContent />}
									cursor={{
										stroke: '#f0f0f0',
										strokeWidth: 1,
										strokeDasharray: '4 4',
									}}
								/>
							</LineChart>
						</ResponsiveContainer>
					</ChartContainer>
				</div>
				<div className="mt-4 flex items-center justify-center space-x-8">
					<div className="flex items-center">
						<div className="mr-2 h-3 w-3 rounded-sm bg-[hsl(200,100%,40%)]" />
						<span className="text-sm text-muted-foreground">Incidents</span>
					</div>
					<div className="flex items-center">
						<div className="mr-2 h-3 w-3 rounded-sm bg-[hsl(320,70%,30%)]" />
						<span className="text-sm text-muted-foreground">Alerts</span>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
