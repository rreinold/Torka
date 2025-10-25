import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Radar, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from "recharts";
import { 
  Brain, 
  TrendingUp, 
  Clock, 
  Award, 
  Flame,
  Eye,
  Ear,
  BookOpen,
  Hand,
  Image,
  Headphones,
  FileText,
  Play,
  Zap
} from "lucide-react";

// Mock data for visualizations
const learningStyleData = [
  { subject: 'Visual', value: 85, fullMark: 100 },
  { subject: 'Auditory', value: 60, fullMark: 100 },
  { subject: 'Reading/Writing', value: 70, fullMark: 100 },
  { subject: 'Hands-On', value: 45, fullMark: 100 },
];

const mediaPreferencesData = [
  { type: 'Diagrams', effectiveness: 92, icon: Image },
  { type: 'Interactive', effectiveness: 85, icon: Play },
  { type: 'Videos', effectiveness: 78, icon: Eye },
  { type: 'Text', effectiveness: 75, icon: FileText },
  { type: 'Audio', effectiveness: 68, icon: Headphones },
];

const optimalStudyHours = [
  { hour: '6 AM', performance: 45 },
  { hour: '9 AM', performance: 85 },
  { hour: '12 PM', performance: 75 },
  { hour: '3 PM', performance: 90 },
  { hour: '6 PM', performance: 70 },
  { hour: '9 PM', performance: 55 },
];

