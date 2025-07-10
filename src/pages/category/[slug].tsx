import { useRouter } from 'next/router';
import { useDarkMode } from '../../contexts/DarkModeContext';
import { useCategories } from '../../hooks/useCategories';

export default function CategoryPage() {
  const router = useRouter();
  const { slug } = router.query;
  const { currentTheme } = useDarkMode();
  const { categories } = useCategories();

  const currentCategory = categories.find(cat => cat.slug === slug);

  return (
    <div
      className="min-h-screen p-8"
      style={{ backgroundColor: currentTheme.background.primary }}
    >
      <div className="max-w-4xl mx-auto">
        <div
          className="mb-8 p-6 rounded-lg"
          style={{ 
            backgroundColor: currentTheme.background.card,
            border: `1px solid ${currentTheme.border.primary}`,
          }}
        >
          <h1
            className="text-3xl font-bold mb-4"
            style={{ color: currentTheme.text.primary }}
          >
            {currentCategory ? currentCategory.name : `Category: ${slug}`}
          </h1>
          <p
            className="text-lg"
            style={{ color: currentTheme.text.secondary }}
          >
            {currentCategory 
              ? `Browse products in ${currentCategory.name}`
              : `Category page for: ${slug}`
            }
          </p>
        </div>

        <div
          className="p-6 rounded-lg"
          style={{ 
            backgroundColor: currentTheme.background.card,
            border: `1px solid ${currentTheme.border.primary}`,
          }}
        >
          <h2
            className="text-xl font-semibold mb-4"
            style={{ color: currentTheme.text.primary }}
          >
            All Categories
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((category) => (
              <div
                key={category._id}
                className={`p-4 rounded-md border transition-all duration-200 cursor-pointer ${
                  category.slug === slug ? 'ring-2' : 'hover:ring-1'
                }`}
                style={{
                  backgroundColor: category.slug === slug 
                    ? currentTheme.background.tertiary 
                    : currentTheme.background.secondary,
                  borderColor: category.slug === slug 
                    ? currentTheme.interactive.primary 
                    : currentTheme.border.primary,
                }}
                onClick={() => router.push(`/category/${category.slug}`)}
              >
                <h3
                  className="font-medium"
                  style={{ 
                    color: category.slug === slug 
                      ? currentTheme.interactive.primary 
                      : currentTheme.text.primary 
                  }}
                >
                  {category.name}
                </h3>
                <p
                  className="text-sm mt-1"
                  style={{ color: currentTheme.text.muted }}
                >
                  {category.slug}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 