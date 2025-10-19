import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { AppProvider } from './context/AppContext';
import { NotificationProvider } from './context/NotificationContext';
import Home from './pages/Home';
import Diary from './pages/Diary';
import Company from './pages/Company';
import Story from './pages/Story';
import Room from './pages/Room';
import RoomEditor from './pages/RoomEditor';
import Supermarket from './pages/Supermarket';
import Paycheck from './pages/Paycheck';
import SelfCare from './pages/SelfCare';
import RoomDecorHelper from './pages/RoomDecorHelper';
import RoomTest from './pages/RoomTest';
import YuwonHitboxMaker from './pages/YuwonHitboxMaker';
import SpriteSheetToGif from './pages/SpriteSheetToGif';
import SpriteSheetViewer from './pages/SpriteSheetViewer';
import ExplosionTest from './pages/ExplosionTest';
import AnimationTest from './pages/AnimationTest';
import AnimationTestNew from './pages/AnimationTestNew';
import NoahWalkingTest from './pages/NoahWalkingTest';
import TodoList from './pages/TodoList';
import ShootEmUp from './pages/ShootEmUp';
import EmployeeInvaders from './pages/EmployeeInvaders';
import WalkingPathTool from './pages/WalkingPathTool';
import Header from './components/Header';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import FloatingEmployee from './components/FloatingEmployee';
import NotificationToast from './components/NotificationToast';
import { getCurrentSeason } from './config/seasonalConfig';
import './style.css';

function AppContent() {
  const location = useLocation();
  const currentSeason = getCurrentSeason();
  const outerDecorations = currentSeason?.outerDecorations || [];
  const [floatingEmployee, setFloatingEmployee] = useState(null);

  // Check if we're in embedded mode (for iframes)
  const searchParams = new URLSearchParams(location.search);
  const isEmbedded = searchParams.get('embedded') === 'true';

  return (
    <NotificationProvider>
      <AppProvider floatingEmployee={floatingEmployee} setFloatingEmployee={setFloatingEmployee}>
        <NotificationToast />
        <div style={{ margin: 0, padding: 0, width: '100%', position: 'relative' }}>
          {/* Outer layer decorations - at absolute browser edge */}
          {!isEmbedded && outerDecorations.map((deco, index) => (
            <img
              key={`outer-${index}`}
              src={deco.image}
              alt=""
              className={`outer-decoration ${deco.animation}`}
              style={{
                position: 'fixed',
                ...deco.position,
                width: deco.size,
                height: deco.size,
                objectFit: 'contain',
                pointerEvents: 'none',
                zIndex: 9999,
                opacity: deco.opacity !== undefined ? deco.opacity : 1,
                filter: deco.filter || 'none',
                animationDelay: deco.delay || '0s'
              }}
            />
          ))}
          {/* Global Header - hide in embedded mode */}
          {!isEmbedded && <Header />}

          <div className="container" style={{ paddingLeft: isEmbedded ? '0' : '20px', paddingRight: isEmbedded ? '0' : '20px' }}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/record" element={<Diary />} />
              <Route path="/company" element={<Company />} />
              <Route path="/story" element={<Story />} />
              <Route path="/room" element={<Room />} />
              <Route path="/room-editor" element={<RoomEditor />} />
              <Route path="/supermarket" element={<Supermarket />} />
              <Route path="/paycheck" element={<Paycheck />} />
              <Route path="/selfcare" element={<SelfCare />} />
              <Route path="/shoot-em-up" element={<ShootEmUp />} />
              <Route path="/employee-invaders" element={<EmployeeInvaders />} />
              <Route path="/room-helper" element={<RoomDecorHelper />} />
              <Route path="/room-test" element={<RoomTest />} />
              <Route path="/yuwon-hitbox" element={<YuwonHitboxMaker />} />
              <Route path="/sprite-to-gif" element={<SpriteSheetToGif />} />
              <Route path="/sprite-viewer" element={<SpriteSheetViewer />} />
              <Route path="/explosion-test" element={<ExplosionTest />} />
              <Route path="/animation-test" element={<AnimationTest />} />
              <Route path="/animation-test-new" element={<AnimationTestNew />} />
              <Route path="/noah-walking-test" element={<NoahWalkingTest />} />
              <Route path="/todo" element={<TodoList />} />
              <Route path="/walking-path-tool" element={<WalkingPathTool />} />
            </Routes>
            {!isEmbedded && <Footer />}
            {!isEmbedded && <Navbar />}
          </div>

          {/* Floating Employee - hide in embedded mode */}
          {!isEmbedded && floatingEmployee && (
            <FloatingEmployee character={floatingEmployee} />
          )}
        </div>
      </AppProvider>
    </NotificationProvider>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
