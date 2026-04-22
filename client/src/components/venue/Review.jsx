import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from "../common/Toast";
import {
  Star,
  ChevronDown,
  MessageSquare,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import { reviewAPI, bookingAPI } from "../../utils/api";
import { useAuth } from "../../context/AuthContext";

const getInitials = (name) => {
  if (!name) return "U";
  return name
    .split(" ")
    .filter(Boolean)
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

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
  bookingId: yup
    .string()
    .required("Please select the booking you are reviewing"),
});

const Review = ({ venueId, venueRating, onReviewSubmitted }) => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [reviewableBookings, setReviewableBookings] = useState([]);

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
      bookingId: "",
    },
  });

  const currentRating = watch("rating");

  useEffect(() => {
    setReviews([]);
    setReviewableBookings([]);
    fetchReviews();
    if (user) fetchUserEligibility();
  }, [venueId, user]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const response = await reviewAPI.getVenueReviews(venueId);
      setReviews(response.data.data || []);
    } catch (error) {
      console.error("Error fetching reviews:", error);
      toast.error("Failed to load reviews");
    } finally {
      setLoading(false);
    }
  };

  const fetchUserEligibility = async () => {
    try {
      const response = await bookingAPI.getUserBookings();
      const allBookings = response.data.data || [];

      const eligible = allBookings.filter((b) => {
        const isThisVenue = (b.venue?._id || b.venue) === venueId;
        const isConfirmed = b.status === "confirmed";
        const isPast = new Date(b.eventDate) < new Date();
        const alreadyReviewed = reviews.some((r) => r.booking === b._id);

        return isThisVenue && isConfirmed && isPast && !alreadyReviewed;
      });

      setReviewableBookings(eligible);
      if (eligible.length > 0) {
        setValue("bookingId", eligible[0]._id);
      }
    } catch (error) {
      console.error("Error checking review eligibility:", error);
    }
  };

  const onSubmit = async (data) => {
    try {
      await reviewAPI.create(venueId, data);
      toast.success("Review submitted successfully!");
      reset();
      setShowReviewForm(false);
      fetchReviews();
      fetchUserEligibility();
      if (onReviewSubmitted) {
        onReviewSubmitted();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to submit review");
    }
  };

  const handleStarClick = (rating) => {
    setValue("rating", rating, { shouldValidate: true });
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-surface-800 rounded-2xl p-6 sm:p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 dark:bg-surface-700 rounded w-1/4"></div>
          <div className="space-y-4">
            <div className="h-24 bg-gray-200 dark:bg-surface-700 rounded-xl"></div>
            <div className="h-24 bg-gray-200 dark:bg-surface-700 rounded-xl"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-surface-800 rounded-2xl p-5 sm:p-8 border border-gray-100 dark:border-surface-700 shadow-sm">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
        <div>
          <div className="flex items-center space-x-2 mb-1">
            <MessageSquare className="h-5 w-5 text-gold-600" />
            <h3 className="text-xl font-black text-primary-900 dark:text-text-dark tracking-tight">
              Guest Experiences
            </h3>
          </div>
          <p className="text-xs text-gray-400 dark:text-gray-500 font-medium">
            Based on {reviews.length} verified stays
          </p>
        </div>

        <div className="flex items-center bg-gray-50 dark:bg-surface-900 px-4 py-2.5 rounded-2xl border border-gray-100 dark:border-surface-700">
          <div className="flex items-center text-yellow-400 mr-3">
            <Star className="h-5 w-5 fill-current" />
            <span className="ml-1.5 text-lg font-black text-primary-900 dark:text-text-dark">
              {venueRating}
            </span>
          </div>
          <div className="h-4 w-px bg-gray-200 dark:bg-surface-700 mx-3"></div>
          <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">
            Average Rating
          </span>
        </div>
      </div>

      {/* Reviews List */}
      {reviews.length === 0 ? (
        <div className="text-center py-12 bg-gray-50/50 dark:bg-surface-900/30 rounded-3xl border border-dashed border-gray-200 dark:border-surface-700">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white dark:bg-surface-800 shadow-sm mb-4">
            <Star className="h-8 w-8 text-gray-200 dark:text-gray-700" />
          </div>
          <p className="text-gray-500 dark:text-gray-400 font-medium italic">
            Be the first to share your experience!
          </p>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {(showAllReviews ? reviews : reviews.slice(0, 3)).map((review) => (
              <div
                key={review._id}
                className="group bg-white dark:bg-surface-800 p-4 sm:p-6 rounded-2xl border border-gray-100 dark:border-surface-700 hover:border-gold-500/30 transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start space-x-3">
                    {/* User Avatar */}
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-600 to-primary-800 text-white flex items-center justify-center font-black text-sm shadow-lg shadow-primary-900/10 uppercase">
                        {getInitials(
                          review.customerName || review.customer?.name,
                        )}
                      </div>
                    </div>

                    {/* Name & Badge */}
                    <div>
                      <div className="flex items-center space-x-2">
                        <h4 className="font-bold text-primary-900 dark:text-text-dark text-sm sm:text-base">
                          {review.customerName ||
                            review.customer?.name ||
                            "Verified Guest"}
                        </h4>
                        <span className="inline-flex items-center text-[10px] font-bold text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-1.5 py-0.5 rounded-md border border-green-100 dark:border-green-900/30">
                          <CheckCircle2 className="h-2.5 w-2.5 mr-1" />
                          Stayed
                        </span>
                      </div>

                      {/* Rating Stars */}
                      <div className="flex items-center mt-1 space-x-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-3 w-3 ${
                              i < review.rating
                                ? "text-yellow-400 fill-current"
                                : "text-gray-200 dark:text-gray-700"
                            }`}
                          />
                        ))}
                        <span className="text-[10px] text-gray-400 font-bold uppercase ml-2 tracking-tighter">
                          {review.eventType}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">
                      {new Date(
                        review.date || review.createdAt,
                      ).toLocaleDateString(undefined, {
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                </div>

                {/* Comment */}
                <p className="text-text-light dark:text-text-dark text-sm leading-relaxed pl-0 sm:pl-13 opacity-90 italic">
                  "{review.comment}"
                </p>
              </div>
            ))}
          </div>

          {reviews.length > 3 && (
            <div className="mt-8 text-center">
              <button
                onClick={() => setShowAllReviews(!showAllReviews)}
                className="px-6 py-2.5 rounded-xl border border-gray-200 dark:border-surface-700 text-sm font-bold text-primary-900 dark:text-text-dark hover:bg-gray-50 dark:hover:bg-surface-700 transition-all flex items-center mx-auto space-x-2"
              >
                <span>
                  {showAllReviews
                    ? "View Less"
                    : `View All ${reviews.length} Reviews`}
                </span>
                <ChevronDown
                  className={`h-4 w-4 transition-transform ${showAllReviews ? "rotate-180" : ""}`}
                />
              </button>
            </div>
          )}
        </>
      )}

      {/* Review Form Section - Minimal & Professional */}
      {user && reviewableBookings.length > 0 && (
        <div className="mt-10 pt-8 border-t border-gray-100 dark:border-surface-700">
          {!showReviewForm ? (
            <div className="bg-gold-500/5 dark:bg-gold-500/10 p-5 rounded-3xl border border-gold-500/10 flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-gold-500 rounded-2xl shadow-lg shadow-gold-500/20">
                  <Star className="h-6 w-6 text-white" />
                </div>
                <div className="text-center md:text-left">
                  <h4 className="text-primary-900 dark:text-text-dark font-black tracking-tight">
                    Share your journey
                  </h4>
                  <p className="text-xs text-gray-500 font-medium">
                    Your feedback helps owners improve.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowReviewForm(true)}
                className="w-full md:w-auto bg-primary-900 dark:bg-gold-500 hover:bg-black dark:hover:bg-gold-600 text-white px-8 py-3 rounded-2xl font-bold text-sm transition-all"
              >
                Write a Review
              </button>
            </div>
          ) : (
            <div className="animate-zoom-in bg-gray-50 dark:bg-surface-900/50 p-6 rounded-3xl border border-gray-100 dark:border-surface-700">
              <div className="flex justify-between items-center mb-6">
                <h4 className="text-lg font-black text-primary-900 dark:text-text-dark tracking-tight">
                  Post your review
                </h4>
                <button
                  onClick={() => setShowReviewForm(false)}
                  className="text-xs font-bold text-gray-400 hover:text-primary-900 uppercase"
                >
                  Cancel
                </button>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {reviewableBookings.length > 1 && (
                  <div className="grid grid-cols-1 gap-2">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">
                      Select Event
                    </label>
                    <select
                      {...register("bookingId")}
                      className="w-full p-3.5 bg-white dark:bg-surface-800 border border-gray-200 dark:border-surface-700 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-gold-500/20"
                    >
                      {reviewableBookings.map((b) => (
                        <option key={b._id} value={b._id}>
                          {b.eventType} (
                          {new Date(b.eventDate).toLocaleDateString()})
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <div className="bg-white dark:bg-surface-800 p-6 rounded-2xl border border-gray-100 dark:border-surface-700 text-center">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">
                    Overall Experience
                  </p>
                  <div className="flex justify-center space-x-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => handleStarClick(star)}
                        onMouseEnter={() => setHoveredRating(star)}
                        onMouseLeave={() => setHoveredRating(0)}
                        className="transition-transform active:scale-90"
                      >
                        <Star
                          className={`h-8 w-8 sm:h-10 sm:w-10 ${star <= (hoveredRating || currentRating) ? "text-yellow-400 fill-current" : "text-gray-100 dark:text-gray-800"} transition-colors`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-2">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">
                    Your Story
                  </label>
                  <textarea
                    {...register("comment")}
                    rows="4"
                    placeholder="Tell other guests about your experience..."
                    className="w-full p-4 bg-white dark:bg-surface-800 border border-gray-200 dark:border-surface-700 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-gold-500/20 resize-none"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-primary-900 dark:bg-gold-500 text-white py-4 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-primary-900/20 disabled:opacity-50 transition-all"
                >
                  {isSubmitting ? "Posting..." : "Submit Review"}
                </button>
              </form>
            </div>
          )}
        </div>
      )}

      {/* Verified Footer Badge */}
      {user && reviewableBookings.length === 0 && !loading && (
        <div className="mt-8 flex justify-center">
          <div className="inline-flex items-center space-x-2 px-3 py-1.5 bg-gray-50/50 dark:bg-surface-900 rounded-full border border-gray-100 dark:border-surface-700">
            <ShieldCheck className="h-3.5 w-3.5 text-gray-400" />
            <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">
              Verified Guests Only
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Review;
