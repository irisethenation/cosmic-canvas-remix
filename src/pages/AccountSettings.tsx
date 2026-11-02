import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import LavaLampBackground from '@/components/LavaLampBackground';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ArrowLeft, User, KeyRound, Trash2, Loader2 } from 'lucide-react';

const AccountSettings = () => {
  const { user } = useAuth();
  const { toast } = useToast();

  const [fullName, setFullName] = useState('');
  const [savingName, setSavingName] = useState(false);

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [savingPassword, setSavingPassword] = useState(false);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteReason, setDeleteReason] = useState('');
  const [deleteRequested, setDeleteRequested] = useState(false);
  const [savingDelete, setSavingDelete] = useState(false);

  useEffect(() => {
    setFullName(user?.user_metadata?.full_name ?? '');
  }, [user]);

  useEffect(() => {
    if (!user) return;
    supabase
      .from('account_deletion_requests')
      .select('id')
      .eq('user_id', user.id)
      .maybeSingle()
      .then(({ data }) => setDeleteRequested(!!data));
  }, [user]);

  const saveName = async () => {
    if (!fullName.trim()) return;
    setSavingName(true);
    try {
      const { error } = await supabase.auth.updateUser({ data: { full_name: fullName.trim() } });
      if (error) throw error;
      toast({ title: 'Name updated', description: 'Your display name has been saved.' });
    } catch (e) {
      toast({ title: 'Update failed', description: e instanceof Error ? e.message : 'Could not save', variant: 'destructive' });
    } finally {
      setSavingName(false);
    }
  };

  const changePassword = async () => {
    if (newPassword.length < 8) {
      toast({ title: 'Password too short', description: 'Password must be at least 8 characters.', variant: 'destructive' });
      return;
    }
    if (newPassword !== confirmPassword) {
      toast({ title: 'Passwords do not match', variant: 'destructive' });
      return;
    }
    setSavingPassword(true);
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;
      setNewPassword('');
      setConfirmPassword('');
      toast({ title: 'Password changed', description: 'Your new password is active immediately.' });
    } catch (e) {
      toast({ title: 'Change failed', description: e instanceof Error ? e.message : 'Could not change password', variant: 'destructive' });
    } finally {
      setSavingPassword(false);
    }
  };

  const requestDeletion = async () => {
    if (!user) return;
    setSavingDelete(true);
    try {
      const { error } = await supabase
        .from('account_deletion_requests')
        .insert({ user_id: user.id, reason: deleteReason.trim() || null });
      if (error) throw error;
      setDeleteRequested(true);
      setDeleteOpen(false);
      toast({ title: 'Deletion requested', description: 'Our team will process your request and confirm by email.' });
    } catch (e) {
      toast({ title: 'Request failed', description: e instanceof Error ? e.message : 'Could not submit request', variant: 'destructive' });
    } finally {
      setSavingDelete(false);
    }
  };

  return (
    <div className="min-h-screen bg-background relative">
      <LavaLampBackground />
      <div className="relative z-10 container mx-auto px-4 py-8 max-w-2xl">
        <Link to="/dashboard">
          <Button variant="ghost" size="sm" className="mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </Link>

        <h1 className="text-3xl font-bold text-foreground mb-8">Account Settings</h1>

        <div className="space-y-6">
          <Card className="border-border shadow-soft">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <User className="h-5 w-5 text-primary" />
                Profile
              </CardTitle>
              <CardDescription>Your display name and sign-in email.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" value={user?.email ?? ''} disabled />
                <p className="text-xs text-muted-foreground">To change your email, contact support.</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="fullName">Full name</Label>
                <Input id="fullName" value={fullName} onChange={(e) => setFullName(e.target.value)} />
              </div>
              <Button onClick={saveName} disabled={savingName || !fullName.trim()} className="bg-gradient-primary hover:opacity-90">
                {savingName && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                Save name
              </Button>
            </CardContent>
          </Card>

          <Card className="border-border shadow-soft">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <KeyRound className="h-5 w-5 text-primary" />
                Password
              </CardTitle>
              <CardDescription>Change your sign-in password.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="newPassword">New password</Label>
                <Input id="newPassword" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} minLength={8} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm new password</Label>
                <Input id="confirmPassword" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} minLength={8} />
              </div>
              <Button onClick={changePassword} disabled={savingPassword || !newPassword} className="bg-gradient-primary hover:opacity-90">
                {savingPassword && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                Change password
              </Button>
            </CardContent>
          </Card>

          <Card className="border-destructive/40 shadow-soft">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <Trash2 className="h-5 w-5 text-destructive" />
                Delete account
              </CardTitle>
              <CardDescription>
                Request permanent deletion of your account and personal data. This is processed by our team.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {deleteRequested ? (
                <p className="text-sm text-muted-foreground">Your deletion request is pending. We'll confirm by email once it's processed.</p>
              ) : (
                <Button variant="destructive" onClick={() => setDeleteOpen(true)}>
                  Request account deletion
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Request account deletion</DialogTitle>
            <DialogDescription>
              This will permanently delete your account, course progress, and personal data. Active subscriptions must be canceled first.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <Label htmlFor="deleteReason">Reason (optional)</Label>
            <Textarea id="deleteReason" value={deleteReason} onChange={(e) => setDeleteReason(e.target.value)} placeholder="Tell us why you're leaving…" />
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setDeleteOpen(false)} className="border-border">Cancel</Button>
            <Button variant="destructive" onClick={requestDeletion} disabled={savingDelete}>
              {savingDelete && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Submit request
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AccountSettings;
