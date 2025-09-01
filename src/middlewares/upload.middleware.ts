import multer from 'multer';

// ram storage
const storage = multer.memoryStorage();

// single upload
export const uploadSingle = multer({ storage }).single('image');

// multiple upload at a time
export const uploadArray = multer({ storage }).array('images', 20);
