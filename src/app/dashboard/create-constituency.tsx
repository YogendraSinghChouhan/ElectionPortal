'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PlusCircle } from 'lucide-react';

interface CreateConstituencyForm {
  name: string;
  region: string;
}

export default function CreateConstituency() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateConstituencyForm>();

  const onSubmit = async (data: CreateConstituencyForm) => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/constituencies/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Failed to create constituency');
      }

      reset();
      setIsOpen(false);
    } catch (error) {
      console.error('Error creating constituency:', error);
      alert(error instanceof Error ? error.message : 'Failed to create constituency');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <PlusCircle className="w-4 h-4 mr-2" />
          Add Constituency
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Constituency</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Constituency Name</Label>
              <Input
                id="name"
                {...register('name', { required: 'Name is required' })}
              />
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="region">Region</Label>
              <Input
                id="region"
                {...register('region', { required: 'Region is required' })}
              />
              {errors.region && (
                <p className="text-sm text-destructive">{errors.region.message}</p>
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
              }}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Creating...' : 'Create Constituency'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}