import { Separator } from "@repo/ui/components";

type Props = {
  account?: {
    owner: {
      fullName: string;
      email: string;
    };
    accountNumber: string;
  };
  value?: string | number;
};

export function InfoTransaction({ account, value }: Props): JSX.Element {
  return (
    <>
      <div className="col-span-3 space-y-3.5">
        <div className="grid gap-3">
          <div className="font-semibold">Detalhes da Transação</div>
          <ul className="grid gap-3">
            <li className="flex items-center justify-between">
              <span className="text-muted-foreground">Valor</span>
              <span>${Number(value).toFixed(2)}</span>
            </li>
          </ul>
        </div>
        <Separator />
      </div>
      <div className="col-span-3 space-y-2 mt-2">
        <div className="font-semibold">Informações do Destinatário</div>
        <dl className="grid gap-3">
          <div className="flex items-center justify-between">
            <dt className="text-muted-foreground">Nome Completo</dt>
            <dd>{account?.owner.fullName}</dd>
          </div>
          <div className="flex items-center justify-between">
            <dt className="text-muted-foreground">E-mail</dt>
            <dd>
              <span>{account?.owner.email}</span>
            </dd>
          </div>
          <div className="flex items-center justify-between">
            <dt className="text-muted-foreground">Número da Conta</dt>
            <dd>
              <span>{account?.accountNumber}</span>
            </dd>
          </div>
          <div className="flex items-center justify-between">
            <dt className="text-muted-foreground">Instituição</dt>
            <dd>
              <span>bank.com.br</span>
            </dd>
          </div>
        </dl>
      </div>
    </>
  );
}
