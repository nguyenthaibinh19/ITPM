import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { jobSeekerAPI } from "../../services/api";

function JobStatus() {
  const [activeFilter, setActiveFilter] = useState("all");
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setLoading(true);
        setError("");
        const response = await jobSeekerAPI.getMyApplications();
        setApplications(response.data || []);
      } catch (err) {
        console.error("Error fetching applications:", err);
        setError("Failed to load applications");
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  const statusConfig = {
    all: {
      label: "All Applications",
      color: "gray",
      count: applications.length,
    },
    pending: {
      label: "Pending",
      color: "blue",
      count: applications.filter((a) => a.status === "pending").length,
    },
    reviewing: {
      label: "Reviewing",
      color: "yellow",
      count: applications.filter((a) => a.status === "reviewing").length,
    },
    interview: {
      label: "Interview",
      color: "purple",
      count: applications.filter((a) => a.status === "interview").length,
    },
    accepted: {
      label: "Accepted",
      color: "green",
      count: applications.filter((a) => a.status === "accepted").length,
    },
    rejected: {
      label: "Rejected",
      color: "red",
      count: applications.filter((a) => a.status === "rejected").length,
    },
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-blue mx-auto"></div>
          <p className="mt-4 text-neutral-medium">Loading applications...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-700">{error}</p>
      </div>
    );
  }

  const filteredApplications =
    activeFilter === "all"
      ? applications
      : applications.filter((app) => app.status === activeFilter);

  const getStatusBadge = (status) => {
    const colors = {
      pending: "bg-blue-100 text-blue-800",
      reviewing: "bg-yellow-100 text-yellow-800",
      interview: "bg-purple-100 text-purple-800",
      accepted: "bg-green-100 text-green-800",
      rejected: "bg-red-100 text-red-800",
    };
    const labels = {
      pending: "Pending",
      reviewing: "Reviewing",
      interview: "Interview",
      accepted: "Accepted",
      rejected: "Rejected",
    };
    return `badge ${colors[status] || "bg-gray-100 text-gray-800"} ${
      labels[status]
    }`;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Job Applications</h1>
        <p className="text-gray-600 mt-1">
          Track your job applications and interview schedules
        </p>
      </div>

      {/* Status Filters */}
      <div className="flex flex-wrap gap-3">
        {Object.entries(statusConfig).map(([key, config]) => (
          <button
            key={key}
            onClick={() => setActiveFilter(key)}
            className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
              activeFilter === key
                ? "bg-primary-600 text-white shadow-md"
                : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-300"
            }`}
          >
            {config.label}
            <span
              className={`ml-2 px-2 py-1 rounded-full text-xs ${
                activeFilter === key ? "bg-white/20" : "bg-gray-100"
              }`}
            >
              {config.count}
            </span>
          </button>
        ))}
      </div>

      {/* Applications List */}
      <div className="space-y-4">
        {filteredApplications.length === 0 ? (
          <div className="card p-12 text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-10 h-10 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              No applications found
            </h3>
            <p className="text-gray-600 mb-6">
              Start applying to jobs to see your applications here
            </p>
            <Link to="/candidate" className="btn-primary inline-block">
              Browse Jobs
            </Link>
          </div>
        ) : (
          filteredApplications.map((app) => (
            <div
              key={app._id}
              className="card p-6 hover:shadow-lg transition-shadow duration-200"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start space-x-4 flex-1">
                  <div className="w-14 h-14 bg-gradient-to-br from-primary-400 to-secondary-400 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">
                    {app.job?.company?.logoUrl ? (
                      <img
                        src={app.job.company.logoUrl}
                        alt={app.job.company.companyName}
                        className="w-full h-full object-cover rounded-xl"
                      />
                    ) : (
                      <span>🏢</span>
                    )}
                  </div>
                  <div className="flex-1">
                    <Link
                      to={`/candidate/jobs/${app.job?._id}`}
                      className="text-xl font-bold text-gray-900 hover:text-primary-600 transition-colors duration-200"
                    >
                      {app.job?.title || "Job Title"}
                    </Link>
                    <p className="text-gray-700 font-medium">
                      {app.job?.company?.companyName || "Company"}
                    </p>
                    <div className="flex flex-wrap gap-3 mt-2 text-sm text-gray-600">
                      <span className="flex items-center space-x-1">
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                          />
                        </svg>
                        <span>{app.job?.location || "Location"}</span>
                      </span>
                      <span>•</span>
                      <span>
                        {app.job?.salaryRange?.min && app.job?.salaryRange?.max
                          ? `$${app.job.salaryRange.min.toLocaleString()} - $${app.job.salaryRange.max.toLocaleString()}`
                          : "Salary not specified"}
                      </span>
                      <span>•</span>
                      <span>
                        Applied {new Date(app.appliedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
                <span className={getStatusBadge(app.status)}>
                  {statusConfig[app.status]?.label}
                </span>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <svg
                    className="w-5 h-5 text-gray-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span className="text-sm text-gray-700 font-medium">
                    {app.notes || "Application submitted successfully"}
                  </span>
                </div>
                <div className="flex space-x-2">
                  <Link
                    to={`/candidate/jobs/${app.job?._id}`}
                    className="px-4 py-2 text-primary-600 hover:bg-primary-50 font-medium rounded-lg transition-colors duration-200"
                  >
                    View Job
                  </Link>
                  {app.status === "interview" && (
                    <button className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors duration-200">
                      Join Interview
                    </button>
                  )}
                  {app.status === "accepted" && (
                    <button className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors duration-200">
                      View Offer
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default JobStatus;
