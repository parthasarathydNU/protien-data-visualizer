import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ProteinsList from './components/ProteinsList';
import AddProtein from './components/AddProtein';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ProteinsList />} />
        <Route path="/add-protein" element={<AddProtein />} />
      </Routes>
    </Router>
  );
};

export default App;
