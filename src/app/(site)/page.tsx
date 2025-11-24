import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";

const getProducts = () =>
  prisma.product.findMany({
    where: { active: true },
    orderBy: { createdAt: "desc" },
    take: 12
  });

export default async function HomePage() {
  const products = await getProducts();

  return (
    <div className="min-h-screen bg-slate-50">
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-6 py-10">
        <section className="text-center">
          <p className="text-sm uppercase tracking-wide text-brand-500">Integração com Bling</p>
          <h1 className="mt-2 text-4xl font-bold text-slate-900">Loja completa conectada ao seu ERP</h1>
          <p className="mt-4 text-lg text-slate-600">
            Sincronize produtos, pedidos, estoque, frete, pagamentos e NF-e automaticamente.
          </p>
        </section>

        <section className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <Card key={product.id}>
              <CardHeader>
                <CardTitle>{product.name}</CardTitle>
                <CardDescription>{product.description ?? "Produto sem descrição"}</CardDescription>
              </CardHeader>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-semibold text-slate-900">{formatCurrency(Number(product.price))}</div>
                <Button asChild>
                  <Link href={`/product/${product.id}`}>Ver produto</Link>
                </Button>
              </div>
            </Card>
          ))}
          {products.length === 0 && (
            <div className="col-span-full rounded-xl border border-dashed border-slate-300 p-8 text-center text-slate-500">
              Nenhum produto cadastrado. Sincronize com o Bling no painel admin.
            </div>
          )}
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}

