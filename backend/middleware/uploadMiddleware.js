const multer = require("multer");
const path = require("path");

const storage = multer.memoryStorage();
const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = {
  "image/jpeg": [".jpg", ".jpeg"],
  "image/png": [".png"],
  "image/webp": [".webp"],
};

function isAllowedImage(file) {
  const extensions = ALLOWED_IMAGE_TYPES[file?.mimetype];
  return Boolean(extensions && extensions.includes(path.extname(file.originalname || "").toLowerCase()));
}

function hasValidImageSignature(file) {
  if (!file?.buffer) return false;
  const buffer = file.buffer;
  if (file.mimetype === "image/jpeg") return buffer.length >= 3 && buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff;
  if (file.mimetype === "image/png") return buffer.length >= 8 && buffer.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]));
  if (file.mimetype === "image/webp") return buffer.length >= 12 && buffer.subarray(0, 4).toString() === "RIFF" && buffer.subarray(8, 12).toString() === "WEBP";
  return false;
}

const upload = multer({
  storage,
  limits: { fileSize: MAX_IMAGE_SIZE_BYTES, files: 1 },
  fileFilter: (req, file, callback) => {
    if (!isAllowedImage(file)) {
      return callback(new multer.MulterError("LIMIT_UNEXPECTED_FILE", "image"));
    }
    callback(null, true);
  },
});

function singleImage(req, res, next) {
  upload.single("image")(req, res, (error) => {
    if (!error) {
      if (req.file && !hasValidImageSignature(req.file)) {
        return res.status(400).json({ success: false, message: "Image file content is invalid" });
      }
      return next();
    }
    if (error instanceof multer.MulterError) {
      const message = error.code === "LIMIT_FILE_SIZE"
        ? "Image must be 5 MB or smaller"
        : "Only JPG, PNG, and WebP image files are supported";
      return res.status(400).json({ success: false, message });
    }
    return res.status(400).json({ success: false, message: "Invalid image upload" });
  });
}

module.exports = { singleImage, isAllowedImage, hasValidImageSignature, MAX_IMAGE_SIZE_BYTES };
