import React, { useEffect, useState } from "react";
import "../styles/About.css";
import { db, auth } from "../firebase";
import {
  collection,
  addDoc,
  getDocs,
  serverTimestamp,
  query,
  orderBy,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

function About() {
  const [review, setReview] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [user, setUser] = useState(null);

  // Track current user
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
    });
    return () => unsubscribe();
  }, []);

  // Fetch reviews from Firestore
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const q = query(
          collection(db, "reviews"),
          orderBy("createdAt", "desc")
        );
        const snapshot = await getDocs(q);
        const reviewList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setReviews(reviewList);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      } finally {
        setSubmitted(false); // reset after fetching new data
      }
    };

    fetchReviews();
  }, [submitted]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!review.trim()) return;

    setLoading(true);
    try {
      console.log("Current user info:", user);
      await addDoc(collection(db, "reviews"), {
        text: review,
        username: user?.displayName || user?.email || "Anonymous",
        email: user?.email || "No email",
        uid: user?.uid,
        createdAt: serverTimestamp(),
      });

      setReview("");
      setSubmitted(true); // will trigger useEffect to refetch reviews
    } catch (error) {
      console.error("Error submitting review:", error);
      alert("Failed to submit review. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (reviewId) => {
    try {
      await deleteDoc(doc(db, "reviews", reviewId));
      setReviews((prev) => prev.filter((r) => r.id !== reviewId));
    } catch (error) {
      console.error("Failed to delete review:", error);
      alert("Failed to delete review.");
    }
  };

  return (
    <div className="about-page">
      <div className="about-container">
        <h1>About SmartShip</h1>
        <p className="about-description">
          SmartShip is an intelligent shipping analytics platform that empowers
          users to analyze cargo data, track and predict port delays, stay
          informed with real-time maritime news, and explore detailed port
          information using AI-powered tools. Designed to optimize
          decision-making in the maritime industry, SmartShip combines
          data-driven insights with user-friendly features to help logistics
          professionals, freight managers, and analysts streamline operations,
          enhance route planning, and respond swiftly to global shipping
          challenges
        </p>

        {user && (
          <>
            <h2>Leave a Review</h2>
            <form onSubmit={handleSubmit} className="review-form">
              <textarea
                placeholder="Write your feedback..."
                value={review}
                onChange={(e) => setReview(e.target.value)}
                rows={4}
                required
              />
              <button type="submit" disabled={loading}>
                {loading ? "Submitting..." : "Submit Review"}
              </button>
            </form>
          </>
        )}

        {submitted && (
          <p className="thank-you-msg">Thank you for your feedback!</p>
        )}

        <h2>User Reviews</h2>
        <div className="review-list">
          {reviews.map((rev, index) => (
            <div className="review-card" key={index}>
              <p className="review-text">"{rev.text}"</p>
              <p className="review-user">– {rev.username}</p>
              <p className="review-email">{rev.email}</p>

              {user?.uid && user.uid === rev.uid && (
                <button
                  className="delete-btn"
                  onClick={() => handleDelete(rev.id)}
                >
                  Delete
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default About;
