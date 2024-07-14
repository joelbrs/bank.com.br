import { zodResolver } from "@hookform/resolvers/zod";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  Input,
  Label,
  Separator,
} from "@repo/ui/components";
import { ReactNode, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { BtnLoading } from "../../btn-loading";
import { graphql } from "relay-runtime";
import { useQueryLoader } from "react-relay";
import { createTransactionModalQuery } from "../../../../__generated__/createTransactionModalQuery.graphql";
import { ResumeTransaction } from "./resume-transaction";
import { v7 as uuid } from "uuid";

type SchemaType = z.infer<typeof schema>;

type Props = {
  children: ReactNode;
};

const schema = z.object({
  receiverAccountNumber: z
    .string()
    .min(7, "O número da conta deve ter 7 dígitos."),
  value: z.coerce.number(),
});

const DetailAccount = graphql`
  query createTransactionModalQuery($accountNumber: String) {
    account(accountNumber: $accountNumber) {
      accountNumber
      owner {
        fullName
        email
      }
    }
  }
`;

export function CreateTransactionModal({ children }: Props): JSX.Element {
  const [open, setOpen] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  const [queryReference, loadQuery] =
    useQueryLoader<createTransactionModalQuery>(DetailAccount);

  const form = useForm<SchemaType>({
    resolver: zodResolver(schema),
  });

  const handleSubmit = ({
    receiverAccountNumber: accountNumber,
  }: SchemaType) => {
    if (!confirmed) {
      createIdempotencyKey();
      loadQuery({ accountNumber });
      return setConfirmed(true);
    }
    console.log("Create Transaction");
  };

  const createIdempotencyKey = () => {
    const idempotencyKey = uuid();
    sessionStorage.setItem("idempotent-key", idempotencyKey);
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger onClick={() => setOpen(!open)}>
        {children}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-2xl">
            {(!confirmed && "Nova Transação") || "Revisão da Transação"}
          </AlertDialogTitle>
          <Separator />
          <AlertDialogDescription>
            <Form {...form}>
              <form
                className="sm:grid sm:grid-cols-3 sm:gap-3.5 space-y-3.5 sm:space-y-0"
                onSubmit={form.handleSubmit(handleSubmit)}
              >
                {!confirmed && (
                  <>
                    <FormField
                      control={form.control}
                      name="receiverAccountNumber"
                      render={({ field }) => (
                        <FormItem className="col-span-2">
                          <Label htmlFor="accountNumber">Número da Conta</Label>
                          <FormControl>
                            <Input
                              id="accountNumber"
                              type="tel"
                              placeholder="Número da Conta"
                              maxLength={7}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="value"
                      render={({ field }) => (
                        <FormItem>
                          <Label htmlFor="value">Valor ($)</Label>
                          <FormControl>
                            <Input
                              id="value"
                              type="number"
                              placeholder="Valor ($)"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </>
                )}

                {confirmed && queryReference && (
                  <ResumeTransaction
                    query={DetailAccount}
                    queryReference={queryReference}
                    value={form.getValues("value")}
                  />
                )}

                <div className="flex items-center gap-2">
                  <AlertDialogCancel
                    onClick={() => {
                      form.reset();
                      setConfirmed(false);
                    }}
                    type="reset"
                  >
                    Cancelar
                  </AlertDialogCancel>
                  <BtnLoading
                    isLoading={false}
                    placeholder="Salvar"
                    type="submit"
                  />
                </div>
              </form>
            </Form>
          </AlertDialogDescription>
        </AlertDialogHeader>
      </AlertDialogContent>
    </AlertDialog>
  );
}
