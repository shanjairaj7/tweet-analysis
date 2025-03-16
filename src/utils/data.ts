// Define types for the data structure
export interface Tweet {
  id: string;
  text: string;
  created_at: string;
  sentiment_analysis: {
    sentiment: string;
    confidence: number;
  };
  engagement_analysis: {
    metrics: {
      likes: number;
      retweets: number;
      replies: number;
      total_engagement: number;
    };
  };
  emotion_analysis: {
    joy: number;
    trust: number;
    fear: number;
    surprise: number;
    sadness: number;
    disgust: number;
    anger: number;
    anticipation: number;
    [key: string]: number;
  };
  linguistic_analysis: {
    entities: Array<{
      text: string;
      type: string;
    }>;
    hashtags: string[];
    keywords: string[];
  };
  [key: string]: any;
}

export interface Patterns {
  temporal_analysis: {
    volume_patterns: {
      daily_distribution: {
        [key: string]: number;
      };
      hourly_distribution?: {
        [key: string]: number;
      };
    };
  };
  [key: string]: any;
}

// API endpoints
const TWEETS_API = "https://twitter-analysis-8vun.onrender.com/api/tweets";
const PATTERNS_API = "https://twitter-analysis-8vun.onrender.com/api/patterns";

// State to store fetched data
let tweetsData: { tweets: Tweet[] } = { tweets: [] };
let patternsData: Patterns = {
  temporal_analysis: { volume_patterns: { daily_distribution: {} } },
};
let dataLoaded = false;

// Function to fetch data from APIs
export const fetchData = async (): Promise<{
  tweetsData: { tweets: Tweet[] };
  patternsData: Patterns;
}> => {
  try {
    // Fetch tweets data
    const tweetsResponse = await fetch(TWEETS_API);
    tweetsData = await tweetsResponse.json();

    // Fetch patterns data
    const patternsResponse = await fetch(PATTERNS_API);
    patternsData = await patternsResponse.json();

    dataLoaded = true;
    console.log("Data loaded successfully from APIs");

    // Recalculate all derived data
    calculateDerivedData();

    return { tweetsData, patternsData };
  } catch (error) {
    console.error("Error fetching data from APIs:", error);
    return { tweetsData, patternsData };
  }
};

// Check if data is loaded
export const isDataLoaded = () => dataLoaded;

// Tweets data
export let tweets: Tweet[] = tweetsData.tweets;
export let totalTweets = tweets.length;

// Define types for sentiment counts and emotions
interface SentimentCounts {
  positive?: number;
  negative?: number;
  neutral?: number;
  [key: string]: number | undefined;
}

interface EmotionValues {
  joy: number;
  trust: number;
  fear: number;
  surprise: number;
  sadness: number;
  disgust: number;
  anger: number;
  anticipation: number;
  [key: string]: number;
}

// Variables to store calculated data
export let sentimentCounts: SentimentCounts = {};
export let sentimentData: { name: string; value: number }[] = [];
export let avgEngagement = 0;
export let viralTweets = 0;
export let dailyActivity = {
  M: 0,
  T: 0,
  W: 0,
  T2: 0,
  F: 0,
  S: 0,
  S2: 0,
};
export let dailyActivityData: { day: string; count: number }[] = [];
export let emotionData: {
  joy: number;
  trust: number;
  fear: number;
  surprise: number;
  sadness: number;
  disgust: number;
  anger: number;
  anticipation: number;
  total: number;
}[] = [];
export let avgEmotions: EmotionValues = {
  joy: 0,
  trust: 0,
  fear: 0,
  surprise: 0,
  sadness: 0,
  disgust: 0,
  anger: 0,
  anticipation: 0,
};
export let emotionBarData: { name: string; value: number }[] = [];
export let emotionBars: { name: string; value: number }[] = [];
export let goalData: { name: string; value: number; color: string }[] = [];
export let sentimentPieData: { name: string; value: number; color: string }[] =
  [];
export let positivePercent = 0;
export let engagementPercent = 0;
export let viralPercent = 0;

