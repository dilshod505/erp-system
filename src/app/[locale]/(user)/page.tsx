import { Button } from "@/components/ui/button";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import Link from "next/link";

export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> => {
  const { locale } = await params;
  const t = await getTranslations({ locale });

  return {
    title: "AIFU University",
    description: t(
      `Aniq va ijtimoiy fanlar universitetining kutubxona bo'limi`,
    ),
  };
};

const Page = () => {
  return (
    <div>
      <h1>Bosh sahifa</h1>
      <Link href={"login"}>
        <Button>Login</Button>
      </Link>
    </div>
  );
};

export default Page;
