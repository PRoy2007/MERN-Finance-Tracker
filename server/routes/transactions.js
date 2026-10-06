const router = require('express').Router();
const auth = require('../middleware/auth');
const Transaction = require('../models/Transaction');

router.use(auth); //must be logged in to access any transaction routes


//load previous transactions
router.get('/', async (req, res) => { 
  const transactions = await Transaction.find({ user: req.userId }).sort({ date: -1 });
  res.json(transactions);
});

//add new transaction
router.post('/', async (req, res) => {
  try {
    const { type, amount, category, description, date } = req.body;
    const transaction = await Transaction.create({
      user: req.userId, type, amount, category, description, date: date || undefined,
    });
    res.status(201).json(transaction);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

//delete transaction
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Transaction.findOneAndDelete({ _id: req.params.id, user: req.userId });
    if (!deleted) return res.status(404).json({ message: 'Transaction not found' });
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(400).json({ message: 'Invalid transaction id' });
  }
});

module.exports = router;