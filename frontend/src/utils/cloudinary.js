const cloudinary = window.cloudinary; // If using CDN script, or import if installed
export const getImageUrl = (publicId) => {
  if (!publicId) return 'https://via.placeholder.com/150';
  return cloudinary.url(publicId, {
    secure: true,
    transformation: [
      { fetch_format: 'auto', quality: 'auto', width: 1200 },
    ],
  });
};