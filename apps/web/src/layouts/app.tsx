import { Outlet, useNavigate, useSearchParams } from "react-router-dom";
import { useEffect } from 'react'
import { AuthProvider } from "../context/auth-context";
import { fetchMutation } from "../relay";
import { graphql } from 'relay-runtime'
import { useMutation } from 'react-relay'

export function AppLayout(): JSX.Element {
    const navigate = useNavigate()
    const [searchParams] = useSearchParams();

    const validateLinkMutation = graphql`
        mutation appLayoutMutation($code: String!, $redirect: String!) {
            ValidateAuthenticationLink(input: { code: $code, redirect: $redirect }) {
                userId
            }
        }
    `

    const [request] = useMutation(validateLinkMutation)

    useEffect(() => {
        if (!searchParams.size) return

        validateAuthenticationLink()
    }, [])

    const validateAuthenticationLink = () => {
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
    }

    return (
        <AuthProvider>
            <div className="px-10 py-5">
                <Outlet />
            </div>
        </AuthProvider>
    )
}