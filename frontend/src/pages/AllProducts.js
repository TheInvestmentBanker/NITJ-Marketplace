import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Button,
  Box,
  Stack,
  Card,
  CardContent,
  CardMedia,
  CircularProgress,
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import Slider from 'react-slick';
import useMediaQuery from '@mui/material/useMediaQuery';
import axios from 'axios';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

// Cloudinary image helper
const getImageUrl = (publicId) => {
  if (!publicId) return 'https://via.placeholder.com/360x200';
  return `https://res.cloudinary.com/dj1e78e53/image/upload/f_auto,q_auto,w_360,h_200,c_fill/${publicId}`;
};

const Home = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm')); // Mobile if < 600px
  const itemsPerSlide = isMobile ? 1 : 3; // 1 item on mobile, 3 on larger screens
  const API_URL = process.env.REACT_APP_API_URL;
  const [products, setProducts] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch products and services
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prodRes, servRes] = await Promise.all([
          axios.get(`${API_URL}/api/products`),
          axios.get(`${API_URL}/api/services`),
        ]);
        console.log('Products fetched:', prodRes.data); // Debug
        console.log('Services fetched:', servRes.data); // Debug
        setProducts(prodRes.data);
        setServices(servRes.data);
      } catch (err) {
        console.error('Fetch error:', err.message);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [API_URL]);

  // Slick carousel settings
  const slickSettings = {
    dots: true,
    infinite: true,
    speed: 1500,
    slidesToShow: itemsPerSlide,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 0,
    arrows: true,
    adaptiveHeight: true,
    cssEase: 'linear',
    pauseOnHover: true,
  };

  if (loading) return <CircularProgress className="mx-auto my-10" />;
  if (error) return <Typography variant="h6" className="text-center" color="error">Error: {error}</Typography>;

  return (
    <>
      {/* Hero Section with Product Carousel */}
      <Box
        id="hero"
        sx={{
          backgroundColor: theme.palette.background.paper,
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: theme.palette.text.primary,
        }}
      >
        <Container maxWidth="lg">
          <Stack spacing={4} alignItems="center" textAlign="center">
            <Typography
              variant="h1"
              sx={{
                fontWeight: 'bold',
                fontSize: { xs: '2.5rem', md: '4rem' },
              }}
            >
              College Marketplace
            </Typography>
            <Typography
              variant="h5"
              sx={{
                fontSize: { xs: '1rem', md: '1.5rem' },
                maxWidth: '600px',
                color: theme.palette.text.secondary,
              }}
            >
              Buy and sell student-made products and services!
            </Typography>
            <Box sx={{ width: '123%', minHeight: '300px' }}>
              {products.length === 0 ? (
                <Typography variant="body1">No approved products available.</Typography>
              ) : (
                <Slider {...slickSettings}>
                  {products.map((product) => (
                    <Card
                      key={product._id}
                      component={RouterLink}
                      to={`/product/${product._id}`}
                      sx={{
                        textDecoration: 'none',
                        boxShadow: 3,
                        borderRadius: 2,
                        display: 'flex',
                        flexDirection: 'row',
                        height: '350px',
                        maxWidth: isMobile ? '100%' : '360px',
                        width: '100%',
                        margin: '0 70px',
                      }}
                    >
                      <CardMedia
                        component="img"
                        height="200"
                        image={getImageUrl(product.imagePublicId || product.imageUrl)}
                        alt={product.name}
                        sx={{ objectFit: 'cover', width: '200px' }}
                      />
                      <CardContent sx={{ flexGrow: 1, padding: '10px' }}>
                        <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                          {product.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {product.description}
                        </Typography>
                      </CardContent>
                    </Card>
                  ))}
                </Slider>
              )}
            </Box>
            <Button
              variant="contained"
              component={RouterLink}
              to="/products"
              sx={{
                backgroundColor:
                  theme.palette.mode === 'light' ? theme.palette.primary.main : theme.palette.primary.light,
                '&:hover': {
                  backgroundColor: theme.palette.primary.dark,
                },
                padding: '10px 20px',
                fontSize: '1.1rem',
              }}
            >
              Shop Products
            </Button>
          </Stack>
        </Container>
      </Box>

      {/* Blank Box Sections */}
      <Box id="locations" sx={{ py: 6, backgroundColor: theme.palette.background.default }} />
      <Box sx={{ py: 6, backgroundColor: theme.palette.background.paper }} />
      <Box sx={{ py: 6, backgroundColor: theme.palette.background.default }} />

      {/* Services Section */}
      <Box
        id="contact"
        sx={{
          py: 6,
          backgroundColor: theme.palette.background.paper,
          color: theme.palette.text.primary,
        }}
      >
        <Container maxWidth="lg">
          <Typography
            variant="h4"
            sx={{
              textAlign: 'center',
              mb: 4,
              fontWeight: 'bold',
              color: 'primary.main',
            }}
          >
            Our Services
          </Typography>
          <Box sx={{ width: '100%', minHeight: '300px' }}>
            {services.length === 0 ? (
              <Typography variant="body1">No approved services available.</Typography>
            ) : (
              <Slider {...slickSettings}>
                {services.map((service) => (
                  <Card
                    key={service._id}
                    component={RouterLink}
                    to={`/services/${service._id}`}
                    sx={{
                      textDecoration: 'none',
                      boxShadow: 3,
                      borderRadius: 2,
                      display: 'flex',
                      flexDirection: 'row',
                      height: '200px',
                      maxWidth: isMobile ? '100%' : '360px',
                      width: '100%',
                      margin: '0 10px',
                    }}
                  >
                    <CardMedia
                      component="img"
                      height="200"
                      image={getImageUrl(service.imagePublicId || service.imageUrl)}
                      alt={service.serviceTitle}
                      sx={{ objectFit: 'cover', width: '200px' }}
                    />
                    <CardContent sx={{ flexGrow: 1, padding: '10px' }}>
                      <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                        {service.serviceTitle}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {service.description}
                      </Typography>
                    </CardContent>
                  </Card>
                ))}
              </Slider>
            )}
          </Box>
          <Button
            component={RouterLink}
            to="/services"
            variant="contained"
            sx={{
              backgroundColor: 'primary.main',
              '&:hover': {
                backgroundColor: 'primary.dark',
              },
              padding: '10px 20px',
              marginTop: '20px',
            }}
          >
            Explore Services
          </Button>
        </Container>
      </Box>
    </>
  );
};

export default Home;