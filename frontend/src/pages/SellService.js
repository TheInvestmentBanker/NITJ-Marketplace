import { useState } from 'react';
import { Typography, TextField, Button, Checkbox, FormControlLabel, Box, Select, MenuItem } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

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
    <Box className="py-10 max-w-lg mx-auto">
      <Typography variant="h4" className="mb-6 text-center">
        Post a Service
      </Typography>
      <form onSubmit={handleSubmit} className="space-y-4">
        <TextField
          label="Service Title"
          name="serviceTitle"
          value={formData.serviceTitle}
          onChange={handleChange}
          fullWidth
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
          required
        />
        <TextField
          label="Price (₹)"
          name="price"
          type="number"
          value={formData.price}
          onChange={handleChange}
          fullWidth
          required
        />
        <Select
          name="priceType"
          value={formData.priceType}
          onChange={handleChange}
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
          fullWidth
        />
        <TextField
          label="Service Category (e.g., Tutoring)"
          name="serviceCategory"
          value={formData.serviceCategory}
          onChange={handleChange}
          fullWidth
          required
        />
        <TextField
          label="Location (optional)"
          name="location"
          value={formData.location}
          onChange={handleChange}
          fullWidth
        />
        <TextField
          label="Seller Name"
          name="sellerName"
          value={formData.sellerName}
          onChange={handleChange}
          fullWidth
          required
        />
        <TextField
          label="Seller Contact (Email/Phone)"
          name="sellerContact"
          value={formData.sellerContact}
          onChange={handleChange}
          fullWidth
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
          <img
            src={imagePreview}
            alt="Preview"
            className="mt-4 w-full h-48 object-cover rounded-md"
          />
        )}
        <Button type="submit" variant="contained" fullWidth className="py-3">
          Post Service
        </Button>
      </form>
    </Box>
  );
}

export default SellService;