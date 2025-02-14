import { useState } from "react";
import axios from "axios";

const CreateCompany = () => {
  const [companyName, setCompanyName] = useState("");
  const [adminEmail, setAdminEmail] = useState("");
  const [adminUsername, setAdminUsername] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [error, setError] = useState<string | null>(null); // Error message state
  const [success, setSuccess] = useState<string | null>(null); // Success message state

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      // Send a POST request to the backend API
      const response = await axios.post("http://localhost:5000/auth/admin/create-company", {
        companyName,
        adminEmail,
        adminUsername,
        adminPassword,
      });

      // Show success message
      setSuccess(response.data.message);
    } catch (err: any) {
      // Extract error message from the response or fallback to a generic message
      setError(err.response?.data?.message || err.message || "An unexpected error occurred");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold text-center mb-6">Create Company and Admin</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Company Name Input */}
          <input
            type="text"
            placeholder="Company Name"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            required
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          {/* Admin Email Input */}
          <input
            type="email"
            placeholder="Admin Email"
            value={adminEmail}
            onChange={(e) => setAdminEmail(e.target.value)}
            required
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          {/* Admin Username Input */}
          <input
            type="text"
            placeholder="Admin Username"
            value={adminUsername}
            onChange={(e) => setAdminUsername(e.target.value)}
            required
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          {/* Admin Password Input */}
          <input
            type="password"
            placeholder="Admin Password"
            value={adminPassword}
            onChange={(e) => setAdminPassword(e.target.value)}
            required
            minLength={6} // Enforce minimum password length
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
          >
            Create Company and Admin
          </button>
        </form>

        {/* Render the error message */}
        {error && <p className="mt-4 text-red-500 text-sm text-center">{error}</p>}

        {/* Render the success message */}
        {success && <p className="mt-4 text-green-500 text-sm text-center">{success}</p>}
      </div>
    </div>
  );
};

export default CreateCompany;