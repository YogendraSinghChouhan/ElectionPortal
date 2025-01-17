'use client';

import { NextResponse } from 'next/server';
import dbConnect from '@/Database/dbConnect';
import Election from '@/Database/models/election.model';
import Candidate from '@/Database/models/candidate.model';
import { auth } from '@/auth';

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    
    if (!session) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    await dbConnect();

    const { name, partyAffiliation, background, manifesto, photo } = await req.json();

    // Check if election exists and is upcoming
    const election = await Election.findById(params.id);
    if (!election) {
      return NextResponse.json(
        { message: 'Election not found' },
        { status: 404 }
      );
    }

    if (election.status !== 'upcoming') {
      return NextResponse.json(
        { message: 'Applications are only accepted for upcoming elections' },
        { status: 400 }
      );
    }

    // Check if user has already applied
    const existingCandidate = await Candidate.findOne({
      elections: params.id,
      'user': session.user?.email
    });

    if (existingCandidate) {
      return NextResponse.json(
        { message: 'You have already applied for this election' },
        { status: 400 }
      );
    }

    // Create new candidate
    const candidate = await Candidate.create({
      name,
      partyAffiliation,
      background,
      manifesto,
      photo,
      user: session.user?.email,
      constituency: election.constituency
    });

    // Add candidate to election
    await Election.findByIdAndUpdate(params.id, {
      $push: { candidates: candidate._id }
    });

    return NextResponse.json(
      { message: 'Application submitted successfully' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error submitting application:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}