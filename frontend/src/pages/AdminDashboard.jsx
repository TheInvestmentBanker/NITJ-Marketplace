import { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  CardMedia,
  Tabs,
  Tab,
  CircularProgress,
  Container,
  Grid,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useTheme } from '@mui/material/styles';

// helper to build Cloudinary preview
const getImageUrl = (publicId) => {
  if (!publicId) return "https://via.placeholder.com/200";
  return `https://res.cloudinary.com/dj1e78e53/image/upload/f_auto,q_auto,w_300,h_200,c_fill/${publicId}`;
};

function AdminDashboard() {
  const [products, setProducts] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tabValue, setTabValue] = useState(0); // 0: Products, 1: Services
  const navigate = useNavigate();
  const token = localStorage.getItem("adminToken");
  const API_URL = process.env.REACT_APP_API_URL;
  const theme = useTheme();

  useEffect(() => {
    if (!token) return navigate("/admin/login");

    const fetchPending = async () => {
      try {
        const [prodRes, servRes] = await Promise.all([
          axios.get(`${API_URL}/api/admin/products/pending`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${API_URL}/api/admin/services/pending`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);
        setProducts(prodRes.data);
        setServices(servRes.data);
      } catch (err) {
        console.error(err);
        if (err.response && err.response.status === 401) navigate("/admin/login");
      } finally {
        setLoading(false);
      }
    };

    fetchPending();
  }, [token, navigate, API_URL]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const approveProduct = async (id) => {
    try {
      await axios.put(`${API_URL}/api/admin/products/${id}/approve`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts(products.filter((p) => p._id !== id));
    } catch (err) {
      console.error(err);
      alert("Could not approve");
    }
  };

  const rejectProduct = async (id) => {
    const reason = prompt("Reason for rejection (optional):");
    if (reason === null) return; // Cancelled
    try {
      await axios.patch(`${API_URL}/api/admin/products/${id}/reject`, { reason }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts(products.filter((p) => p._id !== id));
    } catch (err) {
      console.error(err);
      alert("Could not reject");
    }
  };

  const deleteProduct = async (id) => {
    if (!window.confirm("Delete this product permanently?")) return;
    try {
      await axios.delete(`${API_URL}/api/admin/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts(products.filter((p) => p._id !== id));
    } catch (err) {
      console.error(err);
      alert("Could not delete");
    }
  };

  const approveService = async (id) => {
    try {
      await axios.put(`${API_URL}/api/admin/services/${id}/approve`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setServices(services.filter((s) => s._id !== id));
    } catch (err) {
      console.error(err);
      alert("Could not approve");
    }
  };

  const rejectService = async (id) => {
    const reason = prompt("Reason for rejection (optional):");
    if (reason === null) return;
    try {
      await axios.patch(`${API_URL}/api/admin/services/${id}/reject`, { reason }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setServices(services.filter((s) => s._id !== id));
    } catch (err) {
      console.error(err);
      alert("Could not reject");
    }
  };

  const deleteService = async (id) => {
    if (!window.confirm("Delete this service permanently?")) return;
    try {
      await axios.delete(`${API_URL}/api/admin/services/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setServices(services.filter((s) => s._id !== id));
    } catch (err) {
      console.error(err);
      alert("Could not delete");
    }
  };

  const currentItems = tabValue === 0 ? products : services;
  const isProducts = tabValue === 0;

  if (loading) return <CircularProgress className="mx-auto my-10" />;

  return (
    <Box sx={{ 
     py: { xs: 15, md: 12 }, 
     backgroundColor: (theme) => theme.palette.background.paper,
     borderRadius: 0, 
     boxShadow: 3, 
     display: 'flex',               // ✅ make it flexbox
     justifyContent: 'center',      // ✅ horizontal center
     alignItems: 'center',          // ✅ vertical center
     minHeight: '100vh',  
     }}>
      <Container maxWidth="lg">
       <Typography variant="h3" alignItems="center" textAlign="center" sx={{fontSize: '2rem', paddingTop:'15px', paddingBottom:'25px', color: theme.palette.text.secondary,}}>Admin Dashboard - Pending Items</Typography>
      
      {/* Tabs for Products/Services */}
      <Tabs value={tabValue} onChange={handleTabChange} centered fullWidth sx={{ mb: 6 }}>
        <Tab label="Pending Products" />
        <Tab label="Pending Services" />
      </Tabs>

      {currentItems.length === 0 && <Typography>No pending {isProducts ? 'products' : 'services'}</Typography>}
      
      <Grid container spacing={4}>
        {currentItems.map((item) => (
          <Grid item xs={12} key={item._id}>
            <Card sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' } }}>
              <CardMedia
                component="img"
                image={getImageUrl(item.imagePublicId)}
                alt={isProducts ? item.name : item.serviceTitle}
                sx={{ width: { xs: '100%', sm: 200 }, height: { xs: 'auto', sm: 200 }, objectFit: "cover" }}
              />
              <CardContent sx={{ flex: 1 }}>
                <Typography variant="h6" sx={{ fontSize: { xs: '1.25rem', md: '1.5rem' } }}>{isProducts ? item.name : item.serviceTitle}</Typography>
                <Typography>Price: ₹{item.price} {item.priceType ? `(${item.priceType})` : ''}</Typography>
                {isProducts ? <Typography>Age: {item.productAge}</Typography> : (
                  <>
                    <Typography>Category: {item.serviceCategory}</Typography>
                    {item.location && <Typography>Location: {item.location}</Typography>}
                    {item.duration && <Typography>Duration: {item.duration}</Typography>}
                  </>
                )}
                <Typography variant="body2" sx={{ mb: 2 }}>{item.description}</Typography>
                <Box sx={{ mt: 2, display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 1 }}>
                  <Button
                    variant="contained"
                    onClick={() => isProducts ? approveProduct(item._id) : approveService(item._id)}
                  >
                    Approve
                  </Button>
                  <Button
                    variant="outlined"
                    color="warning"
                    onClick={() => isProducts ? rejectProduct(item._id) : rejectService(item._id)}
                  >
                    Reject
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => isProducts ? deleteProduct(item._id) : deleteService(item._id)}
                  >
                    Delete
                  </Button>
                  <Button
                    variant="text"
                    onClick={() => navigate(isProducts ? `/product/${item._id}` : `/services/${item._id}`)}
                  >
                    View/Edit
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      
      {/* Note: Admin can navigate back to home/products/services like normal users */}
      <Box sx={{ mt: 6, textAlign: 'center', display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'center', gap: 2 }}>
        <Button variant="outlined" onClick={() => navigate('/')}>Go to Home</Button>
        <Button variant="outlined" onClick={() => navigate('/products')}>View All Products</Button>
        <Button variant="outlined" onClick={() => navigate('/services')}>View All Services</Button>
      </Box>
    </Container>
    </Box>
  );
}

export default AdminDashboard;