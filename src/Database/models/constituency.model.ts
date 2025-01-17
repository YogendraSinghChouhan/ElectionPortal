import mongoose from 'mongoose';

const constituencySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  region: {
    type: String,
    required: true,
  },
  totalVoters: {
    type: Number,
    default: 0,
  },
  activeElections: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Election',
  }],
}, {
  timestamps: true,
});

const Constituency = mongoose.models.Constituency || mongoose.model('Constituency', constituencySchema);
export default Constituency;