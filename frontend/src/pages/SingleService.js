import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Typography, Button, Box, Chip, TextField, FormControlLabel, Checkbox, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import axios from 'axios';

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
    <Box className="py-10 max-w-2xl mx-auto">
      <Typography variant="h4" className="mb-4">{service.serviceTitle}</Typography>
      <img
        src={getImageUrl(service.imagePublicId)}
        alt={service.serviceTitle}
        className="w-full h-64 object-cover mb-4"
      />
      <Typography variant="body1" className="mb-4">{service.description}</Typography>
      <Typography variant="h6" className="mb-2">Price: ₹{service.price} ({service.priceType})</Typography>
      <Typography variant="subtitle1" className="mb-2">
        Seller: {service.sellerName} - Contact: {service.sellerContact}
      </Typography>
      <Typography variant="subtitle1" className="mb-2">Category: {service.serviceCategory}</Typography>
      {service.duration && <Typography variant="subtitle1" className="mb-2">Duration: {service.duration}</Typography>}
      {service.location && <Typography variant="subtitle1" className="mb-2">Location: {service.location}</Typography>}
      <Typography variant="subtitle1" className="mb-2">
        Price Negotiable: {service.isNegotiable ? 'Yes' : 'No'}
      </Typography>
      <Chip
        label={statusLabel}
        color={statusColor}
        className="mb-4"
      />
      <Button
        variant="contained"
        disabled={service.status !== 'approved'}
        onClick={() => {
          window.open(`https://wa.me/${service.sellerContact}`, "_blank");
        }}
        className="mb-2"
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
          className="ml-2"
        >
          Edit Service
        </Button>
      )}

      {/* Edit Dialog */}
      {editing && isAdmin && (
        <Dialog open={editing} onClose={() => setEditing(false)} maxWidth="md" fullWidth>
          <DialogTitle>Edit Service</DialogTitle>
          <DialogContent>
            <TextField
              label="Title"
              name="serviceTitle"
              value={editForm.serviceTitle || ''}
              onChange={handleEditChange}
              fullWidth
              className="mb-2"
            />
            <TextField
              label="Description"
              name="description"
              value={editForm.description || ''}
              onChange={handleEditChange}
              fullWidth
              multiline
              rows={4}
              className="mb-2"
            />
            <TextField
              label="Price"
              name="price"
              type="number"
              value={editForm.price || ''}
              onChange={handleEditChange}
              fullWidth
              className="mb-2"
            />
            <TextField
              label="Price Type"
              name="priceType"
              select
              value={editForm.priceType || 'fixed'}
              onChange={handleEditChange}
              fullWidth
              className="mb-2"
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
              fullWidth
              className="mb-2"
            />
            <TextField
              label="Category"
              name="serviceCategory"
              value={editForm.serviceCategory || ''}
              onChange={handleEditChange}
              fullWidth
              className="mb-2"
            />
            <TextField
              label="Location"
              name="location"
              value={editForm.location || ''}
              onChange={handleEditChange}
              fullWidth
              className="mb-2"
            />
            <FormControlLabel
              control={
                <Checkbox
                  name="isNegotiable"
                  checked={editForm.isNegotiable || false}
                  onChange={handleEditChange}
                />
              }
              label="Negotiable"
            />
            <TextField
              label="Status"
              name="status"
              select
              value={editForm.status || 'pending'}
              onChange={handleEditChange}
              fullWidth
              className="mb-2"
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
              className="mb-2"
            />
            {imagePreview && <img src={imagePreview} alt="Preview" className="w-32 h-32 object-cover" />}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setEditing(false)}>Cancel</Button>
            <Button onClick={handleEditSubmit} variant="contained">Save Changes</Button>
          </DialogActions>
        </Dialog>
      )}
    </Box>
  );
}

export default SingleService;