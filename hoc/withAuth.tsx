"use client";

import React, { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAppSelector } from "@/hooks/useRedux";
import { Loader2 } from "lucide-react";

const withAuth = <P extends object>(
  WrappedComponent: React.ComponentType<P>
) => {
  const AuthenticatedComponent = (props: P) => {
    const { isLoading, user } = useAppSelector((state) => state.auth);
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
      if (!isLoading && !user) {
        router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
      } else {
      }
    }, [isLoading, user, pathname, router]);

    if (isLoading || !user) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-black">
          <div className="fixed inset-0 bg-white z-50 flex items-center justify-center">
            <div className="text-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Loading...</p>
            </div>
          </div>
        </div>
      );
    }

    return <WrappedComponent {...props} />;
  };

  return AuthenticatedComponent;
};

export default withAuth;