// Function to calculate all derived data
function calculateDerivedData() {
  if (!dataLoaded || !tweetsData.tweets || tweetsData.tweets.length === 0) {
    console.log("No data available yet");
    return;
  }

  // Update base data
  tweets = tweetsData.tweets;
  totalTweets = tweets.length;

  // Calculate sentiment distribution
  sentimentCounts = tweets.reduce((acc: SentimentCounts, tweet: Tweet) => {
    const sentiment = tweet.sentiment_analysis.sentiment.toLowerCase();
    acc[sentiment] = (acc[sentiment] || 0) + 1;
    return acc;
  }, {});

  sentimentData = Object.entries(sentimentCounts).map(([name, value]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    value: value || 0,
  }));

  // Calculate average engagement
  avgEngagement =
    totalTweets > 0
      ? tweets.reduce((sum: number, tweet: Tweet) => {
          return sum + tweet.engagement_analysis.metrics.total_engagement;
        }, 0) / totalTweets
      : 0;

  // Count viral tweets
  viralTweets = tweets.filter(
    (tweet: Tweet) => tweet.engagement_analysis.metrics.total_engagement > 30
  ).length;

  // Process daily activity data
  dailyActivity = {
    M: 0,
    T: 0,
    W: 0,
    T2: 0,
    F: 0,
    S: 0,
    S2: 0,
  };

  // Fill with data from patterns
  if (
    patternsData &&
    patternsData.temporal_analysis &&
    patternsData.temporal_analysis.volume_patterns
  ) {
    Object.entries(
      patternsData.temporal_analysis.volume_patterns.daily_distribution
    ).forEach(([day, count]: [string, any]) => {
      switch (day) {
        case "Monday":
          dailyActivity["M"] = count;
          break;
        case "Tuesday":
          dailyActivity["T"] = count;
          break;
        case "Wednesday":
          dailyActivity["W"] = count;
          break;
        case "Thursday":
          dailyActivity["T2"] = count;
          break;
        case "Friday":
          dailyActivity["F"] = count;
          break;
        case "Saturday":
          dailyActivity["S"] = count;
          break;
        case "Sunday":
          dailyActivity["S2"] = count;
          break;
      }
    });
  }

  dailyActivityData = Object.entries(dailyActivity).map(([day, count]) => ({
    day: day.replace("2", ""),
    count,
  }));

  // Process emotion data for heart rate chart
  emotionData = tweets.map((tweet: Tweet) => {
    const emotions = tweet.emotion_analysis;
    const total = Object.values(emotions).reduce(
      (sum: number, val: number) => sum + val,
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
  avgEmotions = emotionData.reduce(
    (acc: EmotionValues, item) => {
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

  // Prepare emotion data for bar chart
  emotionBarData = [
    { name: "Joy", value: avgEmotions.joy },
    { name: "Trust", value: avgEmotions.trust },
    { name: "Fear", value: avgEmotions.fear },
    { name: "Anticipation", value: avgEmotions.anticipation },
    { name: "Surprise", value: avgEmotions.surprise },
    { name: "Anger", value: avgEmotions.anger },
    { name: "Sadness", value: avgEmotions.sadness },
  ];

  emotionBars = [
    { name: "M", value: avgEmotions.joy * 100 },
    { name: "T", value: avgEmotions.trust * 100 },
    { name: "W", value: avgEmotions.fear * 100 },
    { name: "T", value: avgEmotions.surprise * 100 },
    { name: "F", value: avgEmotions.sadness * 100 },
    { name: "S", value: avgEmotions.disgust * 100 },
    { name: "S", value: avgEmotions.anger * 100 },
  ];

  // Goal data
  goalData = [
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

  // Sentiment pie chart data
  sentimentPieData = [
    {
      name: "Positive",
      value: sentimentCounts.positive || 0,
      color: "#2e7d32",
    },
    {
      name: "Negative",
      value: sentimentCounts.negative || 0,
      color: "#d32f2f",
    },
    { name: "Neutral", value: sentimentCounts.neutral || 0, color: "#9e9e9e" },
  ];

  // Calculate percentages for metrics
  positivePercent =
    totalTweets > 0
      ? Math.round(((sentimentCounts.positive || 0) / totalTweets) * 100)
      : 0;

  engagementPercent = Math.min(Math.round((avgEngagement / 100) * 100), 200);
  viralPercent =
    totalTweets > 0 ? Math.round((viralTweets / totalTweets) * 100) : 0;

  console.log(`Data processed: ${totalTweets} tweets`);
}

// Generate sentiment trends data
export const months = [
  "Oct 2023",
  "Nov 2023",
  "Dec 2023",
  "Jan 2024",
  "Feb 2024",
  "Mar 2024",
  "Apr 2024",
  "May 2024",
  "Jun 2024",
  "Jul 2024",
  "Aug 2024",
  "Sep 2024",
  "Oct 2024",
  "Nov 2024",
  "Dec 2024",
  "Jan 2025",
  "Feb 2025",
];

// Generate some random but trending data for sentiment over time
export const sentimentTrendsData = months.map((month, index) => {
  // Start with base values and add some randomness, but ensure positive trends upward
  const basePositive = 50 + index * 1.5;
  const baseNegative = 30 - index * 0.5;
  const baseNeutral = 20 - index * 0.2;

  // Add randomness but keep within reasonable bounds
  const positive = Math.min(
    Math.max(basePositive + (Math.random() * 10 - 5), 40),
    80
  );
  const negative = Math.min(
    Math.max(baseNegative + (Math.random() * 6 - 3), 5),
    30
  );
  const neutral = Math.min(
    Math.max(baseNeutral + (Math.random() * 4 - 2), 5),
    30
  );

  return {
    month,
    positive,
    negative,
    neutral,
  };
});

// Colors for charts
export const COLORS = ["#ff5722", "#9c27b0", "#000000"];
export const SENTIMENT_COLORS = ["#2e7d32", "#d32f2f", "#9e9e9e"];
export const EMOTION_COLORS = {
  Joy: "#2e7d32",
  Trust: "#4caf50",
  Fear: "#bbdefb",
  Anticipation: "#673ab7",
  Surprise: "#8bc34a",
  Anger: "#f44336",
  Sadness: "#90caf9",
};

// Initialize data fetch
fetchData();
