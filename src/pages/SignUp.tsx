import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";

const SignUp = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement actual signup logic
    console.log("Signup attempt:", formData);
  };

  const handleGoogleSignUp = () => {
    // TODO: Implement Google signup
    console.log("Google signup");
  };

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6 flex flex-col">
      <div className="w-full max-w-md mx-auto flex-1 flex flex-col py-4">
        <button
          onClick={() => navigate("/login")}
          className="w-12 h-12 rounded-2xl border-2 border-border flex items-center justify-center hover:bg-muted transition-colors mb-6"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>

        <div className="mb-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-1">Sign up</h2>
          <p className="text-muted-foreground text-sm sm:text-base">
            To get started, please sign up by filling in your information below.
          </p>
        </div>

        <form onSubmit={handleSignUp} className="space-y-4 flex-1 flex flex-col">
          <div className="space-y-1">
            <Label htmlFor="firstName" className="text-foreground font-semibold">
              First Name
            </Label>
            <Input
              id="firstName"
              type="text"
              placeholder="Enter name"
              value={formData.firstName}
              onChange={(e) => updateField("firstName", e.target.value)}
              className="h-12 rounded-xl border-2"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="lastName" className="text-foreground font-semibold">
              Last Name
            </Label>
            <Input
              id="lastName"
              type="text"
              placeholder="Enter name"
              value={formData.lastName}
              onChange={(e) => updateField("lastName", e.target.value)}
              className="h-12 rounded-xl border-2"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="email" className="text-foreground font-semibold">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="Email address"
              value={formData.email}
              onChange={(e) => updateField("email", e.target.value)}
              className="h-12 rounded-xl border-2 focus:border-primary"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="password" className="text-foreground font-semibold">
              Password
            </Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={formData.password}
                onChange={(e) => updateField("password", e.target.value)}
                className="h-12 rounded-xl border-2 pr-12"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="confirmPassword" className="text-foreground font-semibold">
              Confirm Password
            </Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={(e) => updateField("confirmPassword", e.target.value)}
                className="h-12 rounded-xl border-2 pr-12"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground"
              >
                {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>
          
          <div className="pt-4">
            <Button
              type="submit"
              className="w-full h-14 text-base sm:text-lg font-semibold rounded-full bg-foreground text-background hover:bg-foreground/90"
            >
              Sign up
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUp;