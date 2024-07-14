export function Footer(): JSX.Element {
  return (
    <footer className="text-sm dark:text-white text-center py-5 border-t">
      Painel do parceiro © Bank - {new Date().getFullYear()}
    </footer>
  );
}
