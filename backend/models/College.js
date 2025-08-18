import mongoose from 'mongoose';

const CollegeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },
  courses: [{ type: String, required: true }],
  streams: [{ type: String, required: true }],
  minMarks: { type: Number, required: true },
  maxFees: { type: Number, required: true },
  description: { type: String, required: true },
  website: { type: String },
  contactEmail: { type: String },
  facilities: [{ type: String }],
  placementStats: {
    averagePackage: { type: Number },
    highestPackage: { type: Number },
    topRecruiters: [{ type: String }]
  },
  admissionProcess: { type: String },
  ranking: { type: Number },
  imageUrl: { type: String }
}, { timestamps: true });

const College = mongoose.model('College', CollegeSchema);

export default College;
