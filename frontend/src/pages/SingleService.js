import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Typography, Button, Box, Chip, TextField, FormControlLabel, Checkbox, Dialog, DialogTitle, DialogContent, DialogActions, Container } from '@mui/material';
import axios from 'axios';
import { useTheme } from '@mui/material/styles'; 

const getImageUrl = (publicId) => {
  if (!publicId) return 'https://via.placeholder.com/600x400';
  return `https://res.cloudinary.com/dj1e78e53/image/upload/f_auto,q_auto,w_600/${publicId}`;
};

function SingleService() {
  const { id } = useParams();
  const [service, setService] = useState(null);
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const isAdmin = !!localStorage.getItem('adminToken');
  const API_URL = process.env.REACT_APP_API_URL;
  const token = localStorage.getItem('adminToken');
  const theme = useTheme();

  useEffect(() => {
    axios.get(`${API_URL}/api/services/${id}`)
      .then(res => {
        setService(res.data);
        if (editing) setEditForm(res.data);
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
      const updateData = { ...editForm };
      if (imageFile) {
        // Placeholder for image upload
        alert('Image upload not implemented; update text fields only.');
      }

      await axios.put(`${API_URL}/api/admin/services/${id}`, updateData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEditing(false);
      const res = await axios.get(`${API_URL}/api/services/${id}`);
      setService(res.data);
      alert('Service updated!');
    } catch (err) {
      console.error(err);
      alert('Error updating service');
    }
  };

  if (!service) return <Typography>Loading...</Typography>;

  const statusLabel = service.status === 'out_of_service' ? 'Out of Service' : 
                     service.status === 'approved' ? 'Available' : 
                     service.status === 'rejected' ? 'Rejected' : 'Pending';
  const statusColor = service.status === 'out_of_service' || service.status === 'rejected' ? 'error' : 
                     service.status === 'approved' ? 'success' : 'default';

  return (
    <Box sx={{ 
      py: { xs: 15, md: 12 },                         
      backgroundColor: theme.palette.background.paper, 
      borderRadius: 0,                                
      boxShadow: 3,                                   
    }}>
      <Container maxWidth="lg">
      <Typography 
        variant="h2" 
        sx={{ mb: 4, fontSize: '2rem', color: theme.palette.text.secondary }}>
        {service.serviceTitle}
      </Typography>
      <Box
        component="img"
        src={getImageUrl(service.imagePublicId)}
        alt={service.serviceTitle}
        sx={{ width: '100%', height: 'auto', aspectRatio: '1/1', objectFit: 'contain', mb: 4, borderRadius: 2, backgroundColor: '#fff'}}
      />
      <Typography variant="body1" sx={{ mb: 4, fontSize: { xs: '0.875rem', md: '1rem' },  color: theme.palette.text.secondary  }}>{service.description}</Typography>
      <Typography variant="h6" sx={{ mb: 2, fontSize: { xs: '1.25rem', md: '1.5rem' },  color: theme.palette.text.secondary  }}>Price: ₹{service.price} ({service.priceType})</Typography>
      <Typography variant="subtitle1" sx={{ mb: 2, fontSize: { xs: '0.875rem', md: '1rem' },  color: theme.palette.text.secondary  }}>
        Seller: {service.sellerName} - Contact: {service.sellerContact}
      </Typography>
      <Typography variant="subtitle1" sx={{ mb: 2, fontSize: { xs: '0.875rem', md: '1rem' },  color: theme.palette.text.secondary  }}>Category: {service.serviceCategory}</Typography>
      {service.duration && <Typography variant="subtitle1" sx={{ mb: 2, fontSize: { xs: '0.875rem', md: '1rem' },  color: theme.palette.text.secondary  }}>Duration: {service.duration}</Typography>}
      {service.location && <Typography variant="subtitle1" sx={{ mb: 2, fontSize: { xs: '0.875rem', md: '1rem' },  color: theme.palette.text.secondary  }}>Location: {service.location}</Typography>}
      <Typography variant="subtitle1" sx={{ mb: 2, fontSize: { xs: '0.875rem', md: '1rem' },  color: theme.palette.text.secondary  }}>
        Price Negotiable: {service.isNegotiable ? 'Yes' : 'No'}
      </Typography>
      <Chip
        label={statusLabel}
        color={statusColor}
        sx={{ mb: 4 }}
      />
      <Button
        variant="contained"
        disabled={service.status !== 'approved'}
        onClick={() => {
          window.open(`https://wa.me/${service.sellerContact}`, "_blank");
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
            setEditForm({ ...service });
          }}
          sx={{ ml: 2 }}
        >
          Edit Service
        </Button>
      )}

      {/* Edit Dialog */}
      {editing && isAdmin && (
        <Dialog open={editing} onClose={() => setEditing(false)} maxWidth="md" fullWidth>
          <DialogTitle>Edit Service</DialogTitle>
          <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Title"
              name="serviceTitle"
              value={editForm.serviceTitle || ''}
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
              label="Price Type"
              name="priceType"
              select
              value={editForm.priceType || 'fixed'}
              onChange={handleEditChange}
              fullWidth
              InputProps={{ sx: { backgroundColor: (theme) => theme.palette.background.default } }}
              SelectProps={{ native: true }}
            >
              <option value="fixed">Fixed</option>
              <option value="hourly">Hourly</option>
            </TextField>
            <TextField
              label="Duration"
              name="duration"
              value={editForm.duration || ''}
              onChange={handleEditChange}
              InputProps={{ sx: { backgroundColor: (theme) => theme.palette.background.default } }}
              fullWidth
            />
            <TextField
              label="Category"
              name="serviceCategory"
              value={editForm.serviceCategory || ''}
              onChange={handleEditChange}
              InputProps={{ sx: { backgroundColor: (theme) => theme.palette.background.default } }}
              fullWidth
            />
            <TextField
              label="Location"
              name="location"
              value={editForm.location || ''}
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
              <option value="out_of_service">Out of Service</option>
              <option value="rejected">Rejected</option>
            </TextField>
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

export default SingleService;