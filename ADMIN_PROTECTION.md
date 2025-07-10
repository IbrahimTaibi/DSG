# Admin Protection System

## Overview

The admin protection system ensures that only authenticated users with admin role can access the `/admin` section of the application. It provides a comprehensive solution with proper error handling, loading states, and theme-aware error pages.

## Architecture

### Components

1. **`useAdminProtection` Hook** (`src/hooks/useAdminProtection.ts`)

   - Checks user authentication and admin role
   - Returns loading state, error messages, and admin status
   - Handles edge cases and provides clear error messages

2. **`AdminProtected` Component** (`src/components/admin/AdminProtected.tsx`)

   - Higher-order component that wraps admin content
   - Shows loading spinner during authentication check
   - Displays error page for unauthorized access
   - Renders children only for authenticated admins

3. **`ErrorPage` Component** (`src/components/ui/ErrorPage.tsx`)

   - Theme-aware error page component
   - Supports custom error codes, messages, and icons
   - Provides navigation options (back, home)
   - Fully customizable with props

4. **`AdminLayout` Component** (`src/components/admin/AdminLayout.tsx`)
   - Main admin layout wrapper
   - Automatically protected with `AdminProtected`
   - Provides sidebar navigation and responsive design

### Error Pages

- **404 Page** (`src/pages/404.tsx`) - Page not found
- **500 Page** (`src/pages/500.tsx`) - Server error
- **403 Page** - Access denied (handled by `AdminProtected`)

## Usage

### Automatic Protection

All admin pages are automatically protected when using `AdminLayout`:

```tsx
import AdminLayout from "../../components/admin/AdminLayout";

export default function MyAdminPage() {
  return (
    <AdminLayout>
      {/* Your admin page content */}
    </AdminLayout>
  );
}
```

### Manual Protection

For custom admin pages that don't use `AdminLayout`:

```tsx
import AdminProtected from "../../components/admin/AdminProtected";

export default function CustomAdminPage() {
  return (
    <AdminProtected>
      {/* Your admin content */}
    </AdminProtected>
  );
}
```

### Custom Error Pages

Create custom error pages using the `ErrorPage` component:

```tsx
import ErrorPage from "../components/ui/ErrorPage";

export default function CustomError() {
  return (
    <ErrorPage
      title="Custom Error"
      message="Something went wrong"
      errorCode="CUSTOM"
      showHomeButton={true}
      showBackButton={true}
    />
  );
}
```

## Features

### Security

- ✅ Role-based access control
- ✅ Authentication verification
- ✅ Automatic redirection for unauthorized users
- ✅ Clear error messages for different scenarios

### User Experience

- ✅ Loading states during authentication checks
- ✅ Theme-aware error pages
- ✅ Responsive design
- ✅ Smooth animations and transitions
- ✅ Clear navigation options

### Developer Experience

- ✅ Modular architecture
- ✅ Reusable components
- ✅ TypeScript support
- ✅ Easy to extend and customize
- ✅ Consistent theming

## Error Handling

The system handles various error scenarios:

1. **Not Authenticated**: "Vous devez être connecté pour accéder à cette page"
2. **Not Admin**: "Vous n'avez pas les permissions nécessaires pour accéder à cette page"
3. **Loading**: Shows spinner with "Vérification des permissions..."
4. **Network Errors**: Handled gracefully with fallback messages

## Theming

All error pages and components respect the application's theme system:

- Light/dark mode support
- Consistent color palette
- Proper contrast ratios
- Smooth theme transitions

## File Structure

```
src/
├── hooks/
│   └── useAdminProtection.ts          # Admin protection hook
├── components/
│   ├── admin/
│   │   ├── AdminProtected.tsx         # Protection wrapper
│   │   ├── AdminLayout.tsx            # Main admin layout
│   │   └── withAdminProtection.tsx    # HOC utilities
│   └── ui/
│       └── ErrorPage.tsx              # Reusable error page
└── pages/
    ├── admin/                         # Protected admin pages
    ├── 404.tsx                        # Custom 404 page
    └── 500.tsx                        # Custom 500 page
```

## Best Practices

1. **Always use `AdminLayout`** for admin pages to ensure protection
2. **Customize error messages** for specific use cases
3. **Test with different user roles** to ensure proper access control
4. **Use the theme system** for consistent styling
5. **Provide clear navigation** options in error pages

## Future Enhancements

- [ ] Add audit logging for admin access attempts
- [ ] Implement session timeout handling
- [ ] Add multi-factor authentication support
- [ ] Create admin role hierarchy system
- [ ] Add admin activity dashboard
