// lib/auth.ts
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export interface User {
  name: string;
  id: string;
  phone: string;
  role: string;
  acy: string;
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

// ===== AUTHENTICATION HELPERS =====

/**
 * Get user from localStorage
 */
export const getStoredUser = (): User | null => {
  if (typeof window === "undefined") return null;

  try {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) return null;

    const parsedUser = JSON.parse(storedUser);

    // Validate required user properties
    if (
      !parsedUser ||
      !parsedUser.phone ||
      !parsedUser.id ||
      !parsedUser.name
    ) {
      localStorage.removeItem("user");
      return null;
    }

    return parsedUser;
  } catch (error) {
    console.error("Error parsing user data:", error);
    localStorage.removeItem("user");
    return null;
  }
};

/**
 * Clear user authentication
 */
export const clearAuth = (): void => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("user");
  }
};

/**
 * Check if user is authenticated
 */
export const isUserAuthenticated = (): boolean => {
  return getStoredUser() !== null;
};

/**
 * Check if user has specific role
 */
export const hasRole = (requiredRole: string): boolean => {
  const user = getStoredUser();
  return user?.role === requiredRole;
};

/**
 * Check if user is admin
 */
export const isAdmin = (): boolean => {
  return hasRole("admin");
};

// ===== REACT HOOKS =====

/**
 * Custom hook for authentication
 * @param redirectTo - Path to redirect if not authenticated (default: "/login")
 * @param requiredRole - Required role for access (optional)
 */
export const useAuth = (
  redirectTo: string = "/login",
  requiredRole?: string
): AuthState => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuthentication = () => {
      const storedUser = getStoredUser();

      if (!storedUser) {
        router.push(redirectTo);
        return;
      }

      // Check role if required
      if (requiredRole && storedUser.role !== requiredRole) {
        router.push("/login"); // or appropriate error page
        return;
      }

      setUser(storedUser);
      setIsLoading(false);
    };

    checkAuthentication();
  }, [router, redirectTo, requiredRole]);

  return {
    user,
    isLoading,
    isAuthenticated: user !== null,
  };
};

/**
 * Custom hook for optional authentication (doesn't redirect)
 */
export const useOptionalAuth = (): AuthState => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = getStoredUser();
    setUser(storedUser);
    setIsLoading(false);
  }, []);

  return {
    user,
    isLoading,
    isAuthenticated: user !== null,
  };
};

// ===== COMPONENTS =====

/**
 * Higher-Order Component for route protection
 */
export const withAuth = <P extends object>(
  WrappedComponent: React.ComponentType<P>,
  redirectTo: string = "/login",
  requiredRole?: string
) => {
  const AuthenticatedComponent = (props: P) => {
    const { user, isLoading } = useAuth(redirectTo, requiredRole);

    if (isLoading) {
      return (
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-gray-600">Loading...</p>
            </div>
          </div>
        </div>
      );
    }

    if (!user) {
      return null; // Will redirect
    }

    return <WrappedComponent {...props} />;
  };

  AuthenticatedComponent.displayName = `withAuth(${
    WrappedComponent.displayName || WrappedComponent.name
  })`;
  return AuthenticatedComponent;
};

/**
 * Protected Route Component
 */
interface ProtectedRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
  requiredRole?: string;
  fallback?: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  redirectTo = "/login",
  requiredRole,
  fallback,
}) => {
  const { user, isLoading } = useAuth(redirectTo, requiredRole);

  if (isLoading) {
    return (
      fallback || (
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-gray-600">Loading...</p>
            </div>
          </div>
        </div>
      )
    );
  }

  if (!user) {
    return null; // Will redirect
  }

  return <>{children}</>;
};

/**
 * Admin Route Component
 */
export const AdminRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <ProtectedRoute requiredRole="admin" redirectTo="/login">
      {children}
    </ProtectedRoute>
  );
};

// ===== LOADING COMPONENT =====
export const AuthLoadingSpinner: React.FC<{ message?: string }> = ({
  message = "Loading...",
}) => (
  <div className="container mx-auto px-4 py-8">
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-gray-600">{message}</p>
      </div>
    </div>
  </div>
);
