import React from "react";
import { getTranslations } from "next-intl/server";
import { Metadata } from "next";
import SignUp from "@/components/pages/sign-up";

export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> => {
  const { locale } = await params;
  const t = await getTranslations({ locale });

  return {
    title: t("Sign up"),
    description: t("Sign up page"),
  };
};

const Page = () => {
  return (
    <div>
      <SignUp />
    </div>
  );
};

export default Page;
