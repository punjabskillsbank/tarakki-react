import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthService from "../../services/AuthService";
import { setMemberIdentity, setToken } from "../../utils/authStorage";
import config from "../../config/indexConfig";

export function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);
    try {
      const response = await AuthService.login(email.trim(), password);
      setToken(response.token);
      setMemberIdentity(response.member);
      navigate(config.routes.organizationDecision, { replace: true });
    } catch {
      setError("Invalid email or password. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F6F7FB] p-6">
      <form onSubmit={submit} className="w-full max-w-md space-y-5 rounded-xl bg-white p-8 shadow-xl">
        <div><h1 className="text-2xl font-semibold">Log in</h1><p className="mt-1 text-sm text-[#6B7280]">Continue to Tarakki.</p></div>
        <label className="block text-sm font-medium">Email<input required type="email" value={email} onChange={(event) => setEmail(event.target.value)} className="mt-1 w-full rounded-lg border p-3" /></label>
        <label className="block text-sm font-medium">Password<input required type="password" value={password} onChange={(event) => setPassword(event.target.value)} className="mt-1 w-full rounded-lg border p-3" /></label>
        {error && <p role="alert" className="text-sm text-red-600">{error}</p>}
        <button disabled={isSubmitting} className="w-full rounded-lg bg-[#0073EA] p-3 font-medium text-white disabled:opacity-60">{isSubmitting ? "Logging in..." : "Log in"}</button>
        <p className="text-center text-sm text-[#6B7280]">New here? <Link to={config.routes.onboarding} className="text-[#0073EA] hover:underline">Create an account</Link></p>
      </form>
    </main>
  );
}
