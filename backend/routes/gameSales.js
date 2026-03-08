const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { getGameSales, createGameSale, updateGameSale, deleteGameSale } = require('../controllers/gameController');

// Ensure upload directory exists before starting multer
const uploadDir = path.join(__dirname, '../uploads/transactions/');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

router.get('/', getGameSales);
router.post('/', upload.single('transactionImage'), createGameSale);
router.put('/:id', updateGameSale);
router.delete('/:id', deleteGameSale);

module.exports = router;
