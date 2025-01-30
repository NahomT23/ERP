import { useState } from "react";

function App() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  
    if (!username || !password || !email) {
      setError("All fields are required");
      return;
    }
  
    try {
      setLoading(true);
      setError(""); 
  
      // const response = await fetch("http://localhost:3000/auth/signup", {
        const response = await fetch("/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          email,
          password,
        }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        alert("Signup successful!");

      } else {
        setError(data.message || "Something went wrong");
      }
    } catch (err) {
      setError("Server error, please try again.");
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <>
      <div className="flex items-center justify-center">
        <form onSubmit={handleSignup} className="space-y-4">
          <p className="font-bold">Username</p>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="border px-3 py-2"
          />

          <p className="font-bold">Email</p>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border px-3 py-2"
          />

          <p className="font-bold">Password</p>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border px-3 py-2"
          />

          {error && <p className="text-red-500">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-500 text-white py-2 px-4 rounded"
          >
            {loading ? "Submitting..." : "Submit"}
          </button>
        </form>
      </div>
    </>
  );
}

export default App;
