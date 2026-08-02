import { useEffect, useState } from "react";
import type { User } from "firebase/auth";
import { onAuthStateChanged } from "firebase/auth";

import { auth } from "./firebase/config";
import Login from "./pages/Login";
import HomePage from "./pages/HomePage";

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);
    });

    return unsubscribe;
  }, []);

  if (authLoading) {
    return (
      <main className="login-page">
        <p style={{ color: "#ffffff" }}>Race Control laden...</p>
      </main>
    );
  }

  if (!user) {
    return <Login />;
  }

  return <HomePage />;
}