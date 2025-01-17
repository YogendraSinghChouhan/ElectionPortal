"use server";

import { auth } from "@/auth";
import dbConnect from "@/Database/dbConnect";
import Candidate from "@/Database/models/candidate.model";
import Election from "@/Database/models/election.model";
import User from "@/Database/models/user.model";

export const getVotingHistory = async () => {
    try {
        const session = await auth();

        if (!session) {
            return [];
        }
        await dbConnect();

        const user = await User.findOne({ email: session.user?.email })
            .populate({
                path: 'votingHistory.election',
                select: 'title description startDate endDate'
            });
        if (!user) {
            return [];
        }
        return user.votingHistory;

    } catch (error) {
        console.error('Error fetching voting history:', error);
        return [];
    }
};

export const getUpcomingElections = async () => {
    try {
        const session = await auth();
        if (!session) {
            return [];
        }
        await dbConnect();

        const elections = await Election.find({ startDate: { $gt: new Date() } });
        if (!elections) {
            return [];
        }
        return elections;
    } catch (error) {
        console.error('Error fetching upcoming elections:', error);
        return [];
    }
}

export const getAllElections = async () => {
    try {
        const session = await auth();
        if (!session) {
            return [];
        }
        await dbConnect();

        const elections = await Election.find()
            .populate('constituency', 'name region')
            .sort({ startDate: -1 });

        if (!elections) {
            return [];
        }
        return elections;
    } catch (error) {
        console.error('Error fetching all elections:', error);
        return [];
    }
};

export const getElectionById = async (id: string) => {
    try {
        const session = await auth();
        if (!session) {
            return [];
        }
        await dbConnect();

        const election = await Election.findById(id)
            .populate('constituency', 'name region')
            .populate('candidates');

        if (!election) {
            return null;
        }
        return election;
    } catch (error) {
        console.error('Error fetching election by ID:', error);
        return null;
    }
};

export const isAlreadyVoted = async (electionId: string) => {
    try {
        const session = await auth();
        if (!session) {
            return false;
        }
        await dbConnect();

        const user = await User.findOne({
            email: session.user?.email,
            'votingHistory.election': electionId
        });
        if (!user) {
            return false;
        }
        return true;

    } catch (error) {
        console.error('Error checking if user has voted:', error);
        return false;
    }
}

export const vote = async (electionId: string, candidateId: string) => {
    try {
        const session = await auth();
        if (!session) {
            return false;
        }
        await dbConnect();
        const election = await Election.findById(electionId);
        if (!election) {
            return {message: 'Election not found'};
        }
        if (election.status !== 'active') {
            return {message: 'Election is not active'};
        }

        const user = await User.findOne({ email: session.user?.email });
        if (!user) {
            return {message: 'User not found'};
        }
        const hasVoted = user.votingHistory.some(
            (vote:any) => vote.election.toString() === electionId
        );
        if (hasVoted) {
            return {message: 'User has already voted'};
        }

        await Promise.all([
            // Update candidate votes
            Candidate.findByIdAndUpdate(candidateId, { $inc: { votes: 1 } }),
            // Update election total votes
            Election.findByIdAndUpdate(electionId, { $inc: { totalVotes: 1 } }),
            // Record user's vote
            User.findByIdAndUpdate(user._id, {
              $push: {
                votingHistory: {
                  election: electionId,
                  votedAt: new Date()
                }
              }
            })
        ]);
        
        return "Vote recorded successfully";

    } catch (error) {
        console.error('Error voting:', error);
        return false;
    }
}


export const createElection = async (electionData: any) => {
    try {
        const session = await auth();
        if (!session) {
            return false;
        }
        await dbConnect();

        const user = await User.findOne({ email: session.user?.email });
        if (!user) {
            return { message: 'User not found' };
        }
        if (user.role !== 'admin') {
            return { message: 'User is not an admin' };
        }

        const election = new Election({
            ...electionData,
            status: 'upcoming'
        });
        await election.save();
    } catch (error) {
        console.error('Error creating election:', error);
        return false;
    }
}