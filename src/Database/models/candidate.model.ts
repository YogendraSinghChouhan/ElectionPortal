import mongoose from 'mongoose';

const candidateSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },

    constituency: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Constituency',
        required: true,
    },
    elections: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Election',
    }],
    votes: {
        type: Number,
        default: 0,
    },
}, {
    timestamps: true,
});

const Candidate = mongoose.models.Candidate || mongoose.model('Candidate', candidateSchema);
export default Candidate;