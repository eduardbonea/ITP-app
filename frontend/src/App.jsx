// src/App.jsx

import { useState } from 'react';
import MainApp from './MainApp';      
import LoginPage from './LoginPage';  
import SignUpPage from './SignUpPage'; // Import the new component

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  // New state to control auth view: 'login' or 'signup'
  const [authView, setAuthView] = useState('login');
  
  // New state to show a success message on the login page after signup
  const [signUpSuccess, setSignUpSuccess] = useState(null);

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
  };

  // This runs when signup is successful
  const handleSignUpSuccess = () => {
    setAuthView('login'); // Switch back to the login view
    setSignUpSuccess('Account created successfully!');
  };

  const handleNavigateToSignUp = () => {
    setAuthView('signup');
    setSignUpSuccess(null); // Clear success message when navigating
  };

  const handleNavigateToLogin = () => {
    setAuthView('login');
    setSignUpSuccess(null); // Clear success message
  };

  return (
    <>
      {isLoggedIn ? (
        // If logged in, show the main application
        <MainApp />
      ) : (
        // If not logged in, show either Login or SignUp
        authView === 'login' ? (
          <LoginPage 
            onLoginSuccess={handleLoginSuccess}
            onNavigateToSignUp={handleNavigateToSignUp}
            successMessage={signUpSuccess} // Pass the success message
          />
        ) : (
          <SignUpPage 
            onSignUpSuccess={handleSignUpSuccess}
            onNavigateToLogin={handleNavigateToLogin}
          />
        )
      )}
    </>
  );
}