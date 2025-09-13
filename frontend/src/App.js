import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import AllProducts from './pages/AllProducts';
import Product from './pages/Product';
import Sell from './pages/Sell';
import SingleService from './pages/SingleService';
import SellService from './pages/SellService'; // New: Import Service
import AllService from './pages/AllService'; // New: Import AllService
import EdgeBall from './components/EdgeBall';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import BreatheIn from './pages/BreatheIn';
import { ThemeProvider } from '@mui/material/styles';
import React, { useState } from 'react';
import { getTheme } from './utils/theme';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

const App = () => {
  const [darkMode, setDarkMode] = useState(true); // Dark mode as default
  const [isLoading, setIsLoading] = useState(true);
  const handleFinishLoading = () => {
    setIsLoading(false);
  }
  return (
    <ThemeProvider theme={getTheme(darkMode)}>
     {isLoading ? (
        <BreatheIn onFinish={handleFinishLoading} />
      ) : (
      <Router>
        <Header darkMode={darkMode} setDarkMode={setDarkMode} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<AllProducts />} />
          <Route path="/services" element={<AllService />} /> {/* New: Services route */}
          <Route path="/product/:id" element={<Product />} />
          <Route path="/sell" element={<Sell />} />
          <Route path="/sell-service" element={<SellService />} /> {/* Corrected */} {/* New: Sell service route; using Service component for form */}
          <Route path="/services/:id" element={<SingleService />} /> {/* Corrected */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
        </Routes>
        <Footer/>
      </Router>
      )}
    </ThemeProvider>
  );
}

export default App;