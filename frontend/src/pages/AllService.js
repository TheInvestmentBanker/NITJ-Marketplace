// Updated AllService.js with similar changes as AllProducts.js

import { useState, useEffect } from 'react';
import { Typography, Box, Card, CardMedia, CardContent, Grid, Container } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';

function AllService() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const theme = useTheme();

  useEffect(() => {
    const fetchServices = async () => {
      const API_URL = process.env.REACT_APP_API_URL;
      try {
        const res = await axios.get(`${API_URL}/api/services`);
        setServices(res.data);
      } catch (err) {
        console.error('Error fetching services:', err);
      }
      setLoading(false);
    };
    fetchServices();
  }, []);

  if (loading) return <Typography>Loading services...</Typography>;

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 6, md: 10 },backgroundColor: theme.palette.background.paper, paddingTop : '100px', }}>
      <Typography variant="h4" sx={{ mb: 6, textAlign: 'center', fontSize: { xs: '1.75rem', md: '2.125rem' } }}>
        All Services
      </Typography>
      <Grid container spacing={{ xs: 2, md: 4 }} justifyContent="center">
        {services.map((service) => (
          <Grid item key={service._id} xs={12} sm={6} md={4} lg={3}>
            <Card sx={{ height: '100%', cursor: 'pointer' }} onClick={() => navigate(`/services/${service._id}`)}>
              {service.imageUrl && (
                <CardMedia
                  component="img"
                  image={service.imageUrl}
                  alt={service.serviceTitle}
                  sx={{ height: 'auto', aspectRatio: '3/2', objectFit: 'cover' }}
                />
              )}
              <CardContent>
                <Typography variant="h6" sx={{ fontSize: { xs: '1rem', md: '1.25rem' } }}>{service.serviceTitle}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {service.description.substring(0, 100)}...
                </Typography>
                <Typography variant="h6" sx={{ mt: 2, fontSize: { xs: '1.125rem', md: '1.25rem' } }}>
                  ₹{service.price} ({service.priceType})
                </Typography>
                <Typography variant="body2">
                  Category: {service.serviceCategory}
                </Typography>
                {service.location && (
                  <Typography variant="body2">Location: {service.location}</Typography>
                )}
                <Typography variant="body2">Contact: {service.sellerContact}</Typography>
                {!service.isOutOfService && <Typography color="success.main">Available</Typography>}
                {service.isOutOfService && <Typography color="error.main">Out of Service</Typography>}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}

export default AllService;