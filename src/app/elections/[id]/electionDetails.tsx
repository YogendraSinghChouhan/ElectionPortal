'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, } from '@/components/ui/alert-dialog';
import { Calendar, Users, Award, AlertTriangle } from 'lucide-react';

interface Candidate {
    _id: string;
    name: string;
    photo: string;
    partyAffiliation: string;
    background: string;
    manifesto: string;
    votes: number;
}

interface Election {
    _id: string;
    title: string;
    description: string;
    startDate: string;
    endDate: string;
    status: 'upcoming' | 'active' | 'completed';
    constituency: {
        name: string;
        region: string;
    };
    candidates: Candidate[];
    totalVotes: number;
}

const ElectionDetails = ({ id }: { id: string }) => {
    const router = useRouter();
    const [election, setElection] = useState<Election | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedCandidate, setSelectedCandidate] = useState<string | null>(null);
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const [hasVoted, setHasVoted] = useState(false);

    useEffect(() => {
        const fetchElection = async () => {
            try {
                const electionData = await fetch(`/api/elections/${id}`).then((res) => res.json());
                const hasVotedres = await fetch(`/api/elections/${id}/voting-status`).then((res) => res.json());
                console.log('hasVotedresponse:', hasVotedres);

                setElection(electionData);
                setHasVoted(hasVotedres.hasVoted);
            } catch (error) {
                console.error('Error fetching election details:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchElection();
    }, [id]);

    const handleVote = async () => {
        if (!selectedCandidate) return;

        try {
            const res = await fetch(`/api/elections/${id}/vote`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ candidateId: selectedCandidate }),
            });

            if (!res.ok) throw new Error('Failed to cast vote');

            setHasVoted(true);
            router.refresh();
        } catch (error) {
            console.error('Error casting vote:', error);
        }
    };

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

    if (!election) {
        return (
            <div className="container mx-auto py-8 text-center">
                <AlertTriangle className="mx-auto h-12 w-12 text-yellow-500 mb-4" />
                <h1 className="text-2xl font-bold mb-2">Election Not Found</h1>
                <p className="text-muted-foreground mb-4">
                    The election you&apos;re looking for doesn&apos;t exist or has been removed.
                </p>
                <Button onClick={() => router.push('/elections')}>Back to Elections</Button>
            </div>
        );
    }

    return (
        <div className="container mx-auto py-8 px-4">
            <div className="max-w-4xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold mb-2">{election.title}</h1>
                    <p className="text-muted-foreground mb-4">{election.description}</p>
                    <div className="flex flex-wrap gap-6 text-sm">
                        <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-2" />
                            {new Date(election.startDate).toLocaleDateString()} -{' '}
                            {new Date(election.endDate).toLocaleDateString()}
                        </div>
                        <div className="flex items-center">
                            <Users className="w-4 h-4 mr-2" />
                            {election.constituency.name}, {election.constituency.region}
                        </div>
                        {election.status === 'completed' && (
                            <div className="flex items-center">
                                <Award className="w-4 h-4 mr-2" />
                                {election.totalVotes} total votes
                            </div>
                        )}
                    </div>
                </div>

                <div className="grid gap-6">
                    {election.candidates.map((candidate) => (
                        <Card
                            key={candidate._id}
                            className={`cursor-pointer transition-colors ${selectedCandidate === candidate._id
                                ? 'border-primary'
                                : 'hover:border-primary/50'
                                }`}
                            onClick={() => {
                                if (election.status === 'active' && !hasVoted) {
                                    setSelectedCandidate(candidate._id);
                                }
                            }}
                        >
                            <CardHeader>
                                <CardTitle className="flex items-center justify-between">
                                    <span>{candidate.name}</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                {election.status === 'completed' && (
                                    <div className="mt-4 pt-4 border-t">
                                        <div className="flex justify-between items-center">
                                            <span className="font-medium">Votes Received</span>
                                            <span>{candidate.votes}</span>
                                        </div>
                                        <div className="w-full bg-secondary h-2 rounded-full mt-2">
                                            <div
                                                className="bg-primary h-2 rounded-full"
                                                style={{
                                                    width: `${(candidate.votes / election.totalVotes) * 100}%`,
                                                }}
                                            />
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {election.status === 'active' && !hasVoted && (
                    <div className="mt-8 flex justify-center">
                        <Button
                            size="lg"
                            disabled={!selectedCandidate}
                            onClick={() => setShowConfirmDialog(true)}
                        >
                            Cast Your Vote
                        </Button>
                    </div>
                )}

                {hasVoted && (
                    <Card className="mt-8 border-green-500">
                        <CardContent className="flex items-center justify-center p-6">
                            <Award className="w-6 h-6 text-green-500 mr-2" />
                            <p className="text-green-500 font-medium">
                                Thank you for voting in this election!
                            </p>
                        </CardContent>
                    </Card>
                )}

                <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Confirm Your Vote</AlertDialogTitle>
                            <AlertDialogDescription>
                                Are you sure you want to cast your vote? This action cannot be undone.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={handleVote}>
                                Confirm Vote
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </div>
    );
}

export default ElectionDetails;