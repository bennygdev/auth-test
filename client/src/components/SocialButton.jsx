const SocialButton = ({ provider, children }) => (
  <a 
    href={`http://localhost:8080/api/auth/${provider}`}
    className="flex items-center justify-center w-full px-4 py-2 mt-2 border border-gray-200 rounded-md hover:bg-gray-50"
  >
    {children}
  </a>
);

export default SocialButton;