import { Separator } from "@repo/ui/components";
import { Pyramid } from "lucide-react";
import { Link } from "react-router-dom";
import { ModeToggle } from "./theme-toggle";

export function Header(): JSX.Element {
  return (
    <header className="flex justify-between py-3 px-6 border-b">
      <div className="flex items-center">
        <div className="flex items-center gap-6">
          <Pyramid className="w-4 h-4" />
          <Separator className="h-6" orientation="vertical" />
        </div>
        <nav className="px-6 text-sm font-medium">
          <Link to={{ pathname: "/dashboard" }}>
            <span className="underline underline-offset-4 text-foreground">
              Início
            </span>
          </Link>
        </nav>
      </div>

      <ModeToggle />
      {/* <BtnUser /> */}
    </header>
  );
}
