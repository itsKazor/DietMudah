import { Routes, Route, Navigate } from 'react-router-dom';
import { useProfileStore } from './store/profileStore';
import Onboarding from './pages/Onboarding';

import Dashboard from './pages/Dashboard';

import Scan from './pages/Scan';
import Log from './pages/Log';
import Progress from './pages/Progress';

import Settings from './pages/Settings';

function App() {
  const onboardingDone = useProfileStore(state => state.onboardingDone);

  return (
    <div className="max-w-[430px] mx-auto min-h-screen bg-surface relative shadow-xl overflow-hidden">
      <Routes>
        <Route path="/onboarding" element={
          onboardingDone ? <Navigate to="/" replace /> : <Onboarding />
        } />
        
        {/* Protected Routes */}
        <Route path="/" element={
          !onboardingDone ? <Navigate to="/onboarding" replace /> : <Dashboard />
        } />
        <Route path="/scan" element={
          !onboardingDone ? <Navigate to="/onboarding" replace /> : <Scan />
        } />
        <Route path="/log" element={
          !onboardingDone ? <Navigate to="/onboarding" replace /> : <Log />
        } />
        <Route path="/progress" element={
          !onboardingDone ? <Navigate to="/onboarding" replace /> : <Progress />
        } />
        <Route path="/settings" element={
          !onboardingDone ? <Navigate to="/onboarding" replace /> : <Settings />
        } />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default App;
