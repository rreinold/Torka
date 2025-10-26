import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from "recharts";

interface SubmissionRadarChartProps {
  data: Record<string, any> | null;
}

export function SubmissionRadarChart({ data }: SubmissionRadarChartProps) {
  if (!data || !data.correct) {
    return null;
  }

  // Convert the "correct" object into radar chart data
  const correctData = data.correct;
  const radarData = Object.entries(correctData).map(([key, value]) => ({
    subject: key,
    value: typeof value === 'number' ? value : (value ? 100 : 0),
    fullMark: 100,
  }));

  if (radarData.length === 0) {
    return null;
  }

  return (
    <Card className="w-80" data-testid="card-submission-radar">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm">Quiz Results</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={200}>
          <RadarChart data={radarData}>
            <PolarGrid stroke="hsl(var(--border))" />
            <PolarAngleAxis
              dataKey="subject"
              tick={{ fill: "hsl(var(--foreground))", fontSize: 11 }}
            />
            <PolarRadiusAxis
              angle={90}
              domain={[0, 100]}
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }}
            />
            <Radar
              name="Correct"
              dataKey="value"
              stroke="hsl(var(--primary))"
              fill="hsl(var(--primary))"
              fillOpacity={0.6}
            />
          </RadarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
