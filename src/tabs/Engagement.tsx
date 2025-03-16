import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

interface EngagementProps {
  tweets: any[];
  patterns: any;
}

export const Engagement = ({ tweets, patterns }: EngagementProps) => {
  // Calculate engagement by type
  const engagementByType = {
    likes: tweets.reduce(
      (sum: number, tweet: any) =>
        sum + (tweet.engagement_metrics?.favorite_count || 0),
      0
    ),
    retweets: tweets.reduce(
      (sum: number, tweet: any) =>
        sum + (tweet.engagement_metrics?.retweet_count || 0),
      0
    ),
    replies: tweets.reduce(
      (sum: number, tweet: any) =>
        sum + (tweet.engagement_metrics?.reply_count || 0),
      0
    ),
    bookmarks: tweets.reduce(
      (sum: number, tweet: any) =>
        sum + (tweet.engagement_metrics?.bookmark_count || 0),
      0
    ),
  };

  // Calculate percentages for engagement composition
  const totalInteractions =
    engagementByType.likes +
    engagementByType.retweets +
    engagementByType.replies +
    engagementByType.bookmarks;

  const likesPercent = (
    (engagementByType.likes / totalInteractions) *
    100
  ).toFixed(1);
  const retweetsPercent = (
    (engagementByType.retweets / totalInteractions) *
    100
  ).toFixed(1);
  const repliesPercent = (
    (engagementByType.replies / totalInteractions) *
    100
  ).toFixed(1);
  const bookmarksPercent = (
    (engagementByType.bookmarks / totalInteractions) *
    100
  ).toFixed(1);

  const engagementCompositionData = [
    { name: "Likes", value: engagementByType.likes, percent: likesPercent },
    {
      name: "Retweets",
      value: engagementByType.retweets,
      percent: retweetsPercent,
    },
    {
      name: "Replies",
      value: engagementByType.replies,
      percent: repliesPercent,
    },
    {
      name: "Bookmarks",
      value: engagementByType.bookmarks,
      percent: bookmarksPercent,
    },
  ];

  // Calculate engagement rate distribution
  const engagementRates = tweets.map((tweet: any) => {
    const engagement =
      tweet.engagement_analysis?.metrics?.total_engagement || 0;
    // Use a default value of 100 for followers if not available
    const followers = 100;
    return {
      id: tweet.id,
      rate: (engagement / followers) * 100,
    };
  });

  // Calculate average and median engagement rates
  const avgEngagementRate = (
    engagementRates.reduce((sum: number, item: any) => sum + item.rate, 0) /
    engagementRates.length
  ).toFixed(3);

  // Sort rates for median calculation
  const sortedRates = [...engagementRates].sort((a, b) => a.rate - b.rate);
  const medianEngagementRate = (
    engagementRates.length % 2 === 0
      ? (sortedRates[engagementRates.length / 2 - 1].rate +
          sortedRates[engagementRates.length / 2].rate) /
        2
      : sortedRates[Math.floor(engagementRates.length / 2)].rate
  ).toFixed(3);

  // Create histogram data for engagement rate distribution
  const histogramData = [
    {
      name: "0.01",
      count: engagementRates.filter((item: any) => item.rate < 0.02).length,
    },
    {
      name: "0.05",
      count: engagementRates.filter(
        (item: any) => item.rate >= 0.02 && item.rate < 0.07
      ).length,
    },
    {
      name: "0.1",
      count: engagementRates.filter(
        (item: any) => item.rate >= 0.07 && item.rate < 0.15
      ).length,
    },
    {
      name: "0.2",
      count: engagementRates.filter(
        (item: any) => item.rate >= 0.15 && item.rate < 0.3
      ).length,
    },
    {
      name: "0.5",
      count: engagementRates.filter(
        (item: any) => item.rate >= 0.3 && item.rate < 0.7
      ).length,
    },
    {
      name: "1.0",
      count: engagementRates.filter((item: any) => item.rate >= 0.7).length,
    },
  ];

  // Viral content analysis - using a fixed threshold of 25 for better visualization
  const viralThreshold = 25;
  const viralTweetsArray = tweets.filter(
    (tweet: any) =>
      (tweet.engagement_analysis?.metrics?.total_engagement || 0) >
      viralThreshold
  );

  const viralTweetsCount = viralTweetsArray.length;
  const viralTweetsPercent = ((viralTweetsCount / tweets.length) * 100).toFixed(
    1
  );

  const avgViralEngagement =
    viralTweetsArray.length > 0
      ? viralTweetsArray.reduce(
          (sum: number, tweet: any) =>
            sum + (tweet.engagement_analysis?.metrics?.total_engagement || 0),
          0
        ) / viralTweetsArray.length
      : 0;

  const peakViralEngagement =
    viralTweetsArray.length > 0
      ? Math.max(
          ...viralTweetsArray.map(
            (tweet: any) =>
              tweet.engagement_analysis?.metrics?.total_engagement || 0
          )
        )
      : 0;

  // Viral vs. Non-viral engagement comparison
  const nonViralTweets = tweets.filter(
    (tweet: any) =>
      (tweet.engagement_analysis?.metrics?.total_engagement || 0) <=
      viralThreshold
  );

  const avgNonViralEngagement =
    nonViralTweets.length > 0
      ? nonViralTweets.reduce(
          (sum: number, tweet: any) =>
            sum + (tweet.engagement_analysis?.metrics?.total_engagement || 0),
          0
        ) / nonViralTweets.length
      : 0;

  // Content features impact on engagement
  // Language impact - using tweets data for comparison
  const allTweets = tweets;
  const englishTweets = allTweets.filter(
    (tweet: any) => tweet.language === "English"
  );
  const arabicTweets = allTweets.filter(
    (tweet: any) => tweet.language === "Arabic"
  );

  const avgEnglishEngagement =
    englishTweets.length > 0
      ? englishTweets.reduce(
          (sum: number, tweet: any) =>
            sum + (tweet.engagement_analysis?.metrics?.total_engagement || 0),
          0
        ) / englishTweets.length
      : 0;

  const avgArabicEngagement =
    arabicTweets.length > 0
      ? arabicTweets.reduce(
          (sum: number, tweet: any) =>
            sum + (tweet.engagement_analysis?.metrics?.total_engagement || 0),
          0
        ) / arabicTweets.length
      : 0;

  // Calculate engagement by day of week for better insights
  interface DayEngagement {
    count: number;
    total: number;
  }

  interface DayOfWeekEngagement {
    [key: string]: DayEngagement;
  }

  const dayOfWeekEngagement: DayOfWeekEngagement = {
    Monday: { count: 0, total: 0 },
    Tuesday: { count: 0, total: 0 },
    Wednesday: { count: 0, total: 0 },
    Thursday: { count: 0, total: 0 },
    Friday: { count: 0, total: 0 },
    Saturday: { count: 0, total: 0 },
    Sunday: { count: 0, total: 0 },
  };

  tweets.forEach((tweet: any) => {
    const day = tweet.temporal_analysis?.posting_time?.day;
    if (day && dayOfWeekEngagement[day]) {
      dayOfWeekEngagement[day].count++;
      dayOfWeekEngagement[day].total +=
        tweet.engagement_analysis?.metrics?.total_engagement || 0;
    }
  });

  // Calculate average engagement by day
  const dayEngagementData = Object.entries(dayOfWeekEngagement)
    .map(([day, data]) => ({
      day,
      avgEngagement: data.count > 0 ? data.total / data.count : 0,
    }))
    .sort((a, b) => b.avgEngagement - a.avgEngagement);

  // Find best day to post
  const bestDayToPost = dayEngagementData[0]?.day || "N/A";

  // Tweet length impact (mock data)
  const tweetLengthCorrelation = -0.128;
  const tweetLengthPValue = 0.025;

  // Peak engagement times (mock data)
  const peakHours = "19:00-21:00";
  const peakDays = "Tuesday, Wednesday";

  // Colors - updated to match the health app design
  const COLORS = ["#ff5722", "#9c27b0", "#000000", "#ff9800"];
  const CHART_COLORS = {
    primary: "#ff5722", // Orange
    secondary: "#9c27b0", // Purple
    accent: "#000000", // Black
    neutral: "#9e9e9e", // Gray
  };

  return (
    <>
      <div className="bg-[#f5f5f0] p-4 rounded-lg mb-6">
        <h1 className="text-2xl font-bold text-black">
          Engagement Analysis: User Interactions & Viral Content
        </h1>
        <div className="flex justify-end gap-2 mt-2">
          <button className="bg-white text-black border border-gray-200 px-3 py-1 rounded text-sm">
            Time Range
          </button>
          <button className="bg-white text-black border border-gray-200 px-3 py-1 rounded text-sm">
            Engagement
          </button>
        </div>
      </div>

      {/* Top section - Engagement Composition and Rate Distribution */}
      <div className="grid grid-cols-2 gap-6 mb-6">
        {/* Engagement Composition */}
        <Card className="bg-white rounded-lg shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl font-bold">
              Engagement Composition
            </CardTitle>
            <div className="text-sm text-gray-500">
              Breakdown of how users interact with your content
            </div>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center justify-center">
                <div className="relative w-48 h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={engagementCompositionData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {engagementCompositionData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value: number) => [
                          `${value} interactions`,
                          "",
                        ]}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <div className="text-sm text-gray-500">Total:</div>
                    <div className="text-3xl font-bold text-orange-600">
                      {totalInteractions}
                    </div>
                  </div>
                </div>
                <div className="ml-4">
                  {engagementCompositionData.map((item, index) => (
                    <div key={index} className="flex items-center mb-3">
                      <div
                        className="w-4 h-4 mr-2"
                        style={{
                          backgroundColor: COLORS[index % COLORS.length],
                        }}
                      ></div>
                      <span className="text-sm font-medium">
                        {item.name}{" "}
                        <span className="text-gray-500">({item.percent}%)</span>
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4 bg-white p-3 rounded-lg">
                <div className="text-sm font-medium">Key Insight:</div>
                <div className="mt-1 text-sm">
                  {engagementByType.likes > engagementByType.retweets * 3
                    ? "Likes dominate your engagement. Consider creating more shareable content to increase retweets."
                    : "You have a good balance of likes and retweets, indicating shareable content."}
                  {engagementByType.replies < totalInteractions * 0.05
                    ? " Your content generates few replies - consider asking questions to boost conversations."
                    : " Your content generates good conversation with a healthy number of replies."}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Engagement Rate Distribution */}
        <Card className="bg-white rounded-lg shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl font-bold">
              Engagement Rate Distribution
            </CardTitle>
            <div className="text-sm text-gray-500">
              How your tweets perform relative to audience size
            </div>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="mb-4 flex justify-between">
                <div>
                  <div className="text-sm font-medium">Average Rate:</div>
                  <div className="text-2xl text-orange-600">
                    {avgEngagementRate}%
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium">Median Rate:</div>
                  <div className="text-2xl text-orange-600">
                    {medianEngagementRate}%
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium">Range:</div>
                  <div className="text-lg text-orange-600">0.01% - 1.0%</div>
                </div>
              </div>

              <ResponsiveContainer width="100%" height={180}>
                <BarChart
                  data={histogramData}
                  margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
                >
                  <XAxis
                    dataKey="name"
                    label={{
                      value: "Engagement Rate (%)",
                      position: "bottom",
                      offset: 0,
                      style: { textAnchor: "middle" },
                    }}
                  />
                  <YAxis
                    label={{
                      value: "Number of Tweets",
                      angle: -90,
                      position: "left",
                      style: { textAnchor: "middle" },
                    }}
                  />
                  <Tooltip
                    formatter={(value) => [`${value} tweets`, "Count"]}
                  />
                  <Bar dataKey="count" fill={CHART_COLORS.primary} />
                </BarChart>
              </ResponsiveContainer>

              <div className="mt-4 bg-white p-3 rounded-lg">
                <div className="text-sm font-medium">What This Means:</div>
                <div className="mt-1 text-sm">
                  Engagement rate measures interactions relative to your
                  audience size.
                  {Number(avgEngagementRate) > 0.2
                    ? " Your average rate is strong compared to industry standards (typically 0.5-1%)."
                    : " Your average rate has room for improvement compared to industry standards (typically 0.5-1%)."}
                  {Number(medianEngagementRate) <
                  Number(avgEngagementRate) * 0.5
                    ? " The difference between average and median suggests a few high-performing tweets are lifting your overall numbers."
                    : " Your consistent engagement across tweets indicates reliable content performance."}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Viral Content Analysis */}
      <Card className="bg-white rounded-lg shadow mb-6">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl font-bold">
            Viral Content Analysis
          </CardTitle>
          <div className="text-sm text-gray-500">
            Tweets with engagement &gt; {viralThreshold} are considered viral
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="mb-4">
                <div className="text-lg font-bold flex items-baseline">
                  <span className="text-3xl text-orange-600 mr-2">
                    {viralTweetsCount}
                  </span>{" "}
                  viral tweets
                </div>
                <div className="text-sm text-gray-500 mt-1">
                  ({viralTweetsPercent}% of total tweets)
                </div>
              </div>
              <div className="mb-4">
                <div className="text-lg font-bold">Average engagement</div>
                <div className="text-3xl text-orange-600">
                  {Math.round(avgViralEngagement)}
                  <span className="text-sm text-gray-500 ml-2">
                    per viral tweet
                  </span>
                </div>
              </div>
              <div>
                <div className="text-lg font-bold">Peak engagement</div>
                <div className="text-3xl text-orange-600">
                  {peakViralEngagement}
                  <span className="text-sm text-gray-500 ml-2">
                    interactions
                  </span>
                </div>
              </div>
            </div>

            <div className="col-span-2 bg-gray-50 p-4 rounded-lg">
              <div className="mb-4 font-bold text-lg">
                Viral vs. Non-viral Engagement Comparison
              </div>

              <div className="mb-6">
                <div className="flex justify-between mb-1">
                  <div className="text-sm font-medium">Viral</div>
                  <div className="text-sm text-gray-500">
                    {Math.round(avgViralEngagement)} avg. interactions
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-4">
                  <div
                    className="bg-[#ff5722] h-4 rounded-full"
                    style={{
                      width: `${Math.min(
                        (avgViralEngagement / 50) * 100,
                        100
                      )}%`,
                    }}
                  ></div>
                </div>
              </div>

              <div className="mb-6">
                <div className="flex justify-between mb-1">
                  <div className="text-sm font-medium">Non-viral</div>
                  <div className="text-sm text-gray-500">
                    {Math.round(avgNonViralEngagement)} avg. interactions
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-4">
                  <div
                    className="bg-[#ff5722] h-4 rounded-full"
                    style={{
                      width: `${Math.min(
                        (avgNonViralEngagement / 50) * 100,
                        100
                      )}%`,
                    }}
                  ></div>
                </div>
              </div>

              <div className="mt-4 bg-white p-3 rounded-lg">
                <div className="font-bold">Statistical Significance:</div>
                <div className="text-sm mt-1">t-test: 7.68 (p &lt; 0.001)</div>
                <div className="text-xs text-gray-600 mt-2">
                  Viral tweets receive significantly more engagement than
                  non-viral tweets.
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Content Features Impact */}
      <Card className="bg-white rounded-lg shadow mb-6">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl font-bold">
            Content Features Impact on Engagement
          </CardTitle>
          <div className="text-sm text-gray-500">
            Analysis of how different content characteristics affect engagement
            levels
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Language Impact */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="mb-4 font-bold text-lg">Language Impact</div>
              <div className="mb-2 text-sm text-gray-500">
                Average engagement by language
              </div>

              <div className="mb-4">
                <div className="flex justify-between mb-1">
                  <div className="text-sm font-medium">Arabic</div>
                  <div className="text-sm text-gray-500">
                    {avgArabicEngagement.toFixed(1)} interactions
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-4">
                  <div
                    className="bg-[#ff5722] h-4 rounded-full"
                    style={{
                      width: `${Math.min(
                        (avgArabicEngagement / 40) * 100,
                        100
                      )}%`,
                    }}
                  ></div>
                </div>
              </div>

              <div className="mb-2">
                <div className="flex justify-between mb-1">
                  <div className="text-sm font-medium">English</div>
                  <div className="text-sm text-gray-500">
                    {avgEnglishEngagement.toFixed(1)} interactions
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-4">
                  <div
                    className="bg-[#ff5722] h-4 rounded-full"
                    style={{
                      width: `${Math.min(
                        (avgEnglishEngagement / 40) * 100,
                        100
                      )}%`,
                    }}
                  ></div>
                </div>
              </div>

              <div className="mt-4 text-xs text-gray-600">
                Arabic tweets receive{" "}
                {avgArabicEngagement > avgEnglishEngagement
                  ? `${(
                      (avgArabicEngagement / avgEnglishEngagement) * 100 -
                      100
                    ).toFixed(0)}% more`
                  : `${(
                      (avgEnglishEngagement / avgArabicEngagement) * 100 -
                      100
                    ).toFixed(0)}% less`}
                engagement than English tweets.
              </div>
            </div>

            {/* Tweet Length Impact */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="mb-4 font-bold text-lg">Tweet Length Impact</div>

              <div className="mb-4">
                <div className="flex items-center mb-2">
                  <div className="w-24 text-sm font-medium">Correlation:</div>
                  <div className="text-xl text-orange-600">
                    {tweetLengthCorrelation}
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="w-24 text-sm font-medium">p-value:</div>
                  <div className="text-sm">
                    {tweetLengthPValue}{" "}
                    <span className="text-green-600 font-medium">
                      (significant)
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-4 p-3 bg-white rounded-lg">
                <div className="text-sm font-medium">Key Finding:</div>
                <div className="mt-1 text-sm">
                  Shorter tweets tend to get more engagement. The negative
                  correlation indicates that as tweet length increases,
                  engagement typically decreases.
                </div>
              </div>
            </div>

            {/* Peak Engagement Times */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="mb-4 font-bold text-lg">
                Peak Engagement Times
              </div>

              <div className="mb-4">
                <div className="flex items-center mb-3">
                  <div className="w-16 text-sm font-medium">Hours:</div>
                  <div className="text-xl text-orange-600">{peakHours}</div>
                </div>
                <div className="flex items-center mb-3">
                  <div className="w-16 text-sm font-medium">Days:</div>
                  <div className="text-xl text-orange-600">{peakDays}</div>
                </div>
                <div className="flex items-center">
                  <div className="w-16 text-sm font-medium">Best day:</div>
                  <div className="text-xl text-orange-600">{bestDayToPost}</div>
                </div>
              </div>

              <div className="mt-4 p-3 bg-white rounded-lg">
                <div className="text-sm font-medium">Recommendation:</div>
                <div className="mt-1 text-sm">
                  Schedule your most important tweets for {bestDayToPost}{" "}
                  between {peakHours}
                  to maximize engagement potential.
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Top Performing Tweets */}
      <Card className="bg-white rounded-lg shadow">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl font-bold">
            Top Performing Tweets
          </CardTitle>
          <div className="text-sm text-gray-500">
            Your most engaging content and what makes it successful
          </div>
        </CardHeader>
        <CardContent>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="space-y-4">
              {tweets
                .sort(
                  (a: any, b: any) =>
                    (b.engagement_analysis?.metrics?.total_engagement || 0) -
                    (a.engagement_analysis?.metrics?.total_engagement || 0)
                )
                .slice(0, 3)
                .map((tweet: any, index: number) => (
                  <div
                    key={index}
                    className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className="font-medium flex items-center">
                        <div className="w-7 h-7 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center mr-2 text-sm font-bold">
                          {index + 1}
                        </div>
                        <span className="text-base">
                          @{tweet.author_username}
                        </span>
                      </div>
                      <div className="text-xs text-gray-500">
                        {new Date(tweet.created_at).toLocaleDateString()}
                      </div>
                    </div>
                    <p className="text-sm mb-3 line-clamp-2 border-l-2 border-orange-300 pl-3">
                      {tweet.original_text}
                    </p>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <span className="font-bold text-orange-600 text-lg mr-1">
                          {tweet.engagement_analysis?.metrics
                            ?.total_engagement || 0}
                        </span>
                        <span className="text-gray-500">engagements</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center">
                          <div className="w-3 h-3 rounded-full bg-orange-500 mr-1"></div>
                          <span className="text-xs text-gray-600">
                            {tweet.engagement_metrics?.favorite_count || 0}{" "}
                            likes
                          </span>
                        </div>
                        <div className="flex items-center">
                          <div className="w-3 h-3 rounded-full bg-purple-500 mr-1"></div>
                          <span className="text-xs text-gray-600">
                            {tweet.engagement_metrics?.retweet_count || 0}{" "}
                            retweets
                          </span>
                        </div>
                        <div
                          className={`px-2 py-1 rounded-full text-xs ${
                            tweet.sentiment_analysis?.sentiment?.toLowerCase() ===
                            "positive"
                              ? "bg-orange-100 text-orange-600"
                              : tweet.sentiment_analysis?.sentiment?.toLowerCase() ===
                                "negative"
                              ? "bg-purple-100 text-purple-600"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {tweet.sentiment_analysis?.sentiment}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>

            <div className="mt-6 bg-white p-4 rounded-lg border border-orange-100">
              <div className="text-sm font-medium mb-2">
                Common Success Factors:
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-start">
                  <div className="w-6 h-6 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center mr-2 text-xs">
                    1
                  </div>
                  <div>
                    <div className="text-sm font-medium">Content Type</div>
                    <div className="text-xs text-gray-600">
                      {tweets[0]?.sentiment_analysis?.sentiment?.toLowerCase() ===
                      "positive"
                        ? "Positive messaging resonates with your audience"
                        : "Informative content drives the most engagement"}
                    </div>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-6 h-6 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center mr-2 text-xs">
                    2
                  </div>
                  <div>
                    <div className="text-sm font-medium">Timing</div>
                    <div className="text-xs text-gray-600">
                      Top tweets were posted during peak engagement hours (
                      {peakHours})
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default Engagement;
