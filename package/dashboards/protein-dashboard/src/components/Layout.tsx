import React from "react";
import { Link, Outlet } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { AreaChart } from "lucide-react";
import { DatabaseZap } from "lucide-react";
import { Youtube } from "lucide-react";

const Layout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col max-h-screen basis-full">
      <header className="bg-blue-600 text-white py-4">
        <nav className="container mx-auto flex justify-start gap-3 items-center md:justify-between  ">
          <Link to="/" className="hover:underline">
            <h1 className="text-xl font-bold">GenoQuery</h1>
          </Link>
          <div className="space-x-4 flex gap-2">
            <a
              href="https://www.youtube.com/playlist?list=PLuJI6RWPU5Viiw0ph9CwXEYWb27ss0tjd"
              target={"_blank"}
            >
              <Button variant={"secondary"} className="flex items-center gap-1">
                <Youtube />
                How to use GenoQuery
              </Button>
            </a>

            <Link to="/explore" className="hover:underline">
              <Button variant={"secondary"}>
                <AreaChart /> Explore Data
              </Button>
            </Link>
            <Link to="/chatbot" className="hover:underline">
              <div className="flex items-center gap-2">
                <Button variant={"secondary"}>
                  {" "}
                  <div className="flex gap-2 items-center">
                    <DatabaseZap /> SQL Chat Bot{" "}
                  </div>
                </Button>
              </div>
            </Link>
            {/* <Link to="/visualization" className="hover:underline">Visualize</Link> */}
            {/* <Link to="/add-protein" className="hover:underline">Add Protein</Link> */}
          </div>
        </nav>
      </header>
      <main className="flex-grow container mx-auto p-4 h-[80vh]">
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
