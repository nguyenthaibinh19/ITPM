# Frontend Integration Guide

## 🚀 Quick Setup

### 1. Install axios (if not installed)

```bash
npm install axios
```

### 2. Create .env file

```bash
cp .env.example .env
```

Add backend URL:

```env
VITE_API_URL=http://localhost:5000/api
```

### 3. Import API service

The API service is already created at `src/services/api.js`

## 📚 Usage Examples

### Authentication

#### Register

```jsx
import { authAPI, setAuthToken } from "../services/api";

const handleRegister = async (formData) => {
  try {
    const response = await authAPI.register({
      name: formData.name,
      email: formData.email,
      password: formData.password,
      role: "js", // or 'employer'
    });

    if (response.success) {
      setAuthToken(response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data));
      // Redirect to dashboard
    }
  } catch (error) {
    console.error("Registration failed:", error.message);
  }
};
```

#### Login

```jsx
const handleLogin = async (email, password) => {
  try {
    const response = await authAPI.login({ email, password });

    if (response.success) {
      setAuthToken(response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      // Redirect based on role
      if (response.data.user.role === "js") {
        navigate("/candidate/dashboard");
      } else {
        navigate("/employer/dashboard");
      }
    }
  } catch (error) {
    console.error("Login failed:", error.message);
  }
};
```

### Job Seeker - Profile Management

#### Get Profile

```jsx
import { jobSeekerAPI } from "../services/api";

const fetchProfile = async () => {
  try {
    const response = await jobSeekerAPI.getMyProfile();
    if (response.success) {
      setProfile(response.data);
    }
  } catch (error) {
    console.error("Error fetching profile:", error.message);
  }
};
```

#### Update Basic Info

```jsx
const updateProfile = async (data) => {
  try {
    const response = await jobSeekerAPI.updateBasicInfo(data);
    if (response.success) {
      alert("Profile updated successfully!");
    }
  } catch (error) {
    console.error("Error updating profile:", error.message);
  }
};
```

#### Add Experience

```jsx
const addExperience = async (experienceData) => {
  try {
    const response = await jobSeekerAPI.addExperience({
      companyName: experienceData.company,
      position: experienceData.position,
      startDate: experienceData.startDate,
      endDate: experienceData.endDate,
      isCurrent: experienceData.isCurrent,
      description: experienceData.description,
    });

    if (response.success) {
      alert("Experience added successfully!");
      // Refresh profile
      fetchProfile();
    }
  } catch (error) {
    console.error("Error adding experience:", error.message);
  }
};
```

#### Upload Resume

```jsx
const uploadResume = async (file) => {
  try {
    const formData = new FormData();
    formData.append("resume", file);

    const response = await jobSeekerAPI.uploadResume(formData);

    if (response.success) {
      alert("Resume uploaded successfully!");
    }
  } catch (error) {
    console.error("Error uploading resume:", error.message);
  }
};
```

### Job Search & Application

#### Search Jobs

```jsx
const searchJobs = async (filters) => {
  try {
    const response = await jobSeekerAPI.searchJobs({
      keyword: filters.keyword,
      location: filters.location,
      jobType: filters.jobType,
      page: filters.page || 1,
      limit: filters.limit || 10,
    });

    if (response.success) {
      setJobs(response.data.data);
      setPagination(response.data.pagination);
    }
  } catch (error) {
    console.error("Error searching jobs:", error.message);
  }
};
```

#### Apply for Job

```jsx
const applyForJob = async (jobId, resumeId, coverLetter) => {
  try {
    const response = await jobSeekerAPI.applyForJob(jobId, {
      resumeId,
      coverLetter,
    });

    if (response.success) {
      alert("Application submitted successfully!");
    }
  } catch (error) {
    console.error("Error applying for job:", error.message);
  }
};
```

#### Save Job

```jsx
const saveJob = async (jobId) => {
  try {
    const response = await jobSeekerAPI.saveJob({ jobId });

    if (response.success) {
      alert("Job saved successfully!");
    }
  } catch (error) {
    console.error("Error saving job:", error.message);
  }
};
```

### Employer - Job Management

