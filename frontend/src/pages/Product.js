import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Typography, Button, Box, Chip } from '@mui/material';
import axios from 'axios';

const getImageUrl = (publicId) => {
  if (!publicId) return 'https://via.placeholder.com/600x400';
  return `https://res.cloudinary.com/dj1e78e53/image/upload/f_auto,q_auto,w_600/${publicId}`;
}; 

function Product() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const API_URL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    axios.get(`${API_URL}/api/products/${id}`)
      .then(res => setProduct(res.data))
      .catch(err => console.error(err));
  }, [id]);

  if (!product) return <Typography>Loading...</Typography>;

  return (
    <Box className="py-10 max-w-2xl mx-auto">
      <Typography variant="h4" className="mb-4">{product.name}</Typography>
      <img
  src={getImageUrl(product.imagePublicId)}
  alt={product.name}
  className="w-full h-64 object-cover mb-4"
/>
      <Typography variant="body1" className="mb-4">{product.description}</Typography>
      <Typography variant="h6" className="mb-2">Price: ₹{product.price}</Typography>
      <Typography variant="subtitle1" className="mb-2">
        Seller: {product.sellerName} - Contact: {product.sellerContact}
      </Typography>
      <Typography variant="subtitle1" className="mb-2">Product Age: {product.productAge}</Typography>
      <Typography variant="subtitle1" className="mb-2">
        Price Negotiable: {product.isNegotiable ? 'Yes' : 'No'}
      </Typography>
      <Typography variant="subtitle1" className="mb-2">
        Bill Available: {product.hasBill ? 'Yes' : 'No'}
      </Typography>
      <Chip
        label={product.isSold ? 'Sold' : 'Available'}
        color={product.isSold ? 'error' : 'success'}
        className="mb-4"
      />
      <Button
  variant="contained"
  disabled={product.isSold}
  onClick={() => {
    window.open(`https://wa.me/${product.sellerContact}`, "_blank");
  }}
>
  Contact Seller (via WhatsApp)
</Button>
    </Box>
  );
}

export default Product;