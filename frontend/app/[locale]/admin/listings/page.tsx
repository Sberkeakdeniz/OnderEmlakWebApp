"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { PlusCircle, Edit, Trash2, Eye, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { propertiesApi } from "@/lib/api";
import { Property } from "@/types/property";
import { toast } from "sonner";

export default function AdminPropertiesPage() {
  const t = useTranslations("admin.listings");
  const tt = useTranslations("typeLabels");
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchProperties = async () => {
    setLoading(true);
    try {
      const res = await propertiesApi.getAdminAll({ page, limit: 20 });
      setProperties(res.data);
      setTotalPages(res.pages);
    } catch (error) {
      console.error("Failed to fetch properties:", error);
      toast.error(t("loadError"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, [page]);

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await propertiesApi.delete(deleteId);
      toast.success(t("deleteSuccess"));
      setDeleteId(null);
      fetchProperties();
    } catch (error: any) {
      toast.error(error?.message || t("deleteError"));
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="h-screen overflow-auto">
      <div className="border-b bg-white">
        <div className="flex h-16 items-center px-6 justify-between">
          <h2 className="text-lg font-semibold">{t("title")}</h2>
          <Button asChild>
            <Link href="/admin/listings/new">
              <PlusCircle className="w-4 h-4 mr-2" />
              {t("newListing")}
            </Link>
          </Button>
        </div>
      </div>

      <div className="p-6">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : properties.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-muted-foreground mb-4">{t("noListings")}</p>
            <Button asChild>
              <Link href="/admin/listings/new">
                <PlusCircle className="w-4 h-4 mr-2" />
                {t("addFirst")}
              </Link>
            </Button>
          </div>
        ) : (
          <>
            <Card>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("tableTitle")}</TableHead>
                    <TableHead>{t("tableLocation")}</TableHead>
                    <TableHead>{t("tableType")}</TableHead>
                    <TableHead>{t("tablePrice")}</TableHead>
                    <TableHead>{t("tableStatus")}</TableHead>
                    <TableHead>{t("tableViews")}</TableHead>
                    <TableHead className="text-right">{t("tableActions")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {properties.map((property) => (
                    <TableRow key={property._id}>
                      <TableCell className="font-medium">{property.title}</TableCell>
                      <TableCell>{property.location.city}, {property.location.state}</TableCell>
                      <TableCell>{tt(property.type)}</TableCell>
                      <TableCell>{property.price.toLocaleString()}₺</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded text-sm ${
                          property.isPublished
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-700"
                        }`}>
                          {property.isPublished ? t("active") : t("inactive")}
                        </span>
                      </TableCell>
                      <TableCell>{property.views}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" asChild>
                            <Link href={`/properties/${property._id}`}>
                              <Eye className="h-4 w-4" />
                            </Link>
                          </Button>
                          <Button variant="ghost" size="icon" asChild>
                            <Link href={`/admin/listings/${property._id}/edit`}>
                              <Edit className="h-4 w-4" />
                            </Link>
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setDeleteId(property._id)}
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>

            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-6">
                <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage(page - 1)}>
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <span className="text-sm text-muted-foreground">
                  {t("page", { current: page, total: totalPages })}
                </span>
                <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => setPage(page + 1)}>
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            )}
          </>
        )}
      </div>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("deleteTitle")}</AlertDialogTitle>
            <AlertDialogDescription>{t("deleteDescription")}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("cancel")}</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-500 hover:bg-red-600" disabled={deleting}>
              {deleting ? t("deleting") : t("delete")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
