import { useState } from 'react';
import { Typography, TextField, Button, Checkbox, FormControlLabel, Box, Select, MenuItem, Container } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';

function SellService() {
  const [formData, setFormData] = useState({
    serviceTitle: '',
    description: '',
    price: '',
    sellerName: '',
    sellerContact: '',
    priceType: 'fixed',
    duration: '',
    serviceCategory: '',
    location: '',
    isNegotiable: false,
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
    data.append('serviceTitle', formData.serviceTitle);
    data.append('description', formData.description);
    data.append('price', formData.price);
    data.append('sellerName', formData.sellerName);
    data.append('sellerContact', formData.sellerContact);
    data.append('priceType', formData.priceType);
    data.append('duration', formData.duration);
    data.append('serviceCategory', formData.serviceCategory);
    data.append('location', formData.location);
    data.append('isNegotiable', formData.isNegotiable);
    if (formData.image) {
      data.append('image', formData.image);
    }

    try {
      await axios.post(`${API_URL}/api/services`, data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      alert('Service posted successfully! Awaiting approval.');
      navigate('/services');
    } catch (err) {
      console.error(err);
      alert('Error posting service');
    }
  };

  return (
    <Box sx={{ 
     py: { xs: 15, md: 12 }, 
     backgroundColor: (theme) => theme.palette.background.paper,
     borderRadius: 0, 
     boxShadow: 3, 
     }}><Container maxWidth="lg">
      <Typography variant="h2" textAlign="center" sx={{fontSize: '2rem', paddingTop:'15px',paddingBottom:'25px', color: theme.palette.text.secondary,}}>
        Post a Service
      </Typography>
      <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <TextField
          label="Service Title"
          name="serviceTitle"
          value={formData.serviceTitle}
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
        <Select
          name="priceType"
          value={formData.priceType}
          onChange={handleChange}
          InputProps={{ sx: { backgroundColor: (theme) => theme.palette.background.default } }}
          fullWidth
        >
          <MenuItem value="fixed">Fixed Price</MenuItem>
          <MenuItem value="hourly">Hourly</MenuItem>
        </Select>
        <TextField
          label="Duration (e.g., 1 hour)"
          name="duration"
          value={formData.duration}
          onChange={handleChange}
          InputProps={{ sx: { backgroundColor: (theme) => theme.palette.background.default } }}
          fullWidth
        />
        <TextField
          label="Service Category (e.g., Tutoring)"
          name="serviceCategory"
          value={formData.serviceCategory}
          onChange={handleChange}
          fullWidth
          InputProps={{ sx: { backgroundColor: (theme) => theme.palette.background.default } }}
          required
        />
        <TextField
          label="Location (optional)"
          name="location"
          value={formData.location}
          onChange={handleChange}
          InputProps={{ sx: { backgroundColor: (theme) => theme.palette.background.default } }}
          fullWidth
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
            sx={{ mt: 2, width: '100%', height: 'auto', aspectRatio: '1/1', objectFit: 'contain', borderRadius: 2 }}
          />
        )}
        <Button type="submit" variant="contained" fullWidth sx={{ py: 1.5 }}>
          Post Service
        </Button>
      </Box>
    </Container>
    </Box>
  );
}

export default SellService;