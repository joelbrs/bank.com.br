export function Footer(): JSX.Element {
  return (
    <footer className="text-sm text-white text-center py-5 border-t">
      Painel do parceiro © Bank - {new Date().getFullYear()}
    </footer>
  );
}
