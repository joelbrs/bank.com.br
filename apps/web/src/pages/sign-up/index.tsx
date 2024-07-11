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
import { graphql, useMutation } from "react-relay";
import { fetchMutation } from "../../relay";

type SchemaType = z.infer<typeof schema>;

const schema = z
  .object({
    taxId: z.string().min(8),
    fullName: z.string().min(3),
    email: z.string().email(),
    password: z.string().min(8),
    passwordConfirmation: z.string().min(8),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: "As senhas deverão ser iguais.",
    path: ["passwordConfirmation"],
  });

export function SignUpPage(): JSX.Element {
  const form = useForm<SchemaType>({
    resolver: zodResolver(schema),
    defaultValues: {
      taxId: "",
      fullName: "",
      email: "",
      password: "",
      passwordConfirmation: "",
    },
  });

  const mutation = graphql`
    mutation signUpPageMutation(
      $fullName: String!
      $email: String!
      $password: String!
      $passwordConfirmation: String!
      $taxId: String!
    ) {
      RegisterUser(
        input: {
          fullName: $fullName
          email: $email
          password: $password
          passwordConfirmation: $passwordConfirmation
          taxId: $taxId
        }
      ) {
        user {
          _id
        }
      }
    }
  `;

  const [request] = useMutation(mutation);

  const onSubmit = (variables: SchemaType) => {
    fetchMutation({ request, variables });
  };

  return (
    <div className="lg:p-8 space-y-10">
      <Link to={{ pathname: "/sign-in" }}>
        <Button
          variant="ghost"
          className="absolute right-4 top-4 md:right-8 md:top-8"
        >
          Login
        </Button>
      </Link>

      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            Criar conta grátis
          </h1>
          <p className="text-sm">
            Seja um parceiro <span className="font-semibold">Bank</span>
          </p>
        </div>
      </div>

      <div className="grid gap-6">
        <Form {...form}>
          <form className="space-y-2.5" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="taxId"
              render={({ field }) => (
                <FormItem>
                  <Label htmlFor="taxId">CPF/CNPJ</Label>
                  <FormControl>
                    <Input placeholder="CPF/CNPJ" id="taxId" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <Label htmlFor="fullName">Nome</Label>
                  <FormControl>
                    <Input placeholder="Nome" id="fullName" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <Label htmlFor="email">E-mail</Label>
                  <FormControl>
                    <Input placeholder="E-mail" id="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex items-center gap-2">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormControl>
                      <InputPassword
                        label="Senha"
                        id="password"
                        maxLength={20}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="passwordConfirmation"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormControl>
                      <InputPassword
                        label="Confirme a Senha"
                        id="passwordConfirmation"
                        maxLength={20}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button type="submit" className="w-full">
              Finalizar cadastro
            </Button>
          </form>
        </Form>

        <p className="px-6 text-center text-sm leading-relaxed">
          Ao continuar, você concorda com nossos{" "}
          <a
            href="/terms"
            className="underline underline-offset-4 hover:text-primary"
          >
            Termos de serviço
          </a>{" "}
          e{" "}
          <a
            href="/privacy"
            className="underline underline-offset-4 hover:text-primary"
          >
            Políticas de privacidade
          </a>
          .
        </p>
      </div>
    </div>
  );
}
