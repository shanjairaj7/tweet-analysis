import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { tweets } from "../utils/data";

export const Explorer = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSentiment, setSelectedSentiment] = useState("all");
  const [selectedLanguage, setSelectedLanguage] = useState("all");

  // Filter tweets based on search and filters
  const filteredTweets = tweets.filter((tweet) => {
    // Search term filter
    const matchesSearch =
      searchTerm === "" ||
      tweet.original_text.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (tweet.translated_text &&
        tweet.translated_text.toLowerCase().includes(searchTerm.toLowerCase()));

    // Sentiment filter
    const matchesSentiment =
      selectedSentiment === "all" ||
      tweet.sentiment_analysis.sentiment.toLowerCase() === selectedSentiment;

    // Language filter
    const matchesLanguage =
      selectedLanguage === "all" || tweet.language === selectedLanguage;

    return matchesSearch && matchesSentiment && matchesLanguage;
  });

  // Get unique languages
  const languages = Array.from(new Set(tweets.map((tweet) => tweet.language)));

  // Calculate statistics
  const sentimentCounts = {
    positive: filteredTweets.filter(
      (tweet) => tweet.sentiment_analysis.sentiment.toLowerCase() === "positive"
    ).length,
    neutral: filteredTweets.filter(
      (tweet) => tweet.sentiment_analysis.sentiment.toLowerCase() === "neutral"
    ).length,
    negative: filteredTweets.filter(
      (tweet) => tweet.sentiment_analysis.sentiment.toLowerCase() === "negative"
    ).length,
  };

  const totalFilteredTweets = filteredTweets.length;

  // Calculate top hashtags
  const hashtagCounts = {};
  filteredTweets.forEach((tweet) => {
    if (tweet.hashtags) {
      tweet.hashtags.split(",").forEach((tag) => {
        const trimmedTag = tag.trim();
        hashtagCounts[trimmedTag] = (hashtagCounts[trimmedTag] || 0) + 1;
      });
    }
  });

  const topHashtags = Object.entries(hashtagCounts)
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  return (
    <>
      <h1 className="text-4xl font-bold mb-8">Tweet Explorer</h1>

      {/* Top metrics */}
      <div className="flex justify-between mb-8">
        <div className="flex items-center border-l-4 border-orange-500 pl-4">
          <div>
            <div className="text-gray-600">Total Tweets</div>
            <div className="text-3xl font-bold">
              {totalFilteredTweets}{" "}
              <span className="text-sm text-gray-500">matching</span>
            </div>
          </div>
        </div>

        <div className="flex items-center border-l-4 border-orange-500 pl-4">
          <div>
            <div className="text-gray-600">Sentiment Ratio</div>
            <div className="text-3xl font-bold">
              {totalFilteredTweets > 0
                ? Math.round(
                    (sentimentCounts.positive / totalFilteredTweets) * 100
                  )
                : 0}
              % <span className="text-sm text-gray-500">positive</span>
            </div>
          </div>
        </div>

        <div className="flex items-center border-l-4 border-orange-500 pl-4">
          <div>
            <div className="text-gray-600">Top Hashtag</div>
            <div className="text-3xl font-bold">
              {topHashtags.length > 0 ? topHashtags[0].tag : "None"}{" "}
              <span className="text-sm text-gray-500">
                ({topHashtags.length > 0 ? topHashtags[0].count : 0})
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <Card className="bg-white rounded-lg shadow mb-6">
        <CardHeader>
          <CardTitle className="text-lg">Search and Filter Tweets</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-medium mb-1">Search</label>
              <Input
                placeholder="Search in tweet text..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border-orange-200 focus:border-orange-500 focus:ring-orange-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Sentiment
              </label>
              <select
                className="w-full p-2 border rounded-md border-orange-200 focus:border-orange-500 focus:ring-orange-500"
                value={selectedSentiment}
                onChange={(e) => setSelectedSentiment(e.target.value)}
              >
                <option value="all">All Sentiments</option>
                <option value="positive">Positive</option>
                <option value="neutral">Neutral</option>
                <option value="negative">Negative</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Language</label>
              <select
                className="w-full p-2 border rounded-md border-orange-200 focus:border-orange-500 focus:ring-orange-500"
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
              >
                <option value="all">All Languages</option>
                {languages.map((lang) => (
                  <option key={lang} value={lang}>
                    {lang}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filter Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {/* Sentiment Distribution */}
        <Card className="bg-white rounded-lg shadow">
          <CardHeader>
            <CardTitle className="text-lg">Sentiment Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex h-8 rounded-full overflow-hidden mb-4">
              {totalFilteredTweets > 0 ? (
                <>
                  <div
                    className="bg-green-500"
                    style={{
                      width: `${Math.round(
                        (sentimentCounts.positive / totalFilteredTweets) * 100
                      )}%`,
                    }}
                    title={`Positive: ${Math.round(
                      (sentimentCounts.positive / totalFilteredTweets) * 100
                    )}%`}
                  ></div>
                  <div
                    className="bg-gray-400"
                    style={{
                      width: `${Math.round(
                        (sentimentCounts.neutral / totalFilteredTweets) * 100
                      )}%`,
                    }}
                    title={`Neutral: ${Math.round(
                      (sentimentCounts.neutral / totalFilteredTweets) * 100
                    )}%`}
                  ></div>
                  <div
                    className="bg-red-500"
                    style={{
                      width: `${Math.round(
                        (sentimentCounts.negative / totalFilteredTweets) * 100
                      )}%`,
                    }}
                    title={`Negative: ${Math.round(
                      (sentimentCounts.negative / totalFilteredTweets) * 100
                    )}%`}
                  ></div>
                </>
              ) : (
                <div className="bg-gray-200 w-full"></div>
              )}
            </div>
            <div className="flex justify-between text-sm">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 mr-1 rounded-sm"></div>
                <span>
                  Positive:{" "}
                  {totalFilteredTweets > 0
                    ? Math.round(
                        (sentimentCounts.positive / totalFilteredTweets) * 100
                      )
                    : 0}
                  %
                </span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-gray-400 mr-1 rounded-sm"></div>
                <span>
                  Neutral:{" "}
                  {totalFilteredTweets > 0
                    ? Math.round(
                        (sentimentCounts.neutral / totalFilteredTweets) * 100
                      )
                    : 0}
                  %
                </span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-red-500 mr-1 rounded-sm"></div>
                <span>
                  Negative:{" "}
                  {totalFilteredTweets > 0
                    ? Math.round(
                        (sentimentCounts.negative / totalFilteredTweets) * 100
                      )
                    : 0}
                  %
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Language Distribution */}
        <Card className="bg-white rounded-lg shadow">
          <CardHeader>
            <CardTitle className="text-lg">Language Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2 justify-center">
              {languages.slice(0, 6).map((lang, index) => {
                const count = filteredTweets.filter(
                  (tweet) => tweet.language === lang
                ).length;
                const percentage =
                  totalFilteredTweets > 0
                    ? Math.round((count / totalFilteredTweets) * 100)
                    : 0;
                return (
                  <div
                    key={lang}
                    className={`px-3 py-2 rounded-lg flex flex-col items-center ${
                      selectedLanguage === lang
                        ? "bg-orange-100 border border-orange-300"
                        : "bg-gray-100"
                    }`}
                    style={{ minWidth: "80px" }}
                  >
                    <div className="font-bold">{lang}</div>
                    <div className="text-sm text-gray-500">{percentage}%</div>
                  </div>
                );
              })}
            </div>
            {languages.length > 6 && (
              <div className="text-center text-sm text-gray-500 mt-2">
                +{languages.length - 6} more languages
              </div>
            )}
          </CardContent>
        </Card>

        {/* Top Hashtags */}
        <Card className="bg-white rounded-lg shadow">
          <CardHeader>
            <CardTitle className="text-lg">Top Hashtags</CardTitle>
          </CardHeader>
          <CardContent>
            {topHashtags.length > 0 ? (
              <div className="space-y-2">
                {topHashtags.map((item, index) => (
                  <div key={index} className="flex items-center">
                    <div
                      className="h-2 bg-orange-500 rounded-sm mr-2"
                      style={{
                        width: `${Math.min(
                          Math.round((item.count / topHashtags[0].count) * 100),
                          100
                        )}%`,
                        minWidth: "10px",
                      }}
                    ></div>
                    <div className="flex-1 flex justify-between">
                      <span className="font-medium">#{item.tag}</span>
                      <span className="text-gray-500 text-sm">
                        {item.count} tweets
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4 text-gray-500">
                No hashtags found in filtered tweets
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Results */}
      <Card className="bg-white rounded-lg shadow">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-xl font-bold">
            Results ({filteredTweets.length} tweets)
          </CardTitle>
          <div className="text-sm text-gray-500">
            Showing {Math.min(10, filteredTweets.length)} of{" "}
            {filteredTweets.length}
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {filteredTweets.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <div className="text-orange-500 text-4xl mb-2">🔍</div>
                <p className="font-medium">
                  No tweets match your search criteria
                </p>
                <p className="text-sm mt-2">
                  Try adjusting your filters or search term
                </p>
              </div>
            ) : (
              filteredTweets.slice(0, 10).map((tweet) => (
                <div key={tweet.id} className="border-b border-orange-100 pb-4">
                  <div className="flex justify-between items-start mb-2">
                    <div className="font-bold flex items-center">
                      <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center mr-2">
                        @
                      </div>
                      <span>@{tweet.author_username}</span>
                    </div>
                    <div className="text-sm text-gray-500">
                      {new Date(tweet.created_at).toLocaleString()}
                    </div>
                  </div>

                  <div className="bg-orange-50 p-3 rounded-lg mb-2">
                    <p className="mb-2">{tweet.original_text}</p>

                    {tweet.original_text !== tweet.translated_text && (
                      <p className="mb-2 text-gray-600 italic text-sm border-t border-orange-100 pt-2">
                        <span className="font-medium text-orange-800">
                          Translation:
                        </span>{" "}
                        {tweet.translated_text}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-2 mt-2">
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        tweet.sentiment_analysis.sentiment.toLowerCase() ===
                        "positive"
                          ? "bg-green-100 text-green-800"
                          : tweet.sentiment_analysis.sentiment.toLowerCase() ===
                            "negative"
                          ? "bg-red-100 text-red-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {tweet.sentiment_analysis.sentiment}
                    </span>
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                      Lang: {tweet.language}
                    </span>
                    <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded-full">
                      Engagement:{" "}
                      {tweet.engagement_analysis.metrics.total_engagement}
                    </span>
                    {tweet.hashtags &&
                      tweet.hashtags.split(",").map((tag, i) => (
                        <span
                          key={i}
                          className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full"
                        >
                          {tag.trim()}
                        </span>
                      ))}
                  </div>

                  <div className="mt-3 text-xs text-gray-500 flex items-center">
                    <span className="mr-4">
                      <span className="font-medium">Favorites:</span>{" "}
                      {tweet.engagement_metrics?.favorite_count || 0}
                    </span>
                    <span className="mr-4">
                      <span className="font-medium">Retweets:</span>{" "}
                      {tweet.engagement_metrics?.retweet_count || 0}
                    </span>
                    <span>
                      <span className="font-medium">Replies:</span>{" "}
                      {tweet.engagement_metrics?.reply_count || 0}
                    </span>
                  </div>
                </div>
              ))
            )}

            {filteredTweets.length > 10 && (
              <div className="text-center pt-4">
                <Button
                  variant="outline"
                  className="bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-100"
                >
                  Load More
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default Explorer;
