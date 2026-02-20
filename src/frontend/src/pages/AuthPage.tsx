import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetCallerUserProfile } from '../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LogIn, User } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';

export default function AuthPage() {
  const { identity, login, clear, loginStatus } = useInternetIdentity();
  const { data: userProfile } = useGetCallerUserProfile();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const isAuthenticated = !!identity;
  const isLoggingIn = loginStatus === 'logging-in';

  const handleLogin = async () => {
    try {
      await login();
    } catch (error: any) {
      console.error('Login error:', error);
      if (error.message === 'User is already authenticated') {
        await clear();
        setTimeout(() => login(), 300);
      }
    }
  };

  const handleLogout = async () => {
    await clear();
    queryClient.clear();
    navigate({ to: '/' });
  };

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-md mx-auto">
        <Card>
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              {isAuthenticated ? (
                <User className="w-8 h-8 text-primary" />
              ) : (
                <LogIn className="w-8 h-8 text-primary" />
              )}
            </div>
            <CardTitle className="text-2xl">
              {isAuthenticated ? 'Your Account' : 'Welcome'}
            </CardTitle>
            <CardDescription>
              {isAuthenticated
                ? 'You are logged in and can access all features'
                : 'Sign in to access study materials, practice MCQs, and track your progress'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {isAuthenticated ? (
              <>
                {userProfile && (
                  <div className="p-4 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">Logged in as</p>
                    <p className="font-medium">{userProfile.name}</p>
                    {userProfile.email && (
                      <p className="text-sm text-muted-foreground mt-1">{userProfile.email}</p>
                    )}
                  </div>
                )}
                <Button onClick={handleLogout} variant="destructive" className="w-full">
                  Logout
                </Button>
              </>
            ) : (
              <Button onClick={handleLogin} disabled={isLoggingIn} className="w-full">
                {isLoggingIn ? 'Logging in...' : 'Login with Internet Identity'}
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
