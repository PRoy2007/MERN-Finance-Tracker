const mongoose = require('mongoose');

//new transaction: user, type, amount, category, description, date
const transactionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, enum: ['income', 'expense'], required: true },
    amount: { type: Number, required: true, min: 0.01 },
    category: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    date: { type: Date, default: Date.now },
  },
  { timestamps: true } //lets us keep track of when it was created
);

module.exports = mongoose.model('Transaction', transactionSchema);