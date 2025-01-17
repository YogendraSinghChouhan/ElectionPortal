import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    fullName: {
        type: String,
        required: true,
    },
    dateOfBirth: {
        type: Date,
        required: true,
    },
    address: {
        street: {
            type: String,
            required: true,
        },
        city: {
            type: String,
            required: true,
        },
        state: {
            type: String,
            required: true,
        },
        zipCode: {
            type: String,
            required: true,
        },
    },
    idProof: {
        type: String,
        required: true,
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    role: {
        type: String,
        enum: ['voter', 'admin'],
        default: 'voter',
    },
    constituency: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Constituency',
    },
    votingHistory: [{
        election: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Election',
        },
        votedAt: Date,
    }],
}, {
    timestamps: true,
});

userSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 12);
    }
    next();
});

userSchema.methods.comparePassword = async function (candidatePassword: string) {
    return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.models?.User || mongoose.model('User', userSchema);
export default User;