import { Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="text-center py-10 md:py-20 lg:py-32">  {/* Responsive padding */}
      <Typography variant="h2" className="mb-4 font-bold">
        Welcome to College Marketplace
      </Typography>
      <Typography variant="body1" className="mb-6 max-w-md mx-auto">
        Buy and sell stuff within your college/hostel. No payments here—just connect directly!
      </Typography>
      <Link to="/products">
        <Button variant="contained" size="large" className="px-8 py-3">
          Browse Products
        </Button>
      </Link>
      {/* Placeholder for future: <Button>Sign Up</Button> */}
    </div>
  );
}

export default Home;