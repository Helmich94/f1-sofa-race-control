import logo from "../../components/branding/logo.svg";
import { FcGoogle } from "react-icons/fc";
import { useRef, useState } from "react";
import { signInAnonymously, signInWithPopup } from "firebase/auth";

import { auth, googleProvider } from "../../firebase/config";

import "../../styles/login.css";

type LoginMethod = "google" | "guest" | null;

export default function LoginCard() {
  const [loadingMethod, setLoadingMethod] =
    useState<LoginMethod>(null);

  const [error, setError] = useState("");

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const startAmbience = async () => {
  if (!audioRef.current) return;

  audioRef.current.volume = 0.1;

  try {
    await audioRef.current.play();
  } catch (error) {
    console.warn("Audio kon niet worden gestart:", error);
  }
};

  const handleGoogleLogin = async () => {
    try {
    await startAmbience();
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
     <div className="brand-mark">
  <img
    src={logo}
    alt="F1 Sofa Race Control"
    className="brand-logo"
  />
</div>

      <h1 className="login-title">
        
        <br />
        <span className="login-title-accent">
          
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

      <audio
        ref={audioRef}
        src="/audio/pitlane-ambience.mp3"
        loop
        preload="auto"
      />
    </section>
  );
}