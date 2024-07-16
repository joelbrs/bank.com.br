import { Separator } from "@repo/ui/components";
import { ReactNode } from "react";
import { AccountInfos } from "./account-infos";

type Props = {
  account?: {
    owner: {
      fullName: string;
      email: string;
    };
    accountNumber: string;
  };
  value?: string | number;
  children?: ReactNode;
};

export function InfoTransaction({
  account,
  value,
  children,
}: Props): JSX.Element {
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
      {children}
      <AccountInfos
        title="Informações do Destinatário"
        account={{
          accountNumber: account?.accountNumber,
          email: account?.owner.email,
          fullName: account?.owner.fullName,
        }}
      />
    </>
  );
}
