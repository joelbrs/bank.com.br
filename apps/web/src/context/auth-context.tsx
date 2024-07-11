import { ReactNode, createContext, useContext, useState } from "react";
import { fetchQuery, graphql } from "relay-runtime";
import { authContextQuery$data } from "../../__generated__/authContextQuery.graphql";
import { environment } from "../relay";
import { toast } from "sonner";

interface AuthContextData {
  user: authContextQuery$data | null;
  getUser: (args?: { onError: Function }) => Promise<void>;
}

const AuthContext = createContext<AuthContextData | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<authContextQuery$data | null>(null);

  const getUser = async (args?: { onError: Function }) => {
    const query = graphql`
      query authContextQuery {
        account {
          balance
          accountNumber
          owner {
            fullName
            taxId
          }
        }
      }
    `;

    fetchQuery(environment, query, {}).subscribe({
      next(value) {
        if (!(value as authContextQuery$data).account) {
          toast.warning("Atenção!", {
            description: "Acesso não autorizado.",
            duration: 1500,
          });

          if (args?.onError) {
            args.onError();
          }
          return;
        }

        setUser(value as authContextQuery$data);
      },
      error() {
        toast.error("Oops! Algo deu errado.", {
          description:
            "Verifique sua conexão com a internet e tente novamente mais tarde.",
          duration: 1500,
        });
        if (args?.onError) {
          args.onError();
        }
        return;
      },
    });
  };

  return (
    <AuthContext.Provider value={{ getUser, user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
