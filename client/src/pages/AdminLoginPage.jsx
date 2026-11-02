import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { onAuthStateChanged, signInWithEmailAndPassword } from "firebase/auth";
import { ownerAuth, firebaseIsConfigured } from "../firebase.js";

export default function AdminLoginPage() {
  const goTo = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [problem, setProblem] = useState("");
  const [isSigningIn, setIsSigningIn] = useState(false);

  useEffect(() => {
    if (!ownerAuth) return undefined;
    return onAuthStateChanged(ownerAuth, (person) => {
      if (person) goTo("/admin");
    });
  }, [goTo]);

  async function handleSignIn(event) {
    event.preventDefault();
    setProblem("");
    setIsSigningIn(true);
    try {
      await signInWithEmailAndPassword(ownerAuth, email, password);
      goTo("/admin");
    } catch {
      setProblem("That email and password did not match.");
    } finally {
      setIsSigningIn(false);
    }
  }

  if (!firebaseIsConfigured) {
    return (
      <main className="adminLoginBox">
        <h1>Admin sign in</h1>
        <p className="messageBar messageBad">
          Firebase is not set up yet. Fill in client/.env (see client/.env) and
          restart.
        </p>
        <Link className="outlineButton" to="/">
          Back to the site
        </Link>
      </main>
    );
  }

  return (
    <form className="adminLoginBox" onSubmit={handleSignIn}>
      <h1>Admin sign in</h1>
      <div className="fieldGroup">
        <label htmlFor="ownerEmail">Email</label>
        <input
          id="ownerEmail"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="username"
        />
      </div>
      <div className="fieldGroup">
        <label htmlFor="ownerPassword">Password</label>
        <input
          id="ownerPassword"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="current-password"
        />
      </div>
      {problem && <p className="messageBar messageBad">{problem}</p>}
      <button type="submit" className="solidButton" disabled={isSigningIn}>
        {isSigningIn ? "Signing in..." : "Sign in"}
      </button>
      <Link className="outlineButton" to="/">
        Back to the site
      </Link>
    </form>
  );
}
