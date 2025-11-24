import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { AdminShell } from "@/components/layout/admin-shell";
import { SyncProductsButton } from "@/components/admin/sync-products-button";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { formatCurrency } from "@/lib/utils";

export default async function AdminProductsPage() {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    redirect("/admin/login");
  }

  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" }
  });

  return (
    <AdminShell title="Produtos">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500">Gerencie o catálogo sincronizado com o Bling.</p>
        <SyncProductsButton />
      </div>
      <div className="mt-6 overflow-hidden rounded-xl border border-slate-200 bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Produto</TableHead>
              <TableHead>SKU</TableHead>
              <TableHead>Preço</TableHead>
              <TableHead>Estoque</TableHead>
              <TableHead>Integrado</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell>{product.name}</TableCell>
                <TableCell>{product.sku}</TableCell>
                <TableCell>{formatCurrency(Number(product.price))}</TableCell>
                <TableCell>{product.stock}</TableCell>
                <TableCell>{product.blingId ? "Sim" : "Não"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </AdminShell>
  );
}

