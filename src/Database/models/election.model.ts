import mongoose from 'mongoose';

const electionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  constituency: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Constituency',
    required: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  candidates: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Candidate',
  }],
  status: {
    type: String,
    enum: ['upcoming', 'active', 'completed'],
    default: 'upcoming',
  },
  totalVotes: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: true,
});

const Election = mongoose.models.Election || mongoose.model('Election', electionSchema);
export default Election;