import { CheckIcon } from '@heroicons/react/outline';
import { CircularProgress } from '@mui/material';
import { Product } from '@stripe/firestore-stripe-payments';
import Head from 'next/head';
import Link from 'next/link';
import { useState } from 'react';
import useAuth from '../hooks/useAuth';
import { loadCheckout } from '../lib/stripe';
import Table from './Table';

interface Props {
  products: Product[];
}

const Plans = ({ products }: Props) => {
  const { logout, user } = useAuth();
  const [isBillingLoading, setIsBillingLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<Product | null>(products[2]);

  const handleSelectPlan = (plan: Product) => {
    setSelectedPlan(plan);
  };

  const handleSubscribe = async () => {
    if (!user) return;

    loadCheckout(selectedPlan?.prices[0].id!);
    setIsBillingLoading(true);
  };

  return (
    <div>
      <Head>
        <title>Netflix</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <header className="border-b border-white/10 bg-[#141414]">
        <Link href={'/'}>
          <img
            src="https://rb.gy/ulxxee"
            alt="logo"
            width={150}
            height={90}
            className="cursor-pointer object-contain"
          />
        </Link>
        <button
          onClick={logout}
          className="text-lg font-medium hover:underline"
        >
          Sair
        </button>
      </header>
      <main className="mx-auto max-w-5xl px-5 pt-28 pb-12 transition-all md:px-10">
        <h1 className="mb-3 text-3xl font-medium">
          Inscreva-se hoje mesmo e aproveite todo o conteúdo da Netflix!
        </h1>
        <ul className="py-5">
          <li className="flex items-center gap-x-2 text-lg">
            <CheckIcon className="h-7 w-7 text-[#E50914]" />
            Ganhe acesso ilimitado a todos os nossos filmes e séries.
          </li>
          <li className="flex items-center gap-x-2 text-lg">
            <CheckIcon className="h-7 w-7 text-[#E50914]" />
            Assista em qualquer aparelho sem comerciais e sem interrupções.
          </li>
          <li className="flex items-center gap-x-2 text-lg">
            <CheckIcon className="h-7 w-7 text-[#E50914]" />
            Sem compromisso. Cancele gratuitamente pela internet quando quiser.
          </li>
        </ul>
        <div className="mt-4 flex flex-col space-y-4">
          <div className="flex w-full items-center justify-end self-end md:w-3/5">
            {products.map((product) => (
              <div
                key={product.id}
                className={`planBox ${
                  selectedPlan?.id === product.id ? 'opacity-100' : 'opacity-60'
                }`}
                onClick={() => handleSelectPlan(product)}
              >
                {product.name}
              </div>
            ))}
          </div>
          <Table products={products} selectedPlan={selectedPlan} />
          <button
            disabled={!selectedPlan || isBillingLoading}
            className={`mx-auto w-11/12 rounded bg-[#E50914] py-4 text-xl shadow hover:bg-[#f6121d] md:w-[420px] ${
              isBillingLoading && 'opacity-60'
            }`}
            onClick={handleSubscribe}
          >
            {isBillingLoading ? (
              <CircularProgress color="inherit" />
            ) : (
              'Continuar'
            )}
          </button>
        </div>
      </main>
    </div>
  );
};

export default Plans;