export default function Profile() {
  const retentionScores = {
    twentyFourHr: 88,
    oneWeek: 76,
    oneMonth: 65
  };

  const complexityPreference = 72; // 0-50 = concise, 50-100 = detailed
  const learningPace = 65; // 0-50 = self-paced, 50-100 = structured

  const quickStats = {
    totalSessions: 42,
    avgQuizScore: 87,
    profileConfidence: 85,
    streak: 12
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-6">
          <div className="flex items-center gap-3">
            <Brain className="w-8 h-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold" data-testid="text-profile-title">
                Your Learning Profile
              </h1>
              <p className="text-muted-foreground" data-testid="text-profile-subtitle">
                Personalized insights based on your learning patterns
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Main Content - 3 columns */}
          <div className="lg:col-span-3 space-y-6">
            {/* Top Section - Learning Style Overview */}
            <Card data-testid="card-learning-style">
              <CardHeader>
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div>
                    <CardTitle>Learning Style Overview</CardTitle>
                    <CardDescription>Your personalized learning modality profile</CardDescription>
                  </div>
                  <Badge className="text-base px-4 py-2" data-testid="badge-primary-learner">
                    <Eye className="w-4 h-4 mr-2" />
                    Visual Learner
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-8">
                  {/* Radar Chart */}
                  <div className="flex items-center justify-center">
                    <ResponsiveContainer width="100%" height={300}>
                      <RadarChart data={learningStyleData}>
                        <PolarGrid />
                        <PolarAngleAxis dataKey="subject" />
                        <PolarRadiusAxis angle={90} domain={[0, 100]} />
                        <Radar 
                          name="Learning Style" 
                          dataKey="value" 
                          stroke="hsl(var(--primary))" 
                          fill="hsl(var(--primary))" 
                          fillOpacity={0.6} 
                        />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Percentage Breakdown */}
                  <div className="space-y-4">
                    {learningStyleData.map((style, index) => {
                      const icons = [Eye, Ear, BookOpen, Hand];
                      const Icon = icons[index];
                      return (
                        <div key={style.subject} className="space-y-2" data-testid={`learning-style-${style.subject.toLowerCase()}`}>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Icon className="w-4 h-4 text-muted-foreground" />
                              <span className="font-medium">{style.subject}</span>
                            </div>
                            <span className="text-sm font-bold">{style.value}%</span>
                          </div>
                          <Progress value={style.value} />
                        </div>
                      );
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Middle Section - Adaptive Metrics */}
            <div className="grid md:grid-cols-3 gap-6">
              {/* Retention Score */}
              <Card data-testid="card-retention-score">
                <CardHeader>
                  <CardTitle>Retention Score</CardTitle>
                  <CardDescription>Memory retention over time</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2" data-testid="retention-24hr">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">24 Hours</span>
                      <span className="text-2xl font-bold text-primary">{retentionScores.twentyFourHr}%</span>
                    </div>
                    <Progress value={retentionScores.twentyFourHr} />
                  </div>
                  <div className="space-y-2" data-testid="retention-1week">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">1 Week</span>
                      <span className="text-2xl font-bold text-primary">{retentionScores.oneWeek}%</span>
                    </div>
                    <Progress value={retentionScores.oneWeek} />
                  </div>
                  <div className="space-y-2" data-testid="retention-1month">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">1 Month</span>
                      <span className="text-2xl font-bold text-primary">{retentionScores.oneMonth}%</span>
                    </div>
                    <Progress value={retentionScores.oneMonth} />
                  </div>
                </CardContent>
              </Card>

              {/* Optimal Study Time */}
              <Card className="md:col-span-2" data-testid="card-optimal-time">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    Optimal Study Time
                  </CardTitle>
                  <CardDescription>Your peak learning hours based on quiz performance</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={optimalStudyHours}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="hour" />
                      <YAxis domain={[0, 100]} />
                      <Tooltip />
                      <Bar dataKey="performance" radius={[8, 8, 0, 0]}>
                        {optimalStudyHours.map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={entry.performance > 80 ? 'hsl(var(--primary))' : 'hsl(var(--muted-foreground))'} 
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Bottom Section - Personalization Insights */}
            <div className="grid md:grid-cols-3 gap-6">
              {/* Media Preferences */}
              <Card className="md:col-span-2" data-testid="card-media-preferences">
                <CardHeader>
                  <CardTitle>Media Preferences</CardTitle>
                  <CardDescription>Effectiveness of different content types for you</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {mediaPreferencesData.map((media) => {
                    const Icon = media.icon;
                    return (
                      <div key={media.type} className="space-y-2" data-testid={`media-${media.type.toLowerCase()}`}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Icon className="w-4 h-4 text-muted-foreground" />
                            <span className="font-medium">{media.type}</span>
                          </div>
                          <span className="text-sm font-bold">{media.effectiveness}%</span>
                        </div>
                        <Progress value={media.effectiveness} />
                      </div>
                    );
                  })}
                </CardContent>
              </Card>

              {/* Complexity & Pace */}
              <div className="space-y-6">
                {/* Complexity Preference */}
                <Card data-testid="card-complexity">
                  <CardHeader>
                    <CardTitle className="text-base">Complexity Preference</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Concise</span>
                        <span>Detailed</span>
                      </div>
                      <Progress value={complexityPreference} />
                      <p className="text-center text-sm font-medium">
                        {complexityPreference > 50 ? 'Prefers Detailed' : 'Prefers Concise'}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Learning Pace */}
                <Card data-testid="card-learning-pace">
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <Zap className="w-4 h-4" />
                      Learning Pace
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Self-Paced</span>
                        <span>Structured</span>
                      </div>
                      <Progress value={learningPace} />
                      <p className="text-center text-sm font-medium">
                        {learningPace > 50 ? 'Structured Learning' : 'Self-Paced'}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>

          {/* Side Panel - Quick Stats */}
          <div className="space-y-6">
            <Card data-testid="card-total-sessions">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Study Sessions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <BookOpen className="w-8 h-8 text-primary" />
                  <span className="text-3xl font-bold" data-testid="text-total-sessions">{quickStats.totalSessions}</span>
                </div>
              </CardContent>
            </Card>

            <Card data-testid="card-avg-quiz-score">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">Average Quiz Score</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <Award className="w-8 h-8 text-primary" />
                  <span className="text-3xl font-bold" data-testid="text-avg-quiz-score">{quickStats.avgQuizScore}%</span>
                </div>
              </CardContent>
            </Card>

            <Card data-testid="card-profile-confidence">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">Profile Confidence</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-8 h-8 text-primary" />
                    <span className="text-3xl font-bold" data-testid="text-profile-confidence">{quickStats.profileConfidence}%</span>
                  </div>
                  <Progress value={quickStats.profileConfidence} />
                  <p className="text-xs text-muted-foreground">
                    How well the system knows your learning style
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card data-testid="card-streak">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">Current Streak</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <Flame className="w-8 h-8 text-orange-500" />
                  <span className="text-3xl font-bold" data-testid="text-streak">{quickStats.streak}</span>
                  <span className="text-muted-foreground">days</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
