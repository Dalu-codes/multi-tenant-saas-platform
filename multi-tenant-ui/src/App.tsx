import { useState } from 'react';
import { Dashboard } from './components/dashboard';

function App() {
  const [activeTenant, setActiveTenant] = useState('company-a');

  return (
    <div>
      {/* Workspace Bar Emulator */}
      <nav style={{ padding: '15px', backgroundColor: '#222', color: '#fff' }}>
        <span style={{ marginRight: '20px', fontWeight: 'bold' }}>Tenant Selection Switcher:</span>
        <button 
          onClick={() => setActiveTenant('company-a')}
          style={{ 
            marginRight: '10px', 
            padding: '5px 10px', 
            backgroundColor: activeTenant === 'company-a' ? '#007bff' : '#555',
            color: '#fff', border: 'none', cursor: 'pointer' 
          }}
        >
          Company A Workspace
        </button>
        <button 
          onClick={() => setActiveTenant('company-b')}
          style={{ 
            padding: '5px 10px', 
            backgroundColor: activeTenant === 'company-b' ? '#007bff' : '#555',
            color: '#fff', border: 'none', cursor: 'pointer' 
          }}
        >
          Company B Workspace
        </button>
      </nav>

      {/* Main Core Platform Interface */}
      <Dashboard tenantId={activeTenant} />
    </div>
  );
}

export default App;
