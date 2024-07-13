import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect } from "react";
import { fetchMutation } from "../relay";
import { graphql } from "relay-runtime";
import { useLazyLoadQuery, useMutation } from "react-relay";
import { DashboardPage } from "../pages/dashboard";
import { dashboardQuery } from "../../__generated__/dashboardQuery.graphql";

const UserQuery = graphql`
  query dashboardQuery {
    account {
      ...dashboardAccount_account
    }
  }
`;

export function DashboardLayout(): JSX.Element {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const data = useLazyLoadQuery<dashboardQuery>(UserQuery, {});

  const validateLinkMutation = graphql`
    mutation dashboardLayoutMutation($code: String!, $redirect: String!) {
      ValidateAuthenticationLink(input: { code: $code, redirect: $redirect }) {
        userId
      }
    }
  `;

  const [request] = useMutation(validateLinkMutation);

  useEffect(() => {
    if (!searchParams.size) return;

    validateAuthenticationLink();
  }, []);

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
  };

  return (
    <div className="px-10 py-5">
      <DashboardPage account={data.account} />
    </div>
  );
}
