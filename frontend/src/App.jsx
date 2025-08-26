// src/App.jsx
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import ProtectedRoute from './components/ProtectedRoute';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ProfilePage from './pages/ProfilePage';
import NetworkPage from './pages/NetworkPage'; 
import MessagingPage from './pages/MessagingPage';

function App() {
  return (
    <>
      <Header />
      <main style={{ padding: '1rem' }}>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />

          {/* Protected Routes */}
          <Route path='' element={<ProtectedRoute />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/profile/:id" element={<ProfilePage />} />
            <Route path="/mynetwork" element={<NetworkPage />} />
            <Route path="/messages" element={<MessagingPage />} />
            {/* Add other protected routes here, e.g., Profile, Network */}
          </Route>
        </Routes>
      </main>
    </>
  );
}

export default App;