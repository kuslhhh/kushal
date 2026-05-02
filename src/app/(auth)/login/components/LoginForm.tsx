"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { bricolage_grotesque } from "@/utils/fonts";
import { EyeOpenIcon, EyeClosedIcon, LockClosedIcon } from "@radix-ui/react-icons";

export default function LoginForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const loginUser = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const result = await signIn("credentials", {
                redirect: false,
                email,
                password,
            });

            if (result?.error) {
                toast.error(
                    result.error === "CredentialsSignin"
                        ? "Incorrect email or password."
                        : result.error
                );
                return;
            }

            if (result?.url) {
                toast.success("Welcome back!");
                router.replace("/admin");
            }
        } catch {
            toast.error("Something went wrong. Try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-background px-4">
            <div
                className={`w-full max-w-sm ${bricolage_grotesque}`}
            >
                {/* Card */}
                <div className="rounded-2xl border border-border bg-card shadow-lg px-8 py-10">

                    {/* Icon + heading */}
                    <div className="flex flex-col items-center gap-3 mb-8">
                        <div className="w-11 h-11 rounded-xl bg-foreground flex items-center justify-center">
                            <LockClosedIcon className="w-5 h-5 text-background" />
                        </div>
                        <div className="text-center">
                            <h1 className="text-2xl font-bold text-foreground tracking-tight">
                                Admin Login
                            </h1>
                            <p className="text-sm text-muted-foreground mt-1">
                                Sign in to manage your portfolio
                            </p>
                        </div>
                    </div>

                    {/* Form */}
                    <form onSubmit={loginUser} className="flex flex-col gap-5">
                        <div className="flex flex-col gap-1.5">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="you@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                autoComplete="email"
                                className="h-10"
                            />
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <Label htmlFor="password">Password</Label>
                            <div className="relative">
                                <Input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    autoComplete="current-password"
                                    className="h-10 pr-10"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword((v) => !v)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                    tabIndex={-1}
                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                >
                                    {showPassword ? (
                                        <EyeClosedIcon className="w-4 h-4" />
                                    ) : (
                                        <EyeOpenIcon className="w-4 h-4" />
                                    )}
                                </button>
                            </div>
                        </div>

                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="w-full h-10 mt-1 font-semibold"
                        >
                            {isLoading ? (
                                <span className="flex items-center gap-2">
                                    <span className="w-4 h-4 border-2 border-background/40 border-t-background rounded-full animate-spin" />
                                    Signing in…
                                </span>
                            ) : (
                                "Sign in"
                            )}
                        </Button>
                    </form>
                </div>

                {/* Footer */}
                <p className="text-center text-xs text-muted-foreground mt-5">
                    This page is restricted to the site owner.
                </p>
            </div>
        </div>
    );
}
