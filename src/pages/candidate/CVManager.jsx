import { useState, useEffect } from "react";
import { jobSeekerAPI } from "../../services/api";

function CVManager() {
  const [isDragging, setIsDragging] = useState(false);
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchResumes();
  }, []);

  const fetchResumes = async () => {
    try {
      setLoading(true);
      const response = await jobSeekerAPI.getResumes();
      setResumes(response.data || []);
    } catch (error) {
      console.error("Error fetching resumes:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    await uploadFiles(files);
  };

  const handleFileSelect = async (e) => {
    const files = Array.from(e.target.files);
    await uploadFiles(files);
  };

  const uploadFiles = async (files) => {
    for (const file of files) {
      if (!file.type.match(/pdf|msword|vnd.openxmlformats/)) {
        alert(`${file.name}: Only PDF, DOC, DOCX files are allowed`);
        continue;
      }
      if (file.size > 5 * 1024 * 1024) {
        alert(`${file.name}: File size must be less than 5MB`);
        continue;
      }

      try {
        setUploading(true);
        const formData = new FormData();
        formData.append("resume", file);

        await jobSeekerAPI.uploadResume(formData);
        await fetchResumes(); // Refresh list
      } catch (error) {
        console.error("Error uploading:", error);
        alert(
          `Failed to upload ${file.name}: ${
            error.response?.data?.message || error.message
          }`
        );
      } finally {
        setUploading(false);
      }
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this CV?")) return;

    try {
      await jobSeekerAPI.deleteResume(id);
      await fetchResumes();
    } catch (error) {
      console.error("Error deleting resume:", error);
      alert("Failed to delete CV");
    }
  };

  const handleDownload = (resume) => {
    if (resume.fileUrl) {
      window.open(resume.fileUrl, "_blank");
    }
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return "N/A";
    const kb = bytes / 1024;
    if (kb < 1024) return `${kb.toFixed(0)} KB`;
    return `${(kb / 1024).toFixed(1)} MB`;
  };

  const formatDate = (date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">CV Manager</h1>
          <p className="text-gray-600 mt-1">
            Upload and manage your CVs for job applications
          </p>
        </div>
      </div>

      {/* Upload Area */}
      <div
        className={`card p-12 text-center transition-all duration-200 ${
          isDragging
            ? "border-2 border-primary-500 bg-primary-50"
            : "border-2 border-dashed border-gray-300"
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="max-w-md mx-auto">
          <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-10 h-10 text-primary-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">
            Drag & drop your CV here
          </h3>
          <p className="text-sm text-gray-600 mb-6">
            PDF, DOC, DOCX files up to 5MB
          </p>
          <label className="btn-primary cursor-pointer inline-block">
            <input
              type="file"
              className="hidden"
              accept=".pdf,.doc,.docx"
              onChange={handleFileSelect}
              multiple
              disabled={uploading}
            />
            {uploading ? "Uploading..." : "Upload CV"}
          </label>
        </div>
      </div>

      {/* My Resumes */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">
            My Resumes ({resumes.length})
          </h2>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        ) : resumes.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <p>No CVs uploaded yet. Upload your first CV above!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {resumes.map((resume) => (
              <div
                key={resume.id}
                className="flex items-center justify-between p-6 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors duration-200"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                    <svg
                      className="w-6 h-6 text-red-600"
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
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="font-semibold text-gray-900">
                        {resume.fileName || resume.name || "Untitled CV"}
                      </h3>
                      {resume.isDefault && (
                        <span className="badge badge-primary text-xs">
                          Default
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">
                      Uploaded{" "}
                      {formatDate(resume.uploadedAt || resume.createdAt)} •{" "}
                      {formatFileSize(resume.fileSize || resume.size)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleDownload(resume)}
                    className="p-2 text-gray-600 hover:text-green-600 hover:bg-white rounded-lg transition-colors duration-200"
                    title="Download"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                      />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleDelete(resume._id)}
                    className="p-2 text-gray-600 hover:text-red-600 hover:bg-white rounded-lg transition-colors duration-200"
                    title="Delete"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Tips Card */}
      <div className="card p-6 bg-gradient-to-br from-primary-50 to-secondary-50">
        <div className="flex items-start space-x-4">
          <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center flex-shrink-0">
            <span className="text-2xl">💡</span>
          </div>
          <div>
            <h3 className="font-bold text-gray-900 mb-2">
              Tips for a great CV
            </h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start space-x-2">
                <span className="text-primary-600 mt-1">•</span>
                <span>Keep your CV concise and relevant (1-2 pages)</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-primary-600 mt-1">•</span>
                <span>
                  Highlight your achievements with quantifiable results
                </span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-primary-600 mt-1">•</span>
                <span>Tailor your CV for each job application</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-primary-600 mt-1">•</span>
                <span>Use PDF format for compatibility</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CVManager;
