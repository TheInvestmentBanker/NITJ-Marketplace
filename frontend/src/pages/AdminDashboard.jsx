import { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  CardMedia,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

// helper to build Cloudinary preview
const getImageUrl = (publicId) => {
  if (!publicId) return "https://via.placeholder.com/200";
  return `https://res.cloudinary.com/dj1e78e53/image/upload/f_auto,q_auto,w_300,h_200,c_fill/${publicId}`;
};

function AdminDashboard() {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem("adminToken");

  // Use API URL from environment variable
  const API_URL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    if (!token) return navigate("/admin/login");

    axios
      .get(`${API_URL}/api/admin/products/pending`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setProducts(res.data))
      .catch((err) => {
        console.error(err);
        if (err.response && err.response.status === 401) navigate("/admin/login");
      });
  }, [token, navigate, API_URL]);

  const approve = async (id) => {
    try {
      await axios.put(
        `${API_URL}/api/admin/products/${id}/approve`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setProducts(products.filter((p) => p._id !== id));
    } catch (err) {
      console.error(err);
      alert("Could not approve");
    }
  };

  const reject = async (id) => {
    if (
      !window.confirm(
        "Delete this product? This will remove the image from Cloudinary."
      )
    )
      return;
    try {
      await axios.delete(`${API_URL}/api/admin/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts(products.filter((p) => p._id !== id));
    } catch (err) {
      console.error(err);
      alert("Could not delete");
    }
  };

  return (
    <Box className="py-6 max-w-4xl mx-auto">
      <Typography variant="h4" className="mb-4">
        Pending Products
      </Typography>
      {products.length === 0 && <Typography>No pending products</Typography>}
      {products.map((p) => (
        <Card key={p._id} className="mb-4 flex">
          <CardMedia
            component="img"
            image={getImageUrl(p.imagePublicId)}
            alt={p.name}
            style={{ width: 200, objectFit: "cover" }}
          />
          <CardContent style={{ flex: 1 }}>
            <Typography variant="h6">{p.name}</Typography>
            <Typography>Price: ₹{p.price}</Typography>
            <Typography>{p.description}</Typography>
            <div style={{ marginTop: 8 }}>
              <Button
                variant="contained"
                onClick={() => approve(p._id)}
                style={{ marginRight: 8 }}
              >
                Approve
              </Button>
              <Button
                variant="outlined"
                color="error"
                onClick={() => reject(p._id)}
              >
                Reject
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
}

export default AdminDashboard;
