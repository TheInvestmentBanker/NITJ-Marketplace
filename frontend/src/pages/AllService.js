import { useState, useEffect } from 'react';
import { Typography, Box, Card, CardMedia, CardContent, Grid } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function AllService() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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
    <Box className="py-10">
      <Typography variant="h4" className="mb-6 text-center">
        All Services
      </Typography>
      <Grid container spacing={4} justifyContent="center">
        {services.map((service) => (
          <Grid item key={service._id} xs={12} sm={6} md={4}>
            <Card className="h-full" onClick={() => navigate(`/services/${service._id}`)}>
              {service.imageUrl && (
                <CardMedia
                  component="img"
                  height="200"
                  image={service.imageUrl}
                  alt={service.serviceTitle}
                />
              )}
              <CardContent>
                <Typography variant="h6">{service.serviceTitle}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {service.description.substring(0, 100)}...
                </Typography>
                <Typography variant="h6" className="mt-2">
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
    </Box>
  );
}

export default AllService;