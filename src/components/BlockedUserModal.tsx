import { AlertTriangle, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export const BlockedUserModal = () => {
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-8">
      <div className="max-w-md w-full">
        <div className="bg-card border border-destructive rounded-2xl p-8 text-center">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 rounded-full bg-destructive/20 flex items-center justify-center">
              <Shield className="w-10 h-10 text-destructive" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-4">Account Blocked</h1>
          <p className="text-muted-foreground mb-6">
            Your account has been blocked due to a violation of our quiz rules.
          </p>
          <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
              <p className="text-sm text-destructive">
                <strong>Reason:</strong> Cheating detected during quiz attempt.
              </p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground mb-6">
            If you believe this is an error, please contact the administrator.
          </p>
          <Button onClick={handleSignOut} variant="outline" className="w-full">
            Sign Out
          </Button>
        </div>
      </div>
    </div>
  );
};

