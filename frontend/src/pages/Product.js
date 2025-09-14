import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Typography, Button, Box, Chip, TextField, FormControlLabel, Checkbox, Dialog, DialogTitle, DialogContent, DialogActions, Container } from '@mui/material';
import axios from 'axios';
import { useTheme } from '@mui/material/styles'; 

const getImageUrl = (publicId) => {
  if (!publicId) return 'https://via.placeholder.com/600x400';
  return `https://res.cloudinary.com/dj1e78e53/image/upload/f_auto,q_auto,w_600/${publicId}`;
}; 

function Product() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const isAdmin = !!localStorage.getItem('adminToken');
  const API_URL = process.env.REACT_APP_API_URL;
  const token = localStorage.getItem('adminToken');
  const theme = useTheme();

  useEffect(() => {
    axios.get(`${API_URL}/api/products/${id}`)
      .then(res => {
        setProduct(res.data);
        if (editing) setEditForm(res.data); // Prefill if editing
      })
      .catch(err => console.error(err));
  }, [id, editing]);

  const handleEditChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditForm({ ...editForm, [name]: type === 'checkbox' ? checked : value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
    if (file) setImagePreview(URL.createObjectURL(file));
  };

  const handleEditSubmit = async () => {
    try {
      // For image: If new file, you'd need to upload to Cloudinary first and get new publicId/url
      // For simplicity, skipping image edit here; add Cloudinary upload logic if needed (similar to Sell.js)
      const updateData = { ...editForm };
      if (imageFile) {
        // Placeholder: Upload image separately and add imagePublicId/imageUrl to updateData
        // e.g., const uploadRes = await uploadToCloudinary(imageFile); updateData.imagePublicId = uploadRes.public_id; etc.
        alert('Image upload not implemented in this form; update text fields only for now.');
      }

      await axios.put(`${API_URL}/api/admin/products/${id}`, updateData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEditing(false);
      // Refresh product
      const res = await axios.get(`${API_URL}/api/products/${id}`);
      setProduct(res.data);
      alert('Product updated!');
    } catch (err) {
      console.error(err);
      alert('Error updating product');
    }
  };

  if (!product) return <Typography>Loading...</Typography>;

  const statusLabel = product.status === 'sold' ? 'Sold' : 
                     product.status === 'approved' ? 'Available' : 
                     product.status === 'rejected' ? 'Rejected' : 'Pending';
  const statusColor = product.status === 'sold' || product.status === 'rejected' ? 'error' : 
                      product.status === 'approved' ? 'success' : 'default';

  return (
    <Box maxWidth="md" sx={{ 
      py: { xs: 15, md: 12 },                         // [CHANGED] padding same as Sell.js
      backgroundColor: theme.palette.background.paper, // [CHANGED] adaptive background
      borderRadius: 0,                                // [CHANGED] match Sell.js flat style
      boxShadow: 3,                                   // [CHANGED] stronger shadow like Sell.js
    }}>
      <Container maxWidth="lg">
      <Typography 
        variant="h2" 
        sx={{ mb: 4, fontSize: '2rem', color: theme.palette.text.secondary }} // [CHANGED] color match Sell.js
      >
        {product.name}
      </Typography>
      <Box
        component="img"
        src={getImageUrl(product.imagePublicId)}
        alt={product.name}
        sx={{ width: '100%', height: 'auto', aspectRatio: '1/1', objectFit: 'cover', mb: 4, borderRadius: 2, backgroundColor: '#fff' }}
      />
      <Typography variant="body1" sx={{ mb: 4, fontSize: { xs: '0.875rem', md: '1rem' },  color: theme.palette.text.secondary  }}>{product.description}</Typography>
      <Typography variant="h6" sx={{ mb: 2, fontSize: { xs: '1.25rem', md: '1.5rem' },color: theme.palette.text.secondary }}>Price: ₹{product.price}</Typography>
      <Typography variant="subtitle1" sx={{ mb: 2, fontSize: { xs: '0.875rem', md: '1rem' }, color: theme.palette.text.secondary  }}>
        Seller: {product.sellerName} - Contact: {product.sellerContact}
      </Typography>
      <Typography variant="subtitle1" sx={{ mb: 2, fontSize: { xs: '0.875rem', md: '1rem' }, color: theme.palette.text.secondary  }}>Product Age: {product.productAge}</Typography>
      <Typography variant="subtitle1" sx={{ mb: 2, fontSize: { xs: '0.875rem', md: '1rem' }, color: theme.palette.text.secondary  }}>
        Price Negotiable: {product.isNegotiable ? 'Yes' : 'No'}
      </Typography>
      <Typography variant="subtitle1" sx={{ mb: 2, fontSize: { xs: '0.875rem', md: '1rem' }, color: theme.palette.text.secondary  }}>
        Bill Available: {product.hasBill ? 'Yes' : 'No'}
      </Typography>
      <Chip
        label={statusLabel}
        color={statusColor}
        sx={{ mb: 4 }}
      />
      <Button
        variant="contained"
        disabled={product.status !== 'approved'}
        onClick={() => {
          window.open(`https://wa.me/${product.sellerContact}`, "_blank");
        }}
        sx={{ mb: 2 }}
      >
        Contact Seller (via WhatsApp)
      </Button>
      
      {/* Admin Edit Button */}
      {isAdmin && (
        <Button
          variant="outlined"
          size="small"
          onClick={() => {
            setEditing(true);
            setEditForm({ ...product });
          }}
          sx={{ ml: 2 }}
        >
          Edit Product
        </Button>
      )}

      {/* Edit Dialog/Modal */}
      {editing && isAdmin && (
        <Dialog open={editing} onClose={() => setEditing(false)} maxWidth="md" fullWidth>
          <DialogTitle>Edit Product</DialogTitle>
          <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Name"
              name="name"
              value={editForm.name || ''}
              onChange={handleEditChange}
              InputProps={{ sx: { backgroundColor: (theme) => theme.palette.background.default } }}
              fullWidth
            />
            <TextField
              label="Description"
              name="description"
              value={editForm.description || ''}
              onChange={handleEditChange}
              fullWidth
              multiline
              InputProps={{ sx: { backgroundColor: (theme) => theme.palette.background.default } }}
              rows={4}
            />
            <TextField
              label="Price"
              name="price"
              type="number"
              value={editForm.price || ''}
              onChange={handleEditChange}
              InputProps={{ sx: { backgroundColor: (theme) => theme.palette.background.default } }}
              fullWidth
            />
            <TextField
              label="Product Age"
              name="productAge"
              value={editForm.productAge || ''}
              onChange={handleEditChange}
              InputProps={{ sx: { backgroundColor: (theme) => theme.palette.background.default } }}
              fullWidth
            />
            <FormControlLabel
              control={
                <Checkbox
                  name="isNegotiable"
                  checked={editForm.isNegotiable || false}
                  onChange={handleEditChange}
                />
              }
              sx={{color: theme.palette.text.secondary}}
              label="Negotiable"
            />
            <FormControlLabel
              control={
                <Checkbox
                  name="hasBill"
                  checked={editForm.hasBill || false}
                  onChange={handleEditChange}
                />
              }
              sx={{color: theme.palette.text.secondary}}
              label="Has Bill"
            />
            <TextField
              label="Status"
              name="status"
              select
              value={editForm.status || 'pending'}
              onChange={handleEditChange}
              fullWidth
              InputProps={{ sx: { backgroundColor: (theme) => theme.palette.background.default } }}
              SelectProps={{ native: true }}
            >
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="sold">Sold</option>
              <option value="rejected">Rejected</option>
            </TextField>
            {/* Image Edit: For now, placeholder; implement upload if needed */}
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
            />
            {imagePreview && <Box component="img" src={imagePreview} alt="Preview" sx={{ width: '100%', maxHeight: 200, objectFit: 'cover' }} />}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setEditing(false)}>Cancel</Button>
            <Button onClick={handleEditSubmit} variant="contained">Save Changes</Button>
          </DialogActions>
        </Dialog>
      )}
    </Container>
    </Box>
  );
}

export default Product;