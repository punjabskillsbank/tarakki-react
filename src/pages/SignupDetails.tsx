import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function SignupDetails() {
  const navigate = useNavigate();
  const location = useLocation() as { state?: { email?: string } };
  const email = location.state?.email ?? "";

  const [name, setName] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (!email) navigate("/signup");
  }, [email, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const signupData = { email, name, password };
    console.log("Signup Data:", signupData);
    navigate("/signup/success", { state: { email, name } });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">Complete your signup</h1>
        </div>

        <div className="bg-white rounded-xl shadow-sm ring-1 ring-gray-200 p-5">
          {/* Carried email */}
          <div className="mb-4 text-sm text-gray-600">
            Email: <strong className="text-gray-900">{email}</strong>
            <button
              type="button"
              onClick={() => navigate("/signup")}
              className="ml-2 underline text-blue-600 hover:text-blue-700"
            >
              change
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label htmlFor="name" className="sr-only">Full name</label>
              <input
                id="name"
                type="text"
                placeholder="Full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label htmlFor="password" className="sr-only">Create password</label>
              <input
                id="password"
                type="password"
                placeholder="Create password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <button
              type="submit"
              disabled={!name || !password}
              className="w-full rounded-lg bg-blue-600 text-white font-medium py-3 hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none"
            >
              Finish signup
            </button>
          </form>
        </div>

        <p className="mt-3 text-center text-xs text-gray-500">
          By continuing, you agree to our Terms and Privacy Policy.
        </p>
      </div>
    </div>
  );
}

export default SignupDetails;
