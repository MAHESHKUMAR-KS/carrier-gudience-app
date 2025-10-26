import mongoose from 'mongoose';

const scholarshipSchema = new mongoose.Schema({
  name: { type: String, required: true },
  provider: { type: String, required: true },
  deadline: { type: String },
  amount: { type: String },
  link: { type: String, required: true },
  state: { type: String, default: 'All India' },
  category: { type: String, default: 'General' },
  source: { type: String, required: true },
  description: { type: String },
  eligibility: { type: String },
  updatedAt: { type: Date, default: Date.now },
}, {
  timestamps: true
});

// Create compound index to prevent duplicate scholarships
scholarshipSchema.index({ name: 1, provider: 1, source: 1 }, { unique: true });

const Scholarship = mongoose.model('Scholarship', scholarshipSchema);

export default Scholarship;
