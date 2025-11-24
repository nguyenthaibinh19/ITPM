import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function CandidateRegister() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      const result = await register({
        name: formData.fullName, // Backend expects 'name' not 'fullName'
        email: formData.email,
        password: formData.password,
        role: "js",
      });

      if (result.success) {
        navigate("/candidate/dashboard");
      } else {
        setError(result.error || "Registration failed");
      }
    } catch (err) {
      console.error("Registration error:", err);
      setError(
        err.response?.data?.message || "An error occurred. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-light flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-neutral-dark">JobMatch</h1>
          <p className="text-neutral-medium mt-2">
            Create your Job Seeker account
          </p>
        </div>

        <div className="bg-white p-8 rounded-lg shadow-subtle border border-neutral-light">
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="fullName"
                className="block text-sm font-medium text-neutral-medium mb-1"
              >
                Full Name
              </label>
              <input
                id="fullName"
                name="fullName"
                type="text"
                required
                value={formData.fullName}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-neutral-light rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue"
                placeholder="John Doe"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-neutral-medium mb-1"
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-neutral-light rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-neutral-medium mb-1"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-neutral-light rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue"
                placeholder="••••••••"
              />
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-neutral-medium mb-1"
              >
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-neutral-light rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-brand-blue text-white font-semibold py-2 px-4 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Creating account..." : "Sign Up"}
            </button>
          </form>
        </div>

        <p className="mt-6 text-center text-sm text-neutral-medium">
          Already have an account?{" "}
          <Link
            to="/candidate/login"
            className="font-semibold text-brand-blue hover:underline"
          >
            Log in
          </Link>
        </p>

        <div className="mt-4 text-center">
          <Link to="/" className="text-sm text-brand-blue hover:underline">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

export default CandidateRegister;
