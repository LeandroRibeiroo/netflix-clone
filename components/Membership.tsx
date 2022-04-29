import { useState } from 'react';
import useAuth from '../hooks/useAuth';
import useSubscription from '../hooks/useSubscription';
import { handleGoToBillingPortal } from '../lib/stripe';
import Loader from './Loader';

const Membership = () => {
  const { user } = useAuth();
  const subscription = useSubscription(user);
  const [isBillingLoading, setIsBillingLoading] = useState(false);

  const handleManageSubscription = () => {
    if (subscription) {
      setIsBillingLoading(true);
      handleGoToBillingPortal();
    }
  };

  const subscriptionDate = new Date(
    subscription?.current_period_end as string
  ).toLocaleString('pt-BR', {
    dateStyle: 'short',
  });

  return (
    <div className="mt-6 grid grid-cols-1 gap-x-4 border px-4 md:grid-cols-4 md:border-x-0 md:border-t md:border-b-0 md:px-0">
      <div className="space-y-2 py-4">
        <h4 className="text-lg text-[gray]">Assinatura & Cobrança</h4>
        <button
          disabled={isBillingLoading || !subscription}
          onClick={handleManageSubscription}
          className="h-10 w-3/5 whitespace-nowrap bg-gray-300 py-2 text-sm font-medium text-black shadow-md
        hover:bg-gray-200 md:w-4/5"
        >
          {isBillingLoading ? (
            <Loader color="dark:fill-[#e50914]" />
          ) : (
            'Cancelar assinatura'
          )}
        </button>
      </div>
      <div className="col-span-3">
        <div className="flex flex-col justify-between border-b border-white/10 py-4 md:flex-row">
          <div>
            <p className="font-medium">{user?.email}</p>
            <p className="text-[gray]">Senha: ***********</p>
          </div>
          <div>
            <p className="membershipLink">Alterar e-mail</p>
            <p className="membershipLink">Alterar senha</p>
          </div>
        </div>
        <div className="flex flex-col justify-between pt-4 pb-4 md:flex-row md:pb-0">
          <div>
            <p>
              {subscription?.cancel_at_period_end
                ? 'Sua assinatura vai acabar em '
                : 'A próxima cobrança será em '}
              {subscriptionDate}
            </p>
          </div>
          <div className="md:text-right">
            <p className="membershipLink">Gerenciar métodos de pagamento</p>
            <p className="membershipLink">
              Adicionar um método de pagamento reserva
            </p>
            <p className="membershipLink">Detalhes das cobranças</p>
            <p className="membershipLink">Alterar dia de vencimento</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Membership;
