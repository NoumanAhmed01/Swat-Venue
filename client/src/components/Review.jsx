import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import toast from "react-hot-toast";
import { Star, ChevronDown, MessageSquare } from "lucide-react";
import { reviewAPI } from "../utils/api";
import { useAuth } from "../context/AuthContext";

const reviewSchema = yup.object({
  rating: yup
    .number()
    .min(1, "Please select a rating")
    .max(5)
    .required("Rating is required"),
  comment: yup
    .string()
    .min(10, "Comment must be at least 10 characters")
    .required("Comment is required"),
  eventType: yup.string().required("Event type is required"),
});

const Review = ({ venueId, venueRating, onReviewSubmitted }) => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [hasUserReviewed, setHasUserReviewed] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
    watch,
  } = useForm({
    resolver: yupResolver(reviewSchema),
    defaultValues: {
      rating: 0,
      comment: "",
      eventType: "",
    },
  });

  const currentRating = watch("rating");

  useEffect(() => {
    setHasUserReviewed(false); // Reset when changing venue
    setReviews([]); // Clear previous venue reviews
    fetchReviews();
  }, [venueId]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const response = await reviewAPI.getVenueReviews(venueId);
      setReviews(response.data.data || []);
      if (user) {
        const userReview = response.data.data?.find(
          (review) =>
            (review.customer?._id === user.id || review.customer === user.id) &&
            review.venue?._id === venueId // ensure it’s same venue
        );
        setHasUserReviewed(!!userReview);
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
      toast.error("Failed to load reviews");
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data) => {
    if (!user) {
      toast.error("Please login to leave a review");
      return;
    }
    console.log("Submitting review:", data); // 👈 Add this line
    console.log("Venue ID:", venueId);
    try {
      await reviewAPI.create(venueId, data);
      toast.success("Review submitted successfully!");
      reset();
      setShowReviewForm(false);
      fetchReviews();
      if (onReviewSubmitted) {
        onReviewSubmitted();
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to submit review";
      toast.error(errorMessage);
    }
  };

  const handleStarClick = (rating) => {
    setValue("rating", rating, { shouldValidate: true });
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-surface-800 rounded-2xl p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 dark:bg-surface-700 rounded w-1/3"></div>
          <div className="space-y-3">
            <div className="h-20 bg-gray-200 dark:bg-surface-700 rounded"></div>
            <div className="h-20 bg-gray-200 dark:bg-surface-700 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-surface-800 rounded-2xl p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-primary-900 dark:text-text-dark">
          Customer Reviews ({reviews.length})
        </h3>
        <div className="flex items-center space-x-2">
          <Star className="h-5 w-5 text-yellow-400 fill-current" />
          <span className="font-semibold text-primary-900 dark:text-text-dark">
            {venueRating}
          </span>
          <span className="text-gray-500 dark:text-gray-400">
            ({reviews.length} reviews)
          </span>
        </div>
      </div>

      {/* Reviews */}
      {reviews.length === 0 ? (
        <div className="text-center py-8">
          <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-500 dark:text-gray-400">
            No reviews yet. Be the first to review this venue!
          </p>
        </div>
      ) : (
        <>
          <div className="space-y-6">
            {(showAllReviews ? reviews : reviews.slice(0, 3)).map((review) => (
              <div
                key={review._id}
                className="border-b border-gray-200 dark:border-surface-700 pb-6 last:border-b-0"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-semibold text-primary-900 dark:text-text-dark">
                      {review.customerName ||
                        review.customer?.name ||
                        "Anonymous"}
                    </h4>
                    <div className="flex items-center space-x-2 mt-1">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < review.rating
                                ? "text-yellow-400 fill-current"
                                : "text-gray-300 dark:text-gray-600"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {review.eventType}
                      </span>
                    </div>
                  </div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {new Date(
                      review.date || review.createdAt
                    ).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-text-light dark:text-text-dark leading-relaxed">
                  {review.comment}
                </p>
              </div>
            ))}
          </div>

          {reviews.length > 3 && (
            <div className="mt-6 text-center">
              <button
                onClick={() => setShowAllReviews(!showAllReviews)}
                className="inline-flex items-center space-x-2 text-gold-600 hover:text-gold-700 font-medium transition-colors duration-200"
              >
                <span>
                  {showAllReviews
                    ? "Show Less"
                    : `Show More (${reviews.length - 3} more)`}
                </span>
                <ChevronDown
                  className={`h-4 w-4 transition-transform duration-200 ${
                    showAllReviews ? "rotate-180" : ""
                  }`}
                />
              </button>
            </div>
          )}
        </>
      )}

      {/* Always show review form section */}
      {user && !hasUserReviewed && (
        <div className="mt-8 border-t border-gray-200 dark:border-surface-700 pt-6">
          <button
            onClick={() => setShowReviewForm(!showReviewForm)}
            className="inline-flex items-center space-x-2 bg-gold-500 hover:bg-gold-600 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200"
          >
            <MessageSquare className="h-5 w-5" />
            <span>
              {showReviewForm ? "Close Review Form" : "Write a Review"}
            </span>
          </button>

          {showReviewForm && (
            <div className="mt-6 p-6 bg-gray-50 dark:bg-surface-700 rounded-lg">
              <h4 className="text-lg font-semibold text-primary-900 dark:text-text-dark mb-4">
                Share Your Experience
              </h4>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {/* Rating */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Rating
                  </label>
                  <div className="flex items-center space-x-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => handleStarClick(star)}
                        onMouseEnter={() => setHoveredRating(star)}
                        onMouseLeave={() => setHoveredRating(0)}
                        className="focus:outline-none transition-transform hover:scale-110"
                      >
                        <Star
                          className={`h-8 w-8 ${
                            star <= (hoveredRating || currentRating)
                              ? "text-yellow-400 fill-current"
                              : "text-gray-300 dark:text-gray-600"
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                  {errors.rating && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.rating.message}
                    </p>
                  )}
                </div>

                {/* Event Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Event Type
                  </label>
                  <select
                    {...register("eventType")}
                    className="w-full p-3 border border-gray-300 dark:border-surface-600 rounded-lg bg-white dark:bg-surface-800 text-primary-900 dark:text-text-dark focus:ring-2 focus:ring-gold-500 focus:border-transparent"
                  >
                    <option value="">Select event type</option>
                    <option value="Wedding">Wedding</option>
                    <option value="Birthday">Birthday</option>
                    <option value="Corporate Event">Corporate Event</option>
                    <option value="Conference">Conference</option>
                    <option value="Family Gathering">Family Gathering</option>
                    <option value="Other">Other</option>
                  </select>
                  {errors.eventType && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.eventType.message}
                    </p>
                  )}
                </div>

                {/* Comment */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Your Review
                  </label>
                  <textarea
                    {...register("comment")}
                    rows="4"
                    placeholder="Share your experience with this venue..."
                    className="w-full p-3 border border-gray-300 dark:border-surface-600 rounded-lg bg-white dark:bg-surface-800 text-primary-900 dark:text-text-dark focus:ring-2 focus:ring-gold-500 focus:border-transparent resize-none"
                  ></textarea>
                  {errors.comment && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.comment.message}
                    </p>
                  )}
                </div>

                {/* Buttons */}
                <div className="flex space-x-3">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-gold-500 hover:bg-gold-600 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? "Submitting..." : "Submit Review"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowReviewForm(false);
                      reset();
                    }}
                    className="bg-gray-300 hover:bg-gray-400 dark:bg-surface-600 dark:hover:bg-surface-500 text-gray-700 dark:text-text-dark px-6 py-2 rounded-lg font-medium transition-colors duration-200"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Review;
