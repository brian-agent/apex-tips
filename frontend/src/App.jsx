import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

import { supabase } from "./lib/supabase";
import AppNavbar from "./components/Navbar";
import PaymentModal from "./components/PaymentModal";

import Home from "./pages/Home";
import Games from "./pages/Games";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Account from "./pages/Account";

function ProtectedRoute({ user, children }) {
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

export default function App() {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [showPayment, setShowPayment] = useState(false);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data }) => {
      setUser(data?.session?.user ?? null);
      setAuthLoading(false);
    });

    // Listen for auth changes
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  if (authLoading) return null;

  return (
    <BrowserRouter>
      <AppNavbar user={user} onPayClick={() => setShowPayment(true)} />

      <PaymentModal
        show={showPayment}
        onHide={() => setShowPayment(false)}
      />

      <Routes>
        <Route path="/" element={<Home onPayClick={() => setShowPayment(true)} />} />
        <Route path="/games" element={<Games onPayClick={() => setShowPayment(true)} />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/account"
          element={
            <ProtectedRoute user={user}>
              <Account user={user} onPayClick={() => setShowPayment(true)} />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
