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
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { graphql } from "relay-runtime";
import { useMutation } from "react-relay";
import { fetchMutation } from "../../relay";
import { useCallback } from "react";

type SchemaType = z.infer<typeof schema>;

const mutation = graphql`
  mutation emailSignInPageMutation($email: String!) {
    LoginEmailAccess(input: { email: $email }) {
      message
    }
  }
`;

const schema = z.object({
  email: z.string().email(),
});

export function EmailSignInPage(): JSX.Element {
  const form = useForm<SchemaType>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "",
    },
  });

  const [request] = useMutation(mutation);

  const onSubmit = useCallback(
    (variables: SchemaType) => {
      fetchMutation({ request, variables });
    },
    [request]
  );

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
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <Label htmlFor="email">E-mail</Label>
                <FormControl>
                  <Input id="email" placeholder="E-mail" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Link
            to={{ pathname: "/sign-in" }}
            className="text-xs hover:underline hover:cursor-pointer text-blue-500"
          >
            Utilize o fluxo de login com usuário e senha →
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
