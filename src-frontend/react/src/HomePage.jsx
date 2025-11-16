import { Link } from "react-router-dom";

function HomePage() {
  return (
    <div className="site-root">
      {/* NAVBAR */}
      <header className="top-nav">
        <div className="nav-left">
          <div className="logo">
            <span className="logo-star">★</span>
            <span className="logo-text">glints</span>
          </div>

          <nav className="nav-menu">
            <button className="nav-link active">TÌM VIỆC LÀM</button>
            <button className="nav-link">DANH SÁCH CÔNG TY</button>
            <button className="nav-link">BLOG</button>
            <button className="nav-link">
              <span className="nav-small">MỚI</span> TẢI ỨNG DỤNG
            </button>
          </nav>
        </div>

        <div className="nav-right">
          <button className="nav-btn chat-btn">
            TẢI APP VÀ CHAT VỚI NHÀ TUYỂN DỤNG
          </button>

          <div className="nav-lang">
            🌐 <span>VI</span> ▼
          </div>

          {/* Đăng ký / Đăng nhập ứng viên */}
          <Link to="/candidate/login" className="nav-link small">
            ĐĂNG NHẬP
          </Link>

          {/* Nhà tuyển dụng */}
          <Link to="/employer/login" className="nav-btn employer-btn">
            DÀNH CHO NHÀ TUYỂN DỤNG →
          </Link>
        </div>
      </header>

      {/* HERO SEARCH */}
      <section className="hero">
        <div className="hero-inner">
          <h1 className="hero-title">
            Khám phá <strong>15000+ việc làm</strong> mới hằng tháng!
          </h1>

          <div className="hero-search">
            <div className="search-input-wrapper">
              <span className="search-icon">🔍</span>
              <input
                className="search-input"
                placeholder="Tìm kiếm việc làm"
              />
            </div>

            <div className="search-input-wrapper">
              <span className="search-icon">📍</span>
              <select className="search-input">
                <option>Tất cả Tỉnh/Thành phố</option>
                <option>Hồ Chí Minh</option>
                <option>Hà Nội</option>
                <option>Đà Nẵng</option>
              </select>
            </div>

            <button className="search-btn">TÌM KIẾM</button>
          </div>
        </div>
      </section>

      {/* SECTION BELOW */}
      <section className="section-career">
        <h2 className="career-title">
          KHÁM PHÁ NGHỀ NGHIỆP MƠ ƯỚC
          <span className="career-highlight" />
        </h2>
        <p className="career-subtitle">
          Tìm hiểu nghề nghiệp và chuyên môn dành cho bạn
        </p>
      </section>
    </div>
  );
}

export default HomePage;
