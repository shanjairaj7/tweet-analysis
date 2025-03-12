import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  LineChart,
  Line,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  totalTweets,
  sentimentCounts,
  sentimentPieData,
  emotionBarData,
  EMOTION_COLORS,
  sentimentTrendsData,
  positivePercent,
  tweets,
} from "../utils/data";

export const Sentiment = () => {
  // Calculate sentiment metrics
  const negativePercent = Math.round(
    ((sentimentCounts.negative || 0) / totalTweets) * 100
  );
  const neutralPercent = Math.round(
    ((sentimentCounts.neutral || 0) / totalTweets) * 100
  );

  // Calculate sentiment change (mock data for demonstration)
  const previousPositivePercent = positivePercent - 5;
  const positiveChange = positivePercent - previousPositivePercent;

  // Calculate most common emotions
  const topEmotions = [...emotionBarData]
    .sort((a, b) => b.value - a.value)
    .slice(0, 3)
    .map((emotion) => emotion.name);

  // Calculate sentiment by language
  const sentimentByLanguage = Object.entries(
    tweets.reduce((acc, tweet) => {
      const lang = tweet.language;
      const sentiment = tweet.sentiment_analysis.sentiment.toLowerCase();

      if (!acc[lang]) {
        acc[lang] = { positive: 0, negative: 0, neutral: 0, total: 0 };
      }

      acc[lang][sentiment]++;
      acc[lang].total++;

      return acc;
    }, {})
  )
    .map(([lang, counts]) => ({
      language: lang,
      positivePercent: Math.round((counts.positive / counts.total) * 100),
      negativePercent: Math.round((counts.negative / counts.total) * 100),
      neutralPercent: Math.round((counts.neutral / counts.total) * 100),
      total: counts.total,
    }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 5);

  return (
    <>
      <h1 className="text-4xl font-bold mb-8">Sentiment Analysis</h1>

      {/* Top metrics */}
      <div className="flex justify-between mb-8">
        <div className="flex items-center border-l-4 border-orange-500 pl-4">
          <div>
            <div className="text-gray-600">Positive Sentiment</div>
            <div className="text-3xl font-bold">
              {positivePercent}%{" "}
              <span className="text-sm text-gray-500">of tweets</span>
            </div>
          </div>
          <div className="ml-4 text-xs text-green-600">↑ {positiveChange}%</div>
        </div>

        <div className="flex items-center border-l-4 border-orange-500 pl-4">
          <div>
            <div className="text-gray-600">Negative Sentiment</div>
            <div className="text-3xl font-bold">
              {negativePercent}%{" "}
              <span className="text-sm text-gray-500">of tweets</span>
            </div>
          </div>
          <div className="ml-4 text-xs text-red-600">↓ 2%</div>
        </div>

        <div className="flex items-center border-l-4 border-orange-500 pl-4">
          <div>
            <div className="text-gray-600">Top Emotions</div>
            <div className="text-xl font-bold">{topEmotions.join(", ")}</div>
          </div>
        </div>
      </div>

      {/* Three main charts */}
      <div className="grid grid-cols-3 gap-6 mb-8">
        {/* Sentiment Distribution */}
        <Card className="bg-white rounded-lg shadow">
          <CardHeader>
            <CardTitle className="text-lg">Sentiment Distribution</CardTitle>
            <div className="text-3xl font-bold">
              {positivePercent}%{" "}
              <span className="text-sm font-normal text-gray-500">
                Positive
              </span>
            </div>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <div className="relative w-full h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={sentimentPieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={60}
                    dataKey="value"
                    startAngle={90}
                    endAngle={-270}
                    paddingAngle={2}
                  >
                    {sentimentPieData.map((entry, index) => (
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
            </div>
            <div className="flex justify-around w-full mt-4 text-xs text-gray-500">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-800 mr-1 rounded-sm"></div>
                <span>Positive</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-red-600 mr-1 rounded-sm"></div>
                <span>Negative</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-gray-400 mr-1 rounded-sm"></div>
                <span>Neutral</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Emotion Analysis */}
        <Card className="bg-white rounded-lg shadow">
          <CardHeader>
            <CardTitle className="text-lg">Emotion Analysis</CardTitle>
            <div className="text-3xl font-bold">
              7{" "}
              <span className="text-sm font-normal text-gray-500">
                Emotions
              </span>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart
                data={emotionBarData}
                layout="vertical"
                margin={{ top: 5, right: 10, left: 40, bottom: 5 }}
              >
                <XAxis type="number" domain={[0, 75]} tickCount={4} />
                <YAxis
                  dataKey="name"
                  type="category"
                  width={80}
                  tick={{ fontSize: 11 }}
                />
                <Tooltip formatter={(value) => [`${value}%`, "Percentage"]} />
                <Bar dataKey="value" radius={[0, 4, 4, 0]} fill="#ff5722">
                  {emotionBarData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={EMOTION_COLORS[entry.name] || "#ff5722"}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            <div className="text-xs text-center text-gray-500 mt-2">
              Percentage of tweets expressing each emotion
            </div>
          </CardContent>
        </Card>

        {/* Sentiment Trends Preview */}
        <Card className="bg-white rounded-lg shadow">
          <CardHeader>
            <CardTitle className="text-lg">Sentiment Trends</CardTitle>
            <div className="text-3xl font-bold">
              {sentimentTrendsData[
                sentimentTrendsData.length - 1
              ].positive.toFixed(1)}
              %{" "}
              <span className="text-sm font-normal text-gray-500">
                Current Positive
              </span>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={180}>
              <LineChart
                data={sentimentTrendsData.slice(-6)}
                margin={{ top: 5, right: 10, left: 0, bottom: 5 }}
              >
                <YAxis domain={[0, 100]} hide />
                <Tooltip formatter={(value) => [`${value.toFixed(1)}%`, ""]} />
                <Line
                  type="monotone"
                  dataKey="positive"
                  stroke="#ff5722"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 6 }}
                  name="Positive"
                />
              </LineChart>
            </ResponsiveContainer>
            <div className="flex justify-between text-xs text-gray-500 mt-2">
              <div>6 months ago</div>
              <div>Current</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom section */}
      <div className="grid grid-cols-2 gap-6">
        {/* Sentiment Trends Over Time */}
        <Card className="bg-gray-200 rounded-lg shadow p-4">
          <div className="flex justify-between items-center mb-2">
            <div className="text-lg font-medium">
              Sentiment Trends Over Time
            </div>
            <div className="text-sm text-gray-500">
              Last {sentimentTrendsData.length} months
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart
              data={sentimentTrendsData}
              margin={{ top: 5, right: 10, left: 0, bottom: 5 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#e0e0e0"
              />
              <XAxis dataKey="month" tick={{ fontSize: 10 }} tickMargin={5} />
              <YAxis
                domain={[0, 100]}
                tickCount={5}
                width={30}
                tick={{ fontSize: 10 }}
              />
              <Tooltip formatter={(value) => [`${value.toFixed(1)}%`, ""]} />
              <Line
                type="monotone"
                dataKey="positive"
                stroke="#2e7d32"
                strokeWidth={2}
                dot={{ r: 2 }}
                activeDot={{ r: 6 }}
                name="Positive"
              />
              <Line
                type="monotone"
                dataKey="negative"
                stroke="#d32f2f"
                strokeWidth={2}
                dot={{ r: 2 }}
                activeDot={{ r: 6 }}
                name="Negative"
              />
              <Line
                type="monotone"
                dataKey="neutral"
                stroke="#9e9e9e"
                strokeWidth={2}
                dot={{ r: 2 }}
                activeDot={{ r: 6 }}
                name="Neutral"
              />
            </LineChart>
          </ResponsiveContainer>
          <div className="flex justify-center gap-4 mt-2 text-xs">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-800 mr-1 rounded-sm"></div>
              <span>Positive</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-red-600 mr-1 rounded-sm"></div>
              <span>Negative</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-gray-400 mr-1 rounded-sm"></div>
              <span>Neutral</span>
            </div>
          </div>
        </Card>

        {/* Sentiment by Language */}
        <Card className="bg-gray-200 rounded-lg shadow p-4">
          <div className="flex justify-between items-center mb-2">
            <div className="text-lg font-medium">Sentiment by Language</div>
            <div className="text-sm text-gray-500">Top 5 languages</div>
          </div>
          <div className="space-y-3">
            {sentimentByLanguage.map((lang, index) => (
              <div key={index} className="bg-white p-2 rounded">
                <div className="flex justify-between items-center mb-1">
                  <div className="font-medium">{lang.language}</div>
                  <div className="text-xs text-gray-500">
                    {lang.total} tweets
                  </div>
                </div>
                <div className="flex h-4 rounded-full overflow-hidden">
                  <div
                    className="bg-green-500"
                    style={{ width: `${lang.positivePercent}%` }}
                    title={`Positive: ${lang.positivePercent}%`}
                  ></div>
                  <div
                    className="bg-gray-400"
                    style={{ width: `${lang.neutralPercent}%` }}
                    title={`Neutral: ${lang.neutralPercent}%`}
                  ></div>
                  <div
                    className="bg-red-500"
                    style={{ width: `${lang.negativePercent}%` }}
                    title={`Negative: ${lang.negativePercent}%`}
                  ></div>
                </div>
                <div className="flex justify-between text-xs mt-1">
                  <div>{lang.positivePercent}% positive</div>
                  <div>{lang.negativePercent}% negative</div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </>
  );
};

export default Sentiment;
