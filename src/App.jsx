import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@/components/ThemeProvider';
import Navbar from '@/components/Navbar';
import GradientBackground from '@/components/GradientBackground';
import HomePage from '@/pages/HomePage';
import ResumePage from '@/pages/ResumePage';
import { Toaster } from '@/components/ui/toaster';

const App = () => {
  return (
    <ThemeProvider defaultTheme="light" storageKey="blessed-portfolio-theme">
      <Router>
        <div className="min-h-screen font-sans antialiased text-foreground print:bg-white print:text-black">
          <div className="print:hidden">
            <GradientBackground />
            <Navbar />
          </div>
          <main>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/resume" element={<ResumePage />} />
            </Routes>
          </main>
          <Toaster />
        </div>
      </Router>
    </ThemeProvider>
  );
};

export default App;