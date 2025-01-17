"use server";

import { auth } from "@/auth";
import dbConnect from "@/Database/dbConnect";
import User from "@/Database/models/user.model";

export async function createUser(userData) {
    await dbConnect()
    // create user
    const user = await User.create(userData);
    user.save();
    return user;
}
export async function getUser() {
    try {
        const session = await auth();
        if (!session) {
            return { error: "Unauthorized" };
        }
        await dbConnect();
        const user = await User.findOne({ email: session.user.email }).select("-password");
        if (!user) {
            return { error: "User not found" };
        }
        return user;
    } catch (error) {
        console.error(error);
        return error;
    }
}

export async function updateUser(data) {
    try {
        const session = await auth();
        if (!session) {
            return { error: "Unauthorized" };
        }
        await dbConnect();
        const user = await User.findOneAndUpdate({ email: data.email }, data, { new: true });
        return user;

    } catch (error) {
        console.error(error);
        return error;
    }
}