import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/AuthContext";
import axios from "axios";
import SocialButton from "../components/SocialButton";

const Login = () => {
  const { user, loading, login } = useAuth();
  const [formData, setFormData] = useState({ 
    email: "", 
    password: "",
  });
  const [errors, setErrors] = useState("");
  const navigate = useNavigate();

  if (loading) {
    return null; // checking auth status
  }

  if (user) {
    return <Navigate to="/" replace />;
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });

    if (errors[e.target.name] || errors.form) {
      const newErrors = { ...errors };
      delete newErrors[e.target.name];
      delete newErrors.form;
      setErrors(newErrors);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    try {
      const res = await axios.post(
        "http://localhost:8080/api/users/login",
        formData
      );
      login(res.data.user, res.data.token);
      navigate("/");
    } catch (err) {
      const errorData = err.response?.data;
      if (errorData && errorData.errors) {
        // Handle validation errors
        const newErrors = {};
        errorData.errors.forEach(error => {
          newErrors[error.param] = error.msg;
        });
        setErrors(newErrors);
      } else if (errorData && errorData.msg) {
        setErrors({ form: errorData.msg });
      } else {
        setErrors({ form: "Login failed. Please try again." });
      }
      console.error(err.response);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-8 border border-gray-200 rounded-lg shadow-lg bg-white">
      <h2 className="text-2xl font-bold text-center mb-6">Login</h2>
      <form onSubmit={handleSubmit} noValidate>
        {errors.form && <p className="text-red-500 text-center mb-4">{errors.form}</p>}
        <div className="mb-4">
          <input
            type="text"
            name="usernameEmail"
            placeholder="Email or Username"
            onChange={handleChange}
            required
            className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 ${errors.usernameEmail ? 'border-red-500' : 'border-gray-200'}`}
          />
          {errors.usernameEmail && <p className="text-red-500 text-xs mt-1">{errors.usernameEmail}</p>}
        </div>
        <div className="mb-6">
          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            required
            className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 ${errors.password ? 'border-red-500' : 'border-gray-200'}`}
          />
          {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
        </div>
        <button
          type="submit"
          className="w-full bg-black text-white py-2 rounded-md font-semibold"
        >
          Login
        </button>
      </form>

      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-500">Or continue with</span>
        </div>
      </div>
      
      <div className="space-y-3">
        <SocialButton provider="google">
          {/* SVG Icon can be inserted here but i am too lazy */}
          <span className="ml-2">Sign in with Google</span>
        </SocialButton>
      </div>

      <p className="text-center mt-4 text-sm text-gray-600">
        Don't have an account?{" "}
        <Link to="/register" className="text-blue-600 hover:underline">
          Sign up
        </Link>
      </p>
    </div>
  );
}

export default Login;
