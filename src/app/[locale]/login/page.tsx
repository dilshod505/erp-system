import React from "react";
import { getTranslations } from "next-intl/server";
import { Metadata } from "next";
import LoginPage from "@/components/pages/login";

export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> => {
  const { locale } = await params;
  const t = await getTranslations({ locale });

  return {
    title: t("Login"),
    description: t("Login Page"),
  };
};

const Page = () => {
  return (
    <div>
      <LoginPage />
    </div>
  );
};

export default Page;
