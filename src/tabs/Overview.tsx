import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface OverviewProps {
  tweets: any[];
  patterns: any;
}

export const Overview = ({ tweets, patterns }: OverviewProps) => {
  // Calculate metrics from props
  const totalTweets = tweets.length;

  // Calculate sentiment distribution
  const sentimentCounts = tweets.reduce((acc: any, tweet: any) => {
    const sentiment = tweet.sentiment_analysis.sentiment.toLowerCase();
    acc[sentiment] = (acc[sentiment] || 0) + 1;
    return acc;
  }, {});

  // Calculate percentages for metrics
  const positivePercent = Math.round(
    ((sentimentCounts.positive || 0) / totalTweets) * 100
  );

  // Calculate average engagement
  const avgEngagement =
    tweets.reduce((sum: number, tweet: any) => {
      return sum + tweet.engagement_analysis.metrics.total_engagement;
    }, 0) / totalTweets;

  // Count viral tweets
  const viralTweets = tweets.filter(
    (tweet: any) => tweet.engagement_analysis.metrics.total_engagement > 30
  ).length;

  const engagementPercent = Math.min(
    Math.round((avgEngagement / 100) * 100),
    200
  );

  const viralPercent = Math.round((viralTweets / totalTweets) * 100);

  // Process daily activity data
  const dailyActivity = {
    Mon: 0,
    Tue: 0,
    Wed: 0,
    Thu: 0,
    Fri: 0,
    Sat: 0,
    Sun: 0,
  };

  // Fill with data from patterns
  if (
    patterns &&
    patterns.temporal_analysis &&
    patterns.temporal_analysis.volume_patterns
  ) {
    Object.entries(
      patterns.temporal_analysis.volume_patterns.daily_distribution
    ).forEach(([day, count]: [string, any]) => {
      switch (day) {
        case "Monday":
          dailyActivity["Mon"] = count;
          break;
        case "Tuesday":
          dailyActivity["Tue"] = count;
          break;
        case "Wednesday":
          dailyActivity["Wed"] = count;
          break;
        case "Thursday":
          dailyActivity["Thu"] = count;
          break;
        case "Friday":
          dailyActivity["Fri"] = count;
          break;
        case "Saturday":
          dailyActivity["Sat"] = count;
          break;
        case "Sunday":
          dailyActivity["Sun"] = count;
          break;
      }
    });
  }

  const dailyActivityData = Object.entries(dailyActivity).map(
    ([day, count]) => ({
      day,
      count,
    })
  );

  // Process emotion data
  const emotionData = tweets.map((tweet: any) => {
    const emotions = tweet.emotion_analysis;
    const total = Object.values(emotions).reduce(
      (sum: number, val: any) => sum + val,
      0
    );
    return {
      joy: emotions.joy || 0,
      trust: emotions.trust || 0,
      fear: emotions.fear || 0,
      surprise: emotions.surprise || 0,
      sadness: emotions.sadness || 0,
      disgust: emotions.disgust || 0,
      anger: emotions.anger || 0,
      anticipation: emotions.anticipation || 0,
      total,
    };
  });

  // Calculate average emotions
  const avgEmotions = emotionData.reduce(
    (acc: any, item: any) => {
      acc.joy += item.joy;
      acc.trust += item.trust;
      acc.fear += item.fear;
      acc.surprise += item.surprise;
      acc.sadness += item.sadness;
      acc.disgust += item.disgust;
      acc.anger += item.anger;
      acc.anticipation += item.anticipation;
      return acc;
    },
    {
      joy: 0,
      trust: 0,
      fear: 0,
      surprise: 0,
      sadness: 0,
      disgust: 0,
      anger: 0,
      anticipation: 0,
    }
  );

  if (emotionData.length > 0) {
    Object.keys(avgEmotions).forEach((key) => {
      avgEmotions[key] = Math.round(
        (avgEmotions[key] / emotionData.length) * 100
      );
    });
  }

  const emotionBars = [
    { name: "M", value: avgEmotions.joy },
    { name: "T", value: avgEmotions.trust },
    { name: "W", value: avgEmotions.fear },
    { name: "T", value: avgEmotions.surprise },
    { name: "F", value: avgEmotions.sadness },
    { name: "S", value: avgEmotions.disgust },
    { name: "S", value: avgEmotions.anger },
  ];

  // Goal data
  const goalData = [
    {
      name: "Positive",
      value: sentimentCounts.positive || 0,
      color: "#ff5722",
    },
    { name: "Neutral", value: sentimentCounts.neutral || 0, color: "#9c27b0" },
    {
      name: "Negative",
      value: sentimentCounts.negative || 0,
      color: "#000000",
    },
  ];

  return (
    <>
      <h1 className="text-4xl font-bold mb-8">Tweet Overview</h1>
      {/* Top metrics */}
      <div className="flex justify-between mb-8">
        <div className="flex items-center border-l-4 border-orange-500 pl-4">
          <div>
            <div className="text-gray-600">Sentiment</div>
            <div className="text-3xl font-bold">
              {positivePercent}%{" "}
              <span className="text-sm text-gray-500">positive</span>
            </div>
          </div>
          <div className="ml-4 text-xs text-green-600">
            ↑ {positivePercent}%
          </div>
        </div>

        <div className="flex items-center border-l-4 border-orange-500 pl-4">
          <div>
            <div className="text-gray-600">Engagement</div>
            <div className="text-3xl font-bold">
              {avgEngagement.toFixed(1)}{" "}
              <span className="text-sm text-gray-500">avg</span>
            </div>
          </div>
          <div className="ml-4 text-xs text-green-600">
            ↑ {engagementPercent}%
          </div>
        </div>

        <div className="flex items-center border-l-4 border-orange-500 pl-4">
          <div>
            <div className="text-gray-600">Viral Tweets</div>
            <div className="text-3xl font-bold">
              {viralTweets}{" "}
              <span className="text-sm text-gray-500">tweets</span>
            </div>
          </div>
          <div className="ml-4 text-xs text-green-600">↑ {viralPercent}%</div>
        </div>
      </div>

      {/* Three main charts */}
      <div className="grid grid-cols-3 gap-6 mb-8">
        {/* Tweet Activity */}
        <Card className="bg-white rounded-lg shadow">
          <CardHeader>
            <CardTitle className="text-lg">Tweet Activity</CardTitle>

            <div className="text-3xl font-bold">
              {totalTweets}{" "}
              <span className="text-sm font-normal text-gray-500">Tweets</span>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart
                data={dailyActivityData}
                margin={{ top: 20, right: 0, left: 0, bottom: 0 }}
              >
                <XAxis dataKey="day" axisLine={false} tickLine={false} hide />
                <YAxis hide domain={[0, "dataMax"]} />
                <Tooltip
                  formatter={(value) => [`${value} tweets`, "Count"]}
                  labelFormatter={() => `Daily Tweet Count`}
                />
                <Bar
                  dataKey="count"
                  fill="#ff5722"
                  radius={[10, 10, 0, 0]}
                  barSize={30}
                  isAnimationActive={false}
                />
              </BarChart>
            </ResponsiveContainer>
            <div className="flex justify-between text-xs text-gray-500 mt-2">
              <div>Mon</div>
              <div>Tue</div>
              <div>Wed</div>
              <div>Thu</div>
              <div>Fri</div>
              <div>Sat</div>
              <div>Sun</div>
            </div>
          </CardContent>
        </Card>

        {/* Emotion Analysis */}
        <Card className="bg-white rounded-lg shadow">
          <CardHeader>
            <CardTitle className="text-lg">Emotion Analysis</CardTitle>
            <div className="text-3xl font-bold">
              47–167{" "}
              <span className="text-sm font-normal text-gray-500">Score</span>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart
                data={emotionBars}
                margin={{ top: 20, right: 0, left: 0, bottom: 0 }}
              >
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis hide domain={[0, "dataMax"]} />
                <Tooltip
                  formatter={(value) => [`${value}`, "Score"]}
                  labelFormatter={(label) => `Emotion`}
                />
                <Bar
                  dataKey="value"
                  fill="#000000"
                  radius={[10, 10, 0, 0]}
                  barSize={10}
                />
              </BarChart>
            </ResponsiveContainer>
            <div className="flex justify-between text-xs text-gray-500 mt-2">
              <div>Joy</div>
              <div>Trust</div>
              <div>Fear</div>
              <div>Surprise</div>
              <div>Sad</div>
              <div>Disgust</div>
              <div>Anger</div>
            </div>
          </CardContent>
        </Card>

        {/* Sentiment Goals */}
        <Card className="bg-white rounded-lg shadow">
          <CardHeader>
            <CardTitle className="text-lg">Sentiment Goals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-around mb-4">
              <div className="px-3 py-1 bg-orange-100 text-orange-600 rounded-full text-sm">
                Positive {positivePercent}%
              </div>
              <div className="px-3 py-1 bg-purple-100 text-purple-600 rounded-full text-sm">
                Neutral{" "}
                {Math.round(
                  ((sentimentCounts.neutral || 0) / totalTweets) * 100
                )}
                %
              </div>
              <div className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm">
                Negative{" "}
                {Math.round(
                  ((sentimentCounts.negative || 0) / totalTweets) * 100
                )}
                %
              </div>
            </div>
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie
                  data={goalData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  dataKey="value"
                  startAngle={90}
                  endAngle={-270}
                >
                  {goalData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value, name) => [
                    `${value} tweets (${Math.round(
                      (value / totalTweets) * 100
                    )}%)`,
                    name,
                  ]}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
      {/* Bottom section */}
      <div className="grid grid-cols-2 gap-6">
        {/* Language Distribution */}
        <Card className="bg-gray-200 rounded-lg shadow p-4">
          <div className="flex justify-between items-center mb-2">
            <div className="text-lg font-medium">Language Distribution</div>
            <div className="text-sm text-gray-500">
              Started {new Date().toLocaleDateString()}
            </div>
          </div>
          <div className="text-3xl font-bold mb-4">
            {
              Object.keys(
                tweets.reduce((acc, tweet) => {
                  acc[tweet.language] = true;
                  return acc;
                }, {})
              ).length
            }{" "}
            languages
          </div>
          <div className="flex justify-around">
            {Object.entries(
              tweets.reduce((acc, tweet) => {
                acc[tweet.language] = (acc[tweet.language] || 0) + 1;
                return acc;
              }, {})
            )
              .slice(0, 5)
              .map(([lang, count], index) => (
                <div
                  key={index}
                  className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    index === 2 ? "bg-orange-500 text-white" : "bg-white"
                  }`}
                >
                  {lang}
                </div>
              ))}
          </div>
        </Card>

        {/* Engagement Metrics */}
        <Card className="bg-gray-200 rounded-lg shadow p-4">
          <div className="flex justify-between items-center mb-2">
            <div className="text-lg font-medium">Engagement Metrics</div>
            <div className="text-sm text-gray-500">0 IDLE HOURS</div>
          </div>
          <div className="text-3xl font-bold mb-4">
            {Math.round(avgEngagement)}/{totalTweets}{" "}
            <span className="text-sm font-normal">avg</span>
          </div>
          <div className="grid grid-cols-12 gap-1">
            {Array(12)
              .fill(0)
              .map((_, i) => (
                <div key={i} className="h-6 bg-gray-300 rounded"></div>
              ))}
            {Array(12)
              .fill(0)
              .map((_, i) => (
                <div key={i + 12} className="h-6 bg-black rounded"></div>
              ))}
          </div>
        </Card>
      </div>
    </>
  );
};

export default Overview;
