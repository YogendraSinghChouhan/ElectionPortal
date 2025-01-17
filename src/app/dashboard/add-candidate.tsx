'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { PlusCircle } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface AddCandidateForm {
  name: string;
  constituency: string;
}

interface Constituency {
  _id: string;
  name: string;
}

export default function CreateCandidate() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [constituencies, setConstituencies] = useState<Constituency[]>([]);
  const [selectedConstituency, setSelectedConstituency] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<AddCandidateForm>();

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

  const handleConstituencyChange = (value: string) => {
    setSelectedConstituency(value);
    setValue('constituency', value);
  };

  const onSubmit = async (data: AddCandidateForm) => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/candidates/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Failed to create candidate');
      }

      reset();
      setSelectedConstituency('');
      setIsOpen(false);
    } catch (error) {
      console.error('Error creating candidate:', error);
      alert(error instanceof Error ? error.message : 'Failed to create candidate');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <PlusCircle className="w-4 h-4 mr-2" />
          Add Candidate
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Candidate</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Candidate Name</Label>
              <Input
                id="name"
                {...register('name', { required: 'Name is required' })}
              />
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name.message}</p>
              )}
            </div>
            <div>
              <Label>Constituency</Label>
              <Select value={selectedConstituency} onValueChange={handleConstituencyChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select constituency" />
                </SelectTrigger>
                <SelectContent>
                  {constituencies.map((c) => (
                    <SelectItem key={c._id} value={c._id}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <input
                type="hidden"
                {...register('constituency', { required: 'Constituency is required' })}
              />
              {errors.constituency && (
                <p className="text-sm text-destructive">{errors.constituency.message}</p>
              )}
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
              }}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Creating...' : 'Create Candidate'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}