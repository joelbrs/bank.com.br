import { Pyramid } from "lucide-react";
import { Outlet } from "react-router-dom";

export function AuthPageLayout(): JSX.Element {
  return (
    <div className="flex items-center font-semibold">
      <div className="hidden sm:flex flex-col items-start justify-between bg-primary w-[50%] h-screen p-10">
        <div className="flex text-lg gap-3 items-center text-white">
          <Pyramid className="w-5 h-5" />
          <span className="text-2xl">Bank</span>
        </div>
        <footer className="text-sm text-white">
          Painel do parceiro © Bank - {new Date().getFullYear()}
        </footer>
      </div>
      <div className="flex flex-col items-center justify-center sm:w-[50vw] w-full h-screen">
        <section className="sm:w-[35vw] w-full px-5">
          <Outlet />
        </section>
      </div>
    </div>
  );
}
