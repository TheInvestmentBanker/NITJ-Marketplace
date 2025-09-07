import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import AllProducts from './pages/AllProducts';
import Product from './pages/Product';
import Sell from './pages/Sell';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto p-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<AllProducts />} />
          <Route path="/product/:id" element={<Product />} />
          <Route path="/sell" element={<Sell />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          {/* Placeholders for future */}
          {/* <Route path="/dashboard" element={<UserDashboard />} /> */}
          {/* <Route path="/about" element={<About />} /> */}
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;