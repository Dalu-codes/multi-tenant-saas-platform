import { useState } from 'react';
import { Dashboard } from './components/dashboard';

function App() {
  const [activeTenant] = useState('company-a');

  return (
    <div>
      {/* Main Core Platform Interface */}
      <Dashboard tenantId={activeTenant} />
    </div>
  );
}

export default App;
