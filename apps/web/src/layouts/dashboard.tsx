import { useNavigate, useSearchParams } from "react-router-dom";
import { useCallback, useEffect } from "react";
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

const ValidateLinkMutation = graphql`
  mutation dashboardLayoutMutation($code: String!, $redirect: String!) {
    ValidateAuthenticationLink(input: { code: $code, redirect: $redirect }) {
      userId
    }
  }
`;

export function DashboardLayout(): JSX.Element | null {
  const navigate = useNavigate();
  const [params] = useSearchParams();

  const data = useLazyLoadQuery<dashboardQuery>(UserQuery, {});

  const [request] = useMutation(ValidateLinkMutation);

  const confirmLink = useCallback(() => {
    const variables = {
      code: params.get("code"),
      redirect: params.get("redirect"),
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
  }, [params, request, navigate]);

  useEffect(() => {
    if (!data.account) {
      confirmLink();
    }
  }, [data, confirmLink]);

  if (data.account) {
    return (
      <div className="sm:px-10 py-5">
        <DashboardPage account={data.account} />
      </div>
    );
  }

  return null;
}
