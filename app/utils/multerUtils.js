import multer, { Multer } from "multer";

// Multer storage configuration
export const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, "uploads/");
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(
      null,
      `${file.fieldname}-${uniqueSuffix}.${file.originalname.split(".").pop()}`
    );
  },
});

// Multer upload configuration
export const uploadDisk: Multer = multer({ storage });
