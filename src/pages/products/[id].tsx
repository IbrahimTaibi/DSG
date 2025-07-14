import { GetServerSideProps, NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Product } from '@/types/product';
import { useProductReviews, useSubmitReview } from '@/hooks/useReviews';
import { ReviewList } from '@/components/reviews/ReviewList';
import { ReviewForm } from '@/components/reviews/ReviewForm';
import { useAuth } from '@/contexts/AuthContext';
import { useDarkMode } from '@/contexts/DarkModeContext';
import LoadingSkeleton from '@/components/ui/LoadingSkeleton';
import { ProductGallery } from '@/components/product/ProductGallery';
import { ProductInfoPanel } from '@/components/product/ProductInfoPanel';
import { ProductDescriptionCard } from '@/components/product/ProductDescriptionCard';
import ProductCard from '@/components/product/ProductCard';

interface ProductDetailPageProps {
  product: Product | null;
  error?: string;
}

const ProductDetailPage: NextPage<ProductDetailPageProps> = ({ product, error }) => {
  const { currentTheme } = useDarkMode();
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const productId = product?._id || product?.id || (router.query.id as string);
  const { reviews = [], average = 0, count = 0, loading: reviewsLoading, reload } = useProductReviews(productId);
  const { submit, loading: submitLoading, error: submitError, success } = useSubmitReview(productId);
  const [userReview, setUserReview] = useState<number | undefined>(undefined);

  useEffect(() => {
    if (productId) {
      reload();
    }
  }, [productId, reload]);

  useEffect(() => {
    if (reviews && user) {
      const found = reviews.find(r => r.user._id === user.id);
      setUserReview(found?.rating);
    }
  }, [reviews, user]);

  const handleReviewSubmit = async (rating: number) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : '';
    if (!token) return;
    await submit(rating, token);
    reload();
  };

  if (error) {
    return <div className="max-w-2xl mx-auto py-16 text-center text-red-500 text-xl font-semibold">{error}</div>;
  }
  if (!product) {
    return <div className="max-w-2xl mx-auto py-16 text-center text-gray-500 text-xl font-semibold">Produit introuvable.</div>;
  }

  return (
    <>
      <Head>
        <title>{product.name} | Détail du produit</title>
        <meta name="description" content={product.description || 'Détail du produit'} />
      </Head>
      <div
        className="min-h-screen relative"
        style={{ backgroundColor: currentTheme.background.primary }}
      >
        {/* Background Pattern */}
        <div
          className="absolute inset-0 opacity-5 pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(circle at 25% 25%, ${currentTheme.interactive.primary} 2px, transparent 2px)`,
            backgroundSize: '40px 40px',
            zIndex: 0,
          }}
        />
        <div className="relative z-10 max-w-6xl mx-auto px-4 py-8">
          {/* Hero Section */}
          <section className="flex flex-col lg:flex-row gap-10 mb-10">
            {/* Product Gallery */}
            <div className="flex-1 flex items-center justify-center bg-white dark:bg-gray-900 rounded-3xl shadow-lg p-6" style={{ background: currentTheme.background.secondary }}>
              <ProductGallery image={product.image || '/dsg-photo.jpg'} alt={product.name} />
            </div>
            {/* Info Panel (Sticky on desktop) */}
            <div className="flex-1 lg:max-w-sm lg:sticky lg:top-8 self-stretch">
              <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-lg p-8 h-full flex flex-col" style={{ background: currentTheme.background.secondary }}>
                <h1 className="text-4xl font-bold mb-2" style={{ color: currentTheme.text.primary }}>{product.name}</h1>
                <div className="flex-1">
                  <ProductInfoPanel product={product} averageRating={average} reviewCount={count} />
                  {/* Description */}
                  <div className="mt-6">
                    <ProductDescriptionCard description={product.description} />
                  </div>
                </div>
                {/* Add to Cart, Wishlist, etc. can go here */}
                {/* Review Summary (jump link) */}
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <a href="#reviews" className="text-sm hover:underline transition" style={{ color: currentTheme.interactive.primary }}>Voir les avis clients ({count})</a>
                </div>
              </div>
            </div>
          </section>

          {/* Description & Details - REMOVED */}
          {/* <section className="mb-12">
            <ProductDescriptionCard description={product.description} />
          </section> */}

          {/* Encouragement Card + Reviews Section side by side */}
          <section className="mb-12">
            <div className="flex flex-col md:flex-row gap-8">
              {/* Reviews Section */}
              <div className="flex-1">
                <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-lg p-8 h-full" style={{ background: currentTheme.background.secondary }}>
                  <h2 className="text-2xl font-bold mb-4" style={{ color: currentTheme.text.primary }}>Avis des clients</h2>
                  {reviewsLoading ? (
                    <div className="w-full flex justify-center"><div style={{ width: 320, height: 80, borderRadius: 16, overflow: 'hidden' }}><LoadingSkeleton /></div></div>
                  ) : (
                    <ReviewList reviews={reviews} average={average} count={count} />
                  )}
                  <div className="mt-8 flex flex-col md:flex-row gap-6">
                    {isAuthenticated && (
                      <div className="flex-1">
                        <ReviewForm
                          onSubmit={handleReviewSubmit}
                          initialRating={userReview}
                          loading={submitLoading}
                          success={success}
                          error={submitError}
                        />
                      </div>
                    )}
                  </div>
                  {!isAuthenticated && (
                    <div className="text-center text-gray-500 mt-4">Connectez-vous pour laisser un avis.</div>
                  )}
                </div>
              </div>
              {/* Encouragement Card */}
              <div className="flex-1">
                <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-lg p-8 flex flex-col justify-center items-start h-full" style={{ background: currentTheme.background.secondary }}>
                  <div className="flex items-center gap-2 mb-4">
                    <svg width="28" height="28" fill="none" viewBox="0 0 24 24"><path d="M12 17.75l-6.16 3.24 1.18-6.88L2 9.76l6.92-1L12 2.5l3.08 6.26 6.92 1-5.02 4.35 1.18 6.88z" fill="#fbbf24"/></svg>
                    <span className="text-xl font-bold" style={{ color: currentTheme.text.primary }}>Partagez votre expérience !</span>
                  </div>
                  <p className="text-base text-gray-600 dark:text-gray-300 mb-3">Votre avis compte énormément pour notre communauté. Aidez les autres clients à faire le bon choix en partageant votre expérience avec ce produit.</p>
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-green-500"></div>
                      <span className="text-sm text-gray-600 dark:text-gray-300">Aidez les futurs acheteurs</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                      <span className="text-sm text-gray-600 dark:text-gray-300">Gagnez la confiance de la communauté</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                      <span className="text-sm text-gray-600 dark:text-gray-300">Contribuez à améliorer nos produits</span>
                    </div>
                  </div>
                  {!isAuthenticated && (
                    <button 
                      className="px-6 py-2 rounded-lg font-semibold text-white transition"
                      style={{ background: currentTheme.interactive.primary }}
                      onClick={() => router.push('/auth/login')}
                    >
                      Se connecter pour évaluer
                    </button>
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* Related Products Section */}
          <section className="mb-8">
            <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-lg p-8" style={{ background: currentTheme.background.secondary }}>
              <h2 className="text-2xl font-bold mb-6" style={{ color: currentTheme.text.primary }}>Produits similaires</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                {[1, 2, 3, 4].map((i) => (
                  <ProductCard
                    key={i}
                    product={{
                      _id: `placeholder-${i}`,
                      id: `placeholder-${i}`,
                      name: `Produit Similaire ${i}`,
                      price: 25 + (i * 5),
                      image: '/dsg-photo.jpg',
                      category: { name: 'Catégorie' },
                      description: 'Description du produit similaire avec plus de détails pour tester l\'affichage.',
                      stock: 10 + i,
                      averageRating: 4.2 + (i * 0.1),
                      reviewCount: 15 + (i * 3),
                    }}
                  />
                ))}
              </div>
            </div>
          </section>
        </div>
      </div>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.params || {};
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5010'}/api/products/${id}`);
    if (!res.ok) {
      return { props: { product: null, error: 'Produit introuvable.' } };
    }
    const product = await res.json();
    return { props: { product } };
  } catch (err: any) {
    return { props: { product: null, error: err?.message || 'Erreur lors du chargement du produit.' } };
  }
};

export default ProductDetailPage; 