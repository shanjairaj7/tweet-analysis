import { useState, useEffect } from "react";
import { Overview } from "../tabs/Overview";
import { Sentiment } from "../tabs/Sentiment";
import { Linguistics } from "../tabs/Linguistics";
import { Temporal } from "../tabs/Temporal";
import { Engagement } from "../tabs/Engagement";
import { Explorer } from "../tabs/Explorer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";

// API endpoints
const TWEETS_API = "https://twitter-analysis-8vun.onrender.com/api/tweets";
const PATTERNS_API = "https://twitter-analysis-8vun.onrender.com/api/patterns";

export const TabContainer = () => {
  const [loading, setLoading] = useState(true);
  const [tweetsData, setTweetsData] = useState<any>({ tweets: [] });
  const [patternsData, setPatternsData] = useState<any>({});
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch tweets data
        const tweetsResponse = await fetch(TWEETS_API);
        const tweetsResult = await tweetsResponse.json();
        setTweetsData(tweetsResult);

        // Fetch patterns data
        const patternsResponse = await fetch(PATTERNS_API);
        const patternsResult = await patternsResponse.json();
        setPatternsData(patternsResult);

        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to load data. Please try again later.");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        {/* Modern loading animation container */}
        <div className="relative w-32 h-32 mb-6">
          {/* Outer spinning ring with gradient */}
          <div className="absolute top-0 left-0 w-full h-full rounded-full border-4 border-transparent border-t-blue-500 border-r-purple-500 border-b-pink-500 border-l-orange-500 animate-spin"></div>

          {/* Middle pulsing ring */}
          <div className="absolute top-2 left-2 right-2 bottom-2 rounded-full border-4 border-transparent border-t-blue-400 border-r-purple-400 border-b-pink-400 border-l-orange-400 animate-[spin_1.5s_linear_infinite_reverse] opacity-75"></div>

          {/* Inner spinning element */}
          <div className="absolute top-6 left-6 right-6 bottom-6 rounded-full bg-gradient-to-br from-blue-300 via-purple-300 to-pink-300 animate-pulse"></div>

          {/* Twitter-like bird silhouette in the center */}
          <div className="absolute inset-0 flex items-center justify-center">
            <svg
              className="w-10 h-10 text-white"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M23.643 4.937c-.835.37-1.732.62-2.675.733.962-.576 1.7-1.49 2.048-2.578-.9.534-1.897.922-2.958 1.13-.85-.904-2.06-1.47-3.4-1.47-2.572 0-4.658 2.086-4.658 4.66 0 .364.042.718.12 1.06-3.873-.195-7.304-2.05-9.602-4.868-.4.69-.63 1.49-.63 2.342 0 1.616.823 3.043 2.072 3.878-.764-.025-1.482-.234-2.11-.583v.06c0 2.257 1.605 4.14 3.737 4.568-.392.106-.803.162-1.227.162-.3 0-.593-.028-.877-.082.593 1.85 2.313 3.198 4.352 3.234-1.595 1.25-3.604 1.995-5.786 1.995-.376 0-.747-.022-1.112-.065 2.062 1.323 4.51 2.093 7.14 2.093 8.57 0 13.255-7.098 13.255-13.254 0-.2-.005-.402-.014-.602.91-.658 1.7-1.477 2.323-2.41z"></path>
            </svg>
          </div>
        </div>

        {/* Text with animated dots */}
        <div className="flex flex-col items-center">
          <h3 className="text-xl font-bold text-gray-800 mb-2 tracking-wide">
            Analyzing Tweets
          </h3>
          <div className="flex items-center text-sm text-gray-600">
            <span>Processing data</span>
            <span className="ml-1 inline-flex">
              <span className="animate-[bounce_1s_infinite_100ms]">.</span>
              <span className="animate-[bounce_1s_infinite_200ms]">.</span>
              <span className="animate-[bounce_1s_infinite_300ms]">.</span>
            </span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-xl text-red-500">{error}</p>
      </div>
    );
  }

  const tweets = tweetsData || [];

  return (
    <Tabs defaultValue="overview" className="w-full">
      <TabsList className="mb-4">
        <TabsTrigger value="overview" className="px-6 py-3">
          Overview
        </TabsTrigger>
        <TabsTrigger value="linguistics" className="px-6 py-3">
          Linguistics
        </TabsTrigger>
        <TabsTrigger value="sentiment" className="px-6 py-3">
          Sentiment
        </TabsTrigger>
        <TabsTrigger value="temporal" className="px-6 py-3">
          Temporal
        </TabsTrigger>
        <TabsTrigger value="engagement" className="px-6 py-3">
          Engagement
        </TabsTrigger>
        <TabsTrigger value="explorer" className="px-6 py-3">
          Tweet Explorer
        </TabsTrigger>
      </TabsList>

      <div className="mb-4 flex justify-end gap-2">
        <Input placeholder="Language" className="max-w-[200px]" />
        <Input placeholder="Date Range" className="max-w-[200px]" />
      </div>

      <TabsContent value="overview">
        <Overview tweets={tweets} patterns={patternsData} />
      </TabsContent>

      <TabsContent value="sentiment">
        <Sentiment tweets={tweets} patterns={patternsData} />
      </TabsContent>

      <TabsContent value="linguistics">
        <Linguistics tweets={tweets} patterns={patternsData} />
      </TabsContent>

      <TabsContent value="temporal">
        <Temporal tweets={tweets} patterns={patternsData} />
      </TabsContent>

      <TabsContent value="engagement">
        <Engagement tweets={tweets} patterns={patternsData} />
      </TabsContent>

      <TabsContent value="explorer">
        <Explorer tweets={tweets} patterns={patternsData} />
      </TabsContent>
    </Tabs>
  );
};

export default TabContainer;
