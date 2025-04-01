"use client";

import { useEffect } from "react";
import { useAuth } from "@/components/context/AuthContext";
import { useRouter } from "next/navigation";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.replace("/login");
    }
  }, [user, router]);

  return user ? <>{children}</> : null;
};

export default ProtectedRoute;
