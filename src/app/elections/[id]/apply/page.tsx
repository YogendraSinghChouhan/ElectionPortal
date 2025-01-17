'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

interface CandidateApplicationForm {
  name: string;
  partyAffiliation: string;
  background: string;
  manifesto: string;
  photo: string;
}

export default function CandidateApplicationPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CandidateApplicationForm>();

  const onSubmit = async (data: CandidateApplicationForm) => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/elections/${params.id}/apply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message);
      }

      router.push(`/elections/${params.id}`);
      router.refresh();
    } catch (error) {
      console.error('Error submitting application:', error);
      alert(error instanceof Error ? error.message : 'Failed to submit application');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container max-w-2xl mx-auto py-8 px-4">
      <Card>
        <CardHeader>
          <CardTitle>Apply as Candidate</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  {...register('name', { required: 'Name is required' })}
                />
                {errors.name && (
                  <p className="text-sm text-destructive">{errors.name.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="partyAffiliation">Party Affiliation</Label>
                <Input
                  id="partyAffiliation"
                  {...register('partyAffiliation', { required: 'Party affiliation is required' })}
                />
                {errors.partyAffiliation && (
                  <p className="text-sm text-destructive">{errors.partyAffiliation.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="background">Background</Label>
                <Textarea
                  id="background"
                  {...register('background', { required: 'Background is required' })}
                />
                {errors.background && (
                  <p className="text-sm text-destructive">{errors.background.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="manifesto">Election Manifesto</Label>
                <Textarea
                  id="manifesto"
                  {...register('manifesto', { required: 'Manifesto is required' })}
                />
                {errors.manifesto && (
                  <p className="text-sm text-destructive">{errors.manifesto.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="photo">Photo URL</Label>
                <Input
                  id="photo"
                  type="url"
                  {...register('photo', { required: 'Photo URL is required' })}
                />
                {errors.photo && (
                  <p className="text-sm text-destructive">{errors.photo.message}</p>
                )}
              </div>
            </div>

            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Submitting...' : 'Submit Application'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}