'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useUser } from '@auth0/nextjs-auth0/client';
import { MailCheck } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

export default function VerifyEmailPage() {
  const { user, isLoading, checkSession } = useUser();
  const [isSending, setIsSending] = useState(false);
  const router = useRouter();

  // This effect will run when the user object changes (e.g., after refocusing the tab)
  useEffect(() => {
    if (user && user.email_verified) {
      // If the user is now verified, send them to the dashboard.
      router.push('/dashboard');
    }
  }, [user, router]);

  const handleResend = async () => {
    setIsSending(true);
    try {
      await fetch('/api/auth/resend-verification', { method: 'POST' });
      toast.success('Verification email sent successfully!');
    } catch (err) {
      toast.error('Failed to resend verification email.');
    } finally {
      setIsSending(false);
    }
  };
  
  // This provides a more reliable way to check the session status on demand.
  useEffect(() => {
    const interval = setInterval(async () => {
      await checkSession();
    }, 5000); // Check every 5 seconds

    return () => clearInterval(interval);
  }, [checkSession]);

  // Show a loading state while we wait for the redirect to happen.
  if (isLoading || (user && user.email_verified)) {
    return <div className="flex justify-center items-center h-screen"><div>Loading...</div></div>;
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <Card className="w-full max-w-md mx-4">
        <CardHeader className="text-center">
          <div className="mx-auto bg-primary/10 p-3 rounded-full w-fit">
             <MailCheck className="w-8 h-8 text-primary" />
          </div>
          <CardTitle className="mt-4">Please Verify Your Email</CardTitle>
          <CardDescription>
            We've sent a verification link to <span className="font-semibold">{user?.email || 'your email address'}</span>. After you click the link, this page will automatically redirect you.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <Button onClick={handleResend} disabled={isSending} variant="outline">
            {isSending ? 'Sending...' : 'Resend Verification Email'}
          </Button>
          <p className="text-center text-sm text-gray-600">
            Wrong account? <Link href="/api/auth/logout" className="font-semibold text-primary hover:underline">Log out</Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
} 