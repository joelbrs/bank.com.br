import { graphql, useMutation } from "react-relay";
import { fetchMutation } from "../../relay";
import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

export function ConfirmationPage(): JSX.Element {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const mutation = graphql`
    mutation confirmationPageMutation($code: String!, $redirect: String!) {
      ConfirmUser(input: { code: $code, redirect: $redirect }) {
        userId
      }
    }
  `;

  const [request] = useMutation(mutation);

  useEffect(() => {
    const variables = {
      code: searchParams.get("code"),
      redirect: searchParams.get("redirect"),
    };

    fetchMutation({
      request,
      variables,
      onCompleted: () => {
        navigate("/dashboard");
      },
      onError: () => {
        navigate("/sign-in");
      },
    });
  }, []);

  return (
    <>
      <main className="flex items-center justify-center w-[45vw] h-screen flex-col">
        <div>
          <h1 className="text-3xl font-medium">Confirmação de conta</h1>
          <p>Estamos confirmando sua conta...</p>
        </div>
      </main>
      <footer className="text-sm font-medium dark:text-white flex justify-center items-center h-16 absolute bottom-0 w-full">
        © {new Date().getFullYear()} Bank - Todos os direitos reservados.
      </footer>
    </>
  );
}
