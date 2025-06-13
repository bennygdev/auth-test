import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/AuthContext';
import axios from 'axios';

function Register() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await axios.post(
        "http://localhost:8080/api/users/register",
        formData
      );
      login(res.data.user, res.data.token);
      navigate("/");
    } catch (err) {
      const errorMsg =
        err.response?.data?.msg ||
        err.response?.data?.errors?.[0]?.msg ||
        "Registration failed";
      setError(errorMsg);
      console.error(err.response);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-8 border border-gray-200 rounded-lg shadow-lg bg-white">
      <h2 className="text-2xl font-bold text-center mb-6">Create an Account</h2>
      <form onSubmit={handleSubmit}>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <div className="mb-4">
          <input
            type="text"
            name="firstName"
            placeholder="First Name"
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-200 rounded-md focus:outline-none"
          />
        </div>
        <div className="mb-4">
          <input
            type="text"
            name="lastName"
            placeholder="Last Name"
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-200 rounded-md focus:outline-none"
          />
        </div>
        <div className="mb-4">
          <input
            type="text"
            name="username"
            placeholder="Username"
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-200 rounded-md focus:outline-none"
          />
        </div>
        <div className="mb-4">
          <input
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-200 rounded-md focus:outline-none"
          />
        </div>
        <div className="mb-6">
          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-black text-white py-2 rounded-md font-semibold"
        >
          Register
        </button>
      </form>
    </div>
  );
}

export default Register;