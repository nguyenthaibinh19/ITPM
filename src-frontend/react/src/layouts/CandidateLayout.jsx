import { Outlet, Link } from "react-router-dom";

function CandidateLayout() {
  return (
    <div className="layout">
      <aside className="sidebar">
        <h2>Candidate</h2>
        <nav>
          <Link to="/candidate">Trang chủ</Link>
          <Link to="/candidate/profile">Hồ sơ cá nhân</Link>
        </nav>
      </aside>
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}

export default CandidateLayout;
