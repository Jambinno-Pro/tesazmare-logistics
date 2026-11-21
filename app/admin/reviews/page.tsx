"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Star,
  Search,
  RefreshCw,
  CheckCircle2,
  XCircle,
  Trash2,
  MessageSquare,
  Clock3,
  Eye,
  X,
} from "lucide-react";
import "./reviews.css";

const API_BASE_URL = (() => {
  const base = (
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:5050"
  ).replace(/\/+$/, "");

  return base.endsWith("/api") ? base : `${base}/api`;
})();

type ReviewStatus = "Pending" | "Approved" | "Rejected";

interface Review {
  id: number;
  customerName: string;
  customerEmail: string | null;
  rating: number;
  comment: string;
  status: ReviewStatus;
  createdAtUtc: string;
  updatedAtUtc?: string | null;
}

const statusOptions = ["All", "Pending", "Approved", "Rejected"];

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-ZA", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function StarRating({ rating, size = 17 }: { rating: number; size?: number }) {
  return (
    <div className="review-stars" aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={size}
          fill={star <= rating ? "currentColor" : "none"}
          className={star <= rating ? "star-filled" : "star-empty"}
        />
      ))}
    </div>
  );
}

function StatusBadge({ status }: { status: ReviewStatus }) {
  return (
    <span className={`review-status review-status-${status.toLowerCase()}`}>
      <span className="review-status-dot" />
      {status}
    </span>
  );
}

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [actionLoading, setActionLoading] = useState<number | null>(null);

  const fetchReviews = useCallback(async (showRefresh = false) => {
    if (showRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    setError("");

    try {
      const response = await fetch(`${API_BASE_URL}/reviews`, {
        method: "GET",
        headers: { Accept: "application/json" },
        credentials: "include",
        cache: "no-store",
      });

      if (response.status === 401 || response.status === 403) {
        throw new Error(
          "Your admin session has expired. Please sign in again.",
        );
      }

      if (!response.ok) {
        throw new Error("Unable to load reviews. Please try again.");
      }

      const data: Review[] = await response.json();
      setReviews(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong while loading reviews.",
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const filteredReviews = useMemo(() => {
    return reviews.filter((review) => {
      const matchesFilter =
        activeFilter === "All" || review.status === activeFilter;

      const term = search.trim().toLowerCase();

      const matchesSearch =
        !term ||
        review.customerName.toLowerCase().includes(term) ||
        review.comment.toLowerCase().includes(term) ||
        (review.customerEmail ?? "").toLowerCase().includes(term);

      return matchesFilter && matchesSearch;
    });
  }, [reviews, activeFilter, search]);

  const approvedReviews = reviews.filter(
    (review) => review.status === "Approved",
  );

  const pendingCount = reviews.filter(
    (review) => review.status === "Pending",
  ).length;

  const rejectedCount = reviews.filter(
    (review) => review.status === "Rejected",
  ).length;

  const averageRating =
    approvedReviews.length > 0
      ? (
          approvedReviews.reduce((total, review) => total + review.rating, 0) /
          approvedReviews.length
        ).toFixed(1)
      : "0.0";

  async function updateStatus(review: Review, status: ReviewStatus) {
    setActionLoading(review.id);
    setError("");

    try {
      const response = await fetch(
        `${API_BASE_URL}/reviews/${review.id}/status`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ status }),
        },
      );

      if (!response.ok) {
        throw new Error(
          response.status === 401 || response.status === 403
            ? "Your admin session has expired."
            : "Unable to update this review.",
        );
      }

      setReviews((current) =>
        current.map((item) =>
          item.id === review.id ? { ...item, status } : item,
        ),
      );

      setSelectedReview((current) =>
        current?.id === review.id ? { ...current, status } : current,
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to update review.");
    } finally {
      setActionLoading(null);
    }
  }

  async function deleteReview(review: Review) {
    const confirmed = window.confirm(
      `Are you sure you want to permanently delete the review from ${review.customerName}?`,
    );

    if (!confirmed) return;

    setActionLoading(review.id);
    setError("");

    try {
      const response = await fetch(`${API_BASE_URL}/reviews/${review.id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error(
          response.status === 401 || response.status === 403
            ? "Your admin session has expired."
            : "Unable to delete this review.",
        );
      }

      setReviews((current) => current.filter((item) => item.id !== review.id));

      if (selectedReview?.id === review.id) {
        setSelectedReview(null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to delete review.");
    } finally {
      setActionLoading(null);
    }
  }

  return (
    <div className="reviews-page">
      <div className="reviews-heading">
        <div>
          <span className="reviews-eyebrow">CUSTOMER FEEDBACK</span>
          <h1>Reviews</h1>
          <p>Manage customer feedback and ratings for TESAZMARE Logistics.</p>
        </div>

        <button
          className="reviews-refresh-button"
          onClick={() => fetchReviews(true)}
          disabled={refreshing || loading}
        >
          <RefreshCw size={16} className={refreshing ? "review-spin" : ""} />
          Refresh
        </button>
      </div>

      {error && (
        <div className="reviews-error">
          <XCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      <div className="reviews-stats">
        <div className="review-stat-card">
          <div className="review-stat-icon navy">
            <MessageSquare size={21} />
          </div>
          <div>
            <span>Total reviews</span>
            <strong>{reviews.length}</strong>
            <small>All customer submissions</small>
          </div>
        </div>

        <div className="review-stat-card">
          <div className="review-stat-icon orange">
            <Clock3 size={21} />
          </div>
          <div>
            <span>Pending reviews</span>
            <strong>{pendingCount}</strong>
            <small>Waiting for approval</small>
          </div>
        </div>

        <div className="review-stat-card">
          <div className="review-stat-icon green">
            <CheckCircle2 size={21} />
          </div>
          <div>
            <span>Approved reviews</span>
            <strong>{approvedReviews.length}</strong>
            <small>Visible to website visitors</small>
          </div>
        </div>

        <div className="review-stat-card">
          <div className="review-stat-icon gold">
            <Star size={21} fill="currentColor" />
          </div>
          <div>
            <span>Average rating</span>
            <strong>
              {averageRating}
              <small className="out-of-five"> / 5</small>
            </strong>
            <div className="review-stat-stars">
              <StarRating
                rating={Math.round(Number(averageRating))}
                size={13}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="reviews-content">
        <div className="reviews-toolbar">
          <div className="reviews-filter-tabs">
            {statusOptions.map((status) => (
              <button
                key={status}
                className={activeFilter === status ? "active" : ""}
                onClick={() => setActiveFilter(status)}
              >
                {status}
                {status === "Pending" && pendingCount > 0 && (
                  <span className="filter-count">{pendingCount}</span>
                )}
              </button>
            ))}
          </div>

          <div className="reviews-search">
            <Search size={17} />
            <input
              type="search"
              placeholder="Search reviews..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>
        </div>

        {loading ? (
          <div className="reviews-state">
            <RefreshCw className="review-spin" size={25} />
            <p>Loading customer reviews...</p>
          </div>
        ) : filteredReviews.length === 0 ? (
          <div className="reviews-state">
            <MessageSquare size={35} />
            <h3>No reviews found</h3>
            <p>
              {search || activeFilter !== "All"
                ? "Try changing your search or filter."
                : "Customer reviews will appear here when submitted."}
            </p>
          </div>
        ) : (
          <div className="reviews-list">
            {filteredReviews.map((review) => (
              <article className="review-card" key={review.id}>
                <div className="review-card-top">
                  <div className="review-customer">
                    <div className="review-avatar">
                      {review.customerName.charAt(0).toUpperCase()}
                    </div>

                    <div>
                      <h3>{review.customerName}</h3>
                      <span>{review.customerEmail || "No email provided"}</span>
                    </div>
                  </div>

                  <StatusBadge status={review.status} />
                </div>

                <div className="review-rating-row">
                  <StarRating rating={review.rating} />
                  <span className="review-rating-number">
                    {review.rating}.0 / 5
                  </span>
                </div>

                <p className="review-comment">{review.comment}</p>

                <div className="review-card-bottom">
                  <span className="review-date">
                    {formatDate(review.createdAtUtc)}
                  </span>

                  <div className="review-actions">
                    <button
                      className="review-action view"
                      onClick={() => setSelectedReview(review)}
                      title="View review"
                    >
                      <Eye size={16} />
                      <span>View</span>
                    </button>

                    {review.status !== "Approved" && (
                      <button
                        className="review-action approve"
                        disabled={actionLoading === review.id}
                        onClick={() => updateStatus(review, "Approved")}
                        title="Approve review"
                      >
                        <CheckCircle2 size={16} />
                        <span>Approve</span>
                      </button>
                    )}

                    {review.status !== "Rejected" && (
                      <button
                        className="review-action reject"
                        disabled={actionLoading === review.id}
                        onClick={() => updateStatus(review, "Rejected")}
                        title="Reject review"
                      >
                        <XCircle size={16} />
                        <span>Reject</span>
                      </button>
                    )}

                    <button
                      className="review-action delete"
                      disabled={actionLoading === review.id}
                      onClick={() => deleteReview(review)}
                      title="Delete review"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {!loading && filteredReviews.length > 0 && (
          <div className="reviews-results">
            Showing {filteredReviews.length} of {reviews.length} reviews
          </div>
        )}
      </div>

      {rejectedCount > 0 && (
        <p className="reviews-note">
          {rejectedCount} rejected {rejectedCount === 1 ? "review" : "reviews"}{" "}
          are hidden from the public website.
        </p>
      )}

      {selectedReview && (
        <div
          className="review-modal-overlay"
          onClick={() => setSelectedReview(null)}
        >
          <div
            className="review-modal"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="review-modal-header">
              <div>
                <span className="reviews-eyebrow">CUSTOMER FEEDBACK</span>
                <h2>Review details</h2>
              </div>
              <button
                className="review-modal-close"
                onClick={() => setSelectedReview(null)}
                aria-label="Close review details"
              >
                <X size={20} />
              </button>
            </div>

            <div className="review-modal-customer">
              <div className="review-avatar large">
                {selectedReview.customerName.charAt(0).toUpperCase()}
              </div>
              <div>
                <h3>{selectedReview.customerName}</h3>
                <p>{selectedReview.customerEmail || "No email provided"}</p>
              </div>
            </div>

            <div className="review-modal-rating">
              <StarRating rating={selectedReview.rating} size={22} />
              <strong>{selectedReview.rating} out of 5</strong>
            </div>

            <div className="review-modal-comment">
              <span>Customer comment</span>
              <p>{selectedReview.comment}</p>
            </div>

            <div className="review-modal-meta">
              <div>
                <span>Submitted</span>
                <strong>{formatDate(selectedReview.createdAtUtc)}</strong>
              </div>
              <div>
                <span>Status</span>
                <StatusBadge status={selectedReview.status} />
              </div>
            </div>

            <div className="review-modal-actions">
              {selectedReview.status !== "Approved" && (
                <button
                  className="review-modal-approve"
                  disabled={actionLoading === selectedReview.id}
                  onClick={() => updateStatus(selectedReview, "Approved")}
                >
                  <CheckCircle2 size={17} />
                  Approve review
                </button>
              )}

              {selectedReview.status !== "Rejected" && (
                <button
                  className="review-modal-reject"
                  disabled={actionLoading === selectedReview.id}
                  onClick={() => updateStatus(selectedReview, "Rejected")}
                >
                  <XCircle size={17} />
                  Reject review
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
