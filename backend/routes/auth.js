const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

// A simple login route taking an admin password.
// For demonstration, we use an env variable or hardcoded password.
router.post('/login', (req, res) => {
    const { password } = req.body;

    // In a real app, you would check against a hashed password in DB
    const adminPassword = process.env.ADMIN_PASSWORD || 'nxt123';

    if (password === adminPassword) {
        // Create token
        const token = jwt.sign(
            { role: 'admin' },
            process.env.JWT_SECRET || 'super_secret_jwt_key',
            { expiresIn: '24h' }
        );
        res.json({ token });
    } else {
        res.status(401).json({ message: 'Invalid password' });
    }
});

module.exports = router;
