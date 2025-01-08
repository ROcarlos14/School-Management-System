import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { ThemeProvider, CssBaseline, Box, Toolbar } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { AnimatePresence } from 'framer-motion';
import theme from './theme';
import { AuthProvider } from './contexts/AuthContext';

// Components
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import PageTransition from './components/animations/PageTransition';

// Pages
import Home from './pages/Home';
import Login from './pages/auth/Login';
import StudentPortal from './pages/StudentPortal';
import Events from './pages/Events';
import Gallery from './pages/Gallery';
import TeachersAndStaff from './pages/Teachers';
import About from './pages/About';
import Enroll from './pages/Enroll';

const AppContent = () => {
  const location = useLocation();

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      {/* Add space for the fixed navbar */}
      <Toolbar />
      {/* Main content */}
      <Box component="main" sx={{ flexGrow: 1, width: '100%' }}>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={
              <PageTransition>
                <Home />
              </PageTransition>
            } />
            <Route path="/login" element={
              <PageTransition>
                <Login />
              </PageTransition>
            } />
            <Route path="/portal" element={
              <PageTransition>
                <StudentPortal />
              </PageTransition>
            } />
            <Route path="/events" element={
              <PageTransition>
                <Events />
              </PageTransition>
            } />
            <Route path="/gallery" element={
              <PageTransition>
                <Gallery />
              </PageTransition>
            } />
            <Route path="/teachers" element={
              <PageTransition>
                <TeachersAndStaff />
              </PageTransition>
            } />
            <Route path="/about" element={
              <PageTransition>
                <About />
              </PageTransition>
            } />
            <Route path="/enroll" element={
              <PageTransition>
                <Enroll />
              </PageTransition>
            } />
          </Routes>
        </AnimatePresence>
      </Box>
      <Footer />
    </Box>
  );
};

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <CssBaseline />
        <AuthProvider>
          <Router>
            <AppContent />
          </Router>
        </AuthProvider>
      </LocalizationProvider>
    </ThemeProvider>
  );
};

export default App;
