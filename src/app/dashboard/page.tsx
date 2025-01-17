'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Vote, Settings } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import CreateElection from './create-election';
import CreateConstituency from './create-constituency';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CreateCandidate from './add-candidate';

interface Election {
  _id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  status: 'upcoming' | 'active' | 'completed';
}

interface Constituency {
  _id: string;
  name: string;
  region: string;
  totalVoters: number;
}

export default function DashboardPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [upcomingElections, setUpcomingElections] = useState<Election[]>([]);
  const [constituencies, setConstituencies] = useState<Constituency[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      const [electionsRes, constituenciesRes] = await Promise.all([
        fetch('/api/elections'),
        fetch('/api/constituencies')
      ]);
      
      const elections = await electionsRes.json();
      const constituencies = await constituenciesRes.json();
      
      setUpcomingElections(elections);
      setConstituencies(constituencies);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (session?.user && (session.user).role !== 'admin') {
      router.push('/');
      return;
    }

    if (session?.user) {
      fetchDashboardData();
    }
  }, [session, router]);

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="h-48 bg-gray-200 rounded"></div>
            <div className="h-48 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <div className="flex gap-4">
          <CreateConstituency />
          <CreateCandidate />
          <CreateElection onElectionCreated={fetchDashboardData} />
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="constituencies">Constituencies</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Upcoming Elections */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-lg font-medium">
                  <Calendar className="inline-block w-5 h-5 mr-2" />
                  Elections
                </CardTitle>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/elections">View All</Link>
                </Button>
              </CardHeader>
              <CardContent>
                {upcomingElections.length > 0 ? (
                  <div className="space-y-4">
                    {upcomingElections.map((election) => (
                      <div
                        key={election._id}
                        className="flex items-center justify-between border-b pb-4 last:border-0"
                      >
                        <div>
                          <h3 className="font-medium">{election.title}</h3>
                          <p className="text-sm text-muted-foreground">
                            {new Date(election.startDate).toLocaleDateString()} -{' '}
                            {new Date(election.endDate).toLocaleDateString()}
                          </p>
                        </div>
                        <Button asChild>
                          <Link href={`/elections/${election._id}`}>
                            <Vote className="w-4 h-4 mr-2" />
                            View Details
                          </Link>
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-center py-4">
                    No upcoming elections at the moment
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-medium">
                  <Settings className="inline-block w-5 h-5 mr-2" />
                  System Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center border-b pb-4">
                    <div>
                      <h3 className="font-medium">Total Constituencies</h3>
                      <p className="text-2xl font-bold">{constituencies.length}</p>
                    </div>
                    <div>
                      <h3 className="font-medium">Active Elections</h3>
                      <p className="text-2xl font-bold">
                        {upcomingElections.filter(e => e.status === 'active').length}
                      </p>
                    </div>
                  </div>
                  <Button className="w-full" asChild>
                    <Link href="/elections">
                      Manage Elections
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="constituencies">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg font-medium">
                Constituencies
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {constituencies.map((constituency) => (
                  <div
                    key={constituency._id}
                    className="flex items-center justify-between border-b pb-4 last:border-0"
                  >
                    <div>
                      <h3 className="font-medium">{constituency.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        Region: {constituency.region}
                      </p>
                    </div>
                    {/* <div className="text-right">
                      <p className="text-sm font-medium">
                        Total Voters: {constituency.totalVoters}
                      </p>
                    </div> */}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}