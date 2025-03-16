import Layout from "../layout";
import "./App.css";
import { TabContainer } from "./components/TabContainer";

function App() {
  return (
    <Layout>
      <div className="flex min-h-screen bg-gray-100">
        {/* Main content */}
        <div className="flex-1 p-8 bg-gray-50">
          <TabContainer />
        </div>
      </div>
    </Layout>
  );
}

export default App;
