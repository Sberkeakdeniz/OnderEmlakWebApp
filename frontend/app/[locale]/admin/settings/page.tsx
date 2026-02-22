"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Lock, Save, Shield, Loader2 } from "lucide-react";
import { profileApi, authApi } from "@/lib/api";
import { toast } from "sonner";
import { useAuth } from "@/contexts/auth-context";

export default function SettingsPage() {
  const t = useTranslations("admin.settings");
  const { user } = useAuth();
  const [profileLoading, setProfileLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [adminLoading, setAdminLoading] = useState(false);

  const [profileData, setProfileData] = useState({ firstName: "", lastName: "", email: "" });
  const [passwordData, setPasswordData] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [adminData, setAdminData] = useState({ username: "", email: "", password: "", firstName: "", lastName: "" });

  useEffect(() => {
    if (user) {
      setProfileData({ firstName: user.firstName || "", lastName: user.lastName || "", email: user.email || "" });
    }
  }, [user]);

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profileData.firstName || !profileData.lastName || !profileData.email) { toast.error(t("fillAllFields")); return; }
    setProfileLoading(true);
    try {
      await profileApi.update(profileData);
      toast.success(t("profileSuccess"));
    } catch (error: any) { toast.error(error?.message || t("profileError")); }
    finally { setProfileLoading(false); }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) { toast.error(t("fillAllPasswordFields")); return; }
    if (passwordData.newPassword.length < 8 || !/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(passwordData.newPassword)) { toast.error(t("passwordMinLength")); return; }
    if (passwordData.newPassword !== passwordData.confirmPassword) { toast.error(t("passwordMismatch")); return; }
    setPasswordLoading(true);
    try {
      await profileApi.changePassword({ currentPassword: passwordData.currentPassword, newPassword: passwordData.newPassword });
      toast.success(t("passwordSuccess"));
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (error: any) { toast.error(error?.message || t("passwordError")); }
    finally { setPasswordLoading(false); }
  };

  const handleAdminSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminData.username || !adminData.email || !adminData.password || !adminData.firstName || !adminData.lastName) { toast.error(t("fillAllFields")); return; }
    if (adminData.password.length < 8 || !/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(adminData.password)) { toast.error(t("passwordMinLength")); return; }
    setAdminLoading(true);
    try {
      await authApi.createAdmin(adminData);
      toast.success(t("adminSuccess"));
      setAdminData({ username: "", email: "", password: "", firstName: "", lastName: "" });
    } catch (error: any) { toast.error(error?.message || t("adminError")); }
    finally { setAdminLoading(false); }
  };

  return (
    <div className="h-screen overflow-auto">
      <div className="border-b bg-white">
        <div className="flex h-16 items-center px-6"><h2 className="text-lg font-semibold">{t("title")}</h2></div>
      </div>
      <div className="p-6">
        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList>
            <TabsTrigger value="profile" className="flex items-center gap-2"><User className="w-4 h-4" />{t("profileTab")}</TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2"><Lock className="w-4 h-4" />{t("securityTab")}</TabsTrigger>
            <TabsTrigger value="admin" className="flex items-center gap-2"><Shield className="w-4 h-4" />{t("newAdminTab")}</TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-6">{t("profileSettings")}</h3>
              <form onSubmit={handleProfileSubmit} className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2"><Label>{t("firstName")}</Label><Input placeholder={t("firstNamePlaceholder")} value={profileData.firstName} onChange={(e) => setProfileData(prev => ({ ...prev, firstName: e.target.value }))} /></div>
                  <div className="space-y-2"><Label>{t("lastName")}</Label><Input placeholder={t("lastNamePlaceholder")} value={profileData.lastName} onChange={(e) => setProfileData(prev => ({ ...prev, lastName: e.target.value }))} /></div>
                </div>
                <div className="space-y-2"><Label>{t("email")}</Label><Input type="email" placeholder={t("emailPlaceholder")} value={profileData.email} onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))} /></div>
                <Button type="submit" disabled={profileLoading}>
                  {profileLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                  {profileLoading ? t("saving") : t("saveChanges")}
                </Button>
              </form>
            </Card>
          </TabsContent>

          <TabsContent value="security">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-6">{t("changePassword")}</h3>
              <form onSubmit={handlePasswordSubmit} className="space-y-6">
                <div className="space-y-2"><Label>{t("currentPassword")}</Label><Input type="password" value={passwordData.currentPassword} onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))} /></div>
                <div className="space-y-2"><Label>{t("newPassword")}</Label><Input type="password" value={passwordData.newPassword} onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))} /></div>
                <div className="space-y-2"><Label>{t("confirmPassword")}</Label><Input type="password" value={passwordData.confirmPassword} onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))} /></div>
                <Button type="submit" disabled={passwordLoading}>
                  {passwordLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Shield className="w-4 h-4 mr-2" />}
                  {passwordLoading ? t("updatingPassword") : t("updatePassword")}
                </Button>
              </form>
            </Card>
          </TabsContent>

          <TabsContent value="admin">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-6">{t("createAdmin")}</h3>
              <form onSubmit={handleAdminSubmit} className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2"><Label>{t("firstName")}</Label><Input placeholder={t("firstNamePlaceholder")} value={adminData.firstName} onChange={(e) => setAdminData(prev => ({ ...prev, firstName: e.target.value }))} /></div>
                  <div className="space-y-2"><Label>{t("lastName")}</Label><Input placeholder={t("lastNamePlaceholder")} value={adminData.lastName} onChange={(e) => setAdminData(prev => ({ ...prev, lastName: e.target.value }))} /></div>
                </div>
                <div className="space-y-2"><Label>{t("username")}</Label><Input placeholder={t("usernamePlaceholder")} value={adminData.username} onChange={(e) => setAdminData(prev => ({ ...prev, username: e.target.value }))} /></div>
                <div className="space-y-2"><Label>{t("email")}</Label><Input type="email" placeholder={t("emailPlaceholder")} value={adminData.email} onChange={(e) => setAdminData(prev => ({ ...prev, email: e.target.value }))} /></div>
                <div className="space-y-2"><Label>{t("password")}</Label><Input type="password" placeholder={t("passwordPlaceholder")} value={adminData.password} onChange={(e) => setAdminData(prev => ({ ...prev, password: e.target.value }))} /></div>
                <Button type="submit" disabled={adminLoading}>
                  {adminLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Shield className="w-4 h-4 mr-2" />}
                  {adminLoading ? t("creatingAdmin") : t("createAdminButton")}
                </Button>
              </form>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
