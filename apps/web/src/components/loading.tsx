import { Loader2 } from "lucide-react";

export function LoadingSpinner(): JSX.Element {
  return (
    <div className="flex items-center justify-center h-screen">
      <Loader2 className="animate-spin w-24 h-24" />
    </div>
  );
}
