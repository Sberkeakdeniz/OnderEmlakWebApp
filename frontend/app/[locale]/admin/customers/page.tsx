"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Mail, Phone, Trash2, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { customersApi } from "@/lib/api";
import { toast } from "sonner";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface Customer {
  _id: string; username: string; email: string;
  firstName: string; lastName: string; phoneNumber: string;
  role: string; createdAt: string;
}

export default function CustomersPage() {
  const t = useTranslations("admin.customers");
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [appliedSearch, setAppliedSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const res = await customersApi.getAll({ page, limit: 20, search: appliedSearch || undefined });
      setCustomers(res.data); setTotalPages(res.pages); setTotal(res.total);
    } catch (error) {
      console.error("Failed to fetch customers:", error);
      toast.error(t("loadError"));
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchCustomers(); }, [page, appliedSearch]);

  const handleSearch = () => { setPage(1); setAppliedSearch(search); };
  const handleKeyDown = (e: React.KeyboardEvent) => { if (e.key === "Enter") handleSearch(); };

  const handleDelete = async (id: string) => {
    try {
      await customersApi.delete(id);
      setCustomers((prev) => prev.filter((c) => c._id !== id));
      toast.success(t("deleteSuccess"));
    } catch (error) { toast.error(t("deleteError")); }
  };

  function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" });
  }

  if (loading && customers.length === 0) {
    return <div className="flex items-center justify-center h-96"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
  }

  return (
    <div className="h-screen overflow-auto">
      <div className="border-b bg-white">
        <div className="flex h-16 items-center px-6">
          <h2 className="text-lg font-semibold">{t("title")}</h2>
          <span className="ml-3 text-sm text-muted-foreground">{t("records", { count: total })}</span>
        </div>
      </div>

      <div className="p-6">
        <Card className="mb-6">
          <div className="p-4 flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input placeholder={t("searchPlaceholder")} className="pl-10" value={search} onChange={(e) => setSearch(e.target.value)} onKeyDown={handleKeyDown} />
            </div>
            <Button onClick={handleSearch}>{t("search")}</Button>
            {appliedSearch && (
              <Button variant="outline" onClick={() => { setSearch(""); setAppliedSearch(""); setPage(1); }}>{t("clear")}</Button>
            )}
          </div>
        </Card>

        <Card>
          {customers.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              {appliedSearch ? t("noResults") : t("noCustomers")}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("tableName")}</TableHead>
                  <TableHead>{t("tableContact")}</TableHead>
                  <TableHead>{t("tableUsername")}</TableHead>
                  <TableHead>{t("tableDate")}</TableHead>
                  <TableHead className="text-right">{t("tableActions")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {customers.map((customer) => (
                  <TableRow key={customer._id}>
                    <TableCell className="font-medium">{customer.firstName} {customer.lastName}</TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center text-sm"><Mail className="w-4 h-4 mr-2 text-muted-foreground" />{customer.email}</div>
                        <div className="flex items-center text-sm"><Phone className="w-4 h-4 mr-2 text-muted-foreground" />{customer.phoneNumber}</div>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{customer.username}</TableCell>
                    <TableCell className="text-muted-foreground">{formatDate(customer.createdAt)}</TableCell>
                    <TableCell className="text-right">
                      <AlertDialog>
                        <AlertDialogTrigger asChild><Button variant="ghost" size="icon"><Trash2 className="h-4 w-4" /></Button></AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>{t("deleteTitle")}</AlertDialogTitle>
                            <AlertDialogDescription>{t("deleteDescription", { name: `${customer.firstName} ${customer.lastName}` })}</AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>{t("cancel")}</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(customer._id)} className="bg-red-600 hover:bg-red-700">{t("delete")}</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </Card>

        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-6">
            <Button variant="outline" size="icon" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}><ChevronLeft className="w-4 h-4" /></Button>
            <span className="text-sm text-muted-foreground">{t("page", { current: page, total: totalPages })}</span>
            <Button variant="outline" size="icon" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}><ChevronRight className="w-4 h-4" /></Button>
          </div>
        )}
      </div>
    </div>
  );
}
