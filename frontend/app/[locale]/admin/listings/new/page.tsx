"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { Building2, Home, Upload, ArrowLeft, Save, X, Plus } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Link, useRouter } from "@/i18n/navigation";
import { propertiesApi } from "@/lib/api";

export default function NewPropertyPage() {
  const t = useTranslations("admin.newListing");
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [propertyType, setPropertyType] = useState<string>("");
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    title: "", propertyType: "", status: "for-sale", price: "",
    address: "", city: "", state: "", area: "", bedrooms: "", bathrooms: "",
    parking: false, furnished: false, description: "", amenities: "",
    sahibindenUrl: "", isPublished: true,
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      setSelectedImages(prev => [...prev, ...files]);
      const newPreviewUrls = files.map(file => URL.createObjectURL(file));
      setImagePreviewUrls(prev => [...prev, ...newPreviewUrls]);
    }
  };

  const removeImage = (index: number) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
    setImagePreviewUrls(prev => {
      URL.revokeObjectURL(prev[index]);
      return prev.filter((_, i) => i !== index);
    });
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoading(true);
    try {
      const propertyData: Record<string, unknown> = {
        title: formData.title, description: formData.description,
        type: formData.propertyType, status: formData.status,
        price: Number(formData.price),
        location: { address: formData.address, city: formData.city, state: formData.state },
        features: { area: Number(formData.area), parking: formData.parking, furnished: formData.furnished },
        amenities: formData.amenities ? formData.amenities.split(",").map(a => a.trim()).filter(Boolean) : [],
        isPublished: formData.isPublished,
        ...(formData.sahibindenUrl ? { sahibindenUrl: formData.sahibindenUrl } : {}),
      };
      if (formData.propertyType !== "land") {
        (propertyData.features as Record<string, unknown>).bedrooms = Number(formData.bedrooms);
        (propertyData.features as Record<string, unknown>).bathrooms = Number(formData.bathrooms);
      }
      const res = await propertiesApi.create(propertyData);
      const newPropertyId = res.data._id;
      if (selectedImages.length > 0) {
        try { await propertiesApi.uploadImages(newPropertyId, selectedImages); }
        catch (imgErr) { toast.error(t("imageUploadError")); }
      }
      toast.success(t("createSuccess"));
      router.push("/admin/listings");
    } catch (error: any) {
      toast.error(error?.message || t("createError"));
    } finally { setLoading(false); }
  };

  const handleChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="sticky top-0 z-10 bg-white border-b shadow-sm">
        <div className="flex h-16 items-center gap-4 px-6">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/admin/listings"><ArrowLeft className="h-5 w-5" /></Link>
          </Button>
          <div className="flex-1">
            <h1 className="text-xl font-semibold">{t("title")}</h1>
            <p className="text-sm text-muted-foreground">{t("subtitle")}</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" asChild><Link href="/admin/listings">{t("cancel")}</Link></Button>
            <Button onClick={() => handleSubmit()} disabled={loading}>
              <Save className="w-4 h-4 mr-2" />
              {loading ? t("saving") : t("save")}
            </Button>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-6">
                <Home className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-semibold">{t("basicInfo")}</h2>
              </div>
              <div className="grid gap-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>{t("listingTitle")}</Label>
                    <Input required placeholder={t("listingTitlePlaceholder")} value={formData.title} onChange={(e) => handleChange("title", e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>{t("propertyType")}</Label>
                    <Select value={formData.propertyType} onValueChange={(value) => { setPropertyType(value); handleChange("propertyType", value); }}>
                      <SelectTrigger><SelectValue placeholder={t("propertyTypePlaceholder")} /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="apartment">{t("apartment")}</SelectItem>
                        <SelectItem value="house">{t("house")}</SelectItem>
                        <SelectItem value="villa">{t("villa")}</SelectItem>
                        <SelectItem value="office">{t("office")}</SelectItem>
                        <SelectItem value="land">{t("land")}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>{t("listingStatus")}</Label>
                    <Select value={formData.status} onValueChange={(value) => handleChange("status", value)}>
                      <SelectTrigger><SelectValue placeholder={t("listingStatusPlaceholder")} /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="for-sale">{t("forSale")}</SelectItem>
                        <SelectItem value="for-rent">{t("forRent")}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>{t("price")}</Label>
                    <Input type="number" required placeholder={t("pricePlaceholder")} value={formData.price} onChange={(e) => handleChange("price", e.target.value)} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>{t("sahibindenLink")}</Label>
                  <Input type="url" placeholder={t("sahibindenPlaceholder")} value={formData.sahibindenUrl} onChange={(e) => handleChange("sahibindenUrl", e.target.value)} />
                  <p className="text-xs text-muted-foreground">{t("sahibindenHelp")}</p>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>{t("address")}</Label>
                    <Input placeholder={t("addressPlaceholder")} value={formData.address} onChange={(e) => handleChange("address", e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>{t("city")}</Label>
                    <Input placeholder={t("cityPlaceholder")} value={formData.city} onChange={(e) => handleChange("city", e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>{t("stateRegion")}</Label>
                    <Input placeholder={t("stateRegionPlaceholder")} value={formData.state} onChange={(e) => handleChange("state", e.target.value)} />
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-2 mb-6">
                <Building2 className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-semibold">{t("detailedInfo")}</h2>
              </div>
              <div className="grid grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label>{t("area")}</Label>
                  <Input type="number" required placeholder={t("areaPlaceholder")} value={formData.area} onChange={(e) => handleChange("area", e.target.value)} />
                </div>
                {propertyType !== "land" && (
                  <>
                    <div className="space-y-2">
                      <Label>{t("bedrooms")}</Label>
                      <Input type="number" placeholder={t("bedroomsPlaceholder")} value={formData.bedrooms} onChange={(e) => handleChange("bedrooms", e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label>{t("bathrooms")}</Label>
                      <Input type="number" placeholder={t("bathroomsPlaceholder")} value={formData.bathrooms} onChange={(e) => handleChange("bathrooms", e.target.value)} />
                    </div>
                  </>
                )}
              </div>
              <Separator className="my-6" />
              <div className="space-y-4">
                <Label>{t("features")}</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="parking" checked={formData.parking} onCheckedChange={(checked) => handleChange("parking", checked as boolean)} />
                    <label htmlFor="parking" className="text-sm">{t("parking")}</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="furnished" checked={formData.furnished} onCheckedChange={(checked) => handleChange("furnished", checked as boolean)} />
                    <label htmlFor="furnished" className="text-sm">{t("furnished")}</label>
                  </div>
                </div>
              </div>
              <Separator className="my-6" />
              <div className="space-y-2">
                <Label>{t("amenitiesLabel")}</Label>
                <Input placeholder={t("amenitiesPlaceholder")} value={formData.amenities} onChange={(e) => handleChange("amenities", e.target.value)} />
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-2 mb-6">
                <Building2 className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-semibold">{t("description")}</h2>
              </div>
              <div className="space-y-2">
                <Label>{t("descriptionLabel")}</Label>
                <textarea className="w-full min-h-[200px] p-3 rounded-md border border-input bg-transparent resize-none focus:outline-none focus:ring-2 focus:ring-primary" placeholder={t("descriptionPlaceholder")} required value={formData.description} onChange={(e) => handleChange("description", e.target.value)} />
              </div>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-6">
                <Upload className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-semibold">{t("photos")}</h2>
              </div>
              <div className="space-y-4">
                <div className="border-2 border-dashed rounded-lg p-6 text-center hover:border-primary transition-colors">
                  <input type="file" multiple accept="image/*" className="hidden" id="image-upload" onChange={handleImageChange} />
                  <label htmlFor="image-upload" className="cursor-pointer">
                    <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground mb-1">{t("dragDrop")}</p>
                    <Button variant="secondary" size="sm" type="button">
                      <Plus className="w-4 h-4 mr-2" />{t("chooseFile")}
                    </Button>
                  </label>
                </div>
                {imagePreviewUrls.length > 0 && (
                  <div className="grid grid-cols-2 gap-4">
                    {imagePreviewUrls.map((url, index) => (
                      <div key={index} className="relative group">
                        <img src={url} alt={`Preview ${index + 1}`} className="w-full h-32 object-cover rounded-lg" />
                        <button type="button" onClick={() => removeImage(index)} className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
                          <X className="w-4 h-4 text-red-500" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                <p className="text-xs text-muted-foreground">{t("maxPhotos")}</p>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-2 mb-6">
                <Building2 className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-semibold">{t("publishOptions")}</h2>
              </div>
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox id="active" checked={formData.isPublished} onCheckedChange={(checked) => handleChange("isPublished", checked as boolean)} />
                  <div className="space-y-1">
                    <label htmlFor="active" className="text-sm font-medium">{t("isActive")}</label>
                    <p className="text-xs text-muted-foreground">{t("isActiveDesc")}</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
