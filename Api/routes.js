const express = require('express');
const router = express.Router();
const { registerExchangeRequest, getExchangeHistory } = require('./controllers/exchangeController');

router.post('/exchange', registerExchangeRequest);
router.get('/exchange/history', getExchangeHistory);

module.exports = router;