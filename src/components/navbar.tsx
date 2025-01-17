"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, } from '@/components/ui/dropdown-menu';
import { Vote } from 'lucide-react';
import { ModeToggle } from './themeToggle';
import { signOut, useSession } from "next-auth/react"

export default function Navbar() {
  const { data: session } = useSession()

  return (
    <nav className="border-b">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <Vote className="h-6 w-6" />
          <span className="font-bold text-xl">Election Portal</span>
        </Link>

        <div className="flex items-center space-x-4">
          <ModeToggle />
          {session ?
            (
              <>
                {session.user?.role === "admin" && (
                  <Button asChild variant="ghost">
                    <Link href="/dashboard">Dashboard</Link>
                  </Button>)}
                <Button asChild variant="ghost">
                  <Link href="/elections">Elections</Link>
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline">{`Hello, ${session.user?.fullName}`}</Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link href="/profile">Profile</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => signOut()}
                    >
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Button asChild variant="ghost">
                  <Link href="/login">Login</Link>
                </Button>
                <Button asChild>
                  <Link href="/register">Register</Link>
                </Button>
              </>
            )}
        </div>
      </div>
    </nav>
  );
}