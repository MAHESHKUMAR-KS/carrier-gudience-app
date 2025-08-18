import mongoose from 'mongoose';

const CareerSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  degreeRequired: { type: String, required: true },
  careerPath: { type: String, required: true },
  skillsRequired: [{ type: String, required: true }],
});

const Career = mongoose.model('Career', CareerSchema);

export default Career;
