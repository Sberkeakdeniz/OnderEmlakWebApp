"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { Toaster } from "sonner";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { Button } from "@/components/ui/button";
import {
  Building2,
  Users,
  Settings,
  LogOut,
  ChevronRight,
  LayoutDashboard,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/auth-context";
import { Link, useRouter, usePathname } from "@/i18n/navigation";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const t = useTranslations("admin");
  const router = useRouter();
  const pathname = usePathname();
  const { user, isAuthenticated, isLoading, logout } = useAuth();

  useEffect(() => {
    if (!isLoading && (!isAuthenticated || user?.role !== 'admin')) {
      router.push("/login");
    }
  }, [isLoading, isAuthenticated, user, router]);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50/50">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">{t("loading")}</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || user?.role !== 'admin') {
    return null;
  }

  const navigationItems = [
    {
      icon: LayoutDashboard,
      label: t("sidebar.dashboard"),
      path: "/admin",
      description: t("sidebar.dashboardDesc")
    },
    {
      icon: Building2,
      label: t("sidebar.listings"),
      path: "/admin/listings",
      description: t("sidebar.listingsDesc")
    },
    {
      icon: Users,
      label: t("sidebar.customers"),
      path: "/admin/customers",
      description: t("sidebar.customersDesc")
    },
    {
      icon: Settings,
      label: t("sidebar.settings"),
      path: "/admin/settings",
      description: t("sidebar.settingsDesc")
    },
  ];

  const userInitials = user
    ? `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}`.toUpperCase()
    : 'AK';

  return (
    <>
      <div className="min-h-screen bg-gray-50/50">
        <ResizablePanelGroup direction="horizontal">
          {/* Sidebar */}
          <ResizablePanel defaultSize={20} minSize={15} maxSize={20}>
            <div className="h-screen flex flex-col bg-[#1e2841]">
              {/* Logo & Title */}
              <div className="flex-none p-6 border-b border-slate-700/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-700/50 flex items-center justify-center">
                    <span className="text-lg text-white font-bold">Ö</span>
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">
                      Önder Emlak
                    </h2>
                    <p className="text-xs text-slate-400 font-medium">{t("panelTitle")}</p>
                  </div>
                </div>
              </div>

              {/* User Section */}
              <div className="flex-none p-3 border-b border-slate-700/50">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-slate-700/50 flex items-center justify-center">
                    <span className="text-sm font-medium text-white">{userInitials}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">
                      {user ? `${user.firstName} ${user.lastName}` : 'Admin'}
                    </p>
                    <p className="text-xs text-slate-400 truncate">{user?.email || ''}</p>
                  </div>
                </div>
              </div>

              {/* Navigation */}
              <div className="p-3 space-y-0.5">
                {navigationItems.map((item) => {
                  const isActive = pathname === item.path;
                  return (
                    <Button
                      key={item.path}
                      variant={isActive ? "secondary" : "ghost"}
                      className={cn(
                        "w-full justify-start relative group h-auto py-2",
                        isActive
                          ? "bg-slate-700/50 hover:bg-slate-700/50 text-white"
                          : "hover:bg-slate-700/30 text-slate-300 hover:text-white"
                      )}
                      asChild
                    >
                      <Link href={item.path}>
                        <div className={cn(
                          "absolute inset-y-0 left-0 w-1 rounded-full transition-all",
                          isActive ? "bg-white" : "bg-transparent group-hover:bg-slate-400"
                        )} />
                        <item.icon className={cn(
                          "w-5 h-5 mr-3 transition-colors",
                          isActive ? "text-white" : "text-slate-400 group-hover:text-white"
                        )} />
                        <div className="flex-1 text-left">
                          <p className={cn(
                            "font-medium transition-colors",
                            isActive ? "text-white" : "text-slate-300 group-hover:text-white"
                          )}>{item.label}</p>
                          <p className="text-xs text-slate-400 line-clamp-1 group-hover:text-slate-300">
                            {item.description}
                          </p>
                        </div>
                        <ChevronRight className={cn(
                          "w-4 h-4 ml-2 transition-all",
                          isActive ? "text-white opacity-100" : "opacity-0 -translate-x-2 text-slate-400",
                          "group-hover:opacity-100 group-hover:translate-x-0 group-hover:text-white"
                        )} />
                      </Link>
                    </Button>
                  );
                })}
              </div>

              {/* Logout Button */}
              <div className="p-3 border-t border-slate-700/50">
                <Button
                  variant="ghost"
                  className="w-full justify-start text-slate-300 hover:text-white hover:bg-slate-700/30 py-2"
                  onClick={handleLogout}
                >
                  <LogOut className="w-4 h-4 mr-3" />
                  <span>{t("sidebar.logout")}</span>
                </Button>
              </div>
            </div>
          </ResizablePanel>

          <ResizableHandle withHandle className="bg-[#1e2841] hover:bg-[#2a3654] transition-colors" />

          {/* Main Content */}
          <ResizablePanel defaultSize={80}>
            <div className="h-screen overflow-auto bg-gray-50/50">
              {children}
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
      <Toaster position="top-right" />
    </>
  );
}
