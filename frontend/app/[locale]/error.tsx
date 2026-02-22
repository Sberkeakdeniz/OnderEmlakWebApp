"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations("error");

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 px-4">
      <AlertTriangle className="w-12 h-12 text-destructive" />
      <h2 className="text-2xl font-semibold">{t("heading")}</h2>
      <p className="text-muted-foreground text-center max-w-md">
        {t("message")}
      </p>
      <Button onClick={reset}>{t("retry")}</Button>
    </div>
  );
}
