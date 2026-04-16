import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from "../common/Toast";
import { Star, ChevronDown, MessageSquare, ShieldCheck } from "lucide-react";
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
  bookingId: yup.string().required("Please select the booking you are reviewing"),
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
      // Fetch all user bookings
      const response = await bookingAPI.getUserBookings();
      const allBookings = response.data.data || [];
      
      // Filter for: This venue + Confirmed + Past Date
      const eligible = allBookings.filter(b => {
        const isThisVenue = (b.venue?._id || b.venue) === venueId;
        const isConfirmed = b.status === 'confirmed';
        const isPast = new Date(b.eventDate) < new Date();
        // Check if already reviewed (this is simplified, backend also checks)
        const alreadyReviewed = reviews.some(r => r.booking === b._id);
        
        return isThisVenue && isConfirmed && isPast && !alreadyReviewed;
      });

      setReviewableBookings(eligible);
      if (eligible.length > 0) {
        setValue("bookingId", eligible[0]._id); // Default to first eligible
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
      fetchUserEligibility(); // Refresh eligibility
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
        <h3 className="text-lg sm:text-xl font-semibold text-primary-900 dark:text-text-dark">
          Customer Reviews
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
          <div className="space-y-4 sm:space-y-6">
            {(showAllReviews ? reviews : reviews.slice(0, 3)).map((review) => (
              <div
                key={review._id}
                className="border-b border-gray-200 dark:border-surface-700 pb-4 sm:pb-6 last:border-b-0"
              >
                <div className="flex items-start justify-between mb-3">
                  {/* Left side: Profile + Name + Rating */}
                  <div className="flex items-start space-x-3 flex-1 mr-3">
                    {/* Profile Icon */}
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-primary-600 text-white flex items-center justify-center font-semibold text-xs sm:text-sm">
                        {getInitials(
                          review.customerName || review.customer?.name,
                        )}
                      </div>
                    </div>

                    {/* Name and Rating */}
                    <div className="flex-1">
                      <h4 className="font-semibold text-primary-900 dark:text-text-dark text-sm sm:text-base">
                        {review.customerName ||
                          review.customer?.name ||
                          "Anonymous"}
                      </h4>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mt-1">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-3 w-3 sm:h-4 sm:w-4 ${
                                i < review.rating
                                  ? "text-yellow-400 fill-current"
                                  : "text-gray-300 dark:text-gray-600"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                          {review.eventType}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right side: Date */}
                  <div className="flex-shrink-0">
                    <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                      {new Date(
                        review.date || review.createdAt,
                      ).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {/* Review Comment */}
                <p className="text-text-light dark:text-text-dark text-sm sm:text-base leading-relaxed pl-0 sm:pl-11">
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

      {/* Always show review form section - Only if user has eligible bookings */}
      {user && reviewableBookings.length > 0 && (
        <div className="mt-8 border-t border-gray-200 dark:border-surface-700 pt-6">
          {!showReviewForm ? (
            <div className="bg-gold-50 dark:bg-gold-900/10 border border-gold-100 dark:border-gold-900/30 p-4 sm:p-6 rounded-2xl flex flex-col sm:flex-row items-center sm:items-start justify-between gap-4 text-center sm:text-left">
              <div className="flex-1">
                <h4 className="text-gold-800 dark:text-gold-400 font-bold mb-1 text-base sm:text-lg">
                  You've hosted an event here!
                </h4>
                <p className="text-xs sm:text-sm text-gold-700/70 dark:text-gold-500/70">
                  Share your experience to help others and support this venue.
                </p>
              </div>
              <button
                onClick={() => setShowReviewForm(true)}
                className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-gold-500 hover:bg-gold-600 text-white px-6 py-3 rounded-xl font-bold transition-all duration-300 shadow-lg shadow-gold-500/20 text-sm sm:text-base"
              >
                <MessageSquare className="h-4 w-4 sm:h-5 sm:w-5" />
                <span>Write a Review</span>
              </button>
            </div>
          ) : (
            <div className="mt-6 p-4 sm:p-6 bg-gray-50 dark:bg-surface-700 rounded-2xl border border-gray-100 dark:border-surface-600">
              <div className="flex justify-between items-center mb-6">
                <h4 className="text-base sm:text-lg font-bold text-primary-900 dark:text-text-dark">
                  Share Your Experience
                </h4>
                <button 
                  onClick={() => setShowReviewForm(false)}
                  className="text-xs sm:text-sm text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors font-medium"
                >
                  Cancel
                </button>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6">
                {/* Booking Selection (If multiple) */}
                {reviewableBookings.length > 1 && (
                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Select Event to Review
                    </label>
                    <select
                      {...register("bookingId")}
                      className="w-full p-2.5 sm:p-3 border border-gray-200 dark:border-surface-600 rounded-xl bg-white dark:bg-surface-800 text-xs sm:text-sm focus:ring-2 focus:ring-gold-500 outline-none"
                    >
                      {reviewableBookings.map((b) => (
                        <option key={b._id} value={b._id}>
                          {b.eventType} ({new Date(b.eventDate).toLocaleDateString()})
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Rating */}
                <div className="flex flex-col items-center justify-center p-4 bg-white dark:bg-surface-800 rounded-xl border border-gray-100 dark:border-surface-600">
                  <label className="block text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">
                    Your Rating
                  </label>
                  <div className="flex items-center space-x-1 sm:space-x-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => handleStarClick(star)}
                        onMouseEnter={() => setHoveredRating(star)}
                        onMouseLeave={() => setHoveredRating(0)}
                        className="focus:outline-none transition-transform active:scale-95"
                      >
                        <Star
                          className={`h-7 w-7 sm:h-9 sm:w-9 ${
                            star <= (hoveredRating || currentRating)
                              ? "text-yellow-400 fill-current"
                              : "text-gray-200 dark:text-gray-700"
                          } transition-colors duration-200`}
                        />
                      </button>
                    ))}
                  </div>
                  {errors.rating && (
                    <p className="text-red-500 text-[10px] sm:text-xs mt-3 font-medium text-center">
                      {errors.rating.message}
                    </p>
                  )}
                </div>

                {/* Comment */}
                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Review Details
                  </label>
                  <textarea
                    {...register("comment")}
                    rows="4"
                    placeholder="Tell us about the service, food, and ambiance..."
                    className="w-full p-3 sm:p-4 border border-gray-200 dark:border-surface-600 rounded-xl bg-white dark:bg-surface-800 text-primary-900 dark:text-text-dark text-sm focus:ring-2 focus:ring-gold-500 outline-none transition-all resize-none shadow-sm placeholder:text-gray-400"
                  ></textarea>
                  {errors.comment && (
                    <p className="text-red-500 text-xs mt-2 font-medium">
                      {errors.comment.message}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gold-500 hover:bg-gold-600 text-white py-3 sm:py-4 rounded-xl font-bold transition-all duration-300 shadow-lg shadow-gold-500/20 disabled:opacity-50 text-sm sm:text-base"
                >
                  {isSubmitting ? "Posting Review..." : "Post Review"}
                </button>
              </form>
            </div>
          )}
        </div>
      )}

      {/* Guest message if logged in but no bookings */}
      {user && reviewableBookings.length === 0 && !loading && (
        <div className="mt-8 pt-6 border-t border-gray-100 dark:border-surface-700 flex justify-center">
          <div className="inline-flex items-center space-x-2 px-4 py-2 bg-gray-50 dark:bg-surface-900/50 rounded-full border border-gray-200 dark:border-surface-700">
            <ShieldCheck className="h-4 w-4 text-gray-400 dark:text-gray-500" />
            <span className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">
              Verified Guests Only
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Review;
