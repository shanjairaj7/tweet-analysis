import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import Layout from "../layout";
import "./App.css";

// Import tab components
import { Overview } from "./tabs/Overview";
import { Sentiment } from "./tabs/Sentiment";
import { Linguistics } from "./tabs/Linguistics";
import { Temporal } from "./tabs/Temporal";
import { Engagement } from "./tabs/Engagement";
import { Explorer } from "./tabs/Explorer";

function App() {
  return (
    <Layout>
      <div className="flex min-h-screen bg-gray-100">
        {/* Main content */}
        <div className="flex-1 p-8 bg-gray-50">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="overview" className="px-6 py-3">
                Overview
              </TabsTrigger>
              <TabsTrigger value="sentiment" className="px-6 py-3">
                Sentiment
              </TabsTrigger>
              <TabsTrigger value="linguistics" className="px-6 py-3">
                Linguistics
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
              <Overview />
            </TabsContent>

            <TabsContent value="sentiment">
              <Sentiment />
            </TabsContent>

            <TabsContent value="linguistics">
              <Linguistics />
            </TabsContent>

            <TabsContent value="temporal">
              <Temporal />
            </TabsContent>

            <TabsContent value="engagement">
              <Engagement />
            </TabsContent>

            <TabsContent value="explorer">
              <Explorer />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
}

export default App;
