import React, { useEffect } from 'react';
import { useResumeStore } from './store/useResumeStore';
import { DashboardView } from './components/dashboard/DashboardView';
import { TwoColumnEditor } from './components/editor/TwoColumnEditor';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { PinModal } from './components/dashboard/PinModal';
import { UnlockModal } from './components/dashboard/UnlockModal';
import { UploadModal } from './components/dashboard/UploadModal';

export const App: React.FC = () => {
  const { activeTab, initialize } = useResumeStore();

  useEffect(() => {
    initialize();
  }, [initialize]);

  return (
    <div className="min-h-screen bg-[#0A0D12] text-zinc-100 font-sans selection:bg-lime-400 selection:text-black">
      {/* Route views based on activeTab */}
      {activeTab === 'dashboard' ? (
        <DashboardView />
      ) : activeTab === 'admin' ? (
        <AdminDashboard />
      ) : (
        <TwoColumnEditor />
      )}

      {/* Global Modals for Local Access Control & Scanner */}
      <PinModal />
      <UnlockModal />
      <UploadModal />
    </div>
  );
};

export default App;
