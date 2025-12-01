import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
// ❌ Không cần nữa nếu login local, bạn có thể xoá dòng dưới
// import { authAPI } from "../../services/api";

function AdminLogin() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
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
    setLoading(true);

    try {
      // ✅ Check tài khoản cố định ở đây
      if (formData.email === "admin" && formData.password === "admin") {
        // Lưu token và thông tin admin giả lập
        localStorage.setItem("adminToken", "static_admin_token");
        localStorage.setItem(
          "adminUser",
          JSON.stringify({
            email: "admin",
            name: "Administrator",
            role: "admin",
          })
        );

        // Điều hướng sang dashboard
        navigate("/admin/dashboard");
      } else {
        setError("Sai tài khoản hoặc mật khẩu!");
      }

      // Nếu sau này dùng API thật, bạn chỉ cần thay block trên
      // bằng đoạn gọi authAPI như trước là xong.
    } catch (err) {
      setError("Đã xảy ra lỗi, vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-light flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-neutral-dark">
            JobMatch Admin
          </h1>
          <p className="text-neutral-medium mt-2">Admin Portal Login</p>
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
                htmlFor="email"
                className="block text-sm font-medium text-neutral-medium mb-1"
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="text"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-neutral-light rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue"
                placeholder=""
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
                placeholder=""
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-brand-blue text-white font-semibold py-2 px-4 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Logging in..." : "Login as Admin"}
            </button>
          </form>
        </div>

        <div className="mt-4 text-center">
          <Link to="/" className="text-sm text-brand-blue hover:underline">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

export default AdminLogin;
