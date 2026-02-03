import { useState } from 'react';
import { DxcApplicationLayout, DxcFlex, DxcTypography } from '@dxc-technology/halstack-react';
import Queue from './components/Queue/Queue';
import CaseView from './components/CaseView/CaseView';
import Login from './components/Login/Login';
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [currentView, setCurrentView] = useState('queue');
  const [selectedCase, setSelectedCase] = useState(null);
  const [sidenavExpanded, setSidenavExpanded] = useState(true);

  const handleLogin = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setUser(null);
    setIsAuthenticated(false);
    setCurrentView('queue');
    setSelectedCase(null);
  };

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  const handleCaseSelect = (caseItem) => {
    setSelectedCase(caseItem);
  };

  const handleNavigationClick = (view) => {
    setCurrentView(view);
    if (view !== 'queue') {
      setSelectedCase(null);
    }
  };

  const sidenavItems = [
    {
      label: "Submission Intake",
      icon: "inbox",
      selected: currentView === 'queue',
      onClick: () => handleNavigationClick('queue'),
    },
    {
      label: "Triage",
      icon: "sort",
      selected: currentView === 'triage',
      onClick: () => handleNavigationClick('queue'),
    },
    {
      label: "Fulfilment",
      icon: "task_alt",
      selected: currentView === 'fulfilment',
      onClick: () => handleNavigationClick('queue'),
    },
    {
      label: "General Enquiries",
      icon: "help_outline",
      selected: currentView === 'enquiries',
      onClick: () => handleNavigationClick('queue'),
    },
  ];

  return (
    <DxcApplicationLayout
      header={(
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', height: '64px', padding: '0 24px', backgroundColor: '#ffffff', borderBottom: '1px solid #e0e0e0' }}>
          <DxcFlex gap="var(--spacing-gap-m)" alignItems="center">
            <svg width="32" height="32" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M30 0L37.5 15L52.5 7.5L45 22.5L60 30L45 37.5L52.5 52.5L37.5 45L30 60L22.5 45L7.5 52.5L15 37.5L0 30L15 22.5L7.5 7.5L22.5 15L30 0Z" fill="#24A148"/>
              <path d="M30 15L35 25L45 20L40 30L50 35L40 40L45 50L35 45L30 55L25 45L15 50L20 40L10 35L20 30L15 20L25 25L30 15Z" fill="#FFC107"/>
              <path d="M30 20L32.5 27.5L40 25L37.5 32.5L45 35L37.5 37.5L40 45L32.5 42.5L30 50L27.5 42.5L20 45L22.5 37.5L15 35L22.5 32.5L20 25L27.5 27.5L30 20Z" fill="#0095FF"/>
            </svg>
            <DxcTypography fontSize="font-scale-04" fontWeight="font-weight-semibold">
              Nexus &ndash; Broker Assistant
            </DxcTypography>
          </DxcFlex>

          <DxcFlex gap="var(--spacing-gap-m)" alignItems="center">
            <DxcFlex direction="column" gap="var(--spacing-gap-none)" alignItems="flex-end">
              <DxcTypography fontWeight="font-weight-semibold">{user.name}</DxcTypography>
              <DxcTypography fontSize="font-scale-01" color="var(--color-fg-neutral-stronger)">
                {user.domain}
              </DxcTypography>
            </DxcFlex>
            <div
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "50%",
                backgroundColor: "#0095FF",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                fontWeight: "600",
                fontSize: "14px",
              }}
            >
              {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
            </div>
          </DxcFlex>
        </div>
      )}
      sidenav={
        <DxcApplicationLayout.Sidenav
          navItems={sidenavItems}
          expanded={sidenavExpanded}
          onExpandedChange={setSidenavExpanded}
        />
      }
    >
      <DxcApplicationLayout.Main>
        <div style={{ display: 'flex', height: 'calc(100vh - 64px)' }}>
          {/* Queue List - Left Panel */}
          <div style={{ width: selectedCase ? '420px' : '100%', minWidth: selectedCase ? '420px' : 'auto', borderRight: selectedCase ? '1px solid #e0e0e0' : 'none', overflow: 'auto', transition: 'width 0.2s ease' }}>
            <Queue
              onCaseSelect={handleCaseSelect}
              selectedCaseId={selectedCase?.id}
              user={user}
            />
          </div>

          {/* Case View - Right Panel */}
          {selectedCase && (
            <div style={{ flex: 1, overflow: 'auto' }}>
              <CaseView
                caseData={selectedCase}
                onClose={() => setSelectedCase(null)}
              />
            </div>
          )}
        </div>
      </DxcApplicationLayout.Main>
    </DxcApplicationLayout>
  );
}

export default App;
