import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { AdminShell } from "@/components/layout/admin-shell";
import { DashboardMetrics } from "@/components/admin/dashboard-metrics";
import { formatCurrency } from "@/lib/utils";

export default async function DashboardPage() {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    redirect("/admin/login");
  }

  const [ordersCount, productsCount, revenue, pendingPayments] = await Promise.all([
    prisma.order.count(),
    prisma.product.count(),
    prisma.order.aggregate({ _sum: { total: true } }),
    prisma.payment.count({ where: { status: "PENDING" } })
  ]);

  const metrics = [
    { label: "Pedidos", value: ordersCount.toString(), description: "Total sincronizado" },
    { label: "Produtos", value: productsCount.toString(), description: "Catálogo ativo" },
    { label: "Receita", value: formatCurrency(Number(revenue._sum.total ?? 0)), description: "Total faturado" },
    { label: "Pagamentos pendentes", value: pendingPayments.toString(), description: "Aguardando confirmação" }
  ];

  return (
    <AdminShell title="Dashboard">
      <DashboardMetrics metrics={metrics} />
    </AdminShell>
  );
}

