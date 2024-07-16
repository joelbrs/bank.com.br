import { Separator } from "@repo/ui/components";
import { Link } from "react-router-dom";

export function NotFoundPage(): JSX.Element {
  return (
    <div className="flex flex-col gap-5 items-center justify-center h-screen">
      <section className="flex items-center gap-5">
        <img
          src="https://www.tabnews.com.br/_next/static/media/bot-sleepy-face-dark-transparent.6fd852c0.svg"
          width={100}
          height={100}
          alt="not_found_logo"
        />
        <Separator className="h-16" orientation="vertical" />
        <span className="font-bold text-3xl">404</span>
      </section>
      <span className="text-2xl font-bold">Página não encontrada</span>
      <Link className="text-blue-500" to={{ pathname: "/sign-in" }}>
        Retornar à tela inicial
      </Link>
    </div>
  );
}
