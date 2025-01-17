import { NextResponse } from 'next/server';

import dbConnect from '@/Database/dbConnect';
import User from '@/Database/models/user.model';
import { auth } from '@/auth';

export async function GET() {
    try {
        const session = await auth();

        if (!session) {
            return NextResponse.json(
                { message: 'Unauthorized' },
                { status: 401 }
            );
        }

        await dbConnect();

        const user = await User.findOne({ email: session.user?.email })
            .select('-password');

        if (!user) {
            return NextResponse.json(
                { message: 'User not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(user);
    } catch (error) {
        console.error('Error fetching user profile:', error);
        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
        );
    }
}

export async function PUT(req: Request) {
    try {
        const session = await auth();

        if (!session) {
            return NextResponse.json(
                { message: 'Unauthorized' },
                { status: 401 }
            );
        }

        await dbConnect();

        const data = await req.json();
        const { fullName, street, city, state, zipCode } = data;

        const user = await User.findOneAndUpdate(
            { email: session.user?.email },
            {
                fullName,
                address: {
                    street,
                    city,
                    state,
                    zipCode,
                },
            },
            { new: true }
        ).select('-password');

        if (!user) {
            return NextResponse.json(
                { message: 'User not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(user);
    } catch (error) {
        console.error('Error updating user profile:', error);
        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
        );
    }
}