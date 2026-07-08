import React from "react";
import { getTranslations } from "next-intl/server";
import { Metadata } from "next";
import ForgetPage from "@/components/pages/forget";

export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> => {
  const { locale } = await params;
  const t = await getTranslations({ locale });

  return {
    title: t("Forget"),
    description: t("Forget Page"),
  };
};

const Page = () => {
  return (
    <div>
      <ForgetPage />
    </div>
  );
};

export default Page;
