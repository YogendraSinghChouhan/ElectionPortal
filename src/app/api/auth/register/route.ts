import { NextResponse } from "next/server";
import dbConnect from "@/Database/dbConnect";
import User from "@/Database/models/user.model";

export async function POST(req: Request) {
    try {
        await dbConnect();

        const body = await req.json();
        const {
            email,
            password,
            fullName,
            dateOfBirth,
            street,
            city,
            state,
            zipCode,
            idProof,
        } = body;

        // Validate age (18+)
        const birthDate = new Date(dateOfBirth);
        const today = new Date();
        const age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();

        if (age < 18 || (age === 18 && monthDiff < 0)) {
            return NextResponse.json(
                { message: "You must be at least 18 years old to register" },
                { status: 400 }
            );
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return NextResponse.json(
                { message: "User already exists" },
                { status: 400 }
            );
        }

        // Create new user
        const user = await User.create({
            email,
            password,
            fullName,
            dateOfBirth,
            address: {
                street,
                city,
                state,
                zipCode,
            },
            idProof,
            // Note: constituency will need to be determined based on address
            // For now, we'll need to add a default constituency or make it optional
        });

        await user.save();

        return NextResponse.json(
            { message: "User registered successfully" },
            { status: 201 }
        );
    } catch (error) {
        console.error("Registration error:", error);
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
}