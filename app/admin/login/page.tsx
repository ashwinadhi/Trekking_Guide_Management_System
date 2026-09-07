"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { isValidEmail } from "@/lib/form-validation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!isValidEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    if (!password.trim()) {
      setError("Password is required.");
      return;
    }

    setLoading(true);
    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });
    setLoading(false);

    if (res?.error) {
      setError("Invalid credentials or not an admin.");
    } else {
      router.push("/admin/dashboard");
      router.refresh();
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center p-4">
      <Image src="/images/mountain-sunrise.jpg" alt="" fill className="object-cover" priority />
      <div className="absolute inset-0 bg-ink/80" />
      <div className="relative w-full max-w-md border border-gold/25 bg-card/95 p-10 backdrop-blur-md">
        <p className="luxury-label mb-2">Back office</p>
        <div className="mb-8 flex items-center gap-3">
          <img
            src="/images/nirvana-luxury-adventure-logo.jpg"
            alt="Nirvana Luxury Adventure"
            className="h-14 w-auto object-contain"
          />
          <div>
            <h1 className="font-display text-2xl leading-tight text-ivory">Nirvana Luxury Adventure</h1>
            <p className="text-sm text-stone">Administrator sign in</p>
          </div>
        </div>
        {error && (
          <div className="mb-4 border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@example.com"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Signing in…
              </>
            ) : (
              "Enter dashboard"
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
