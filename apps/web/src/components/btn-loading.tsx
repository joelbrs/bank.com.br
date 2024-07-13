import { Button } from "@repo/ui/components";
import { Loader2 } from "lucide-react";

type Props = {
  isLoading: boolean;
  type?: "submit";
  placeholder: string;
};

export function BtnLoading({
  isLoading,
  placeholder,
  type,
}: Props): JSX.Element {
  return (
    <Button className="w-full" type={type} disabled={isLoading}>
      {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
      {placeholder}
    </Button>
  );
}
