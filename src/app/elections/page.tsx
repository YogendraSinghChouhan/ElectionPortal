'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface Election {
  _id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  status: 'upcoming' | 'active' | 'completed';
}

export default function ElectionsPage() {
  const [elections, setElections] = useState<Election[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchElections = async () => {
    try {
      const res = await fetch('/api/elections');
      if (!res.ok) throw new Error('Failed to fetch elections');
      const data = await res.json();
      setElections(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchElections();
  }, []);

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-48 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Elections</h1>
      <div className="grid md:grid-cols-2 gap-6">
        {elections.length > 0 ? (
          elections.map((election) => (
            <Card key={election._id}>
              <CardHeader>
                <CardTitle>{election.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {new Date(election.startDate).toLocaleDateString()} -{' '}
                  {new Date(election.endDate).toLocaleDateString()}
                </p>
                <p className="my-2">{election.description}</p>
                <p
                  className={`text-sm ${
                    election.status === 'active'
                      ? 'text-green-500'
                      : election.status === 'upcoming'
                      ? 'text-blue-500'
                      : 'text-gray-500'
                  }`}
                >
                  {election.status.toUpperCase()}
                </p>
                <Button asChild className="mt-4">
                  <Link href={`/elections/${election._id}`}>
                    View Details
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))
        ) : (
          <p className="text-center text-muted-foreground col-span-full">
            No elections available at this time.
          </p>
        )}
      </div>
    </div>
  );
}