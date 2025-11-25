// src/pages/AdminLogin.jsx
import "./AdminLogin.css";

function AdminLogin() {
  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: xử lý login sau
    console.log("Admin login submit");
  };

  return (
    <div className="admin-login">
      <div className="admin-login__card">
        <div className="admin-login__header">
          <h1>Admin Panel</h1>
          <p>Đăng nhập để quản lý hệ thống việc làm</p>
        </div>

        <form className="admin-login__form" onSubmit={handleSubmit}>
          <div className="admin-login__field">
            <label htmlFor="username">Tài khoản / Email</label>
            <input
              id="username"
              type="text"
              placeholder="Nhập tài khoản hoặc email"
              autoComplete="username"
            />
          </div>

          <div className="admin-login__field">
            <label htmlFor="password">Mật khẩu</label>
            <input
              id="password"
              type="password"
              placeholder="Nhập mật khẩu"
              autoComplete="current-password"
            />
          </div>

          <div className="admin-login__options">
            <label className="admin-login__remember">
              <input type="checkbox" />
              <span>Ghi nhớ đăng nhập</span>
            </label>
            <button
              type="button"
              className="admin-login__forgot"
              onClick={() => alert("Tính năng quên mật khẩu sẽ thêm sau")}
            >
              Quên mật khẩu?
            </button>
          </div>

          <button type="submit" className="admin-login__button">
            Đăng nhập
          </button>
        </form>

        <div className="admin-login__footer">
          <span>© {new Date().getFullYear()} Admin Job Portal</span>
        </div>
      </div>
    </div>
  );
}

export default AdminLogin;
