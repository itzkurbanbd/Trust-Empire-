'use client';

import { motion } from 'framer-motion';
import { useCart } from '@/hooks/useCart';
import { useWishlist } from '@/hooks/useWishlist';
import toast from 'react-hot-toast';

const ProductCard = ({ product, onProductClick }) => {
  const { addToCart } = useCart();
  const { wishlist, addToWishlist, removeFromWishlist } = useWishlist();
  
  const isInWishlist = wishlist.includes(product.id);
  
  const handleWishlist = (e) => {
    e.stopPropagation();
    if (isInWishlist) {
      removeFromWishlist(product.id);
      toast.success('উইশলিস্ট থেকে সরানো হয়েছে');
    } else {
      addToWishlist(product.id);
      toast.success('উইশলিস্টে যোগ করা হয়েছে');
    }
  };
  
  const handleAddToCart = (e) => {
    e.stopPropagation();
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images?.[0] || product.image
    });
    toast.success(`${product.name} কার্টে যোগ করা হয়েছে!`);
  };
  
  const handleOrderNow = (e) => {
    e.stopPropagation();
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images?.[0] || product.image
    });
    toast.success(`${product.name} কার্টে যোগ করা হয়েছে!`);
    // Open cart drawer logic would go here
  };
  
  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    let stars = '';
    
    for (let i = 0; i < 5; i++) {
      if (i < fullStars) stars += '★';
      else if (i === fullStars && halfStar) stars += '½';
      else stars += '☆';
    }
    
    return stars;
  };

  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
      onClick={() => onProductClick?.(product.id)}
      className="bg-white rounded-xl p-3 relative cursor-pointer shadow-md border border-gray-100 hover:shadow-xl transition-all"
    >
      {/* Discount Tag */}
      {product.discount && (
        <div className="absolute top-2 left-2 gradient-secondary text-white text-[10px] font-bold px-2 py-1 rounded z-10">
          {product.discount}
        </div>
      )}
      
      {/* Wishlist Button */}
      <button
        onClick={handleWishlist}
        className="absolute top-2 right-2 w-7 h-7 bg-white rounded-full flex items-center justify-center shadow-md hover:scale-110 transition-all z-10"
      >
        <i className={`${isInWishlist ? 'fas fa-heart text-secondary' : 'far fa-heart text-gray-400'}`}></i>
      </button>
      
      {/* Product Image */}
      <div className="w-full h-28 flex items-center justify-center mb-2">
        <img
          src={product.images?.[0] || product.image}
          alt={product.name}
          className="max-w-full max-h-full object-contain transition-transform hover:scale-105"
          loading="lazy"
        />
      </div>
      
      {/* Product Name */}
      <div className="font-semibold text-sm text-gray-800 mb-1 line-clamp-2 min-h-[40px]">
        {product.name}
      </div>
      
      {/* Product Meta */}
      {product.brand && (
        <div className="text-[10px] text-gray-500 bg-gray-100 inline-block px-2 py-0.5 rounded-full mb-2">
          <i className="fas fa-tag mr-1"></i>
          {product.brand}
        </div>
      )}
      
      {/* Price */}
      <div className="flex items-center gap-2 mb-2">
        <span className="text-primary font-bold text-sm">৳{product.price}</span>
        {product.oldPrice && (
          <span className="text-gray-400 text-xs line-through">৳{product.oldPrice}</span>
        )}
      </div>
      
      {/* Rating */}
      <div className="flex items-center gap-1 mb-3">
        <div className="text-yellow-500 text-[10px]">
          {renderStars(product.rating || 4.5)}
        </div>
        <span className="text-gray-500 text-[10px]">({product.sold || 0})</span>
      </div>
      
      {/* Buttons */}
      <div className="flex gap-2">
        <button
          onClick={handleOrderNow}
          className="flex-1 gradient-primary text-white text-[10px] font-bold py-1.5 rounded-md hover:scale-105 transition-all"
        >
          অর্ডার করুন
        </button>
        <button
          onClick={handleAddToCart}
          className="flex-1 gradient-secondary text-white text-[10px] font-bold py-1.5 rounded-md hover:scale-105 transition-all"
        >
          অ্যাড কার্ট
        </button>
      </div>
    </motion.div>
  );
};

export default ProductCard;