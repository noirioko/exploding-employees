import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import { AppProvider } from './context/AppContext';
import Home from './pages/Home';
import Record from './pages/Record';
import Company from './pages/Company';
import Story from './pages/Story';
import Room from './pages/Room';
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
import Header from './components/Header';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import FloatingEmployee from './components/FloatingEmployee';
import { getCurrentSeason } from './config/seasonalConfig';
import './style.css';

function App() {
  const currentSeason = getCurrentSeason();
  const outerDecorations = currentSeason?.outerDecorations || [];
  const [floatingEmployee, setFloatingEmployee] = useState(null);

  return (
    <AppProvider floatingEmployee={floatingEmployee} setFloatingEmployee={setFloatingEmployee}>
      <Router>
        <div style={{ margin: 0, padding: 0, width: '100%', position: 'relative' }}>
          {/* Outer layer decorations - at absolute browser edge */}
          {outerDecorations.map((deco, index) => (
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
          {/* Global Header */}
          <Header />

          <div className="container" style={{ paddingLeft: '20px', paddingRight: '20px' }}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/record" element={<Record />} />
              <Route path="/company" element={<Company />} />
              <Route path="/story" element={<Story />} />
              <Route path="/room" element={<Room />} />
              <Route path="/supermarket" element={<Supermarket />} />
              <Route path="/paycheck" element={<Paycheck />} />
              <Route path="/selfcare" element={<SelfCare />} />
              <Route path="/room-helper" element={<RoomDecorHelper />} />
              <Route path="/room-test" element={<RoomTest />} />
              <Route path="/yuwon-hitbox" element={<YuwonHitboxMaker />} />
              <Route path="/sprite-to-gif" element={<SpriteSheetToGif />} />
              <Route path="/sprite-viewer" element={<SpriteSheetViewer />} />
              <Route path="/explosion-test" element={<ExplosionTest />} />
              <Route path="/animation-test" element={<AnimationTest />} />
              <Route path="/animation-test-new" element={<AnimationTestNew />} />
              <Route path="/noah-walking-test" element={<NoahWalkingTest />} />
            </Routes>
            <Footer />
            <Navbar />
          </div>

          {/* Floating Employee */}
          {floatingEmployee && (
            <FloatingEmployee character={floatingEmployee} />
          )}
        </div>
      </Router>
    </AppProvider>
  );
}

export default App;
