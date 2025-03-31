import { auth } from '@/auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Vote, UserCheck, Calendar, Shield } from 'lucide-react';
import Link from 'next/link';

export default async function Home() {
  const session = await auth();
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section with a Poster */}
      <div className="relative w-full mb-16">
  <img
    src="banner2.png"
    alt="Election Banner"
    className="w-full h-64 object-cover rounded-lg shadow-md"
  />
  <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-0 flex items-center justify-center">
    {/* Content can be added here if needed */}
  </div>
</div>

      <section className="text-center mb-16">
        <h1 className="text-4xl font-bold mb-4">Welcome to Secure Election Portal</h1>
        <p className="text-xl text-muted-foreground mb-8">
          Your trusted platform for secure and transparent online voting
        </p>
        {session ? (
          <div className="flex gap-4 justify-center">
            <Button asChild size="lg">
              <Link href={session.user.isVerified ? "/elections" : "/profile"}>Start Exploring</Link>
            </Button>
          </div>
        ) : (
          <div className="flex gap-4 justify-center">
            <Button asChild size="lg">
              <Link href="/register">Register to Vote</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/login">Login</Link>
            </Button>
          </div>
        )}
      </section>

      <section className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
        <Card>
          <CardHeader>
            <img src="secure.png" alt="Secure Voting" className="w-16 h-16 mx-auto mb-2" />
            <CardTitle>Secure Voting</CardTitle>
            <CardDescription>
              State-of-the-art encryption and security measures
            </CardDescription>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <img src="easy.png" alt="Easy Registration" className="w-16 h-16 mx-auto mb-2" />
            <CardTitle>Easy Registration</CardTitle>
            <CardDescription>
              Simple and quick voter registration process
            </CardDescription>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <img src="multiple.png" alt="Multiple Elections" className="w-16 h-16 mx-auto mb-2" />
            <CardTitle>Multiple Elections</CardTitle>
            <CardDescription>
              Support for various election types and constituencies
            </CardDescription>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <img src="privacy.png" alt="Data Privacy" className="w-16 h-16 mx-auto mb-2" />
            <CardTitle>Data Privacy</CardTitle>
            <CardDescription>
              Your information is protected and confidential
            </CardDescription>
          </CardHeader>
        </Card>
      </section>

      <section className="max-w-3xl mx-auto text-center">
        <h2 className="text-3xl font-bold mb-6">How It Works</h2>
        <div className="grid gap-8">
          <Card>
            <CardHeader>
              <img src="register.png" alt="Register as a Voter" className="w-12 h-12 mx-auto mb-2" />
              <CardTitle>1. Register as a Voter</CardTitle>
              <CardContent>
                Create your account with valid identification and proof of eligibility
              </CardContent>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <img src="validate.png" alt="Verify Your Identity" className="w-12 h-12 mx-auto mb-2" />
              <CardTitle>2. Verify Your Identity</CardTitle>
              <CardContent>
                Complete the verification process to ensure election integrity
              </CardContent>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <img src="cast.png" alt="Cast Your Vote" className="w-12 h-12 mx-auto mb-2" />
              <CardTitle>3. Cast Your Vote</CardTitle>
              <CardContent>
                Participate in elections securely from anywhere
              </CardContent>
            </CardHeader>
          </Card>
        </div>
      </section>
    </div>
  );
}
