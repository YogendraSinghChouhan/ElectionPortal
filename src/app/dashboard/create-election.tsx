'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { PlusCircle } from 'lucide-react';

interface CreateElectionForm {
    title: string;
    description: string;
    constituency: string;
    startDate: string;
    endDate: string;
    candidates: string[];
}

interface Constituency {
    _id: string;
    name: string;
    region: string;
}

interface Candidate {
    _id: string;
    name: string;
    partyAffiliation: string;
    constituency: {
        _id: string;
        name: string;
        region: string;
    };
}

export default function CreateElection({ onElectionCreated }: { onElectionCreated: () => void }) {
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [constituencies, setConstituencies] = useState<Constituency[]>([]);
    const [candidates, setCandidates] = useState<Candidate[]>([]);
    const [selectedCandidates, setSelectedCandidates] = useState<string[]>([]);
    const [selectedConstituency, setSelectedConstituency] = useState<string>('');

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        formState: { errors },
    } = useForm<CreateElectionForm>();

    useEffect(() => {
        const fetchConstituencies = async () => {
            try {
                const res = await fetch('/api/constituencies');
                if (res.ok) {
                    const data = await res.json();
                    setConstituencies(data);
                }
            } catch (error) {
                console.error('Error fetching constituencies:', error);
            }
        };

        fetchConstituencies();
    }, []);

    useEffect(() => {
        const fetchCandidates = async () => {
            if (!selectedConstituency) {
                setCandidates([]);
                return;
            }

            try {
                const res = await fetch(`/api/candidates?constituency=${selectedConstituency}`);
                if (res.ok) {
                    const data = await res.json();
                    setCandidates(data);
                    setSelectedCandidates([]); // Reset selected candidates when constituency changes
                }
            } catch (error) {
                console.error('Error fetching candidates:', error);
            }
        };

        fetchCandidates();
    }, [selectedConstituency]);

    const handleConstituencyChange = (value: string) => {
        setSelectedConstituency(value);
        setValue('constituency', value);
    };

    const onSubmit = async (data: CreateElectionForm) => {
        if (selectedCandidates.length === 0) {
            alert('Please select at least one candidate');
            return;
        }

        setIsLoading(true);
        try {
            const res = await fetch('/api/elections/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...data,
                    candidates: selectedCandidates,
                }),
            });

            if (!res.ok) throw new Error('Failed to create election');

            reset();
            setSelectedConstituency('');
            setSelectedCandidates([]);
            setIsOpen(false);
            onElectionCreated();
        } catch (error) {
            console.error('Error creating election:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button>
                    <PlusCircle className="w-4 h-4 mr-2" />
                    Create Election
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Create New Election</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="title">Title</Label>
                            <Input
                                id="title"
                                {...register('title', { required: 'Title is required' })}
                            />
                            {errors.title && (
                                <p className="text-sm text-destructive">{errors.title.message}</p>
                            )}
                        </div>

                        <div>
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                {...register('description', { required: 'Description is required' })}
                            />
                            {errors.description && (
                                <p className="text-sm text-destructive">
                                    {errors.description.message}
                                </p>
                            )}
                        </div>

                        <div>
                            <Label htmlFor="constituency">Constituency</Label>
                            <Select
                                value={selectedConstituency}
                                onValueChange={handleConstituencyChange}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select constituency" />
                                </SelectTrigger>
                                <SelectContent>
                                    {constituencies.map((constituency) => (
                                        <SelectItem key={constituency._id} value={constituency._id}>
                                            {constituency.name} - {constituency.region}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <input
                                type="hidden"
                                {...register('constituency', { required: 'Constituency is required' })}
                            />
                            {errors.constituency && (
                                <p className="text-sm text-destructive">
                                    {errors.constituency.message}
                                </p>
                            )}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="startDate">Start Date</Label>
                                <Input
                                    id="startDate"
                                    type="datetime-local"
                                    {...register('startDate', { required: 'Start date is required' })}
                                />
                                {errors.startDate && (
                                    <p className="text-sm text-destructive">
                                        {errors.startDate.message}
                                    </p>
                                )}
                            </div>

                            <div>
                                <Label htmlFor="endDate">End Date</Label>
                                <Input
                                    id="endDate"
                                    type="datetime-local"
                                    {...register('endDate', { required: 'End date is required' })}
                                />
                                {errors.endDate && (
                                    <p className="text-sm text-destructive">{errors.endDate.message}</p>
                                )}
                            </div>
                        </div>

                        <div>
                            <Label>Candidates</Label>
                            <div className="space-y-2 mt-2">
                                {candidates.length > 0 ? (
                                    candidates.map((candidate) => (
                                        <div
                                            key={candidate._id}
                                            className="flex items-center space-x-2 p-2 rounded hover:bg-accent"
                                        >
                                            <Checkbox
                                                id={candidate._id}
                                                checked={selectedCandidates.includes(candidate._id)}
                                                onCheckedChange={(checked) => {
                                                    if (checked) {
                                                        setSelectedCandidates([...selectedCandidates, candidate._id]);
                                                    } else {
                                                        setSelectedCandidates(
                                                            selectedCandidates.filter((id) => id !== candidate._id)
                                                        );
                                                    }
                                                }}
                                            />
                                            <label
                                                htmlFor={candidate._id}
                                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                            >
                                                {candidate.name} - {candidate.partyAffiliation}
                                            </label>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-sm text-muted-foreground">
                                        {selectedConstituency
                                            ? 'No candidates found for this constituency'
                                            : 'Select a constituency to view candidates'}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end space-x-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                                setIsOpen(false);
                                reset();
                                setSelectedConstituency('');
                                setSelectedCandidates([]);
                            }}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? 'Creating...' : 'Create Election'}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}