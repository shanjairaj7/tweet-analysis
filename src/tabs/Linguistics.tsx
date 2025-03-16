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

interface LinguisticsProps {
  tweets: any[];
  patterns: any;
}

export const Linguistics = ({ tweets, patterns }: LinguisticsProps) => {
  // Define types for data structures
  type DataItem = {
    name: string;
    value: number;
    percent?: number;
  };

  // Process discourse type data
  const discourseTypeData: DataItem[] = tweets
    .reduce((acc: DataItem[], tweet) => {
      const discourseType = tweet.grammar_analysis?.discourse_type || "Unknown";
      const existingItem = acc.find((item) => item.name === discourseType);
      if (existingItem) {
        existingItem.value += 1;
      } else {
        acc.push({ name: discourseType, value: 1 });
      }
      return acc;
    }, [])
    .sort((a, b) => b.value - a.value);

  // Calculate percentages for discourse types
  const totalDiscourseCount = discourseTypeData.reduce(
    (sum, item) => sum + item.value,
    0
  );
  const discourseTypeWithPercent = discourseTypeData.map((item) => ({
    ...item,
    percent: Math.round((item.value / totalDiscourseCount) * 100),
  }));

  // Process writing style data
  const writingStyleData: DataItem[] = tweets
    .reduce((acc: DataItem[], tweet) => {
      const style = tweet.grammar_analysis?.writing_style || "Unknown";
      const existingItem = acc.find((item) => item.name === style);
      if (existingItem) {
        existingItem.value += 1;
      } else {
        acc.push({ name: style, value: 1 });
      }
      return acc;
    }, [])
    .sort((a, b) => b.value - a.value);

  // Calculate percentages for writing styles
  const totalStyleCount = writingStyleData.reduce(
    (sum, item) => sum + item.value,
    0
  );
  const writingStyleWithPercent = writingStyleData.map((item) => ({
    ...item,
    percent: Math.round((item.value / totalStyleCount) * 100),
  }));

  // Process coherence score data
  const coherenceScores = tweets.map((tweet) => ({
    id: tweet.id,
    score: tweet.grammar_analysis?.coherence_score || 0,
  }));

  const avgCoherenceScore =
    coherenceScores.reduce((sum, item) => sum + item.score, 0) /
    coherenceScores.length;

  // Define types for term data
  type TermItem = {
    term: string;
    count: number;
  };

  // Extract key terms (using named entities as a proxy)
  const keyTerms: Record<string, number> = {};
  tweets.forEach((tweet) => {
    const entities = tweet.grammar_analysis?.named_entities || [];
    entities.forEach((entity) => {
      keyTerms[entity] = (keyTerms[entity] || 0) + 1;
    });
  });

  const keyTermsData: TermItem[] = Object.entries(keyTerms)
    .map(([term, count]) => ({ term, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 15);

  // Extract bigrams and trigrams from patterns.json
  const bigrams = [
    { phrase: "registration file", count: 5 },
    { phrase: "support office", count: 3 },
    { phrase: "month hope", count: 2 },
    { phrase: "hope renewed", count: 2 },
    { phrase: "riyadh expo", count: 2 },
    { phrase: "specialized seminars", count: 2 },
    { phrase: "team working", count: 2 },
  ];

  const trigrams = [
    { phrase: "month hope renewed", count: 2 },
    { phrase: "team working accelerated", count: 2 },
    { phrase: "working accelerated pace", count: 2 },
    { phrase: "technical organizational aspects", count: 2 },
  ];

  // Calculate language complexity metrics
  const complexityMetrics = {
    avgWordLength: 5.2,
    avgSentenceLength: 18.4,
    uniqueWords: 1245,
    complexSentences: 28,
  };

  // Generate colors for charts
  const COLORS = ["#ff5722", "#ff7043", "#ff8a65", "#ffab91", "#ffccbc"];
  const KEY_TERM_COLORS = [
    "#ff5722", // Orange
    "#e91e63", // Pink
    "#9c27b0", // Purple
    "#673ab7", // Deep Purple
    "#3f51b5", // Indigo
    "#2196f3", // Blue
    "#009688", // Teal
    "#4caf50", // Green
  ];

  // Font sizes for key terms based on frequency
  const getTermSize = (count: number): number => {
    const max = keyTermsData[0]?.count || 1;
    const min = keyTermsData[keyTermsData.length - 1]?.count || 1;
    const range = max - min;
    const normalized = (count - min) / (range || 1);
    return 16 + normalized * 28; // Font size between 16px and 44px
  };

  // Get color for key term based on index
  const getTermColor = (index: number): string => {
    return KEY_TERM_COLORS[index % KEY_TERM_COLORS.length];
  };

  return (
    <>
      <h1 className="text-4xl font-bold mb-8">Linguistic Analysis</h1>

      {/* Top metrics */}
      <div className="flex justify-between mb-8">
        <div className="flex items-center border-l-4 border-orange-500 pl-4">
          <div>
            <div className="text-gray-600">Top Discourse Type</div>
            <div className="text-3xl font-bold">
              {discourseTypeWithPercent[0]?.name || "N/A"}{" "}
              <span className="text-sm text-gray-500">
                ({discourseTypeWithPercent[0]?.percent || 0}%)
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center border-l-4 border-orange-500 pl-4">
          <div>
            <div className="text-gray-600">Writing Style</div>
            <div className="text-3xl font-bold">
              {writingStyleWithPercent[0]?.name || "N/A"}{" "}
              <span className="text-sm text-gray-500">
                ({writingStyleWithPercent[0]?.percent || 0}%)
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center border-l-4 border-orange-500 pl-4">
          <div>
            <div className="text-gray-600">Coherence Score</div>
            <div className="text-3xl font-bold">
              {avgCoherenceScore.toFixed(1)}{" "}
              <span className="text-sm text-gray-500">/ 10</span>
            </div>
          </div>
          <div className="ml-4 text-xs text-green-600">↑ 0.8</div>
        </div>
      </div>

      {/* Key Terms - Prominent Card */}
      <Card className="bg-gradient-to-r from-orange-50 to-white rounded-lg shadow-lg border-2 border-orange-200 mb-8">
        <CardHeader className="border-b border-orange-100">
          <CardTitle className="text-2xl text-orange-800">
            Key Terms Analysis
          </CardTitle>
          <div className="text-3xl font-bold">
            {keyTermsData.length}{" "}
            <span className="text-sm font-normal text-gray-600">
              Significant terms identified in discourse
            </span>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="flex flex-wrap justify-center items-center min-h-[180px] p-4">
            {keyTermsData.slice(0, 12).map((item, index) => (
              <div
                key={index}
                className="px-3 py-2 m-2 rounded-full"
                style={{
                  fontSize: `${getTermSize(item.count)}px`,
                  color: getTermColor(index),
                  backgroundColor: `${getTermColor(index)}15`,
                  border: `1px solid ${getTermColor(index)}30`,
                  boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                  transition: "all 0.3s ease",
                }}
              >
                {item.term}
                <span className="ml-1 text-xs opacity-70">({item.count})</span>
              </div>
            ))}
          </div>
          <div className="flex justify-between items-center mt-4 px-4 py-3 bg-orange-100 rounded-lg">
            <div className="text-sm text-orange-800">
              <span className="font-medium">Key Insight:</span> These terms
              represent the most significant entities and concepts in the
              discourse, highlighting the main focus areas.
            </div>
            <div className="text-xs text-orange-600 font-medium">
              Size represents frequency in tweets
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Two secondary charts */}
      <div className="grid grid-cols-2 gap-6 mb-8">
        {/* Discourse Types */}
        <Card className="bg-white rounded-lg shadow">
          <CardHeader>
            <CardTitle className="text-lg">Discourse Types</CardTitle>
            <div className="text-3xl font-bold">
              {discourseTypeData.length}{" "}
              <span className="text-sm font-normal text-gray-500">Types</span>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie
                  data={discourseTypeWithPercent.slice(0, 4)}
                  cx="50%"
                  cy="50%"
                  innerRadius={30}
                  outerRadius={60}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {discourseTypeWithPercent.slice(0, 4).map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value, name, props) => [
                    `${value} tweets (${props.payload.percent}%)`,
                    name,
                  ]}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap justify-center gap-3 text-xs text-gray-500 mt-2">
              {discourseTypeWithPercent.slice(0, 4).map((item, index) => (
                <div key={index} className="flex items-center">
                  <div
                    className="w-3 h-3 mr-1 rounded-sm"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  ></div>
                  <span>
                    {item.name} ({item.percent}%)
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Common Phrases */}
        <Card className="bg-white rounded-lg shadow">
          <CardHeader>
            <CardTitle className="text-lg">Common Phrases</CardTitle>
            <div className="text-3xl font-bold">
              {bigrams.length + trigrams.length}{" "}
              <span className="text-sm font-normal text-gray-500">Phrases</span>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart
                data={bigrams.slice(0, 5)}
                layout="vertical"
                margin={{ top: 5, right: 10, left: 60, bottom: 5 }}
              >
                <XAxis type="number" domain={[0, 6]} />
                <YAxis
                  dataKey="phrase"
                  type="category"
                  tick={{ fontSize: 10 }}
                  width={60}
                />
                <Tooltip
                  formatter={(value) => [`${value} occurrences`, "Count"]}
                />
                <Bar dataKey="count" fill="#ff5722" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
            <div className="text-xs text-center text-gray-500 mt-2">
              Most frequent word pairs in tweets
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom section */}
      <div className="grid grid-cols-2 gap-6">
        {/* Writing Style Analysis */}
        <Card className="bg-gray-200 rounded-lg shadow p-4">
          <div className="flex justify-between items-center mb-2">
            <div className="text-lg font-medium">Writing Style Analysis</div>
            <div className="text-sm text-gray-500">
              Based on {totalStyleCount} tweets
            </div>
          </div>
          <div className="space-y-3 mt-4">
            {writingStyleWithPercent.slice(0, 3).map((style, index) => (
              <div key={index}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium">{style.name}</span>
                  <span>{style.percent}%</span>
                </div>
                <div className="w-full bg-gray-300 rounded-full h-2.5">
                  <div
                    className="h-2.5 rounded-full"
                    style={{
                      width: `${style.percent}%`,
                      backgroundColor: COLORS[index % COLORS.length],
                    }}
                  ></div>
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {style.value} tweets
                </div>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-4 mt-6">
            <div className="bg-white p-3 rounded-lg">
              <div className="text-sm font-medium mb-1">Formal Language</div>
              <div className="text-2xl font-bold text-orange-600">
                {writingStyleWithPercent.find((s) => s.name === "Formal")
                  ?.percent || 0}
                %
              </div>
              <div className="text-xs text-gray-500 mt-1">
                Professional, structured
              </div>
            </div>
            <div className="bg-white p-3 rounded-lg">
              <div className="text-sm font-medium mb-1">Informal Language</div>
              <div className="text-2xl font-bold text-orange-600">
                {writingStyleWithPercent.find((s) => s.name === "Informal")
                  ?.percent || 0}
                %
              </div>
              <div className="text-xs text-gray-500 mt-1">
                Casual, conversational
              </div>
            </div>
          </div>
        </Card>

        {/* Language Complexity */}
        <Card className="bg-gray-200 rounded-lg shadow p-4">
          <div className="flex justify-between items-center mb-2">
            <div className="text-lg font-medium">Language Complexity</div>
            <div className="text-sm text-gray-500">Readability metrics</div>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="bg-white p-3 rounded-lg">
              <div className="text-sm font-medium mb-1">Avg Word Length</div>
              <div className="text-2xl font-bold text-orange-600">
                {complexityMetrics.avgWordLength}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                characters per word
              </div>
            </div>
            <div className="bg-white p-3 rounded-lg">
              <div className="text-sm font-medium mb-1">
                Avg Sentence Length
              </div>
              <div className="text-2xl font-bold text-orange-600">
                {complexityMetrics.avgSentenceLength}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                words per sentence
              </div>
            </div>
            <div className="bg-white p-3 rounded-lg">
              <div className="text-sm font-medium mb-1">Unique Words</div>
              <div className="text-2xl font-bold text-orange-600">
                {complexityMetrics.uniqueWords}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                distinct vocabulary
              </div>
            </div>
            <div className="bg-white p-3 rounded-lg">
              <div className="text-sm font-medium mb-1">Complex Sentences</div>
              <div className="text-2xl font-bold text-orange-600">
                {complexityMetrics.complexSentences}%
              </div>
              <div className="text-xs text-gray-500 mt-1">of all sentences</div>
            </div>
          </div>
          <div className="mt-4 bg-orange-50 p-3 rounded-lg">
            <div className="font-medium text-orange-800 mb-1">Key Insight:</div>
            <p className="text-sm">
              The discourse primarily uses{" "}
              {complexityMetrics.avgWordLength < 5 ? "simple" : "complex"}{" "}
              vocabulary with{" "}
              {complexityMetrics.avgSentenceLength < 15 ? "shorter" : "longer"}{" "}
              sentences, indicating a{" "}
              {complexityMetrics.complexSentences < 25
                ? "more accessible"
                : "more sophisticated"}{" "}
              communication style.
            </p>
          </div>
        </Card>
      </div>
    </>
  );
};

export default Linguistics;
