'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ProductImageGallery from './ProductImageGallery';
import { useCart } from '@/hooks/useCart';
import { useWishlist } from '@/hooks/useWishlist';
import { useAuth } from '@/hooks/useAuth';
import { addReview, getProductReviews } from '@/lib/firestore';
import toast from 'react-hot-toast';

const ProductDetail = ({ product, onClose, relatedProducts }) => {
  const [expanded, setExpanded] = useState(false);
  const [showReview, setShowReview] = useState(false);
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const { addToCart } = useCart();
  const { wishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const { user } = useAuth();
  
  const isInWishlist = wishlist.includes(product.id);

  // Load reviews
  useEffect(() => {
    if (product.id) {
      loadReviews();
    }
  }, [product.id]);

  const loadReviews = async () => {
    try {
      const reviewsData = await getProductReviews(product.id);
      setReviews(reviewsData);
    } catch (error) {
      console.error('Error loading reviews:', error);
    }
  };

  const handleRating = (value) => {
    setRating(value);
  };

  const handleSubmitReview = async () => {
    if (!user) {
      toast.error('রিভিউ দিতে লগইন করুন!');
      return;
    }
    
    if (rating === 0) {
      toast.error('দয়া করে রেটিং দিন!');
      return;
    }
    
    if (!reviewText.trim()) {
      toast.error('রিভিউ লিখুন!');
      return;
    }
    
    setLoading(true);
    
    try {
      await addReview(product.id, {
        userId: user.id,
        userName: user.name,
        rating,
        text: reviewText,
        userImage: user.photoURL || null
      });
      
      toast.success('রিভিউ দেওয়ার জন্য ধন্যবাদ!');
      setRating(0);
      setReviewText('');
      loadReviews();
    } catch (error) {
      console.error('Error submitting review:', error);
      toast.error('রিভিউ জমা দিতে সমস্যা হয়েছে');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images?.[0] || product.image
    });
    toast.success(`${product.name} কার্টে যোগ করা হয়েছে!`);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    onClose();
    // Open cart drawer logic would go here
  };

  const handleWishlistToggle = () => {
    if (isInWishlist) {
      removeFromWishlist(product.id);
      toast.success('উইশলিস্ট থেকে সরানো হয়েছে');
    } else {
      addToWishlist(product.id);
      toast.success('উইশলিস্টে যোগ করা হয়েছে');
    }
  };

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    let stars = '';
    
    for (let i = 0; i < 5; i++) {
      if (i < fullStars) stars += '★';
      else if (i === fullStars && hasHalfStar) stars += '½';
      else stars += '☆';
    }
    
    return stars;
  };

  const calculateAverageRating = () => {
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return (sum / reviews.length).toFixed(1);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: '100%' }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: '100%' }}
      transition={{ type: 'spring', damping: 25, stiffness: 300 }}
      className="fixed inset-0 bg-white z-50 overflow-y-auto"
    >
      <div className="max-w-2xl mx-auto relative pb-24 md:max-w-4xl md:pb-0 md:my-8">
        {/* Header */}
        <div className="sticky top-0 bg-white z-10 px-4 py-3 flex items-center justify-between border-b border-gray-100 md:relative md:border-0">
          <button
            onClick={onClose}
            className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-all"
          >
            <i className="fas fa-arrow-left"></i>
          </button>
          <h3 className="font-bold text-lg">প্রোডাক্ট ডিটেইলস</h3>
          <div className="flex gap-2">
            <button className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-all">
              <i className="fas fa-share-alt"></i>
            </button>
            <button
              onClick={handleWishlistToggle}
              className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-all"
            >
              <i className={`${isInWishlist ? 'fas fa-heart text-secondary' : 'far fa-heart'}`}></i>
            </button>
          </div>
        </div>

        {/* Image Gallery */}
        <div className="px-4 pt-4">
          <ProductImageGallery
            images={product.images || [product.image]}
            productName={product.name}
          />
        </div>

        {/* Product Info */}
        <div className="px-4 pt-4">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">{product.name}</h1>

          {/* Rating */}
          <div className="flex items-center gap-2 mb-3">
            <div className="text-yellow-500 text-base">
              {renderStars(calculateAverageRating())}
            </div>
            <span className="text-gray-500 text-sm">({calculateAverageRating()})</span>
            <span className="text-gray-500 text-sm bg-gray-100 px-2 py-1 rounded-full">
              {product.sold || 0} সল্ড
            </span>
          </div>

          {/* Sample Review */}
          <div className="bg-gray-50 rounded-xl p-3 mb-4 relative border-l-4 border-primary">
            <p className="text-gray-600 text-sm italic">
              "{product.sampleReview || 'দারুণ প্রোডাক্ট, ডেলিভারি দ্রুত ছিল!'}"
            </p>
          </div>

          {/* Price */}
          <div className="flex items-center gap-3 mb-4 flex-wrap">
            <span className="text-3xl font-bold text-primary">৳{product.price}</span>
            {product.oldPrice && (
              <span className="text-gray-400 line-through text-lg">৳{product.oldPrice}</span>
            )}
            {product.discount && (
              <span className="gradient-secondary text-white px-3 py-1 rounded-full text-sm font-semibold">
                {product.discount}
              </span>
            )}
          </div>

          {/* Description Preview */}
          <p className="text-gray-600 leading-relaxed mb-3">
            {expanded ? product.description : `${product.description?.substring(0, 100)}...`}
          </p>

          {/* See More Button */}
          {product.description?.length > 100 && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="text-primary font-semibold flex items-center gap-1 mb-5 hover:text-primary-dark transition-all"
            >
              {expanded ? 'See Less' : 'See More'}
              <i className={`fas fa-chevron-${expanded ? 'up' : 'down'} text-sm`}></i>
            </button>
          )}

          {/* Full Details */}
          <AnimatePresence>
            {expanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="bg-gray-50 rounded-xl p-4 mb-5">
                  <p className="text-gray-700 leading-relaxed">{product.description}</p>
                </div>

                {/* Specifications */}
                {product.specs && Object.keys(product.specs).length > 0 && (
                  <div className="mb-5">
                    <h4 className="font-bold text-lg mb-3 flex items-center gap-2">
                      <i className="fas fa-clipboard-list text-primary"></i>
                      স্পেসিফিকেশন
                    </h4>
                    <div className="border border-gray-200 rounded-xl overflow-hidden">
                      {Object.entries(product.specs).map(([key, value], index) => (
                        <div
                          key={index}
                          className={`flex p-3 ${index !== Object.keys(product.specs).length - 1 ? 'border-b border-gray-200' : ''}`}
                        >
                          <span className="w-2/5 font-semibold text-gray-700">{key}</span>
                          <span className="w-3/5 text-gray-600">{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Review Section */}
          <div className="border border-gray-200 rounded-xl overflow-hidden mb-6">
            <button
              onClick={() => setShowReview(!showReview)}
              className="w-full bg-gray-50 p-3 flex items-center justify-between hover:bg-gray-100 transition-all"
            >
              <span className="font-semibold flex items-center gap-2">
                <i className="fas fa-star text-primary"></i>
                রিভিউ ও রেটিং
              </span>
              <i className={`fas fa-chevron-${showReview ? 'up' : 'down'} text-gray-500`}></i>
            </button>

            <AnimatePresence>
              {showReview && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="p-4 border-t border-gray-200">
                    {/* Rating Stars */}
                    <div className="mb-4">
                      <p className="text-sm text-gray-600 mb-2">আপনার রেটিং দিন:</p>
                      <div className="flex gap-2 text-2xl">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            onClick={() => handleRating(star)}
                            className="focus:outline-none"
                          >
                            <i className={`${rating >= star ? 'fas fa-star text-yellow-500' : 'far fa-star text-gray-300'}`}></i>
                          </button>
                        ))}
                      </div>
                      <span className="text-sm text-gray-500 ml-2">{rating}/5</span>
                    </div>

                    {/* Review Input */}
                    <textarea
                      value={reviewText}
                      onChange={(e) => setReviewText(e.target.value)}
                      placeholder="আপনার অভিজ্ঞতা লিখুন..."
                      rows="3"
                      className="w-full p-3 border border-gray-200 rounded-xl resize-none focus:border-primary focus:outline-none mb-3"
                    ></textarea>

                    <button
                      onClick={handleSubmitReview}
                      disabled={loading}
                      className="w-full gradient-primary text-white py-2 rounded-xl font-semibold hover:scale-105 transition-all disabled:opacity-50"
                    >
                      {loading ? 'পাঠানো হচ্ছে...' : 'রিভিউ সাবমিট'}
                    </button>

                    {/* Existing Reviews */}
                    <div className="mt-5">
                      <h5 className="font-semibold mb-3">সকল রিভিউ</h5>
                      {reviews.length === 0 ? (
                        <p className="text-gray-400 text-center py-5">কোনো রিভিউ এখনো দেওয়া হয়নি</p>
                      ) : (
                        <div className="space-y-3 max-h-64 overflow-y-auto">
                          {reviews.map((review, index) => (
                            <div key={index} className="bg-gray-50 p-3 rounded-xl">
                              <div className="flex items-center justify-between mb-2">
                                <span className="font-semibold text-sm">{review.userName}</span>
                                <div className="text-yellow-500 text-xs">
                                  {renderStars(review.rating)}
                                </div>
                              </div>
                              <p className="text-gray-600 text-sm">{review.text}</p>
                              <span className="text-gray-400 text-xs mt-1 block">
                                {new Date(review.createdAt).toLocaleDateString('bn-BD')}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Related Products */}
          {relatedProducts && relatedProducts.length > 0 && (
            <div className="mb-6">
              <h4 className="font-bold text-lg mb-3 flex items-center gap-2">
                <i className="fas fa-layer-group text-secondary"></i>
                রিলেটেড প্রোডাক্টস
              </h4>
              <div className="grid grid-cols-2 gap-3">
                {relatedProducts.slice(0, 4).map((related) => (
                  <div
                    key={related.id}
                    onClick={() => window.location.href = `/product/${related.id}`}
                    className="bg-white border border-gray-200 rounded-xl p-3 text-center cursor-pointer hover:shadow-lg transition-all hover:-translate-y-1"
                  >
                    <img
                      src={related.images?.[0] || related.image}
                      alt={related.name}
                      className="w-full h-24 object-contain mb-2"
                    />
                    <div className="font-semibold text-sm truncate">{related.name}</div>
                    <div className="text-primary font-bold text-sm">৳{related.price}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Bottom Actions */}
        <div className="fixed bottom-0 left-0 right-0 bg-white p-4 flex gap-3 shadow-lg border-t border-gray-200 md:relative md:border-t-0 md:shadow-none md:p-0 md:mt-4">
          <button
            onClick={handleAddToCart}
            className="flex-1 gradient-secondary text-white py-3 rounded-full font-bold flex items-center justify-center gap-2 hover:scale-105 transition-all"
          >
            <i className="fas fa-shopping-cart"></i>
            কার্টে যোগ করুন
          </button>
          <button
            onClick={handleBuyNow}
            className="flex-1 gradient-primary text-white py-3 rounded-full font-bold flex items-center justify-center gap-2 hover:scale-105 transition-all"
          >
            এখনই কিনুন
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductDetail;