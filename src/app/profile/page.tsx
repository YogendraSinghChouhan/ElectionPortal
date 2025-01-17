'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, User, Shield, History, UserCircle } from 'lucide-react';

interface ProfileForm {
  fullName: string;
  email: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  idProof: string;
}

interface VotingHistoryItem {
  election: {
    _id: string;
    title: string;
    description: string;
  };
  votedAt: string;
}

export default function ProfilePage() {
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [votingHistory, setVotingHistory] = useState<VotingHistoryItem[]>([]);
  const [userData, setUserData] = useState<any>(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProfileForm>();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await fetch('/api/user/profile');
        const data = await res.json();
        setUserData(data);
        reset(data); // Pre-fill form with user data
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, [reset]);

  const onSubmit = async (data: ProfileForm) => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error('Failed to update profile');
      const updatedData = await res.json();
      setUserData(updatedData);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Profile Settings</h1>

      <Tabs defaultValue="personal" className="space-y-6">
        <TabsList>
          <TabsTrigger value="personal">Personal Info</TabsTrigger>
          <TabsTrigger value="voting">Voting History</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        <TabsContent value="personal">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserCircle className="w-5 h-5" />
                Profile Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium text-lg">{userData?.fullName}</h3>
                    <p className="text-muted-foreground">{userData?.email}</p>
                  </div>
                  <Button onClick={() => setIsEditing(!isEditing)}>
                    {isEditing ? 'Cancel Edit' : 'Edit Profile'}
                  </Button>
                </div>
                {!isEditing && (
                  <div className="grid md:grid-cols-2 gap-4 mt-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Address</p>
                      <p>{userData?.address?.street}</p>
                      <p>{`${userData?.address?.city}, ${userData?.address?.state} ${userData?.address?.zipCode}`}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Account Status</p>
                      {userData?.isVerified ? (
                        <p className="text-green-600">Verified</p>
                      ) : (
                        <p className="text-red-600">Not Verified</p>
                      )}
                      <p className="text-sm text-muted-foreground mt-2">Role</p>
                      <p className="capitalize">{(session?.user)?.role || 'Voter'}</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {isEditing && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Edit Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  {/* Form fields remain the same */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Full Name</Label>
                      <Input
                        id="fullName"
                        {...register('fullName', { required: 'Full name is required' })}
                      />
                      {errors.fullName && (
                        <p className="text-sm text-destructive">{errors.fullName.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        {...register('email')}
                        disabled
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="street">Street Address</Label>
                      <Input
                        id="street"
                        {...register('street', { required: 'Street address is required' })}
                      />
                      {errors.street && (
                        <p className="text-sm text-destructive">{errors.street.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        {...register('city', { required: 'City is required' })}
                      />
                      {errors.city && (
                        <p className="text-sm text-destructive">{errors.city.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="state">State</Label>
                      <Input
                        id="state"
                        {...register('state', { required: 'State is required' })}
                      />
                      {errors.state && (
                        <p className="text-sm text-destructive">{errors.state.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="zipCode">ZIP Code</Label>
                      <Input
                        id="zipCode"
                        {...register('zipCode', { required: 'ZIP code is required' })}
                      />
                      {errors.zipCode && (
                        <p className="text-sm text-destructive">{errors.zipCode.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="idProof">ID Proof Number</Label>
                      <Input
                        id="idProof"
                        {...register('idProof')}
                        disabled
                      />
                    </div>
                  </div>

                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? 'Saving...' : 'Save Changes'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="voting">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="w-5 h-5" />
                Voting History
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {votingHistory.length > 0 ? (
                  votingHistory.map((vote, index) => (
                    <div
                      key={index}
                      className="flex items-start justify-between border-b last:border-0 pb-4 last:pb-0"
                    >
                      <div>
                        <h3 className="font-medium">{vote.election.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {vote.election.description}
                        </p>
                        <div className="flex items-center mt-2 text-sm text-muted-foreground">
                          <Calendar className="w-4 h-4 mr-1" />
                          {new Date(vote.votedAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <History className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No voting history available</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Security Settings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="font-medium mb-2">Change Password</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Update your password to maintain account security
                  </p>
                  <Button variant="outline">Change Password</Button>
                </div>

              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}