"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import useLayoutStore from "@/store/layout-store";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { useState } from "react";
import { Eye, EyeOff, LoaderCircle } from "lucide-react";
import axios from "axios";
import Link from "next/link";
import { motion } from "framer-motion";

export default function ForgetPage() {
  const t = useTranslations();
  const router = useRouter();
  const { setCredentials } = useLayoutStore();

  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      const formData = new FormData(event.currentTarget);

      const username = formData.get("username") as string;
      const password = formData.get("password") as string;

      const res = await axios.post(
        "https://dummyjson.com/auth/login",
        {
          username,
          password,
          expiresInMins: 30,
        },
        {
          withCredentials: true,
        },
      );

      Cookies.set("accessToken", res.data.accessToken);

      setCredentials(username, res.data.accessToken);

      toast.success("Login successful");

      router.push("/admin/dashboard");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30 }}
      transition={{ duration: 0.35 }}
      className="grid min-h-screen lg:grid-cols-2"
    >
      <div className="flex items-center justify-center bg-white px-6 py-10">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="mb-12">
            <Image src="/logo.png" alt="logo" width={70} height={70} priority />
          </div>

          {/* Heading */}
          <div className="mb-10">
            <p className="text-gray-500 text-sm">{t("Password recovery")}</p>

            <h1 className="text-4xl font-bold text-gray-900 mt-2 mb-3">
              {t("Forgot your password?")}
            </h1>
            <span>
              {t(
                "Kindly enter the email address linked to this account and we will send you a code to enable you change your password.",
              )}
            </span>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Username */}
            <div>
              <Label className="mb-2 block">{t("Email")}</Label>

              <Input
                name="Email"
                placeholder="Enter email"
                className="h-12 rounded-lg"
                required
              />
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 rounded-lg bg-gradient-to-r from-sky-500 to-blue-700 hover:opacity-90"
            >
              {isLoading && (
                <LoaderCircle className="mr-2 h-5 w-5 animate-spin" />
              )}
              Login
            </Button>
          </form>
        </div>
      </div>
      <div className="relative hidden lg:block">
        <Image
          src="/login-forget-img.png"
          alt="login"
          fill
          priority
          className="object-cover"
        />
      </div>
    </motion.div>
  );
}
