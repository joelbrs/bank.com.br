import {
  Button,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  Input,
  Label,
} from "@repo/ui/components";
import { Link } from "react-router-dom";
import { InputPassword } from "../../components";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { graphql } from "relay-runtime";
import { useMutation } from "react-relay";
import { fetchMutation } from "../../relay";

type SchemaType = z.infer<typeof schema>;

const schema = z.object({
  taxId: z.string().min(11),
  password: z.string().min(8).max(20),
});

export function PasswordSignInPage(): JSX.Element {
  const form = useForm<SchemaType>({
    resolver: zodResolver(schema),
    defaultValues: {
      taxId: "",
      password: "",
    },
  });

  const mutation = graphql`
    mutation passwordSignInPageMutation($taxId: String!, $password: String!) {
      LoginPasswordAccess(input: { taxId: $taxId, password: $password }) {
        userId
      }
    }
  `;

  const [request] = useMutation(mutation);

  const onSubmit = (variables: SchemaType) => {
    fetchMutation({ request, variables });
  };

  return (
    <div className="space-y-10">
      <Link to={{ pathname: "/" }}>
        <Button
          variant="ghost"
          className="absolute right-4 top-4 md:right-8 md:top-8"
        >
          Cadastre-se
        </Button>
      </Link>
      <div className="flex flex-col space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">
          Acessar painel
        </h1>
        <p className="text-sm">
          Acompanhe suas transações pelo painel do parceiro!
        </p>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <section className="space-y-2">
            <FormField
              control={form.control}
              name="taxId"
              render={({ field }) => (
                <FormItem>
                  <Label htmlFor="taxId">CPF/CNPJ</Label>
                  <FormControl>
                    <Input id="taxId" placeholder="CPF/CNPJ" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <InputPassword id="password" label="Senha" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </section>

          <Link
            to={{ pathname: "/sign-in/email" }}
            className="text-xs hover:underline hover:cursor-pointer text-blue-500"
          >
            Utilize o fluxo de login com e-mail →
          </Link>

          <div className="flex items-center justify-center mt-5">
            <Button type="submit" className="w-full">
              Acessar Painel
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}