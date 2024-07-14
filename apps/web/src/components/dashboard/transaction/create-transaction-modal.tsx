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

export function CreateTransactionModal({ children }: Props): JSX.Element {
  const [open, setOpen] = useState(false);

  const form = useForm<SchemaType>({
    resolver: zodResolver(schema),
  });

  return (
    <AlertDialog>
      <AlertDialogTrigger onClick={() => setOpen(!open)}>
        {children}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-2xl">
            Nova Transação
          </AlertDialogTitle>
          <Separator />
          <AlertDialogDescription>
            <Form {...form}>
              <form
                className="sm:grid sm:grid-cols-3 sm:gap-3.5 space-y-3.5 sm:space-y-0"
                onSubmit={form.handleSubmit(console.log)}
              >
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

                <div className="flex items-center gap-2">
                  <AlertDialogCancel onClick={() => form.reset()} type="reset">
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
