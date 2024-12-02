import React, { useState, useEffect } from "react";
import Login from "./pages/login";
import Register from "./pages/register";
import Home from "./pages/home";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState("");
  const [isLogin, setIsLogin] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user.name) {
      setIsAuthenticated(true);
      setUsername(user.name);
    }
  }, []);

  const handleLogin = (user) => {
    setIsAuthenticated(true);
    setUsername(user.name);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUsername("");
    localStorage.removeItem("user"); // Remove user data from local storage
    localStorage.removeItem("token"); // Remove token from local storage
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      {isAuthenticated ? (
        <div className="w-full max-w-screen-xl bg-white shadow-lg rounded-lg p-6">
          <Home username={username} onLogout={handleLogout} />
        </div>
      ) : (
        <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-6">
          {isLogin ? <Login onLogin={handleLogin} /> : <Register onRegister={handleLogin} />}
          <div className="text-center mt-4">
            {isLogin ? (
              <p>
                Don't have an account?{" "}
                <button
                  onClick={() => setIsLogin(false)}
                  className="text-blue-500 hover:underline"
                >
                  Register
                </button>
              </p>
            ) : (
              <p>
                Already have an account?{" "}
                <button
                  onClick={() => setIsLogin(true)}
                  className="text-blue-500 hover:underline"
                >
                  Login
                </button>
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
