function AdminDashboard() {
  return (
    <div className="p-6">
      {/* Header */}
      <h1 className="text-2xl font-bold text-neutral-dark mb-6">
        Admin Dashboard
      </h1>

      {/* 3 cards thống kê */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-subtle border border-neutral-light">
          <h3 className="text-neutral-medium text-sm">Total Users</h3>
          <p className="text-3xl font-bold mt-2 text-brand-blue">1243</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-subtle border border-neutral-light">
          <h3 className="text-neutral-medium text-sm">Total Jobs</h3>
          <p className="text-3xl font-bold mt-2 text-brand-blue">326</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-subtle border border-neutral-light">
          <h3 className="text-neutral-medium text-sm">Employers</h3>
          <p className="text-3xl font-bold mt-2 text-brand-blue">58</p>
        </div>
      </div>

      {/* Activity table */}
      <div className="bg-white p-6 rounded-xl shadow-subtle border border-neutral-light">
        <h2 className="text-xl font-semibold text-neutral-dark mb-4">
          Recent Activities
        </h2>

        <table className="w-full border-collapse">
          <thead>
            <tr className="text-left text-neutral-medium border-b">
              <th className="pb-3">Action</th>
              <th className="pb-3">User</th>
              <th className="pb-3">Time</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b hover:bg-neutral-light transition">
              <td className="py-3">New user registered</td>
              <td>nguyenvana</td>
              <td>2 hours ago</td>
            </tr>

            <tr className="border-b hover:bg-neutral-light transition">
              <td className="py-3">Job posted</td>
              <td>FPT Corp</td>
              <td>4 hours ago</td>
            </tr>

            <tr className="hover:bg-neutral-light transition">
              <td className="py-3">Employer requested approval</td>
              <td>SunGroup HR</td>
              <td>Yesterday</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminDashboard;
