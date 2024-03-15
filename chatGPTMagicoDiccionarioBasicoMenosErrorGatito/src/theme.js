const express = require('express');

const router = express.Router();


router.get('/date', function (req, res) {
    res.sendFile('./index.html', { root: 'public' })
})

module.exports = router; 