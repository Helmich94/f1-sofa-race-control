import { FcGoogle } from "react-icons/fc";
import { useState } from "react";
import { signInAnonymously, signInWithPopup } from "firebase/auth";

import { auth, googleProvider } from "../../firebase/config";

import "../../styles/login.css";

type LoginMethod = "google" | "guest" | null;

export default function LoginCard() {
  const [loadingMethod, setLoadingMethod] =
    useState<LoginMethod>(null);

  const [error, setError] = useState("");

  const handleGoogleLogin = async () => {
    try {
      setError("");
      setLoadingMethod("google");

      await signInWithPopup(auth, googleProvider);
    } catch (loginError) {
      console.error(loginError);
      setError(
        "Inloggen met Google is niet gelukt. Probeer het opnieuw."
      );
    } finally {
      setLoadingMethod(null);
    }
  };

  const handleGuestLogin = async () => {
    try {
      setError("");
      setLoadingMethod("guest");

      await signInAnonymously(auth);
    } catch (loginError) {
      console.error(loginError);
      setError(
        "Doorgaan als gast is niet gelukt. Probeer het opnieuw."
      );
    } finally {
      setLoadingMethod(null);
    }
  };

  const isLoading = loadingMethod !== null;

  return (
    <section className="login-card">
      <div className="brand-mark" aria-hidden="true">
        <span>F1</span>
      </div>

      <h1 className="login-title">
        F1 Sofa
        <br />
        <span className="login-title-accent">
          Race Control
        </span>
      </h1>

      <p className="login-subtitle">
        Voorspel de race, strijd tegen vrienden en beleef ieder
        Grand Prix-weekend vanuit je eigen racecentrum.
      </p>

      <div className="login-actions">
        <button
          className="login-button login-button-primary"
          type="button"
          onClick={handleGoogleLogin}
          disabled={isLoading}
        >
         <FcGoogle className="google-icon" />

          {loadingMethod === "google"
            ? "Google openen..."
            : "Doorgaan met Google"}
        </button>

        <div className="login-divider">of</div>

        <button
          className="login-button login-button-secondary"
          type="button"
          onClick={handleGuestLogin}
          disabled={isLoading}
        >
          {loadingMethod === "guest"
            ? "Gastaccount starten..."
            : "Doorgaan als gast"}
        </button>
      </div>

      {error && (
        <p className="login-error">
          {error}
        </p>
      )}

      <p className="login-footer">
        <span className="login-status">
          <span className="login-status-dot" />
          Race Control online
        </span>
      </p>
    </section>
  );
}
