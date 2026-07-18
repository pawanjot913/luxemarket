import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { RefreshCw } from 'lucide-react';
import ProductDetailsPage from './ProductDetailsPage';
import { fetchProductById, fetchProductReviews, addProductReview, fetchProducts } from '../api';
import { Product, Color, ProductReview } from '../types';

interface DetailsPageWrapperProps {
  selectedProductForDetails: Product | null;
  setSelectedProductForDetails: (product: Product | null) => void;
  setCurrentPage: (page: string) => void;
  setIsInformationOpen: (open: boolean) => void;
  handleAddToCart: (product: Product, size: string, color: Color, quantity: number) => void;
  handleFavoriteToggle: (product: Product) => void;
  favoriteItems: Product[];
  authToken: string | null;
  triggerNotification: (message: string, type?: 'success' | 'info') => void;
  setAllProductsForFilters: (products: Product[]) => void;
  setProducts: (products: Product[]) => void;
  currentPageNum: number;
  selectedCategories: string[];
  searchQuery: string;
  currentPage: string;
}

export default function ProductDetailsPageWrapper({
  selectedProductForDetails,
  setSelectedProductForDetails,
  setCurrentPage,
  setIsInformationOpen,
  handleAddToCart,
  handleFavoriteToggle,
  favoriteItems,
  authToken,
  triggerNotification,
  setAllProductsForFilters,
  setProducts,
  currentPageNum,
  selectedCategories,
  searchQuery,
  currentPage,
}: DetailsPageWrapperProps) {
  const { productId } = useParams<{ productId: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  // Reviews states
  const [reviews, setReviews] = useState<ProductReview[]>([]);
  const [reviewsAvgRating, setReviewsAvgRating] = useState(0);
  const [reviewsCount, setReviewsCount] = useState(0);

  // Review form inputs
  const [writeRating, setWriteRating] = useState<number>(5);
  const [writeComment, setWriteComment] = useState<string>('');
  const [submitReviewError, setSubmitReviewError] = useState<string | null>(null);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  // Local details swatch states
  const [selectedDetailSize, setSelectedDetailSize] = useState<string>('');
  const [selectedDetailColor, setSelectedDetailColor] = useState<Color | null>(null);
  const [selectedDetailImage, setSelectedDetailImage] = useState<string>('');
  const [activeDetailTab, setActiveDetailTab] = useState<'details' | 'shipping' | 'reviews'>('details');

  const loadProductReviews = async (id: string) => {
    try {
      const data = await fetchProductReviews(id, 1, 50);
      setReviews(data.reviews);
      setReviewsAvgRating(data.averageRating);
      setReviewsCount(data.numReviews);
    } catch (err) {
      console.error('Failed to load reviews', err);
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product || !authToken) return;

    if (!writeComment.trim()) {
      setSubmitReviewError('Please enter a review comment.');
      return;
    }

    try {
      setIsSubmittingReview(true);
      setSubmitReviewError(null);
      await addProductReview(product.id, writeRating, writeComment, authToken);
      
      await loadProductReviews(product.id);
      setWriteComment('');
      setWriteRating(5);
      triggerNotification('Review submitted successfully!');
      
      // Refresh the product list coordinates
      const fullList = await fetchProducts(1, 1000);
      setAllProductsForFilters(fullList);
      
      let genderParam: string | undefined = undefined;
      if (currentPage === 'men') genderParam = 'Men';
      else if (currentPage === 'women') genderParam = 'Women';
      let categoryParam: string | undefined = undefined;
      if (currentPage === 'accessories') {
        categoryParam = selectedCategories.length > 0 ? selectedCategories.join(',') : 'Accessories,Eyewear,Bags';
      } else if (selectedCategories.length > 0) {
        categoryParam = selectedCategories.join(',');
      }
      const limit = 10;
      const fetched = await fetchProducts(currentPageNum, limit, categoryParam, searchQuery, genderParam);
      setProducts(fetched);
    } catch (err) {
      setSubmitReviewError(err instanceof Error ? err.message : 'Failed to submit review.');
    } finally {
      setIsSubmittingReview(false);
    }
  };

  useEffect(() => {
    if (!productId) return;
    
    const initializePage = (p: Product) => {
      setProduct(p);
      setSelectedProductForDetails(p);
      setSelectedDetailSize(p.sizes?.[0] || 'S');
      setSelectedDetailColor(p.colors?.[0] || null);
      setSelectedDetailImage(p.image);
      setActiveDetailTab('details');
      setWriteRating(5);
      setWriteComment('');
      setSubmitReviewError(null);
      
      loadProductReviews(p.id);
    };

    if (selectedProductForDetails?.id === productId) {
      initializePage(selectedProductForDetails);
      setLoading(false);
      return;
    }

    const loadProductData = async () => {
      try {
        setLoading(true);
        const p = await fetchProductById(productId);
        initializePage(p);
      } catch (err) {
        console.error('Failed to load product details from route param', err);
      } finally {
        setLoading(false);
      }
    };
    loadProductData();
  }, [productId]);

  if (loading) {
    return (
      <div className="text-center py-40">
        <RefreshCw className="animate-spin mx-auto text-neutral-400 mb-4" size={32} />
        <p className="text-xs text-neutral-500 font-medium">Retrieving product specs...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-40 text-red-500 font-medium text-xs">
        Product specs not found.
      </div>
    );
  }

  return (
    <ProductDetailsPage
      selectedProductForDetails={product}
      setCurrentPage={setCurrentPage}
      selectedDetailImage={selectedDetailImage}
      setSelectedDetailImage={setSelectedDetailImage}
      reviewsAvgRating={reviewsAvgRating}
      reviewsCount={reviewsCount}
      selectedDetailColor={selectedDetailColor}
      setSelectedDetailColor={setSelectedDetailColor}
      selectedDetailSize={selectedDetailSize}
      setSelectedDetailSize={setSelectedDetailSize}
      setIsInformationOpen={setIsInformationOpen}
      handleAddToCart={handleAddToCart}
      handleFavoriteToggle={handleFavoriteToggle}
      favoriteItems={favoriteItems}
      activeDetailTab={activeDetailTab}
      setActiveDetailTab={setActiveDetailTab}
      reviews={reviews}
      authToken={authToken}
      handleSubmitReview={handleSubmitReview}
      submitReviewError={submitReviewError}
      writeRating={writeRating}
      setWriteRating={setWriteRating}
      writeComment={writeComment}
      setWriteComment={setWriteComment}
      isSubmittingReview={isSubmittingReview}
    />
  );
}
