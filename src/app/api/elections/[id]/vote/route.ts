import { NextResponse } from 'next/server';
import dbConnect from '@/Database/dbConnect';
import Election from '@/Database/models/election.model';
import User from '@/Database/models/user.model';
import Candidate from '@/Database/models/candidate.model';
import { auth } from '@/auth';

export async function POST(req: Request, { params }: { params: { id: string } }
) {
    const id = (await params).id
    try {
        const session = await auth();

        if (!session) {
            return NextResponse.json(
                { message: 'Unauthorized' },
                { status: 401 }
            );
        }

        await dbConnect();

        const { candidateId } = await req.json();

        // Check if election exists and is active
        const election = await Election.findById(id);
        if (!election) {
            return NextResponse.json(
                { message: 'Election not found' },
                { status: 404 }
            );
        }

        if (election.status !== 'active') {
            return NextResponse.json(
                { message: 'Election is not active' },
                { status: 400 }
            );
        }

        // Check if user has already voted
        const user = await User.findOne({ email: session.user?.email });
        if (!user) {
            return NextResponse.json(
                { message: 'User not found' },
                { status: 404 }
            );
        }

        const hasVoted = user.votingHistory.some(
            (vote) => vote.election.toString() === id
        );

        if (hasVoted) {
            return NextResponse.json(
                { message: 'You have already voted in this election' },
                { status: 400 }
            );
        }

        // Record the vote
        await Promise.all([
            // Update candidate votes
            Candidate.findByIdAndUpdate(candidateId, { $inc: { votes: 1 } }),
            // Update election total votes
            Election.findByIdAndUpdate(id, { $inc: { totalVotes: 1 } }),
            // Record user's vote
            User.findByIdAndUpdate(user._id, {
                $push: {
                    votingHistory: {
                        election: id,
                        votedAt: new Date()
                    }
                }
            })
        ]);

        return NextResponse.json({ message: 'Vote recorded successfully' });
    } catch (error) {
        console.error('Error recording vote:', error);
        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
        );
    }
}