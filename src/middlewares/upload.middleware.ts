import multer from 'multer';

// ram storage
const storage = multer.memoryStorage();

// single upload
export const uploadSingle = multer({ storage }).single('image');

// multiple upload at a time
export const uploadArray = multer({ storage }).array('images', 20);

// generic single file upload
export const uploadFile = multer({ storage }).single('file');

// generic multiple files upload
export const uploadMultiple = multer({ storage }).array('files', 20);

// document upload
export const uploadDocument = multer({ storage }).single('document');

// banner media upload
export const uploadBannerMedia = multer({ storage }).fields([
  { name: 'image', maxCount: 1 },
  { name: 'mobileImage', maxCount: 1 },
  { name: 'video', maxCount: 1 }
]);