#### Create Company Profile

```jsx
import { employerAPI } from "../services/api";

const createCompany = async (companyData) => {
  try {
    const response = await employerAPI.createCompanyProfile({
      companyName: companyData.name,
      description: companyData.description,
      address: companyData.address,
      phone: companyData.phone,
    });

    if (response.success) {
      alert("Company profile created successfully!");
    }
  } catch (error) {
    console.error("Error creating company:", error.message);
  }
};
```

#### Post a Job

```jsx
const postJob = async (jobData) => {
  try {
    const response = await employerAPI.postJob({
      title: jobData.title,
      description: jobData.description,
      requirements: jobData.requirements,
      location: {
        city: jobData.city,
        isRemote: jobData.isRemote,
      },
      salaryRange: {
        min: jobData.salaryMin,
        max: jobData.salaryMax,
        currency: "VND",
      },
      jobType: jobData.jobType,
      deadline: jobData.deadline,
    });

    if (response.success) {
      alert("Job posted successfully!");
    }
  } catch (error) {
    console.error("Error posting job:", error.message);
  }
};
```

#### Get Job Applicants

```jsx
const getApplicants = async (jobId) => {
  try {
    const response = await employerAPI.getJobApplicants(jobId, {
      page: 1,
      limit: 10,
    });

    if (response.success) {
      setApplicants(response.data.data);
    }
  } catch (error) {
    console.error("Error fetching applicants:", error.message);
  }
};
```

## 🔐 Protected Routes

Create a ProtectedRoute component:

```jsx
import { Navigate } from "react-router-dom";
import { isAuthenticated, getAuthToken } from "../services/api";
import { jwtDecode } from "jwt-decode";

const ProtectedRoute = ({ children, requiredRole }) => {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole) {
    const token = getAuthToken();
    const decoded = jwtDecode(token);

    if (decoded.role !== requiredRole) {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;
```

Usage in routes:

```jsx
<Route
  path="/candidate/dashboard"
  element={
    <ProtectedRoute requiredRole="js">
      <CandidateLayout />
    </ProtectedRoute>
  }
/>
```

## 📱 Handle API Responses

The API service already handles:

- ✅ Automatic token injection
- ✅ Automatic error handling
- ✅ Automatic 401 redirect to login

All responses follow this format:

```json
{
  "success": true,
  "message": "Success message",
  "data": { ... }
}
```

Errors are thrown as Error objects with the message from backend.

## 🎨 Example: Complete Job Search Page

```jsx
import { useState, useEffect } from "react";
import { jobSeekerAPI } from "../services/api";

const JobSearchPage = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    keyword: "",
    location: "",
    page: 1,
  });

  useEffect(() => {
    fetchJobs();
  }, [filters]);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const response = await jobSeekerAPI.searchJobs(filters);

      if (response.success) {
        setJobs(response.data.data);
      }
    } catch (error) {
      console.error("Error:", error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (keyword, location) => {
    setFilters({ ...filters, keyword, location, page: 1 });
  };

  return (
    <div>
      <h1>Job Search</h1>
      {/* Search form */}
      {/* Job list */}
      {loading && <p>Loading...</p>}
      {jobs.map((job) => (
        <div key={job._id}>
          <h3>{job.title}</h3>
          <p>{job.company?.companyName}</p>
        </div>
      ))}
    </div>
  );
};
```

## ⚠️ Important Notes

1. **CORS**: Make sure backend CORS is configured correctly
2. **Token**: Token is stored in localStorage and auto-injected
3. **File Upload**: Use FormData for file uploads
4. **Error Handling**: All errors are caught and thrown as Error objects
5. **401 Redirect**: User is automatically redirected to login on 401

## 🐛 Debugging

If API calls fail:

1. Check backend is running: `http://localhost:5000/health`
2. Check CORS settings in backend
3. Check token in localStorage: `localStorage.getItem('token')`
4. Check browser console for errors
5. Use Network tab to see API responses

## 📝 Next Steps

1. Update all pages to use the new API service
2. Add loading states
3. Add error handling UI
4. Add success notifications
5. Test all features end-to-end
