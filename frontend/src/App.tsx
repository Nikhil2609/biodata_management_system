import React, { useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { useAppDispatch } from './app/hooks';
import { checkAuth } from './features/auth/authSlice';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { AppRoutes } from './routes/AppRoutes';

export const App: React.FC = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    // If token exists, verify session on app load
    if (localStorage.getItem('biodata_token')) {
      dispatch(checkAuth());
    }
  }, [dispatch]);

  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-stone-50 font-sans selection:bg-orange-500 selection:text-white">
        <Navbar />
        <main className="flex-1">
          <AppRoutes />
        </main>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
