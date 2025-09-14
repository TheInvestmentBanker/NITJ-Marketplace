import { useEffect, useState } from 'react';
import { Grid, Card, CardContent, CardMedia, Typography, Button, Chip, Container } from '@mui/material';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useTheme } from '@mui/material/styles';

const getImageUrl = (publicId) => {
  if (!publicId) return 'https://via.placeholder.com/200';
  return `https://res.cloudinary.com/dj1e78e53/image/upload/f_auto,q_auto,w_300,h_200,c_fill/${publicId}`;
};

function AllProducts() {
  const API_URL = process.env.REACT_APP_API_URL;
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const theme = useTheme();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        console.log('Fetching from:', `${API_URL}/api/products`); // Debug log
        const res = await axios.get(`${API_URL}/api/products`);
        console.log('Response data:', res.data); // Debug response
        setProducts(res.data);
      } catch (err) {
        console.error('Fetch error:', err.message); // Debug error
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [API_URL]);

  if (loading) return <Typography variant="h6" className="text-center">Loading products...</Typography>;
  if (error) return <Typography variant="h6" className="text-center" color="error">Error: {error}</Typography>;

  return (
    <Container sx={{ 
     py: { xs: 15, md: 12 }, 
     backgroundColor: (theme) => theme.palette.background.paper,
     borderRadius: 0, 
     boxShadow: 3, 
     }}>
      <Typography variant="h2" textAlign="center" sx={{fontSize: '2rem', paddingTop:'15px',paddingBottom:'25px', color: theme.palette.text.secondary,}}>
        Available Products
      </Typography>
      {products.length === 0 ? (
        <Typography variant="body1" className="text-center">
          No products available. Check back later or approve pending products.
        </Typography>
      ) : (
        <Grid container spacing={{ xs: 2, md: 4 }} justifyContent="center">
          {products.map(product => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={product._id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column',  }}>
                <CardMedia
                  component="img"
                  image={getImageUrl(product.imagePublicId || product.imageUrl)}
                  alt={product.name}
                  sx={{ height: 'auto', aspectRatio: '3/2', objectFit: 'cover' }}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" sx={{ fontSize: { xs: '1rem', md: '1.25rem' } }}>{product.name}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    ₹{product.price}
                  </Typography>
                  <Chip
                    label={product.isSold ? 'Sold' : 'Available'}
                    color={product.isSold ? 'error' : 'success'}
                    size="small"
                    sx={{ mt: 2 }}
                  />
                </CardContent>
                <Button component={Link} to={`/product/${product._id}`} variant="outlined" sx={{ m: 2 }}>
                  View Details
                </Button>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
}

export default AllProducts;