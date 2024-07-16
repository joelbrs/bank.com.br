import { zodResolver } from "@hookform/resolvers/zod";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  Button,
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
import { z } from "../../../../utils";
import { BtnLoading } from "../../../btn-loading";
import { graphql } from "relay-runtime";
import { useMutation, useQueryLoader } from "react-relay";
import { createTransactionModalQuery } from "../../../../../__generated__/createTransactionModalQuery.graphql";
import { ResumeTransaction } from "../cards/resume-transaction";
import { v7 as uuid } from "uuid";
import { fetchMutation } from "../../../../relay";
import { Pencil } from "lucide-react";
import { useNavigate } from "react-router-dom";

type SchemaType = z.infer<typeof schema>;

type Props = {
  children: ReactNode;
};

const schema = z.object({
  receiverAccountNumber: z
    .string()
    .min(7, "O número da conta deve ter 7 dígitos."),
  value: z.string(),
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

const CreateTransaction = graphql`
  mutation createTransactionModalMutation(
    $receiverAccountNumber: String!
    $value: String!
  ) {
    CreateTransaction(
      input: { receiverAccountNumber: $receiverAccountNumber, value: $value }
    ) {
      transactionId
    }
  }
`;

export function CreateTransactionModal({ children }: Props): JSX.Element {
  const [open, setOpen] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  const navigate = useNavigate();

  const [queryReference, loadQuery] =
    useQueryLoader<createTransactionModalQuery>(DetailAccount);

  const form = useForm<SchemaType>({
    resolver: zodResolver(schema),
  });

  const [createTransactionRequest] = useMutation(CreateTransaction);

  const handleSubmit = (variables: SchemaType) => {
    if (!confirmed) {
      setLoading(true);
      createIdempotencyKey();
      loadQuery({ accountNumber: variables?.receiverAccountNumber });
      setLoading(false);
      return setConfirmed(true);
    }

    setLoading(true);
    fetchMutation({
      request: createTransactionRequest,
      variables,
      onCompleted: () => {
        form.reset();
        setOpen(false);
        setConfirmed(false);
        setLoading(false);
        navigate(0);
      },
      onError: () => {
        setLoading(false);
      },
    });
  };

  const createIdempotencyKey = () => {
    const idempotencyKey = uuid();
    sessionStorage.setItem("idempotent-key", idempotencyKey);
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-2xl flex items-center justify-between">
            <span>
              {(!confirmed && "Nova Transação") || "Revisão da Transação"}
            </span>
            {confirmed && (
              <Button
                title="Editar Transação"
                onClick={() => setConfirmed(false)}
                variant="ghost"
                size="icon"
              >
                <Pencil className="w-4 h-4" />
              </Button>
            )}
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
                              step="0.01"
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
                    onNotFoundAccount={() => setConfirmed(false)}
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
                    isLoading={isLoading}
                    placeholder={(confirmed && "Salvar") || "Continuar"}
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
