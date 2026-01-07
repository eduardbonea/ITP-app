import { useState } from "react";
import MainApp, { API_URL } from "./MainApp";
import LoginPage from "./LoginPage";
import SignUpPage from "./SignUpPage";

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authView, setAuthView] = useState("login");
  const [signUpSuccess, setSignUpSuccess] = useState(null);

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
  };

  const handleSignUpSuccess = () => {
    setAuthView("login");
    setSignUpSuccess("Cont creat cu succes!");
  };

  const handleNavigateToSignUp = () => {
    setAuthView("signup");
    setSignUpSuccess(null);
  };

  const handleNavigateToLogin = () => {
    setAuthView("login");
    setSignUpSuccess(null);
  };

  return (
    <>
      {isLoggedIn ? (
        <MainApp />
      ) : authView === "login" ? (
        <LoginPage
          onLoginSuccess={handleLoginSuccess}
          onNavigateToSignUp={handleNavigateToSignUp}
          successMessage={signUpSuccess}
          apiUrl={API_URL}
        />
      ) : (
        <SignUpPage
          onSignUpSuccess={handleSignUpSuccess}
          onNavigateToLogin={handleNavigateToLogin}
          apiUrl={API_URL}
        />
      )}
    </>
  );
}
