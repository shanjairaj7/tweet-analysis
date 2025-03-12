import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { tweets } from "../utils/data";

export const Temporal = () => {
  // Process data for time of day distribution
  const hourlyData = Array(24)
    .fill(0)
    .map((_, hour) => ({
      hour,
      count: tweets.filter((tweet) => {
        const tweetHour = tweet.temporal_analysis?.posting_time?.hour;
        return tweetHour === hour;
      }).length,
    }));

  // Find peak hours (top 3)
  const peakHours = [...hourlyData]
    .sort((a, b) => b.count - a.count)
    .slice(0, 3)
    .map((item) => item.hour);

  // Process data for day of week distribution
  const daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const shortDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const dailyData = daysOfWeek.map((day, index) => ({
    day: shortDays[index],
    fullDay: day,
    count: tweets.filter(
      (tweet) => tweet.temporal_analysis?.posting_time?.day === day
    ).length,
  }));

  // Find most active day
  const mostActiveDay = [...dailyData].sort((a, b) => b.count - a.count)[0];

  // Process data for monthly distribution
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const monthlyData = months.map((month) => {
    const count = tweets.filter((tweet) => {
      if (!tweet.temporal_analysis?.posting_time?.date) return false;
      const tweetDate = new Date(tweet.temporal_analysis.posting_time.date);
      return months[tweetDate.getMonth()] === month;
    }).length;
    return { month, count };
  });

  // Calculate trend data
  const trendData = [
    { period: "Last Week", count: 42 },
    { period: "This Week", count: 78 },
  ];
  const growthRate = Math.round(((78 - 42) / 42) * 100);

  // Calculate time zone distribution
  const timeZoneData = [
    { name: "GMT+0", value: 15 },
    { name: "GMT+1", value: 22 },
    { name: "GMT+2", value: 18 },
    { name: "GMT+3", value: 45 },
    { name: "GMT+4", value: 12 },
    { name: "Other", value: 8 },
  ];

  // Calculate posting frequency
  const postingFrequency = {
    daily: 12,
    weekly: 84,
    monthly: 304,
    avgPerDay: 12,
    mostActiveHour: peakHours[0],
  };

  // Colors
  const COLORS = ["#ff5722", "#ff7043", "#ff8a65", "#ffab91", "#ffccbc"];

  return (
    <>
      <h1 className="text-4xl font-bold mb-8">Temporal Analysis</h1>

      {/* Top metrics */}
      <div className="flex justify-between mb-8">
        <div className="flex items-center border-l-4 border-orange-500 pl-4">
          <div>
            <div className="text-gray-600">Peak Activity</div>
            <div className="text-3xl font-bold">
              {peakHours[0]}:00{" "}
              <span className="text-sm text-gray-500">hour</span>
            </div>
          </div>
          <div className="ml-4 text-xs text-green-600">
            ↑ {hourlyData[peakHours[0]].count} tweets
          </div>
        </div>

        <div className="flex items-center border-l-4 border-orange-500 pl-4">
          <div>
            <div className="text-gray-600">Most Active Day</div>
            <div className="text-3xl font-bold">
              {mostActiveDay?.fullDay}{" "}
              <span className="text-sm text-gray-500">day</span>
            </div>
          </div>
          <div className="ml-4 text-xs text-green-600">
            ↑ {mostActiveDay?.count} tweets
          </div>
        </div>

        <div className="flex items-center border-l-4 border-orange-500 pl-4">
          <div>
            <div className="text-gray-600">Weekly Growth</div>
            <div className="text-3xl font-bold">
              +{growthRate}%{" "}
              <span className="text-sm text-gray-500">increase</span>
            </div>
          </div>
        </div>
      </div>

      {/* Three main charts */}
      <div className="grid grid-cols-3 gap-6 mb-8">
        {/* Hourly Distribution */}
        <Card className="bg-white rounded-lg shadow">
          <CardHeader>
            <CardTitle className="text-lg">Hourly Distribution</CardTitle>
            <div className="text-3xl font-bold">
              24{" "}
              <span className="text-sm font-normal text-gray-500">hours</span>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart
                data={hourlyData}
                margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
              >
                <XAxis
                  dataKey="hour"
                  tick={{ fontSize: 10 }}
                  tickFormatter={(hour) => `${hour}`}
                  interval={3}
                />
                <YAxis hide />
                <Tooltip
                  formatter={(value) => [`${value} tweets`, "Count"]}
                  labelFormatter={(hour) =>
                    `${hour}:00 - ${(hour + 1) % 24}:00`
                  }
                />
                <Bar dataKey="count" fill="#ff5722" radius={[4, 4, 0, 0]}>
                  {hourlyData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={
                        peakHours.includes(entry.hour) ? "#ff3d00" : "#ff8a65"
                      }
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            <div className="flex justify-between text-xs text-gray-500 mt-2">
              <div>12 AM</div>
              <div>6 AM</div>
              <div>12 PM</div>
              <div>6 PM</div>
              <div>11 PM</div>
            </div>
          </CardContent>
        </Card>

        {/* Daily Distribution */}
        <Card className="bg-white rounded-lg shadow">
          <CardHeader>
            <CardTitle className="text-lg">Daily Distribution</CardTitle>
            <div className="text-3xl font-bold">
              7 <span className="text-sm font-normal text-gray-500">days</span>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart
                data={dailyData}
                margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
              >
                <XAxis dataKey="day" />
                <YAxis hide />
                <Tooltip
                  formatter={(value) => [`${value} tweets`, "Count"]}
                  labelFormatter={(day) =>
                    dailyData.find((d) => d.day === day)?.fullDay || day
                  }
                />
                <Bar dataKey="count" fill="#ff8a65" radius={[4, 4, 0, 0]}>
                  {dailyData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={
                        entry.fullDay === mostActiveDay?.fullDay
                          ? "#ff3d00"
                          : "#ff8a65"
                      }
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            <div className="flex justify-between text-xs text-gray-500 mt-2">
              <div>Weekend</div>
              <div className="text-center">Weekdays</div>
              <div className="text-right">Weekend</div>
            </div>
          </CardContent>
        </Card>

        {/* Time Zone Distribution */}
        <Card className="bg-white rounded-lg shadow">
          <CardHeader>
            <CardTitle className="text-lg">Time Zone Distribution</CardTitle>
            <div className="text-3xl font-bold">
              6 <span className="text-sm font-normal text-gray-500">zones</span>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie
                  data={timeZoneData}
                  cx="50%"
                  cy="50%"
                  innerRadius={30}
                  outerRadius={60}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {timeZoneData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value, name) => [
                    `${value} tweets (${Math.round((value / 120) * 100)}%)`,
                    name,
                  ]}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex justify-center gap-3 text-xs text-gray-500 mt-2 flex-wrap">
              {timeZoneData.slice(0, 3).map((zone, index) => (
                <div key={index} className="flex items-center">
                  <div
                    className="w-3 h-3 mr-1 rounded-sm"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  ></div>
                  <span>{zone.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom section */}
      <div className="grid grid-cols-2 gap-6">
        {/* Monthly Trend */}
        <Card className="bg-gray-200 rounded-lg shadow p-4">
          <div className="flex justify-between items-center mb-2">
            <div className="text-lg font-medium">Monthly Trend</div>
            <div className="text-sm text-gray-500">Last 12 months</div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart
              data={monthlyData}
              margin={{ top: 10, right: 10, left: 10, bottom: 10 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#e0e0e0"
              />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => [`${value} tweets`, "Count"]} />
              <Line
                type="monotone"
                dataKey="count"
                stroke="#ff5722"
                strokeWidth={2}
                dot={{ r: 3, fill: "#ff5722" }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
          <div className="mt-4 bg-orange-50 p-3 rounded-lg">
            <div className="font-medium text-orange-800 mb-1">
              Seasonal Patterns:
            </div>
            <p className="text-sm">
              Tweet volume shows a{" "}
              {monthlyData[11].count > monthlyData[0].count
                ? "positive"
                : "negative"}{" "}
              trend over the year, with peak activity in{" "}
              {
                months[
                  monthlyData.indexOf(
                    monthlyData.reduce(
                      (max, item) => (max.count > item.count ? max : item),
                      { month: "", count: 0 }
                    )
                  )
                ]
              }
              .
            </p>
          </div>
        </Card>

        {/* Posting Frequency */}
        <Card className="bg-gray-200 rounded-lg shadow p-4">
          <div className="flex justify-between items-center mb-2">
            <div className="text-lg font-medium">Posting Frequency</div>
            <div className="text-sm text-gray-500">Activity metrics</div>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="bg-white p-3 rounded-lg">
              <div className="text-sm font-medium mb-1">Daily Average</div>
              <div className="text-2xl font-bold text-orange-600">
                {postingFrequency.avgPerDay}
              </div>
              <div className="text-xs text-gray-500 mt-1">tweets per day</div>
            </div>
            <div className="bg-white p-3 rounded-lg">
              <div className="text-sm font-medium mb-1">Weekly Total</div>
              <div className="text-2xl font-bold text-orange-600">
                {postingFrequency.weekly}
              </div>
              <div className="text-xs text-gray-500 mt-1">tweets per week</div>
            </div>
            <div className="bg-white p-3 rounded-lg">
              <div className="text-sm font-medium mb-1">Most Active Hour</div>
              <div className="text-2xl font-bold text-orange-600">
                {postingFrequency.mostActiveHour}:00
              </div>
              <div className="text-xs text-gray-500 mt-1">
                peak activity time
              </div>
            </div>
            <div className="bg-white p-3 rounded-lg">
              <div className="text-sm font-medium mb-1">Most Active Day</div>
              <div className="text-2xl font-bold text-orange-600">
                {mostActiveDay?.fullDay.slice(0, 3)}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {mostActiveDay?.count} tweets
              </div>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex justify-between items-center mb-2">
              <div className="text-sm font-medium">Weekday vs. Weekend</div>
              <div className="text-xs text-gray-500">Tweet distribution</div>
            </div>
            <div className="bg-white rounded-lg p-3">
              <div className="flex h-6 rounded-full overflow-hidden">
                {/* Calculate weekday percentage */}
                {(() => {
                  const weekdayCount = dailyData
                    .filter((d) => !["Sun", "Sat"].includes(d.day))
                    .reduce((sum, day) => sum + day.count, 0);

                  const weekendCount = dailyData
                    .filter((d) => ["Sun", "Sat"].includes(d.day))
                    .reduce((sum, day) => sum + day.count, 0);

                  const total = weekdayCount + weekendCount;
                  const weekdayPercent = Math.round(
                    (weekdayCount / total) * 100
                  );

                  return (
                    <>
                      <div
                        className="bg-orange-500"
                        style={{ width: `${weekdayPercent}%` }}
                        title={`Weekdays: ${weekdayPercent}%`}
                      ></div>
                      <div
                        className="bg-orange-300"
                        style={{ width: `${100 - weekdayPercent}%` }}
                        title={`Weekends: ${100 - weekdayPercent}%`}
                      ></div>
                    </>
                  );
                })()}
              </div>
              <div className="flex justify-between text-xs mt-2">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-orange-500 mr-1 rounded-sm"></div>
                  <span>Weekdays</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-orange-300 mr-1 rounded-sm"></div>
                  <span>Weekends</span>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </>
  );
};

export default Temporal;
