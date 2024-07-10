import { Button, Input } from "@repo/ui/components";
import { Link } from "react-router-dom";
import SignInPageLayout from "./layout";

export function PasswordSignInPage(): JSX.Element {
  return (
    <SignInPageLayout>
      <section className="space-y-2">
        <div>
          <label htmlFor="taxId">CPF/CNPJ</label>
          <Input id="taxId" required placeholder="CPF/CNPJ" />
        </div>

        <div>
          <label htmlFor="password">Senha</label>
          <Input id="password" required placeholder="Senha" />
        </div>
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
    </SignInPageLayout>
  );
}
