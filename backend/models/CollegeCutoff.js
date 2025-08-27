import mongoose from 'mongoose';

const communityCutoffSchema = new mongoose.Schema({
  general: { type: Number, required: true },
  obc: { type: Number },
  sc: { type: Number },
  st: { type: Number },
  ews: { type: Number },
  bc: { type: Number },
  mbc: { type: Number },
  bcm: { type: Number },
  dnc: { type: Number },
  scc: { type: Number },
  sca: { type: Number },
  year: { type: Number, required: true, default: new Date().getFullYear() }
});

const collegeCutoffSchema = new mongoose.Schema({
  placeId: { type: String, required: true, unique: true },
  collegeName: { type: String, required: true },
  location: { type: String, required: true },
  cutoffs: {
    type: Map,
    of: communityCutoffSchema,
    default: {}
  },
  lastUpdated: { type: Date, default: Date.now }
});

export default mongoose.model('CollegeCutoff', collegeCutoffSchema);
