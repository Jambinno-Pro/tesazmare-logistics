"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import {
  Star,
  ArrowLeft,
  Send,
  CheckCircle2,
  MessageSquareText,
  ShieldCheck,
} from "lucide-react";
import "./review.css";

const API_BASE_URL = (() => {
  const base = (
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:5050"
  ).replace(/\/+$/, "");

  return base.endsWith("/api") ? base : `${base}/api`;
})();

export default function ReviewPage() {
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [hoverRating, setHoverRating] = useState(0);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    const name = customerName.trim();
    const message = comment.trim();

    if (!name) {
      setError("Please enter your name.");
      return;
    }

    if (rating < 1 || rating > 5) {
      setError("Please select a star rating.");
      return;
    }

    if (message.length < 10) {
      setError("Please write at least 10 characters about your experience.");
      return;
    }

    if (message.length > 2000) {
      setError("Your review cannot exceed 2,000 characters.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          customerName: name,
          customerEmail: customerEmail.trim() || null,
          rating,
          comment: message,
        }),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        if (response.status === 400) {
          throw new Error(
            data?.message || "Please check your details and try again.",
          );
        }

        throw new Error(
          data?.message || "We could not submit your review. Please try again.",
        );
      }

      setSuccess(true);
      setCustomerName("");
      setCustomerEmail("");
      setRating(0);
      setComment("");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to connect to the review service. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <main className="review-page">
        <div className="review-page-container">
          <div className="review-success-card">
            <div className="review-success-icon">
              <CheckCircle2 size={42} />
            </div>

            <span className="review-page-eyebrow">THANK YOU</span>

            <h1>Your feedback means a lot to us.</h1>

            <p>
              Your review has been successfully submitted to TESAZMARE
              Logistics. It will be visible on our website once our team has
              reviewed and approved it.
            </p>

            <div className="review-success-note">
              <ShieldCheck size={19} />
              <span>
                Your review has been received and is awaiting approval.
              </span>
            </div>

            <div className="review-success-actions">
              <Link href="/" className="review-submit-button">
                Back to Home
              </Link>

              <button
                type="button"
                className="review-another-button"
                onClick={() => setSuccess(false)}
              >
                Submit another review
              </button>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="review-page">
      <div className="review-page-container">
        <Link href="/#reviews" className="review-back-link">
          <ArrowLeft size={17} />
          Back to customer reviews
        </Link>

        <div className="review-form-layout">
          <div className="review-form-intro">
            <div className="review-intro-icon">
              <MessageSquareText size={27} />
            </div>

            <span className="review-page-eyebrow">CUSTOMER EXPERIENCES</span>

            <h1>
              How was your <span>journey?</span>
            </h1>

            <p>
              Your experience matters to us. Tell us how we did and help other
              travellers discover the TESAZMARE Logistics experience.
            </p>

            <div className="review-intro-points">
              <div>
                <CheckCircle2 size={18} />
                <span>Share your honest experience</span>
              </div>

              <div>
                <CheckCircle2 size={18} />
                <span>Rate your journey from 1 to 5 stars</span>
              </div>

              <div>
                <CheckCircle2 size={18} />
                <span>Help us improve our services</span>
              </div>
            </div>
          </div>

          <div className="review-form-card">
            <div className="review-form-heading">
              <span className="review-page-eyebrow">WRITE A REVIEW</span>
              <h2>Share your feedback</h2>
              <p>Fields marked with * are required.</p>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="review-form-group">
                <label htmlFor="customerName">
                  Your name <span>*</span>
                </label>

                <input
                  id="customerName"
                  type="text"
                  placeholder="Enter your full name"
                  value={customerName}
                  onChange={(event) => setCustomerName(event.target.value)}
                  maxLength={100}
                  autoComplete="name"
                  required
                />
              </div>

              <div className="review-form-group">
                <label htmlFor="customerEmail">
                  Email address <small>(Optional)</small>
                </label>

                <input
                  id="customerEmail"
                  type="email"
                  placeholder="Enter your email address"
                  value={customerEmail}
                  onChange={(event) => setCustomerEmail(event.target.value)}
                  maxLength={254}
                  autoComplete="email"
                />
              </div>

              <div className="review-form-group">
                <label>
                  Your rating <span>*</span>
                </label>

                <div
                  className="review-star-selector"
                  onMouseLeave={() => setHoverRating(0)}
                >
                  {[1, 2, 3, 4, 5].map((value) => (
                    <button
                      key={value}
                      type="button"
                      className="review-star-button"
                      onClick={() => setRating(value)}
                      onMouseEnter={() => setHoverRating(value)}
                      aria-label={`Rate ${value} out of 5 stars`}
                      aria-pressed={rating === value}
                    >
                      <Star
                        size={34}
                        fill={
                          value <= (hoverRating || rating)
                            ? "currentColor"
                            : "none"
                        }
                      />
                    </button>
                  ))}

                  <span className="review-rating-label">
                    {rating === 0
                      ? "Select your rating"
                      : rating === 1
                        ? "Poor"
                        : rating === 2
                          ? "Fair"
                          : rating === 3
                            ? "Good"
                            : rating === 4
                              ? "Very good"
                              : "Excellent"}
                  </span>
                </div>
              </div>

              <div className="review-form-group">
                <label htmlFor="comment">
                  Tell us about your experience <span>*</span>
                </label>

                <textarea
                  id="comment"
                  placeholder="How was your journey with TESAZMARE Logistics? Tell us what you liked or what we could improve..."
                  value={comment}
                  onChange={(event) => setComment(event.target.value)}
                  minLength={10}
                  maxLength={2000}
                  rows={6}
                  required
                />

                <div className="review-character-count">
                  {comment.length}/2000 characters
                </div>
              </div>

              {error && (
                <div className="review-form-error" role="alert">
                  {error}
                </div>
              )}

              <button
                type="submit"
                className="review-submit-button"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="review-loading-spinner" />
                    Submitting review...
                  </>
                ) : (
                  <>
                    Submit your review
                    <Send size={17} />
                  </>
                )}
              </button>

              <div className="review-privacy-note">
                <ShieldCheck size={17} />
                <p>
                  Your feedback is submitted for review before being published
                  on our website.
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
