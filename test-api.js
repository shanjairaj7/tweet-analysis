// Simple script to test the API endpoints
const fetch = require("node-fetch");

// API endpoints
const TWEETS_API = "https://twitter-analysis-8vun.onrender.com/api/tweets";
const PATTERNS_API = "https://twitter-analysis-8vun.onrender.com/api/patterns";

// Function to fetch data from the tweets API
async function fetchTweets() {
  try {
    const response = await fetch(TWEETS_API);
    const data = await response.json();
    console.log("Tweets API Response Structure:");
    console.log(
      JSON.stringify(
        {
          totalTweets: data.tweets.length,
          sampleTweet: data.tweets[0],
        },
        null,
        2
      )
    );
  } catch (error) {
    console.error("Error fetching tweets:", error);
  }
}

// Function to fetch data from the patterns API
async function fetchPatterns() {
  try {
    const response = await fetch(PATTERNS_API);
    const data = await response.json();
    console.log("Patterns API Response Structure:");
    console.log(
      JSON.stringify(
        {
          temporal_analysis: {
            volume_patterns: {
              daily_distribution:
                data.temporal_analysis.volume_patterns.daily_distribution,
            },
          },
        },
        null,
        2
      )
    );
  } catch (error) {
    console.error("Error fetching patterns:", error);
  }
}

// Execute the functions
(async () => {
  console.log("Testing API endpoints...");
  await fetchTweets();
  await fetchPatterns();
})();
