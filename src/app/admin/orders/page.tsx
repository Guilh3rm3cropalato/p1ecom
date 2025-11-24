import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { AdminShell } from "@/components/layout/admin-shell";
import { OrderActions } from "@/components/admin/order-actions";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { formatCurrency } from "@/lib/utils";

export default async function AdminOrdersPage() {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    redirect("/admin/login");
  }

  const orders = await prisma.order.findMany({
    include: { user: true, payments: true, shipment: true },
    orderBy: { createdAt: "desc" }
  });

  return (
    <AdminShell title="Pedidos">
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Pedido</TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell>{order.id}</TableCell>
                <TableCell>{order.user?.email ?? "Checkout rápido"}</TableCell>
                <TableCell>{order.status}</TableCell>
                <TableCell>{formatCurrency(Number(order.total))}</TableCell>
                <TableCell>
                  <OrderActions orderId={order.id} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </AdminShell>
  );
}

