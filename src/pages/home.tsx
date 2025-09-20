import React, { useState } from "react";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import { MessageCircle, Users, Zap, Shield, ArrowRight } from "lucide-react";
import { useAuth } from "../contexts/auth-context";
import { useToast } from "../hooks/use-toast";

const LandingPage = () => {
  const { login, signup, isLoading } = useAuth();
  const { toast } = useToast();

  // Login form state
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  // Signup form state
  const [signupData, setSignupData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!loginData.email || !loginData.password) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    const result = await login(loginData.email, loginData.password);

    if (result.success) {
      toast({
        title: "Welcome back!",
        description: "Successfully logged in",
      });
    } else {
      toast({
        title: "Login failed",
        description: result.error || "Please check your credentials",
        variant: "destructive",
      });
    }
  };

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!signupData.username || !signupData.email || !signupData.password) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    if (signupData.password !== signupData.confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords don't match",
        variant: "destructive",
      });
      return;
    }

    if (signupData.password.length < 6) {
      toast({
        title: "Error",
        description: "Password must be at least 6 characters",
        variant: "destructive",
      });
      return;
    }

    const result = await signup(
      signupData.email,
      signupData.password,
      signupData.username
    );

    if (result.success) {
      toast({
        title: "Welcome!",
        description: "Account created successfully",
      });
    } else {
      toast({
        title: "Signup failed",
        description: result.error || "Please try again",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-500/10" />
        <div className="container mx-auto px-4 py-16 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Side - Hero Content */}
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-5xl md:text-6xl font-bold text-white  leading-tight">
                  Connect with your
                  <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                    {" "}
                    community
                  </span>
                </h1>
                <p className="text-xl text-gray-300 leading-relaxed max-w-lg">
                  Join thousands of communities, chat with friends, and
                  collaborate seamlessly in our modern messaging platform.
                </p>
              </div>

              {/* Features */}
              <div className="grid grid-cols-2 gap-6">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-indigo-500/20 rounded-lg flex items-center justify-center">
                    <MessageCircle className="w-5 h-5 text-indigo-400" />
                  </div>
                  <div>
                    <h3 className="text-white  font-semibold">
                      Real-time Chat
                    </h3>
                    <p className="text-gray-400 text-sm">Instant messaging</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                    <Users className="w-5 h-5 text-green-400" />
                  </div>
                  <div>
                    <h3 className="text-white  font-semibold">Communities</h3>
                    <p className="text-gray-400 text-sm">Join groups</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                    <Zap className="w-5 h-5 text-purple-400" />
                  </div>
                  <div>
                    <h3 className="text-white  font-semibold">
                      Lightning Fast
                    </h3>
                    <p className="text-gray-400 text-sm">Ultra responsive</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-orange-500/20 rounded-lg flex items-center justify-center">
                    <Shield className="w-5 h-5 text-orange-400" />
                  </div>
                  <div>
                    <h3 className="text-white  font-semibold">Secure</h3>
                    <p className="text-gray-400 text-sm">Privacy focused</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Auth Forms */}
            <div className="flex justify-center lg:justify-end">
              <Card className="w-full max-w-md bg-slate-800/50 border-slate-700 backdrop-blur-sm">
                <CardHeader className="space-y-1">
                  <CardTitle className="text-2xl text-center text-white ">
                    Get Started
                  </CardTitle>
                  <CardDescription className="text-center text-gray-400">
                    Create an account or sign in to continue
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="login" className="space-y-4">
                    <TabsList className="grid w-full grid-cols-2 bg-slate-700">
                      <TabsTrigger
                        value="login"
                        className="text-gray-300 data-[state=active]:text-black cursor-pointer"
                      >
                        Sign In
                      </TabsTrigger>
                      <TabsTrigger
                        value="signup"
                        className="text-gray-300 data-[state=active]:text-black cursor-pointer"
                      >
                        Sign Up
                      </TabsTrigger>
                    </TabsList>

                    {/* Login Form */}
                    <TabsContent value="login" className="space-y-4">
                      <form onSubmit={handleLogin} className="space-y-4">
                        <div className="space-y-2">
                          <Label
                            htmlFor="login-email"
                            className="text-gray-300"
                          >
                            Email
                          </Label>
                          <Input
                            id="login-email"
                            type="email"
                            placeholder="Enter your email"
                            value={loginData.email}
                            onChange={(e) =>
                              setLoginData({
                                ...loginData,
                                email: e.target.value,
                              })
                            }
                            className="bg-slate-700 border-slate-600 text-white  placeholder:text-gray-400"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label
                            htmlFor="login-password"
                            className="text-gray-300"
                          >
                            Password
                          </Label>
                          <Input
                            id="login-password"
                            type="password"
                            placeholder="Enter your password"
                            value={loginData.password}
                            onChange={(e) =>
                              setLoginData({
                                ...loginData,
                                password: e.target.value,
                              })
                            }
                            className="bg-slate-700 border-slate-600 text-white  placeholder:text-gray-400"
                            required
                          />
                        </div>
                        <Button
                          type="submit"
                          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white "
                          disabled={isLoading}
                        >
                          {isLoading ? "Signing in..." : "Sign In"}
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      </form>
                    </TabsContent>

                    {/* Signup Form */}
                    <TabsContent value="signup" className="space-y-4">
                      <form onSubmit={handleSignup} className="space-y-4">
                        <div className="space-y-2">
                          <Label
                            htmlFor="signup-username"
                            className="text-gray-300"
                          >
                            Username
                          </Label>
                          <Input
                            id="signup-username"
                            type="text"
                            placeholder="Choose a username"
                            value={signupData.username}
                            onChange={(e) =>
                              setSignupData({
                                ...signupData,
                                username: e.target.value,
                              })
                            }
                            className="bg-slate-700 border-slate-600 text-white  placeholder:text-gray-400"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label
                            htmlFor="signup-email"
                            className="text-gray-300"
                          >
                            Email
                          </Label>
                          <Input
                            id="signup-email"
                            type="email"
                            placeholder="Enter your email"
                            value={signupData.email}
                            onChange={(e) =>
                              setSignupData({
                                ...signupData,
                                email: e.target.value,
                              })
                            }
                            className="bg-slate-700 border-slate-600 text-white  placeholder:text-gray-400"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label
                            htmlFor="signup-password"
                            className="text-gray-300"
                          >
                            Password
                          </Label>
                          <Input
                            id="signup-password"
                            type="password"
                            placeholder="Create a password"
                            value={signupData.password}
                            onChange={(e) =>
                              setSignupData({
                                ...signupData,
                                password: e.target.value,
                              })
                            }
                            className="bg-slate-700 border-slate-600 text-white  placeholder:text-gray-400"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label
                            htmlFor="signup-confirm"
                            className="text-gray-300"
                          >
                            Confirm Password
                          </Label>
                          <Input
                            id="signup-confirm"
                            type="password"
                            placeholder="Confirm your password"
                            value={signupData.confirmPassword}
                            onChange={(e) =>
                              setSignupData({
                                ...signupData,
                                confirmPassword: e.target.value,
                              })
                            }
                            className="bg-slate-700 border-slate-600 text-white  placeholder:text-gray-400"
                            required
                          />
                        </div>
                        <Button
                          type="submit"
                          className="w-full bg-purple-600 hover:bg-purple-700 text-white "
                          disabled={isLoading}
                        >
                          {isLoading ? "Creating account..." : "Create Account"}
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      </form>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="border-t border-slate-800">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-white  mb-2">10K+</div>
              <div className="text-gray-400">Active Users</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white  mb-2">500+</div>
              <div className="text-gray-400">Communities</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white  mb-2">1M+</div>
              <div className="text-gray-400">Messages</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white  mb-2">99.9%</div>
              <div className="text-gray-400">Uptime</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
