import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ProteinsList from './components/ProteinsList';
import AddProtein from './components/AddProtein';
import Layout from './components/Layout';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<ProteinsList />} />
          <Route path="add-protein" element={<AddProtein />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
