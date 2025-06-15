"use client";

import React from "react";
import { Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis } from "recharts"
import { Label, PolarRadiusAxis, RadialBar, RadialBarChart } from "recharts"
// import { Pie, PieChart, Sector } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const barChartConfig = {
    ndc_count: {
      label: "NDC Count",
      color: "hsl(var(--chart-1))",
    },
    label: {
        color: "hsl(var(--background))",
    },
} satisfies ChartConfig

const pieChartConfig = {
    yes: {
        label: "Yes",
        color: "hsl(var(--chart-2))",
    },
    no: {
        label: "No",
        color: "hsl(var(--chart-1))",
    },
} satisfies ChartConfig

type NDCData = {
  ndc_count: number;
  btr_submitted: number;
};

// https://unfccc.int/NDCREG
// https://unfccc.int/first-biennial-transparency-reports
type TrackerData = {
  [country: string]: NDCData;
};

export default function NDCTracker() {
  // Use the TrackerData type directly without fetching from API
  const trackerData: TrackerData = {
    "Singapore": { ndc_count: 2, btr_submitted: 1 },
    "Malaysia": { ndc_count: 1.5, btr_submitted: 1 },
    "Vietnam": { ndc_count: 1.5, btr_submitted: 0 },
    "Thailand": { ndc_count: 1.5, btr_submitted: 1 },    
    "Myanmar": { ndc_count: 1.5, btr_submitted: 0 },
    "Cambodia": { ndc_count: 1.5, btr_submitted: 1 },
    "Laos": { ndc_count: 1.5, btr_submitted: 0 },
    "Timor-Leste": { ndc_count: 1.5, btr_submitted: 0 },
    "Indonesia": { ndc_count: 1, btr_submitted: 1 },
    "Philippines": { ndc_count: 1, btr_submitted: 1 },
    "Brunei": { ndc_count: 1, btr_submitted: 1 },
  };
  // Accurate as of 2025-04-19
  // 1.5 means the country has submitted an update to its first NDC.
  // 2 means the country has submitted its second NDC.

  // Prepare data for the NDC submissions bar chart.
  const ndcChartData = Object.entries(trackerData).map(([country, data]) => ({
    country,
    ndc_count: data.ndc_count,
  }));

  // Prepare data for the BTR status pie chart.
  const btrYesCountries = Object.entries(trackerData)
    .filter(([, data]) => data.btr_submitted)
    .map(([country]) => country);
  const btrNoCountries = Object.entries(trackerData)
    .filter(([, data]) => !data.btr_submitted)
    .map(([country]) => country);
  const btrYesCount = btrYesCountries.length;
  const btrNoCount = btrNoCountries.length;
  const totalCountries = btrYesCount + btrNoCount
  const btrChartData = [{ yes: btrYesCount, no: btrNoCount }];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Bar Chart for NDC Submissions */}
      <Card>
      <p className="mb-4 text-sm">Nationally Determined Contributions (NDCs), are national climate action plans by each country under the Paris Agreement.</p>
        <CardHeader>
          <CardTitle>NDC Submissions by SEA Country</CardTitle>
          <CardDescription>Overview</CardDescription>
        </CardHeader>
          <CardContent>
            <ChartContainer config={barChartConfig}>
                <BarChart
                    accessibilityLayer
                    data={ndcChartData}
                    layout="vertical"
                    margin={{
                    right: 16,
                    }}
                >
            <CartesianGrid horizontal={false} />
            <YAxis
              dataKey="country"
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
              hide
            />
            <XAxis dataKey="ndc_count" type="number" hide />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Bar
              dataKey="ndc_count"
              layout="vertical"
              fill="var(--color-ndc_count)"
              radius={4}
            >
              <LabelList
                dataKey="country"
                position="insideLeft"
                offset={8}
                className="fill-[--color-label]"
                fontSize={12}
              />
              <LabelList
                dataKey="ndc_count"
                position="right"
                offset={8}
                className="fill-foreground"
                fontSize={12}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
            <div>
                <ul>
                    <li>The NDCs to be submitted in 2025, aka NDCs 3.0, are to be informed by the outcome of the first global stocktake (2023).</li>
                </ul>
            </div>
      </CardFooter>
      </Card>

      {/* Pie Chart for BTR Status */}
      <Card>
      <p className="mb-4 text-sm">Under the Enhanced Transparency Framework, Parties to the Paris Agreement must submit BTRs biennially, starting by 31 Dec 2024.</p>
        <CardHeader>
          <CardTitle>BTR Status by SEA Countries</CardTitle>
          <CardDescription>Biennial Transparency Reports (BTR) Submission Overview</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-1 items-center pb-0">
          <ChartContainer config={pieChartConfig} className="mx-auto aspect-square w-full max-w-[220px]">
            <RadialBarChart
                data={btrChartData}
                endAngle={180}
                innerRadius={80}
                outerRadius={130}
            >
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle">
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) - 16}
                          className="fill-foreground text-2xl font-bold"
                        >
                          {totalCountries.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 4}
                          className="fill-muted-foreground"
                        >
                          Countries
                        </tspan>
                      </text>
                    )
                  }
                }}
              />
            </PolarRadiusAxis>
            <RadialBar
              dataKey="yes"
              stackId="a"
              cornerRadius={5}
              fill="var(--color-yes)"
              className="stroke-transparent stroke-2"
            />
            <RadialBar
              dataKey="no"
              fill="var(--color-no)"
              stackId="a"
              cornerRadius={5}
              className="stroke-transparent stroke-2"
            />
          </RadialBarChart>
          </ChartContainer>
        </CardContent>
        <CardFooter className="flex-col gap-2 text-sm">
            <div>
                <ul>
                    <li><strong>Submitted:</strong> {btrYesCountries.join(", ")}</li>
                    <li><strong>Not Submitted:</strong> {btrNoCountries.join(", ")}</li>
                </ul>
            </div>
      </CardFooter>
      </Card>
    </div>
  );
}