"use client";

import useLayoutStore from "@/store/layout-store";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { type ReactNode, useEffect, useState } from "react";
import { api } from "@/components/models/axios";
import Cookies from "js-cookie";

const AuthProvider = ({
  children,
  role,
}: {
  children: ReactNode;
  role?: string;
}) => {
  const t = useTranslations();
  const { setUser, user } = useLayoutStore();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const check = async () => {
      try {
        console.log("TOKEN:", Cookies.get("accessToken"));

        const res = await api.get("/auth/me");

        console.log("ME:", res.data);

        setUser(res.data);

        setIsLoading(false);
      } catch (err: any) {
        console.log("STATUS:", err.response?.status);
        console.log("DATA:", err.response?.data);
        console.log("HEADERS:", err.config?.headers);

        router.replace("/login");
      }
    };

    check();
  }, []);

  // useEffect(() => {
  //   let isMounted = true;
  //
  //   console.log(Cookies.get("accessToken"));
  //
  //   const check = async () => {
  //     try {
  //       const res = await api.get("/auth/me");
  //       if (!isMounted) return;
  //
  //       if (res.status === 200 || res.status === 201) {
  //         const userData = res.data.data;
  //         setUser(userData);
  //         if (
  //           role &&
  //           userData.role.toString().toUpperCase() !== role.toUpperCase()
  //         ) {
  //           router.replace(
  //             `/${userData.role.toLowerCase().replace("_", "-")}/dashboard`,
  //           );
  //           return; // 🔑 redirect bo'lsa isLoading false qilmaslik
  //         }
  //         setIsLoading(false); // ✅ Faqat to‘g‘ri foydalanuvchi bo‘lsa ochamiz
  //       } else {
  //         router.replace("/login");
  //       }
  //     } catch {
  //       router.replace("/login");
  //     }
  //   };
  //
  //   check();
  //
  //   return () => {
  //     isMounted = false;
  //   };
  // }, [role, router, setUser]);

  // ✅ loading bo‘lsa yoki user hali kelmagan bo‘lsa faqat spinner
  if (isLoading || !user) {
    return (
      <div className="absolute bg-white top-0 left-0 z-50 flex justify-center items-center h-screen w-full gap-3">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900" />
        <p className="ml-2 text-black">{t("loading")}...</p>
      </div>
    );
  }

  return <>{children}</>;
};

export default AuthProvider;
