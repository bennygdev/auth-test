import { useAuth } from "../hooks/AuthContext";

function AuthTestPage() {
  const { user } = useAuth(); // The user object now contains the role

  if (!user) {
    // This should ideally be handled by ProtectedRoute, but as a fallback:
    return <p className="text-center p-10">You must be logged in to view this page.</p>;
  }

  const { role } = user;

  const canSeeGreen = role === 'User' || role === 'Moderator' || role === 'Admin';
  const canSeeBlue = role === 'Moderator' || role === 'Admin';
  const canSeePurple = role === 'Admin';

  return (
    <div className="flex flex-col items-center justify-center p-10">
      <h1 className="text-3xl font-bold mb-8">Role-Based Content</h1>
      <div className="flex space-x-4">
        {canSeeGreen && (
          <div className="w-32 h-32 bg-green-500 rounded-lg flex items-center justify-center text-white font-bold text-lg">
            For Users
          </div>
        )}
        {canSeeBlue && (
          <div className="w-32 h-32 bg-blue-500 rounded-lg flex items-center justify-center text-white font-bold text-lg">
            For Mods
          </div>
        )}
        {canSeePurple && (
          <div className="w-32 h-32 bg-purple-500 rounded-lg flex items-center justify-center text-white font-bold text-lg">
            For Admins
          </div>
        )}
      </div>
      <h2 className="mt-8 text-xl font-semibold">
        Your current role is: <span className="font-bold text-blue-600">{role}</span>
      </h2>
    </div>
  );
}

export default AuthTestPage;