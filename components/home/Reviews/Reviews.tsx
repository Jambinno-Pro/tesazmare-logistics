import Link from "next/link";
import { Star, Quote, ArrowUpRight, MessageSquareText } from "lucide-react";
import ReviewsCarousel from "./ReviewsCarousel";
import "./Reviews.css";

const API_URL = process.env.TESAZMARE_API_URL || "http://localhost:5050";

interface Review {
  id: number;
  customerName: string;
  rating: number;
  comment: string;
  createdAtUtc: string;
}

interface ApprovedReviewsResponse {
  totalReviews: number;
  averageRating: number;
  reviews: Review[];
}

async function getApprovedReviews(): Promise<ApprovedReviewsResponse> {
  try {
    const response = await fetch(`${API_URL}/api/reviews/approved`, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      console.error("Unable to fetch approved reviews:", response.status);

      return {
        totalReviews: 0,
        averageRating: 0,
        reviews: [],
      };
    }

    return await response.json();
  } catch (error) {
    console.error("Reviews API connection error:", error);

    return {
      totalReviews: 0,
      averageRating: 0,
      reviews: [],
    };
  }
}

function ReviewCard({ review }: { review: Review }) {
  const initials = review.customerName
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");

  return (
    <article className="review-card">
      <div className="review-card-top">
        <div
          className="review-stars"
          aria-label={`${review.rating} out of 5 stars`}
        >
          {Array.from({ length: 5 }).map((_, index) => (
            <Star
              key={index}
              size={17}
              fill={index < review.rating ? "currentColor" : "none"}
            />
          ))}
        </div>

        <Quote className="review-quote-icon" size={32} />
      </div>

      <p className="review-comment">&ldquo;{review.comment}&rdquo;</p>

      <div className="review-customer">
        <div className="review-avatar">{initials || "C"}</div>

        <div className="review-customer-info">
          <strong>{review.customerName}</strong>
          <span>Customer review</span>
        </div>
      </div>
    </article>
  );
}

export default async function Reviews() {
  const data = await getApprovedReviews();

  const reviews = data.reviews ?? [];
  const averageRating = data.averageRating ?? 0;

  return (
    <section className="reviews-section" id="reviews">
      <div className="reviews-container">
        {/* SECTION HEADING */}
        <div className="reviews-heading">
          <span className="reviews-eyebrow">CUSTOMER EXPERIENCES</span>

          <h2>
            What Our Customers <span>Say.</span>
          </h2>

          <p>
            Every journey matters to us. We value your feedback and continuously
            strive to provide comfortable, reliable and convenient
            transportation.
          </p>
        </div>

        {/* RATING SUMMARY */}
        <div className="reviews-summary">
          <div className="reviews-summary-icon">
            <Star size={25} fill="currentColor" />
          </div>

          <div>
            <strong>{averageRating.toFixed(1)} / 5</strong>
            <span>
              Average customer rating ({data.totalReviews}{" "}
              {data.totalReviews === 1 ? "review" : "reviews"})
            </span>
          </div>
        </div>

        {/* CUSTOMER REVIEWS CAROUSEL */}
        {reviews.length > 0 ? (
          <ReviewsCarousel
            items={reviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          />
        ) : (
          <div className="reviews-empty">
            <MessageSquareText size={32} />

            <h3>Be the first to share your experience</h3>

            <p>
              We look forward to hearing about your journey with TESAZMARE
              Logistics.
            </p>
          </div>
        )}

        {/* WRITE A REVIEW CTA */}
        <div className="reviews-cta">
          <div className="reviews-cta-content">
            <div className="reviews-cta-icon">
              <MessageSquareText size={24} />
            </div>

            <div>
              <h3>Travelled With Us?</h3>

              <p>
                We'd love to hear about your experience. Share your feedback and
                help us serve you better.
              </p>
            </div>
          </div>

          <Link href="/review" className="reviews-cta-button">
            Write a Review
            <ArrowUpRight size={18} />
          </Link>
        </div>
      </div>
    </section>
  );
}
