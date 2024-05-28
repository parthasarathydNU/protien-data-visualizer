import React from 'react';
import { Link, Outlet } from 'react-router-dom';

const Layout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-blue-600 text-white py-4">
        <nav className="container mx-auto flex justify-between items-center">
        <Link to="/" className="hover:underline"><h1 className="text-xl font-bold">Protein Dashboard</h1></Link>
          <div className="space-x-4">
            <Link to="/visualization" className="hover:underline">Visualize</Link>
            <Link to="/add-protein" className="hover:underline">Add Protein</Link>
          </div>
        </nav>
      </header>
      <main className="flex-grow container mx-auto p-4">
        <Outlet />
      </main>
      <footer className="bg-gray-800 text-white py-4">
        <div className="container mx-auto text-center">
          &copy; 2024 Protein Dashboard. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Layout;
