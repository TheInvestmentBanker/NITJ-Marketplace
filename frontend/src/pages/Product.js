// src/pages/Product.js  (or wherever your Product component lives)
import { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import {
  Typography,
  Button,
  Box,
  Chip,
  TextField,
  FormControlLabel,
  Checkbox,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Container
} from '@mui/material';
import axios from 'axios';
import { useTheme } from '@mui/material/styles';

// helper: returns Cloudinary url; width optional (used for zoom pane)
const getImageUrl = (publicId, width = 600) => {
  if (!publicId) return 'https://via.placeholder.com/600x400';
  return `https://res.cloudinary.com/dj1e78e53/image/upload/f_auto,q_auto,w_${width}/${publicId}`;
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

  // --- ZOOM RELATED STATE & REFS ---
  const wrapperRef = useRef(null); // wrapper containing image + zoom pane
  const imgRef = useRef(null);
  const [isZoomed, setIsZoomed] = useState(false);                 // hover state
  const [mousePx, setMousePx] = useState({ x: 0, y: 0 });          // mouse pos in px inside image
  const [mousePercent, setMousePercent] = useState({ x: 50, y: 50 }); // pos in %
  const [displayedSize, setDisplayedSize] = useState({ w: 0, h: 0 });
  const [naturalSize, setNaturalSize] = useState({ w: 0, h: 0 });

  useEffect(() => {
    axios.get(`${API_URL}/api/products/${id}`)
      .then(res => {
        setProduct(res.data);
        if (editing) setEditForm(res.data); // Prefill if editing
      })
      .catch(err => console.error(err));
  }, [id, editing, API_URL]);

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
        alert('Image upload not implemented in this form; update text fields only for now.');
      }

      await axios.put(`${API_URL}/api/admin/products/${id}`, updateData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEditing(false);
      const res = await axios.get(`${API_URL}/api/products/${id}`);
      setProduct(res.data);
      alert('Product updated!');
    } catch (err) {
      console.error(err);
      alert('Error updating product');
    }
  };

  // --- ZOOM HANDLERS ---
  const handleImageLoad = (e) => {
    // set natural size for correct zoom scaling
    setNaturalSize({ w: e.target.naturalWidth, h: e.target.naturalHeight });
    // also set displayed size initially (useful if component mounted after image is loaded)
    const rect = e.target.getBoundingClientRect();
    setDisplayedSize({ w: rect.width, h: rect.height });
  };

  const handleMouseEnter = () => {
    if (!product?.imagePublicId) return;
    setIsZoomed(true);
  };

  const handleMouseLeave = () => {
    setIsZoomed(false);
  };

  const handleMouseMove = (e) => {
    // use the actual image bounding rect to compute pointer position relative to the image
    const imgEl = imgRef.current;
    if (!imgEl) return;
    const rect = imgEl.getBoundingClientRect();
    const x = e.clientX - rect.left; // px
    const y = e.clientY - rect.top;  // px
    const clampedX = Math.max(0, Math.min(x, rect.width));
    const clampedY = Math.max(0, Math.min(y, rect.height));
    const percentX = (clampedX / rect.width) * 100;
    const percentY = (clampedY / rect.height) * 100;
    setMousePx({ x: clampedX, y: clampedY });
    setMousePercent({ x: percentX, y: percentY });
    setDisplayedSize({ w: rect.width, h: rect.height });
  };

  if (!product) return <Typography>Loading...</Typography>;

  const statusLabel = product.status === 'sold' ? 'Sold' :
                     product.status === 'approved' ? 'Available' :
                     product.status === 'rejected' ? 'Rejected' : 'Pending';
  const statusColor = product.status === 'sold' || product.status === 'rejected' ? 'error' :
                      product.status === 'approved' ? 'success' : 'default';

  // compute background-size for zoom pane
  const zoomBackgroundSize = (naturalSize.w && displayedSize.w)
    ? `${(naturalSize.w / displayedSize.w) * 100}% ${(naturalSize.h / displayedSize.h) * 100}%`
    : 'cover';

  // Lens visual size (px)
  const LENS_SIZE = 110;

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
          sx={{ mb: 4, fontSize: '2rem', color: theme.palette.text.secondary }}
        >
          {product.name}
        </Typography>

        {/* Layout: left = details, right = image + zoom */}
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4, alignItems: 'flex-start' }}>
          {/* Right: Image + Zoom area (wrapped so mouse enter/leave includes both image and zoom pane) */}
          <Box
            ref={wrapperRef}
            onMouseEnter={handleMouseEnter}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            sx={{
              display: 'flex',
              gap: 3,
              alignItems: 'flex-start',
              flexShrink: 0
            }}
          >
            {/* Image container */}
            <Box
              sx={{
                position: 'relative',
                width: { xs: '100%', md: 300 },
              }}
            >
              <Box
                component="img"
                ref={imgRef}
                src={getImageUrl(product.imagePublicId, 600)}
                alt={product.name}
                onLoad={handleImageLoad}
                sx={{
                  width: '100%',
                  height: 'auto',
                  borderRadius: 2,
                  backgroundColor: '#fff',
                  boxShadow: 3,
                  transition: 'transform 0.15s ease',
                  cursor: 'zoom-in',
                  display: 'block',
                }}
              />

              {/* Lens overlay (visual) */}
              {isZoomed && (
                <Box
                  sx={{
                    display: { xs: 'none', md: 'block' }, // lens only on desktop
                    position: 'absolute',
                    pointerEvents: 'none',
                    width: `${LENS_SIZE}px`,
                    height: `${LENS_SIZE}px`,
                    borderRadius: 1,
                    border: '1px solid rgba(255,255,255,0.9)',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.25)',
                    transform: 'translate(-50%,-50%)',
                    left: `${mousePx.x}px`,
                    top: `${mousePx.y}px`,
                    background: 'rgba(255,255,255,0.04)',
                    backdropFilter: 'blur(0.5px)',
                  }}
                />
              )}
            </Box>

            {/* Zoom Pane (desktop only, only while zooming) */}
            {isZoomed && (
              <Box
                sx={{
                  display: { xs: 'none', md: 'block' },
                  width: 420,
                  height: 420,
                  borderRadius: 2,
                  boxShadow: 3,
                  backgroundImage: `url(${getImageUrl(product.imagePublicId, 1200)})`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: `${mousePercent.x}% ${mousePercent.y}%`,
                  backgroundSize: zoomBackgroundSize,
                  border: '1px solid rgba(0,0,0,0.08)',
                  overflow: 'hidden'
                }}
              />
            )}
          </Box>
        </Box>

        {/* Remaining details (below image area) */}
        <Typography variant="body1" sx={{ mb: 4,paddingTop: 170, fontSize: { xs: '0.875rem', md: '1rem' }, color: theme.palette.text.secondary }}>
              {product.description}
        </Typography>
        <Typography variant="h6" sx={{ mb: 2, fontSize: { xs: '1.25rem', md: '1.5rem' }, color: theme.palette.text.secondary }}>
              Price: ₹{product.price}
        </Typography>
        <Typography variant="body1" sx={{ mt: 4, mb: 2, fontSize: { xs: '0.875rem', md: '1rem' }, color: theme.palette.text.secondary }}>
          Product Age: {product.productAge}
        </Typography>
        <Typography variant="subtitle1" sx={{ mb: 2, fontSize: { xs: '0.875rem', md: '1rem' }, color: theme.palette.text.secondary }}>
          Seller: {product.sellerName} - Contact: {product.sellerContact}
        </Typography>
        <Typography variant="subtitle1" sx={{ mb: 2, fontSize: { xs: '0.875rem', md: '1rem' }, color: theme.palette.text.secondary }}>
          Price Negotiable: {product.isNegotiable ? 'Yes' : 'No'}
        </Typography>
        <Typography variant="subtitle1" sx={{ mb: 2, fontSize: { xs: '0.875rem', md: '1rem' }, color: theme.palette.text.secondary }}>
          Bill Available: {product.hasBill ? 'Yes' : 'No'}
        </Typography>

        <Chip label={statusLabel} color={statusColor} sx={{ mb: 4 }} />

        <Button
          variant="contained"
          disabled={product.status !== 'approved'}
          onClick={() => window.open(`https://wa.me/${product.sellerContact}`, "_blank")}
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
                sx={{ color: theme.palette.text.secondary }}
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
                sx={{ color: theme.palette.text.secondary }}
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

              <input type="file" accept="image/*" onChange={handleImageChange} />
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
