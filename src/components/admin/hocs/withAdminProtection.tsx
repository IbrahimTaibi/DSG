import React from "react";
import AdminProtected from "@/components/admin/layout/AdminProtected";

// Higher-order component for admin protection
export function withAdminProtection<P extends object>(
  WrappedComponent: React.ComponentType<P>,
) {
  return function AdminProtectedComponent(props: P) {
    return (
      <AdminProtected>
        <WrappedComponent {...props} />
      </AdminProtected>
    );
  };
}

// Alternative: Function that returns a protected component
export function createProtectedAdminPage<P extends object>(
  Component: React.ComponentType<P>,
) {
  return function ProtectedAdminPage(props: P) {
    return (
      <AdminProtected>
        <Component {...props} />
      </AdminProtected>
    );
  };
}
