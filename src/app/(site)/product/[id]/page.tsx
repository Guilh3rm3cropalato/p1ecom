import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { AddToCartButton } from "@/components/store/add-to-cart-button";
import { formatCurrency } from "@/lib/utils";

type Props = {
  params: { id: string };
};

const getProduct = (id: string) =>
  prisma.product.findUnique({
    where: { id }
  });

export default async function ProductPage({ params }: Props) {
  const product = await getProduct(params.id);

  if (!product) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <SiteHeader />
      <main className="mx-auto max-w-4xl px-6 py-10">
        <div className="grid gap-8 md:grid-cols-2">
          <div className="aspect-square rounded-xl bg-white shadow-sm">Imagem do produto</div>
          <div>
            <p className="text-sm uppercase tracking-wide text-slate-500">{product.category ?? "Produto"}</p>
            <h1 className="mt-2 text-3xl font-bold text-slate-900">{product.name}</h1>
            <p className="mt-4 text-slate-600">{product.description ?? "Produto sem descrição detalhada."}</p>

            <div className="mt-6 text-4xl font-semibold text-slate-900">{formatCurrency(Number(product.price))}</div>

            <div className="mt-8">
              <AddToCartButton productId={product.id} name={product.name} price={Number(product.price)} image={product.imageUrl} />
              <p className="mt-3 text-sm text-slate-500">
                Estoque atualizado automaticamente via Bling: <strong>{product.stock}</strong> unidades.
              </p>
            </div>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

