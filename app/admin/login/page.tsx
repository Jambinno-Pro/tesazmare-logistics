"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  ShieldCheck,
} from "lucide-react";

import "./login.css";

export default function AdminLoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "same-origin",
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Invalid email or password.");
        return;
      }

      router.replace("/admin");
      router.refresh();
    } catch {
      setError("Unable to connect to the authentication server.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="tes-login">
      {/* LEFT: BRANDING AND IMAGE */}

      <section className="tes-login-visual">
        <div className="tes-login-photo" />
        <div className="tes-login-overlay" />

        <div className="tes-login-brand">
          <div className="tes-login-logo">
            <ShieldCheck size={25} />
          </div>

          <div>
            <h1>TESAZMARE</h1>
            <span>LOGISTICS</span>
          </div>
        </div>

        <div className="tes-login-message">
          <span className="tes-login-eyebrow">ADMINISTRATION PORTAL</span>

          <h2>
            Moving people.
            <br />
            Managing excellence.
          </h2>

          <p>
            Welcome to the TESAZMARE Logistics administration platform. Manage
            your bookings, pricing, customer enquiries and operations from one
            secure location.
          </p>

          <div className="tes-login-visual-footer">
            <span className="tes-login-status-dot" />
            Secure administrator access
          </div>
        </div>

        <div className="tes-login-visual-copyright">
          © 2026 TESAZMARE Logistics. All rights reserved.
        </div>
      </section>

      {/* RIGHT: LOGIN FORM */}

      <section className="tes-login-content">
        <div className="tes-login-mobile-brand">
          <div className="tes-login-logo">
            <ShieldCheck size={24} />
          </div>

          <div>
            <h1>TESAZMARE</h1>
            <span>LOGISTICS</span>
          </div>
        </div>

        <div className="tes-login-card">
          <div className="tes-login-card-heading">
            <span className="tes-login-small-label">ACCOUNT ACCESS</span>

            <h2>Welcome back</h2>

            <p>
              Sign in with your administrator credentials to continue to your
              dashboard.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="tes-login-form">
            {/* EMAIL FIELD */}

            <div className="tes-login-field">
              <label htmlFor="login-email">Email address</label>

              <div className="tes-login-input-wrap">
                <Mail size={18} />

                <input
                  id="login-email"
                  type="email"
                  autoComplete="username"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                />
              </div>
            </div>

            {/* PASSWORD FIELD */}

            <div className="tes-login-field">
              <label htmlFor="login-password">Password</label>

              <div className="tes-login-input-wrap">
                <LockKeyhole size={18} />

                <input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                />

                <button
                  type="button"
                  className="tes-login-password-toggle"
                  onClick={() => setShowPassword((current) => !current)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* ERROR */}

            {error && (
              <div className="tes-login-error" role="alert">
                {error}
              </div>
            )}

            {/* SUBMIT BUTTON */}

            <button
              type="submit"
              className="tes-login-submit"
              disabled={loading}
            >
              <span>{loading ? "Signing in..." : "Sign in to dashboard"}</span>

              {!loading && <ArrowRight size={18} />}
            </button>
          </form>

          <div className="tes-login-security">
            <ShieldCheck size={19} />

            <p>
              This portal is restricted to authorised TESAZMARE Logistics
              administrators.
            </p>
          </div>
        </div>

        <div className="tes-login-content-footer">
          © 2026 TESAZMARE Logistics
        </div>
      </section>
    </main>
  );
}
