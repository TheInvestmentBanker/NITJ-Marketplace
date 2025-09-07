import { useState } from 'react';
import { Typography, TextField, Button, Checkbox, FormControlLabel, Box } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

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
      await axios.post('http://localhost:5000/api/products', data, {
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
    <Box className="py-10 max-w-lg mx-auto">
      <Typography variant="h4" className="mb-6 text-center">
        Post a Product
      </Typography>
      <form onSubmit={handleSubmit} className="space-y-4">
        <TextField
          label="Product Name"
          name="name"
          value={formData.name}
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
        <TextField
          label="Product Age (e.g., 6 months)"
          name="productAge"
          value={formData.productAge}
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
        <FormControlLabel
          control={
            <Checkbox
              name="hasBill"
              checked={formData.hasBill}
              onChange={handleChange}
            />
          }
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
          <img
            src={imagePreview}
            alt="Preview"
            className="mt-4 w-full h-48 object-cover rounded-md"
          />
        )}
        <Button type="submit" variant="contained" fullWidth className="py-3">
          Post Product
        </Button>
      </form>
    </Box>
  );
}

export default Sell;