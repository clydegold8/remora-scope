import { Line, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
} from "chart.js";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TrendingUp, BarChart3 } from "lucide-react";
import { AggMonthStats, DetectionData } from "@/hooks/useYearlyDetections";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface DetectionChartProps {
  data: DetectionData[];
  aggMonthStats: AggMonthStats[];
}

export function DetectionChart({ data, aggMonthStats }: DetectionChartProps) {
  const labels = aggMonthStats.map((item) => item.month);

  const peopleData = aggMonthStats.map((item) => item.avgPeople);
  const carData = aggMonthStats.map((item) => item.avgCars);

  const rootStyles = getComputedStyle(document.documentElement);
  const foreground = rootStyles.getPropertyValue("--foreground").trim();
  const card = rootStyles.getPropertyValue("--card").trim();
  const cardForeground = rootStyles
    .getPropertyValue("--card-foreground")
    .trim();
  const border = rootStyles.getPropertyValue("--border").trim();
  const primary = rootStyles.getPropertyValue("--primary").trim();
  const accent = rootStyles.getPropertyValue("--accent").trim();

  const hslForeground = `hsl(${foreground})`;
  const hslCard = `hsl(${card})`;
  const hslCardForeground = `hsl(${cardForeground})`;
  const hslBorder = `hsl(${border})`;
  const hslPrimary = `hsl(${primary})`;
  const hslAccent = `hsl(${accent})`;
  const hslPrimaryBg = `hsl(${primary} / 0.2)`;
  const hslAccentBg = `hsl(${accent} / 0.2)`;

  const lineChartOptions: ChartOptions<"line"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
        labels: {
          usePointStyle: true,
          color: hslForeground,
          font: {
            family: "Inter",
          },
        },
      },
      title: {
        display: false,
      },
      tooltip: {
        backgroundColor: hslCard,
        titleColor: hslCardForeground,
        bodyColor: hslCardForeground,
        borderColor: hslBorder,
        borderWidth: 1,
      },
    },
    scales: {
      x: {
        ticks: {
          color: hslForeground,
          font: {
            family: "Inter",
          },
          maxRotation: 0,
          autoSkip: true,
          maxTicksLimit: 12, // only 12 labels (Jan–Dec)
        },
        grid: {
          color: hslBorder,
        },
      },
      y: {
        ticks: {
          color: hslForeground,
          font: {
            family: "Inter",
          },
        },
        grid: {
          color: hslBorder,
        },
      },
    },
    elements: {
      line: {
        tension: 0.4,
      },
      point: {
        radius: 4,
        hoverRadius: 6,
      },
    },
  };

  const barChartOptions: ChartOptions<"bar"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
        labels: {
          usePointStyle: true,
          color: hslForeground,
          font: {
            family: "Inter",
          },
        },
      },
      tooltip: {
        backgroundColor: hslCard,
        titleColor: hslCardForeground,
        bodyColor: hslCardForeground,
        borderColor: hslBorder,
        borderWidth: 1,
      },
    },
    scales: {
      x: {
        ticks: {
          color: hslForeground,
          font: {
            family: "Inter",
          },
          maxRotation: 0,
          autoSkip: true,
          maxTicksLimit: 12, // only 12 labels (Jan–Dec)
        },
        grid: {
          display: false,
        },
      },
      y: {
        ticks: {
          color: hslForeground,
          font: {
            family: "Inter",
          },
        },
        grid: {
          color: hslBorder,
        },
      },
    },
  };

  const chartData = {
    labels,
    datasets: [
      {
        label: "Avg. People Detected",
        data: peopleData,
        borderColor: hslPrimary,
        backgroundColor: hslPrimaryBg,
        fill: true,
        borderWidth: 2,
      },
      {
        label: "Avg. Cars Detected",
        data: carData,
        borderColor: hslAccent,
        backgroundColor: hslAccentBg,
        fill: true,
        borderWidth: 2,
      },
    ],
  };

  if (data.length === 0) {
    return (
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            <span>Detection Analytics</span>
          </CardTitle>
          <CardDescription>
            Visual analysis of sensor detection patterns
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64 text-muted-foreground">
            <div className="text-center">
              <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No data available for visualization</p>
              <p className="text-sm">Add some detections to see charts</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass-card animate-fade-in">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          <span>Detection Analytics</span>
        </CardTitle>
        <CardDescription>
          Visual analysis of sensor detection patterns over time
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="line" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="line" className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4" />
              <span>Trend Analysis</span>
            </TabsTrigger>
            <TabsTrigger value="bar" className="flex items-center space-x-2">
              <BarChart3 className="h-4 w-4" />
              <span>Comparison</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="line" className="mt-6">
            <div className="h-80">
              <Line data={chartData} options={lineChartOptions} />
            </div>
          </TabsContent>

          <TabsContent value="bar" className="mt-6">
            <div className="h-80">
              <Bar data={chartData} options={barChartOptions} />
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
