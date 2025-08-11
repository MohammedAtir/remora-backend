const mongoose = require('mongoose');

const businessSchema = new mongoose.Schema({
  name: { type: String, required: true },
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Investor' },
  sector: {type : String, enum : ["Manufacturing", "Retail", "Agriculture", "Health Care", "Education", "Transportation", "Finance", "Construction", "Other"], required : true},
  valuation: { type: Number, default: 0 },
  constitution :  {type : String, enum : [ "Limited Liability Partnership (LLP)", "Public Limited Company", "Private Limited Company", "Sole Proprietorship","Other"], required : true},
  revenue: {type : String, enum : ["upto 50 Lacs", "50lac-1Crore", "1Crore to 5cr", "5Cr to 20 Cr", "Above 20 Cr"], required : true},
  companySize: {type : String, enum : ["1-10 Employees", "11-50 Employees", "51-100 Employees", "101-500 Employees", "501-1000 Employees", "1001-5000 Employees", "5001-10000 Employees", "Above 10000 Employees"], required : true},
  ownerEmail: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Business', businessSchema);
