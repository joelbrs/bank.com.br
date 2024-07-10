import { Landmark } from "lucide-react";
import { ReactNode } from "react";

export default function SignInPageLayout({
  children,
}: {
  children: ReactNode;
}): JSX.Element {
  return (
    <div className="flex items-center text-muted-foreground font-semibold">
      <div className="flex flex-col items-start justify-between bg-muted w-[50%] h-screen p-10">
        <div className="flex text-foreground text-lg gap-3 items-center">
          <Landmark className="w-5 h-5" />
          <span className="text-2xl">Bank</span>
        </div>
        <footer className="text-sm">
          Painel do parceiro © Bank - {new Date().getFullYear()}
        </footer>
      </div>
      <div className="flex flex-col items-center justify-center w-[50vw] h-screen">
        <form className="w-[35vw]">{children}</form>
      </div>
    </div>
  );
}
