import { Typography } from '@mui/material';

function Footer() {
  return (
    <footer sx={{ bgcolor: 'grey.200', py: { xs: 2, md: 4 }, textAlign: 'center' }}>
      <Typography variant="body2" sx={{ color: 'grey.600', fontSize: { xs: '0.75rem', md: '0.875rem' } }}>
        © 2025 College Marketplace. All rights reserved.
        {/* Placeholder for ads: <div className="mt-2">Ad space here</div> */}
      </Typography>
    </footer>
  );
}

export default Footer;