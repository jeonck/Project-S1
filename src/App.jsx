import { useState } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { DataProvider } from './context/DataContext';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Footer from './components/Footer';
import Dashboard from './pages/Dashboard';
import Projects from './pages/Projects';
import Tasks from './pages/Tasks';
import Milestones from './pages/Milestones';
import Deliverables from './pages/Deliverables';
import Requirements from './pages/Requirements';
import Guide from './pages/Guide';
import TeamMembers from './pages/TeamMembers';
import ResourcePlanner from './pages/ResourcePlanner';
import Schedule from './pages/Schedule';

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <DataProvider>
      <Router>
        <div className="bg-gray-50 font-[Poppins] min-h-screen flex flex-col">
          <Header onMenuToggle={toggleSidebar} />

          <div className="flex flex-1 relative pt-14">
            <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />

            <main className="flex-1 p-4 md:ml-64 transition-all duration-300 ease-in-out mb-20">
              <div className="container mx-auto p-4 bg-white rounded-xl shadow-lg">
                <div className="w-full min-h-[80vh]">
                  <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/projects" element={<Projects />} />
                    <Route path="/tasks" element={<Tasks />} />
                    <Route path="/milestones" element={<Milestones />} />
                    <Route path="/deliverables" element={<Deliverables />} />
                    <Route path="/requirements" element={<Requirements />} />
                    <Route path="/guide" element={<Guide />} />
                    <Route path="/teammembers" element={<TeamMembers />} />
                    <Route path="/resourceplanner" element={<ResourcePlanner />} />
                    <Route path="/schedule" element={<Schedule />} />
                  </Routes>
                </div>
              </div>
            </main>
          </div>

          <Footer />
        </div>
      </Router>
    </DataProvider>
  );
}

export default App;
