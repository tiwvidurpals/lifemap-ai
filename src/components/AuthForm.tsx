
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { AlertTriangle, Shield, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { LucideIcon } from "lucide-react";
import { sendVerificationEmail, validateVerificationCode, clearVerificationCode, sendPasswordResetEmail } from "@/services/verification-service";

interface AuthFormProps {
  onLogin: (email: string, password: string) => void;
  onSignUp?: (email: string, password: string, metadata?: { fullName?: string; purpose?: string; age?: string }) => void;
  onSocialLogin: (provider: "google" | "facebook" | "github" | "apple" | "linkedin_oidc") => void;
  onSendVerificationEmail?: (email: string) => Promise<void>;
  isLoading?: boolean;
  mode?: 'login' | 'signup';
  onToggleMode?: () => void;
  resetSignal?: number;
  failedAttempts?: number;
  isBlocked?: boolean;
  isEmailVerificationRequired?: boolean;
  remainingAttempts?: number;
  remainingBlockTime?: number;
}

const AuthForm = ({ 
  onLogin, 
  onSignUp, 
  onSocialLogin,
  onSendVerificationEmail,
  isLoading,
  mode = 'login',
  onToggleMode,
  resetSignal = 0,
  failedAttempts = 0,
  isBlocked = false,
  isEmailVerificationRequired = false,
  remainingAttempts = 5,
  remainingBlockTime = 0
}: AuthFormProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [purpose, setPurpose] = useState("");
  const [age, setAge] = useState("");
  const [showVerification, setShowVerification] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [isSendingVerification, setIsSendingVerification] = useState(false);
  const [verificationStep, setVerificationStep] = useState<'code' | 'reset'>('code');
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isVerifyingCode, setIsVerifyingCode] = useState(false);
  const [isResettingPassword, setIsResettingPassword] = useState(false);

  // Clear inputs when resetSignal changes (e.g., after logout)
  useEffect(() => {
    setEmail("");
    setPassword("");
    setFullName("");
    setPurpose("");
    setAge("");
    setShowVerification(false);
    setVerificationCode("");
    setVerificationStep('code');
    setNewPassword("");
    setConfirmPassword("");
    setIsSendingVerification(false);
    setIsVerifyingCode(false);
    setIsResettingPassword(false);
    
  }, [resetSignal]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if blocked due to brute force protection
    if (isBlocked && remainingBlockTime > 0) {
      return;
    }
    
    if (mode === 'login') {
      onLogin(email, password);
    } else if (mode === 'signup' && onSignUp) {
      onSignUp(email, password, { fullName, purpose, age });
    }
  };

  const handleSendVerificationEmail = async () => {
    if (!email) return;
    
    setIsSendingVerification(true);
    try {
      // Generate and send verification code
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      await sendVerificationEmail(email, code);
      setShowVerification(true);
      setVerificationStep('code');
    } catch (error) {
      console.error('Failed to send verification email:', error);
    } finally {
      setIsSendingVerification(false);
    }
  };

  const handleVerifyCode = async () => {
    if (!verificationCode || verificationCode.length !== 6) return;
    
    setIsVerifyingCode(true);
    try {
      const isValid = validateVerificationCode(email, verificationCode);
      
      if (isValid) {
        // Code is correct, show password reset option
        setVerificationStep('reset');
        clearVerificationCode();
        // Code verified successfully
      } else {
        // Code is incorrect
        setVerificationCode("");
        // You could show an error message here
        alert('Verification code is incorrect. Please try again.');
      }
    } catch (error) {
      console.error('Failed to verify code:', error);
      alert('Failed to verify code. Please try again.');
    } finally {
      setIsVerifyingCode(false);
    }
  };

  const handleResetPassword = async () => {
    if (!newPassword || newPassword !== confirmPassword) {
      alert('Passwords do not match.');
      return;
    }
    
    if (newPassword.length < 6) {
      alert('Password must be at least 6 characters long.');
      return;
    }
    
    setIsResettingPassword(true);
    try {
      await sendPasswordResetEmail(email);
      alert('Password reset email sent. Please check your email and follow the link to reset your password.');
      // Reset the form
      setShowVerification(false);
      setVerificationStep('code');
      setNewPassword("");
      setConfirmPassword("");
      setVerificationCode("");
    } catch (error) {
      console.error('Failed to reset password:', error);
      alert('Failed to send password reset email. Please try again.');
    } finally {
      setIsResettingPassword(false);
    }
  };

  const formatTime = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // Social login providers are now enabled
  const socialLoginDisabled = false;
  const socialLoginTooltip = "Sign in with your social account";

  const SocialButton = ({ provider, icon: Icon, label, className }: { 
    provider: "google" | "facebook" | "github" | "apple" | "linkedin_oidc", 
    icon: LucideIcon | (() => JSX.Element), 
    label: string,
    className?: string 
  }) => (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => onSocialLogin(provider)}
            disabled={isLoading || socialLoginDisabled}
            className={cn(
              "w-full flex items-center justify-center gap-2 hover:scale-[1.02] transition-all",
              socialLoginDisabled && "opacity-50 cursor-not-allowed",
              className
            )}
          >
            <Icon className="w-5 h-5" />
            <span>{label}</span>
            {socialLoginDisabled && <AlertTriangle className="w-4 h-4 ml-2 text-yellow-500" />}
          </Button>
        </TooltipTrigger>
        {socialLoginDisabled && (
          <TooltipContent>
            <p>{socialLoginTooltip}</p>
          </TooltipContent>
        )}
      </Tooltip>
    </TooltipProvider>
  );

  return (
    <Card className="w-full max-w-md mx-auto shadow-lg animate-fade-in">
      <CardHeader className="text-center space-y-4">
        <div className="mx-auto w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
          <img src="/lifemap-logo.svg" alt="LifeMap logo" className="w-10 h-10 object-contain" />
        </div>
        <CardTitle className="text-2xl font-bold">Welcome to LifeMap</CardTitle>
        <CardDescription>
          {mode === 'login' ? 'Sign in to start planning your journey' : 'Create an account to start your journey'}
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'signup' && (
            <>
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  type="text"
                  placeholder="Your full name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="purpose">Purpose</Label>
                <Input
                  id="purpose"
                  type="text"
                  placeholder="Why are you joining?"
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="age">Age</Label>
                <Input
                  id="age"
                  type="number"
                  min="1"
                  max="120"
                  placeholder="Your age"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>
            </>
          )}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-secondary/50"
              required
              disabled={isLoading}
            />
          </div>
          
          {showVerification && verificationStep === 'code' ? (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="verification">Enter verification code sent to {email}</Label>
                <InputOTP
                  value={verificationCode}
                  onChange={setVerificationCode}
                  maxLength={6}
                  render={({ slots }) => (
                    <InputOTPGroup className="gap-2 justify-center">
                      {slots.map((slot, idx) => (
                        <InputOTPSlot key={idx} {...slot} index={idx} />
                      ))}
                    </InputOTPGroup>
                  )}
                />
              </div>
              <Button
                onClick={handleVerifyCode}
                disabled={isVerifyingCode || verificationCode.length !== 6}
                className="w-full"
              >
                {isVerifyingCode ? 'Verifying...' : 'Verify Code'}
              </Button>
            </div>
          ) : showVerification && verificationStep === 'reset' ? (
            <div className="space-y-4">
              <div className="p-3 rounded-lg border border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950">
                <div className="flex items-center gap-2 text-green-800 dark:text-green-200">
                  <Shield className="w-4 h-4" />
                  <span className="text-sm font-medium">Code verified successfully!</span>
                </div>
                <p className="text-xs text-green-700 dark:text-green-300 mt-1">
                  You can now reset your password.
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input
                  id="newPassword"
                  type="password"
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  disabled={isResettingPassword}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  disabled={isResettingPassword}
                />
              </div>
              
              <Button
                onClick={handleResetPassword}
                disabled={isResettingPassword || !newPassword || !confirmPassword}
                className="w-full"
              >
                {isResettingPassword ? 'Sending Reset Email...' : 'Reset Password'}
              </Button>
            </div>
          ) : (
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-secondary/50"
                required
                disabled={isLoading}
              />
            </div>
          )}
          
          <Button 
            type="submit" 
            className="w-full hover:scale-[1.02] transition-transform"
            disabled={isLoading}
          >
            {isLoading 
              ? (mode === 'login' ? "Signing in..." : "Signing up...") 
              : (mode === 'login' ? "Sign In" : "Sign Up")}
          </Button>
        </form>
        
        {/* Brute Force Protection Warnings */}
        {mode === 'login' && failedAttempts > 0 && (
          <div className="mt-4 p-3 rounded-lg border border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-950">
            <div className="flex items-center gap-2 text-orange-800 dark:text-orange-200">
              <Shield className="w-4 h-4" />
              <span className="text-sm font-medium">
                {isBlocked ? 'Account temporarily locked' : 'Multiple failed attempts detected'}
              </span>
            </div>
            <p className="text-xs text-orange-700 dark:text-orange-300 mt-1">
              {isBlocked ? (
                <>Please wait {formatTime(remainingBlockTime)} before trying again.</>
              ) : (
                <>You have {remainingAttempts} attempts remaining before email verification is required.</>
              )}
            </p>
          </div>
        )}
        
        {/* Email Verification Required */}
        {mode === 'login' && isEmailVerificationRequired && !showVerification && (
          <div className="mt-4 p-4 rounded-lg border border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950">
            <div className="flex items-center gap-2 text-red-800 dark:text-red-200 mb-2">
              <Shield className="w-4 h-4" />
              <span className="text-sm font-medium">Email verification required</span>
            </div>
            <p className="text-xs text-red-700 dark:text-red-300 mb-3">
              For security reasons, please verify your email address before signing in.
            </p>
            <Button
              onClick={handleSendVerificationEmail}
              disabled={isSendingVerification || !email}
              variant="outline"
              size="sm"
              className="w-full"
            >
              {isSendingVerification ? 'Sending...' : 'Send verification email'}
            </Button>
          </div>
        )}
        
        {onToggleMode && (
          <div className="mt-4 text-center">
            <Button variant="link" onClick={onToggleMode} disabled={isLoading}>
              {mode === 'login' ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
            </Button>
          </div>
        )}
        
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-background text-muted-foreground">
              Or continue with
            </span>
          </div>
        </div>
        
        <div className="grid gap-3">
          <SocialButton 
            provider="google"
            icon={() => (
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
            )}
            label="Google"
          />
        </div>
      </CardContent>
      
      <CardFooter className="text-center text-sm text-muted-foreground block">
        <p>Your personal roadmap to achieving life goals</p>
      </CardFooter>
    </Card>
  );
};

export default AuthForm;
