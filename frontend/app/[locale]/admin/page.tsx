"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  PlusCircle,
  ListFilter,
  Building2,
  Users,
  Eye,
  Loader2,
} from "lucide-react";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { statsApi } from "@/lib/api";

interface DashboardStats {
  totalProperties: number;
  activeProperties: number;
  totalCustomers: number;
  totalViews: number;
}

export default function AdminDashboard() {
  const t = useTranslations("admin.dashboard");
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const statsRes = await statsApi.getDashboard();
        setStats(statsRes.data);
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const statCards = [
    {
      label: t("totalListings"),
      value: stats?.totalProperties ?? 0,
      icon: Building2,
      color: "blue"
    },
    {
      label: t("activeListings"),
      value: stats?.activeProperties ?? 0,
      icon: ListFilter,
      color: "green"
    },
    {
      label: t("totalCustomers"),
      value: stats?.totalCustomers ?? 0,
      icon: Users,
      color: "violet"
    },
    {
      label: t("totalViews"),
      value: stats?.totalViews ?? 0,
      icon: Eye,
      color: "amber"
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <Card key={index} className="relative overflow-hidden group hover:shadow-md transition-shadow">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={cn(
                  "p-2 rounded-lg transition-colors",
                  stat.color === "blue" && "bg-blue-100 group-hover:bg-blue-200",
                  stat.color === "green" && "bg-green-100 group-hover:bg-green-200",
                  stat.color === "violet" && "bg-violet-100 group-hover:bg-violet-200",
                  stat.color === "amber" && "bg-amber-100 group-hover:bg-amber-200",
                )}>
                  <stat.icon className={cn(
                    "w-5 h-5",
                    stat.color === "blue" && "text-blue-600",
                    stat.color === "green" && "text-green-600",
                    stat.color === "violet" && "text-violet-600",
                    stat.color === "amber" && "text-amber-600",
                  )} />
                </div>
              </div>
              <h3 className="text-2xl font-bold mb-1">
                {typeof stat.value === 'number' && stat.value > 999
                  ? stat.value.toLocaleString('tr-TR')
                  : stat.value}
              </h3>
              <p className="text-muted-foreground text-sm">{stat.label}</p>
            </div>
            <div className={cn(
              "absolute inset-x-0 bottom-0 h-1",
              stat.color === "blue" && "bg-blue-100",
              stat.color === "green" && "bg-green-100",
              stat.color === "violet" && "bg-violet-100",
              stat.color === "amber" && "bg-amber-100",
            )}>
              <div className={cn(
                "h-full",
                stat.color === "blue" && "bg-blue-500",
                stat.color === "green" && "bg-green-500",
                stat.color === "violet" && "bg-violet-500",
                stat.color === "amber" && "bg-amber-500",
              )} style={{ width: '100%' }} />
            </div>
          </Card>
        ))}
      </div>

      <Card>
        <div className="p-6 flex items-center justify-between">
          <h3 className="text-lg font-semibold">{t("quickActions")}</h3>
          <Button asChild>
            <Link href="/admin/listings/new">
              <PlusCircle className="w-4 h-4 mr-2" />
              {t("addNewListing")}
            </Link>
          </Button>
        </div>
      </Card>
    </div>
  );
}
