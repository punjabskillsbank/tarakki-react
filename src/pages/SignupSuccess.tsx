// src/pages/SignupSuccess.tsx
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

function SignupSuccess() {
  const location = useLocation() as { state?: { email?: string; name?: string } };
  const navigate = useNavigate();

  const email = location.state?.email ?? "";
  const name = location.state?.name ?? "";

  const hasData = Boolean(email || name);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md text-center">
        <div className="bg-white rounded-xl shadow-sm ring-1 ring-gray-200 p-6">
          <h2 className="text-2xl font-semibold text-green-600"> Signup successful</h2>

          {hasData ? (
            <p className="mt-3 text-gray-700">
              Welcome <span className="font-semibold">{name || "there"}</span>!<br />
              Registered with <span className="font-semibold">{email || "your email"}</span>.
            </p>
          ) : (
            <p className="mt-3 text-gray-600">
              Your account is ready. Return to signup if you want to start over.
            </p>
          )}

          <button
            onClick={() => navigate("/signup")}
            className="mt-5 inline-flex items-center justify-center px-4 py-2.5 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition"
          >
            Back to signup
          </button>
        </div>
      </div>
    </div>
  );
}

export default SignupSuccess;
