
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Github, Facebook, Mail, Apple, Linkedin, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { LucideIcon } from "lucide-react";

interface AuthFormProps {
  onLogin: (email: string, password: string) => void;
  onSignUp?: (email: string, password: string, metadata?: { fullName?: string; purpose?: string; age?: string }) => void;
  onSocialLogin: (provider: "google" | "facebook" | "github" | "apple" | "linkedin_oidc") => void;
  isLoading?: boolean;
  mode?: 'login' | 'signup';
  onToggleMode?: () => void;
}

const AuthForm = ({ 
  onLogin, 
  onSignUp, 
  onSocialLogin, 
  isLoading,
  mode = 'login',
  onToggleMode
}: AuthFormProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [purpose, setPurpose] = useState("");
  const [age, setAge] = useState("");
  const [showVerification, setShowVerification] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'login') {
      onLogin(email, password);
    } else if (mode === 'signup' && onSignUp) {
      onSignUp(email, password, { fullName, purpose, age });
    }
  };

  // Social login providers are not configured - show warning
  const socialLoginDisabled = true;
  const socialLoginTooltip = "Social providers need to be configured in Supabase dashboard first.";

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
        <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
          <Mail className="w-6 h-6 text-primary" />
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
          
          {showVerification ? (
            <div className="space-y-2">
              <Label htmlFor="verification">Verification Code</Label>
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
          
          <SocialButton 
            provider="facebook"
            icon={Facebook}
            label="Facebook"
            className="text-blue-600"
          />
          
          <SocialButton 
            provider="github"
            icon={Github}
            label="GitHub"
            className="text-gray-900 dark:text-white"
          />
          
          <SocialButton 
            provider="apple"
            icon={Apple}
            label="Apple"
            className="text-gray-900 dark:text-white"
          />
          
          <SocialButton 
            provider="linkedin_oidc"
            icon={Linkedin}
            label="LinkedIn"
            className="text-[#0077b5]"
          />
        </div>
      </CardContent>
      
      <CardFooter className="text-center text-sm text-muted-foreground block">
        <p>Your personal roadmap to achieving life goals</p>
        {socialLoginDisabled && (
          <p className="mt-2 text-yellow-600 text-xs">
            💡 Configure social providers in Supabase to enable social login
          </p>
        )}
      </CardFooter>
    </Card>
  );
};

export default AuthForm;
