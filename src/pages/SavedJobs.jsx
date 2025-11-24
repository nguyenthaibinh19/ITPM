import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

function SavedJobs() {
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSavedJobs();
  }, []);

  const fetchSavedJobs = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "http://localhost:5001/api/js/saved-jobs",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = response.data?.data || [];
      setSavedJobs(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching saved jobs:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUnsave = async (jobId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5001/api/js/saved-jobs/${jobId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSavedJobs(savedJobs.filter((item) => item.job?._id !== jobId));
    } catch (error) {
      console.error("Error unsaving job:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Link
            to="/"
            className="text-indigo-600 hover:text-indigo-700 font-medium"
          >
            ← Back to Home
          </Link>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-6">Saved Jobs</h1>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        ) : savedJobs.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <svg
              className="w-16 h-16 text-gray-400 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No saved jobs yet
            </h3>
            <p className="text-gray-600 mb-6">
              Start exploring and save jobs you're interested in
            </p>
            <Link
              to="/"
              className="inline-block px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700"
            >
              Browse Jobs
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {savedJobs.map((item) => {
              const job = item.job || {};
              return (
                <div
                  key={item._id}
                  className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <Link
                        to={`/jobs/${job._id}`}
                        className="text-xl font-bold text-gray-900 hover:text-indigo-600"
                      >
                        {job.title}
                      </Link>
                      <p className="text-gray-600 mt-1">
                        {job.company?.companyName || "Company"}
                      </p>
                      <div className="flex items-center space-x-4 mt-3 text-sm text-gray-600">
                        <span>📍 {job.location?.city || "Remote"}</span>
                        <span>💼 {job.jobType}</span>
                        <span>⏱ {job.workMode}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleUnsave(job._id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <svg
                        className="w-6 h-6"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default SavedJobs;
