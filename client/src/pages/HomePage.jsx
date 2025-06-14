import { useAuth } from "../hooks/AuthContext";

const HomePage = () => {
  const { user } = useAuth();
  return (
    <div className="text-center p-10">
      <h1 className="text-4xl font-bold mb-4">Welcome to the Home Page</h1>
      {user ? (
        <p className="text-lg text-gray-700">
          You are logged in and can see this content.
        </p>
      ) : (
        <p className="text-lg text-gray-700">
          Please log in or sign up to get started.
        </p>
      )}
    </div>
  );
}

export default HomePage;
