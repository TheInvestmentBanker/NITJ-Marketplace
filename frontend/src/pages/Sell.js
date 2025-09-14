import { useState } from 'react';
import { Typography, TextField, Button, Checkbox, FormControlLabel, Box, Container } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';

function Sell() {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    sellerName: '',
    sellerContact: '',
    productAge: '',
    isNegotiable: false,
    hasBill: false,
    image: null,
  });
  const [imagePreview, setImagePreview] = useState(null);
  const navigate = useNavigate();
  const theme = useTheme();

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === 'file') {
      const file = files[0];
      setFormData({ ...formData, image: file });
      setImagePreview(URL.createObjectURL(file));
    } else {
      setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    const API_URL = process.env.REACT_APP_API_URL;
    data.append('name', formData.name);
    data.append('description', formData.description);
    data.append('price', formData.price);
    data.append('sellerName', formData.sellerName);
    data.append('sellerContact', formData.sellerContact);
    data.append('productAge', formData.productAge);
    data.append('isNegotiable', formData.isNegotiable);
    data.append('hasBill', formData.hasBill);
    if (formData.image) {
      data.append('image', formData.image);
    }

    try {
      await axios.post(`${API_URL}/api/products`, data, {
         headers: { 'Content-Type': 'multipart/form-data' },
      });
      alert('Product posted successfully!');
      navigate('/products');
    } catch (err) {
      console.error(err);
      alert('Error posting product');
    }
  };

  return (
    <Box sx={{ 
     py: { xs: 15, md: 12 }, 
     backgroundColor: (theme) => theme.palette.background.paper,
     borderRadius: 0, 
     boxShadow: 3, 
     }}>
      <Container maxWidth="lg">
      <Typography variant="h2" textAlign="center" sx={{fontSize: '2rem', paddingTop:'15px',paddingBottom:'25px', color: theme.palette.text.secondary,}}>
        Sell Something
      </Typography>
      {/* Option buttons for Product or Service */}
      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 6, flexDirection: { xs: 'column', sm: 'row' } }}>
        <Button 
          variant="contained" 
          onClick={() => navigate('/sell')} // Current page for products
          sx={{ padding: 1}}
        >
          Sell a Product
        </Button>
        <Button 
          variant="outlined" 
          onClick={() => navigate('/sell-service')}
          sx={{ padding: 1}}
        >
          Sell a Service
        </Button>
      </Box>
      <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <TextField
          label="Product Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          fullWidth
          InputProps={{ sx: { backgroundColor: (theme) => theme.palette.background.default } }}
          required
        />
        <TextField
          label="Description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          fullWidth
          multiline
          rows={4}
          InputProps={{ sx: { backgroundColor: (theme) => theme.palette.background.default } }}
          required
        />
        <TextField
          label="Price (₹)"
          name="price"
          type="number"
          value={formData.price}
          onChange={handleChange}
          fullWidth
          InputProps={{ sx: { backgroundColor: (theme) => theme.palette.background.default } }}
          required
        />
        <TextField
          label="Seller Name"
          name="sellerName"
          value={formData.sellerName}
          onChange={handleChange}
          fullWidth
          InputProps={{ sx: { backgroundColor: (theme) => theme.palette.background.default } }}
          required
        />
        <TextField
          label="Seller Contact (Email/Phone)"
          name="sellerContact"
          value={formData.sellerContact}
          onChange={handleChange}
          fullWidth
          InputProps={{ sx: { backgroundColor: (theme) => theme.palette.background.default } }}
          required
        />
        <TextField
          label="Product Age (e.g., 6 months)"
          name="productAge"
          value={formData.productAge}
          onChange={handleChange}
          fullWidth
          InputProps={{ sx: { backgroundColor: (theme) => theme.palette.background.default } }}
          required
        />
        <FormControlLabel
          control={
            <Checkbox
              name="isNegotiable"
              checked={formData.isNegotiable}
              onChange={handleChange}
            />
          }
          sx={{color: theme.palette.text.secondary}}
          label="Price Negotiable"
        />
        <FormControlLabel
          control={
            <Checkbox
              name="hasBill"
              checked={formData.hasBill}
              onChange={handleChange}
            />
          }
          sx={{color: theme.palette.text.secondary}}
          label="Bill Available"
        />
        <input
          type="file"
          accept="image/*"
          name="image"
          onChange={handleChange}
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />
        {imagePreview && (
          <Box component="img"
            src={imagePreview}
            alt="Preview"
            sx={{ mt: 2, width: '100%', height: 'auto', aspectRatio: '1 / 1',  objectFit: 'contain', borderRadius: 2,  backgroundColor: '#ffffff' }}
          />
        )}
        <Button type="submit" variant="contained" fullWidth sx={{ py: 1.5 }}>
          Post Product
        </Button>
      </Box>
    </Container>
    </Box>
  );
}

export default Sell;