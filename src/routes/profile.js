const express = require('express');
const { db } = require('../config/firebase');
const jwt = require('jsonwebtoken');

const router = express.Router();

const verifyToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) {
        return res.status(403).json({ success: false, message: 'Access token is required' });
    }

    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        req.userId = decoded.userId;
        next();
    } catch (error) {
        return res.status(401).json({ success: false, message: 'Invalid or expired token', error: error.message });
    }
};

router.post('/currentuser', verifyToken, async (req, res) => {
    const { username, email, phone, address } = req.body;

    try {
        const userDoc = await db.collection('profiles').doc(req.userId).get();

        if (userDoc.exists) {
            await db.collection('profiles').doc(req.userId).update({
                username, email, phone, address, updatedAt: new Date(),
            });
            res.status(200).json({ success: true, message: 'Profile updated successfully' });
        } else {
            await db.collection('profiles').doc(req.userId).set({
                username, email, phone, address, createdAt: new Date(),
            });
            res.status(201).json({ success: true, message: 'Profile created successfully' });
        }
    } catch (error) {
        console.error('Error saving profile:', error);
        res.status(500).json({ success: false, message: 'Failed to save profile', error: error.message });
    }
});

router.get('/currentuser', verifyToken, async (req, res) => {
    try {
        const userSnapshot = await db.collection('profiles').doc(req.userId).get();

        if (!userSnapshot.exists) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        res.status(200).json({
            success: true,
            message: 'Profile fetched successfully',
            data: userSnapshot.data(),
        });
    } catch (error) {
        console.error('Error fetching profile:', error);
        res.status(500).json({ success: false, message: 'Error fetching profile', error: error.message });
    }
});

module.exports = router;
