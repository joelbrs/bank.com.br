import { Button, Input } from "@repo/ui/components";
import { Link } from "react-router-dom";
import SignInPageLayout from "./layout";

export function EmailSignInPage(): JSX.Element {
  return (
    <SignInPageLayout>
      <label htmlFor="email">E-mail</label>
      <Input id="email" type="email" required placeholder="E-mail" />

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
    </SignInPageLayout>
  );
}
