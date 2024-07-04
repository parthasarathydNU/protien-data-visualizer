import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ProteinsList from "./components/ProteinsList";
import AddProtein from "./components/AddProtein";
import Layout from "./components/Layout";
import EditProtein from "./components/EditProtein";
import DataVisualization from "./components/charts/Viz";
import ProteinDetail from "./components/ProteinDetail";
import ServiceDown from "./components/ServiceDown";
import Visualize from "./components/dynamicCharts/Visualize";
import SQLChatBotView from "./components/SQLChatBotView";
import TablesView from "components/TablesView";

const App: React.FC = () => {
  return (
    <div className="flex basis-full">
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<TablesView />} />
            <Route path="/chatbot" element={<SQLChatBotView />} />
            <Route path="/explore" element={<Visualize />} />
            <Route path="add-protein" element={<AddProtein />} />

            <Route path="edit-protein" element={<EditProtein />} />
            <Route path="/service-down" element={<ServiceDown />} />
            <Route path="/visualization" element={<DataVisualization />} />
            <Route path="/proteins/:entry" element={<ProteinDetail />} />
          </Route>
        </Routes>
      </Router>
    </div>
  );
};

export default App;
