import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export default async function AccountPage() {
  const session = await auth();
  if (!session?.user?.email) {
    redirect("/admin/login");
  }

  const orders = await prisma.order.findMany({
    where: { user: { email: session.user.email } },
    include: { items: { include: { product: true } }, shipment: true, nfe: true, payments: true },
    orderBy: { createdAt: "desc" }
  });

  return (
    <div className="min-h-screen bg-slate-50">
      <SiteHeader />
      <main className="mx-auto max-w-5xl px-6 py-10">
        <h1 className="text-3xl font-bold text-slate-900">Meus pedidos</h1>
        <div className="mt-8 space-y-6">
          {orders.map((order) => (
            <div key={order.id} className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="text-sm text-slate-500">Pedido</p>
                  <p className="text-lg font-semibold text-slate-900">{order.id}</p>
                </div>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-700">
                  {order.status}
                </span>
              </div>
              <div className="mt-4 space-y-2 text-sm text-slate-600">
                {order.items.map((item) => (
                  <p key={item.id}>
                    {item.product.name} x {item.quantity} — {formatCurrency(Number(item.unitPrice))}
                  </p>
                ))}
              </div>
              <div className="mt-4 flex flex-wrap gap-4 text-sm text-slate-600">
                <p>Total: {formatCurrency(Number(order.total))}</p>
                {order.shipment?.trackingCode && <p>Rastreamento: {order.shipment.trackingCode}</p>}
              </div>
              <div className="mt-4 flex flex-wrap gap-3">
                {order.nfe?.pdfUrl && (
                  <Button asChild variant="outline" size="sm">
                    <a href={order.nfe.pdfUrl} target="_blank" rel="noreferrer">
                      Baixar NFe (PDF)
                    </a>
                  </Button>
                )}
                {order.shipment?.trackingCode && (
                  <Button asChild variant="outline" size="sm">
                    <a href={`/api/bling/shipping?tracking=${order.shipment.trackingCode}`}>Rastrear</a>
                  </Button>
                )}
              </div>
            </div>
          ))}
          {orders.length === 0 && <p className="text-slate-500">Nenhum pedido encontrado.</p>}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

