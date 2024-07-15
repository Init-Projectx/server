const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
// Konfigurasi untuk menyimpan file upload
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../assets/products')); // Sesuaikan dengan lokasi penyimpanan file Anda
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = `${uuidv4()}-${path.extname(file.originalname)}`;
        cb(null, file.fieldname + '-' + uniqueSuffix);
    }
});

const upload = multer({ storage: storage });

module.exports = upload.single('photo'); // Ekspor fungsi langsung
