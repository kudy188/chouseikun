import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { OrganizerScreen } from './components/OrganizerScreen';
import { ParticipantScreen } from './components/ParticipantScreen';
import { ResultsScreen } from './components/ResultsScreen';
import { Toaster } from './components/ui/sonner';

function App() {
  return (
    <Router>
      <div className="bg-container">
        <div className="mantis-pattern" />
        <Routes>
          <Route path="/" element={<OrganizerScreen />} />
          <Route path="/participate/:eventId" element={<ParticipantScreen />} />
          <Route path="/results/:eventId" element={<ResultsScreen />} />
        </Routes>
        <Toaster />
      </div>
    </Router>
  );
}

export default App;
