import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { CheckoutClient } from "@/components/store/checkout-client";

export default function CheckoutPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <SiteHeader />
      <main className="mx-auto max-w-5xl px-6 py-10">
        <h1 className="text-3xl font-bold text-slate-900">Checkout</h1>
        <p className="mt-2 text-slate-600">Calcule o frete via Bling e finalize o pedido integrado.</p>
        <div className="mt-8">
          <CheckoutClient />
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

