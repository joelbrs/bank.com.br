import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@repo/ui/components";
import { ChevronDown, LogOut } from "lucide-react";
import { dashboardAccount_account$data } from "../../__generated__/dashboardAccount_account.graphql";

type Props = {
  account?: dashboardAccount_account$data | null;
};

export function BtnUser({ account }: Props): JSX.Element {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger as-child>
        <Button
          className="flex items-center justify-center gap-2 h-10"
          variant="outline"
        >
          <h3>{account?.owner.fullName}</h3>
          <ChevronDown className="w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="relative right-6 w-56">
        <DropdownMenuLabel className="pb-0">
          {account?.owner.taxId}
        </DropdownMenuLabel>
        <p className="text-xs text-muted-foreground px-2">
          {account?.owner.email}
        </p>

        <DropdownMenuSeparator className="mt-2" />
        <DropdownMenuItem className="text-red-400">
          <LogOut className="mr-2 h-4 w-4" />
          <span>Sair</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
