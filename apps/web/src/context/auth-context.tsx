import { ReactNode, createContext, useContext, useState, useEffect } from "react"
import { fetchQuery, graphql } from "relay-runtime"
import { authContextQuery$data } from '../../__generated__/authContextQuery.graphql'
import { environment } from "../relay"
import { toast } from "sonner";

interface AuthContextData {
    user: authContextQuery$data | null
    getUser: ({onError}: {onError: Function}) => Promise<void>
}

const AuthContext = createContext<AuthContextData | undefined>(undefined)

export const AuthProvider = ({children}: { children: ReactNode }) => {
    const [user, setUser] = useState<authContextQuery$data | null>(null)

    const getUser = async ({onError}: {onError: Function}) => {
        const query = graphql`
            query authContextQuery {
                user {
                    fullName
                    taxId
                    email
                }
            }
        `

        fetchQuery(environment, query, {}).subscribe({
            next(value) {
                if (!value) {
                    toast.warning("Atenção!", {
                        description:
                          "Acesso não autorizado.",
                        duration: 1500,
                      });
                    return onError()
                }

                setUser(value as authContextQuery$data)
            },
            error() {
                toast.error("Oops! Algo deu errado.", {
                    description:
                      "Verifique sua conexão com a internet e tente novamente mais tarde.",
                    duration: 1500,
                });
                return onError()
            },
        })
    }
    
    return (
        <AuthContext.Provider value={{getUser, user}}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};