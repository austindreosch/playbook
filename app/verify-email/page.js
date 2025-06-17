'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useUser } from '@auth0/nextjs-auth0/client';
import { MailCheck, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { toast } from 'sonner';

export default function VerifyEmailPage() {
  const { user, isLoading } = useUser();
  const [isSending, setIsSending] = useState(false);

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

  const handleContinue = () => {
    // A full page reload is the most reliable way to force the middleware
    // to re-evaluate the session and perform the correct redirect.
    window.location.reload();
  };

  if (isLoading) {
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
            Click the link in the email we sent to <span className="font-semibold">{user?.email || 'your email address'}</span>. Once you've verified, click continue.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <Button onClick={handleContinue}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Continue
          </Button>
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