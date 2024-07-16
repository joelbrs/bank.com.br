import { setMaskEmail } from "../../../utils";

type Account = {
  fullName?: string;
  email?: string;
  accountNumber?: string;
};

type Props = {
  account: Account;
  title: string;
};

export function AccountInfos({ account, title }: Props): JSX.Element {
  return (
    <div className="col-span-3 space-y-2 mt-2">
      <div className="font-semibold">{title}</div>
      <dl className="grid gap-3">
        <div className="flex items-center justify-between">
          <dt className="text-muted-foreground">Nome Completo</dt>
          <dd>{account?.fullName}</dd>
        </div>
        <div className="flex items-center justify-between">
          <dt className="text-muted-foreground">E-mail</dt>
          <dd>
            <span>{setMaskEmail(account?.email)}</span>
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
  );
}
