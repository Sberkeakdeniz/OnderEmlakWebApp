"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations("error");

  return (
    <div className="flex flex-col items-center justify-center h-96 gap-6">
      <AlertTriangle className="w-12 h-12 text-destructive" />
      <h2 className="text-xl font-semibold">{t("heading")}</h2>
      <p className="text-muted-foreground text-center max-w-md">
        {t("message")}
      </p>
      <Button onClick={reset}>{t("retry")}</Button>
    </div>
  );
}
