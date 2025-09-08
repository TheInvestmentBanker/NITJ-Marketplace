import { useEffect, useState } from 'react';
import { Grid, Card, CardContent, CardMedia, Typography, Button, Chip } from '@mui/material';
import { Link } from 'react-router-dom';
import axios from 'axios';

const getImageUrl = (publicId) => {
  if (!publicId) return 'https://via.placeholder.com/200';
  return `https://res.cloudinary.com/dj1e78e53/image/upload/f_auto,q_auto,w_300,h_200,c_fill/${publicId}`;
};

function AllProducts() {
  const API_URL = process.env.REACT_APP_API_URL;
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
    <div className="py-6">
      <Typography variant="h4" className="mb-6 text-center">
        Available Products
      </Typography>
      {products.length === 0 ? (
        <Typography variant="body1" className="text-center">
          No products available. Check back later or approve pending products.
        </Typography>
      ) : (
        <Grid container spacing={4} className="justify-center">
          {products.map(product => (
            <Grid item xs={12} sm={6} md={4} key={product._id}>
              <Card className="h-full flex flex-col">
                <CardMedia
                  component="img"
                  height="200"
                  image={getImageUrl(product.imagePublicId || product.imageUrl)}
                  alt={product.name}
                />
                <CardContent className="flex-grow">
                  <Typography variant="h6">{product.name}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    ₹{product.price}
                  </Typography>
                  <Chip
                    label={product.isSold ? 'Sold' : 'Available'}
                    color={product.isSold ? 'error' : 'success'}
                    size="small"
                    className="mt-2"
                  />
                </CardContent>
                <Button component={Link} to={`/product/${product._id}`} variant="outlined" className="m-2">
                  View Details
                </Button>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </div>
  );
}

export default AllProducts;