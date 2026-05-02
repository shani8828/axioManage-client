import { useState } from "react";
import { toast } from "sonner";
import { useAuth } from "../context/AuthContext";
import api from "../utils/api";
import { GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import { Lock } from "lucide-react";

export default function Login() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleEmailLogin = async (e) => {
    e.preventDefault();

    const t = toast.loading("Signing you in...");
    setIsLoading(true);

    try {
      const { token, user } = await api.post("/auth/login", {
        email,
        password,
      });

      login(token, user);
      toast.success("Welcome back!", { id: t });
      navigate("/");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Login failed", { id: t });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogle = async (res) => {
    const t = toast.loading("Connecting your Google account...");

    try {
      const { token, user } = await api.post("/auth/google", {
        tokenId: res.credential,
      });

      login(token, user);
      toast.success("Logged in with Google!", { id: t });
      navigate("/");
    } catch (err) {
      toast.error(
        err?.response?.data?.message || "Google authentication failed",
        { id: t },
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 md:p-10 border border-[#111111] transition-all hover:border-[#d0f4e0]">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 border border-[#111111] bg-[#111111] flex items-center justify-center mb-4">
            <Lock className="text-white h-6 w-6 stroke-[1.5px]" />
          </div>
          <h2 className="text-3xl font-display font-bold text-[#111111] uppercase tracking-widest">
            Welcome back
          </h2>
          <p className="mt-2 text-sm font-bold text-[#666666] uppercase tracking-widest">
            Choose your Google account to access your space
          </p>
        </div>

        <form className="mt-8 space-y-5" onSubmit={handleEmailLogin}>
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#666666]/20"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase tracking-widest font-bold">
              <span className="px-4 bg-white text-[#666666]">
                Continue with
              </span>
            </div>
          </div>

          <div className="flex justify-center w-full pt-4">
            <GoogleLogin
              onSuccess={handleGoogle}
              onError={() => toast.error("Google login failed")}
              theme="outline"
              shape="pill"
              width="100%"
            />
          </div>
        </form>
      </div>
    </div>
  );
}
