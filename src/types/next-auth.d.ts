import 'next-auth'
import { DefaultSession } from 'next-auth';

declare module 'next-auth' {
    interface User {
        _id: string;
        email: string;
        fullName: string;
        dateOfBirth?: Date;
        isVerified: boolean;
        role: string;
    }
    interface Session {
        user: {
            _id: string;
            email: string;
            fullName: string;
            dateOfBirth?: Date;
            isVerified: boolean;
            role: string;
        } & DefaultSession['user'];
    }
}

