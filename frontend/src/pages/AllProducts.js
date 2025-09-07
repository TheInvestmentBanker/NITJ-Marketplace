import { useEffect, useState } from 'react';
import { Grid, Card, CardContent, CardMedia, Typography, Button, Chip } from '@mui/material';
import { Link } from 'react-router-dom';
import axios from 'axios';

// Optional: Inline function to generate Cloudinary URL if utility file not used
const getImageUrl = (publicId) => {
  if (!publicId) return 'https://via.placeholder.com/200';
  return `https://res.cloudinary.com/dj1e78e53/image/upload/f_auto,q_auto,w_300,h_200,c_fill/${publicId}`;
  // Replace [your-cloud-name] with your actual Cloudinary cloud name
};

function AllProducts() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/products')
      .then(res => setProducts(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="py-6">
      <Typography variant="h4" className="mb-6 text-center">
        Available Products
      </Typography>
      <Grid container spacing={4} className="justify-center">
        {products.map(product => (
          <Grid item xs={12} sm={6} md={4} key={product._id}>
            <Card className="h-full flex flex-col">
              <CardMedia
                component="img"
                height="200"
                image={getImageUrl(product.imagePublicId)} // Use imagePublicId instead of imageUrl
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
    </div>
  );
}

export default AllProducts;