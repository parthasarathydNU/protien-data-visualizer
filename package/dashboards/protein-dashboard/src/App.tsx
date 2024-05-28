import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ProteinsList from './components/ProteinsList';
import AddProtein from './components/AddProtein';
import Layout from './components/Layout';
import EditProtein from './components/EditProtein';
import DataVisualization from './components/Viz';
import ProteinDetail from './components/ProteinDetail';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<ProteinsList />} />
          <Route path="add-protein" element={<AddProtein />} />
          <Route path="edit-protein" element={<EditProtein />} />
          <Route path="/visualization" element={<DataVisualization />} />
          <Route path="/proteins/:entry" element={<ProteinDetail />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
