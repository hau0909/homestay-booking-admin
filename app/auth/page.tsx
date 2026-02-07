"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { signIn } from "@/src/services/auth";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

export default function Page() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const result = await signIn(email, password);

    if (result.success) {
      setError("");
      toast.success("Login successful!");
      router.push("/");
      return;
    }

    setIsLoading(false);
    setError("Email or password is incorrect");
    toast.error("Failed login, try again!");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-[#11009E]/10 via-white to-[#11009E]/10">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center space-y-1">
          <p className="text-3xl font-extrabold text-[#11009E] tracking-tight">
            Homestay Booking
          </p>
          <p className="text-sm text-muted-foreground">
            Admin Management System
          </p>
        </div>

        {/* Card */}
        <div className="rounded-xl border bg-white/80 backdrop-blur shadow-lg px-6 py-8 space-y-6">
          <p className="text-xl font-semibold text-center">Sign in</p>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-1">
              <label className="text-sm font-medium">Email</label>
              <Input
                type="email"
                placeholder="admin@example.com"
                className="focus-visible:ring-[#11009E]"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium">Password</label>
              <Input
                type="password"
                placeholder="••••••••"
                className="focus-visible:ring-[#11009E]"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <p className="my-2 text-red-400 text-sm italic">{error}</p>

            {isLoading ? (
              <div className="flex justify-center mt-2">
                <Loader2 className="animate-spin text-[#11009E]" size={36} />
              </div>
            ) : (
              <Button
                type="submit"
                className="w-full bg-[#11009E] hover:bg-white
              border hover:text-[#11009E] hover:border-[#11009E]
              cursor-pointer
              transition-all duration-200"
                disabled={!email || !password}
              >
                Sign in
              </Button>
            )}
          </form>

          {/* Footer */}
          <p className="text-xs text-center text-muted-foreground">
            Authorized personnel only
          </p>
        </div>
      </div>
    </div>
  );
}
