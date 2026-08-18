'use strict';

const express = require('express');

const router = express.Router();

// GET /health — simple liveness check, no auth, no dependencies.
router.get('/', (req, res) => {
  res.json({ status: 'ok', uptimeSeconds: process.uptime() });
});

module.exports = router;
