import { Typography } from '@mui/material';

function Footer() {
  return (
    <footer className="bg-gray-200 dark:bg-gray-800 py-4 text-center">
      <Typography variant="body2" className="text-gray-600 dark:text-gray-400">
        © 2025 College Marketplace. All rights reserved.
        {/* Placeholder for ads: <div className="mt-2">Ad space here</div> */}
      </Typography>
    </footer>
  );
}

export default Footer;