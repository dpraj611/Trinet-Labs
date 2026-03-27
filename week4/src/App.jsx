import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import ApplicantPortal from './components/ApplicantPortal';
import HRDashboard from './components/HRDashboard';
import { useState, useEffect } from 'react';

function App() {
  const [secureMode, setSecureMode] = useState(false);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 2000);
    return () => clearInterval(interval);
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch('/stats');
      const data = await response.json();
      setStats(data);
      setSecureMode(data.secureMode);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const toggleSecureMode = async () => {
    try {
      const response = await fetch('/toggle-secure-mode', { method: 'POST' });
      const data = await response.json();
      setSecureMode(data.secureMode);
      alert(data.message);
    } catch (error) {
      console.error('Error toggling secure mode:', error);
    }
  };

  const resetDatabase = async () => {
    if (window.confirm('Are you sure you want to reset all data? This cannot be undone.')) {
      try {
        await fetch('/reset-database', { method: 'DELETE' });
        alert('Database reset successfully!');
        window.location.reload();
      } catch (error) {
        console.error('Error resetting database:', error);
      }
    }
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-900 terminal-bg cyber-grid">
        <nav className="bg-black border-b-2 border-cyan-500 shadow-lg relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-500/10 to-transparent"></div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="flex justify-between h-16">
              <div className="flex items-center space-x-8">
                <div className="flex-shrink-0 flex items-center">
                  <h1 className="text-xl font-bold text-green-400 font-['Orbitron'] tracking-wider neon-text">
                    &gt;_ AI_ATTACK_LAB
                  </h1>
                </div>
                <div className="flex space-x-2">
                  <Link
                    to="/"
                    className="inline-flex items-center px-4 py-2 border border-cyan-500 text-sm font-medium rounded bg-gray-900 text-cyan-400 hover:bg-cyan-500 hover:text-black transition font-['Share_Tech_Mono']"
                  >
                    [ ATTACK ]
                  </Link>
                  <Link
                    to="/dashboard"
                    className="inline-flex items-center px-4 py-2 border border-cyan-500 text-sm font-medium rounded bg-gray-900 text-cyan-400 hover:bg-cyan-500 hover:text-black transition font-['Share_Tech_Mono']"
                  >
                    [ DASHBOARD ]
                  </Link>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                {stats && (
                  <div className="text-xs text-green-400 font-['Share_Tech_Mono']">
                    <span>&gt; APP: {stats.totalApplications}</span>
                    {stats.queueSize > 0 && (
                      <span className="ml-3 text-orange-400">&gt; Q: {stats.queueSize}</span>
                    )}
                  </div>
                )}

                <button
                  onClick={toggleSecureMode}
                  className={`px-4 py-2 rounded text-xs font-bold transition border-2 font-['Orbitron'] tracking-wider ${
                    secureMode
                      ? 'bg-green-600 text-black border-green-400 hover:bg-green-500'
                      : 'bg-red-600 text-black border-red-400 hover:bg-red-500 animate-pulse'
                  }`}
                >
                  {secureMode ? '[ SECURE ]' : '[ VULNERABLE ]'}
                </button>

                <button
                  onClick={resetDatabase}
                  className="px-4 py-2 bg-gray-800 text-cyan-400 border border-cyan-500 rounded text-xs font-bold hover:bg-cyan-500 hover:text-black transition font-['Orbitron']"
                >
                  [ RESET ]
                </button>
              </div>
            </div>
          </div>
        </nav>

        <Routes>
          <Route path="/" element={<ApplicantPortal secureMode={secureMode} />} />
          <Route path="/dashboard" element={<HRDashboard secureMode={secureMode} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
