import { useEffect, useState } from "react";
import type { User } from "firebase/auth";
import { onAuthStateChanged, signOut } from "firebase/auth";

import { auth } from "./firebase/config";
import Login from "./pages/Login";

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

  return (
    <main className="login-page">
      <section className="login-card">
        <div className="brand-mark" aria-hidden="true">
          <span>F1</span>
        </div>

        <h1 className="login-title">
          Welkom
          <br />
          <span className="login-title-accent">
            {user.isAnonymous
              ? "Gastcoureur"
              : user.displayName ?? "Coureur"}
          </span>
        </h1>

        <p className="login-subtitle">
          Je bent succesvol ingelogd bij F1 Sofa Race Control.
        </p>

        {!user.isAnonymous && user.email && (
          <p className="login-subtitle">{user.email}</p>
        )}

        <button
          className="login-button login-button-secondary"
          type="button"
          onClick={() => signOut(auth)}
        >
          Uitloggen
        </button>
      </section>
    </main>
  );
}