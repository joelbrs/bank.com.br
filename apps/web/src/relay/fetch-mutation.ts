import { UseMutationConfig } from "react-relay";
import { MutationParameters } from "relay-runtime";
import { toast } from "sonner";

type Props<T> = {
  variables: object;
  request: (_: UseMutationConfig<MutationParameters>) => void;
  onCompleted?: (_: T) => void;
  onError?: () => void;
};

type DefaultMutationResponse = {
  message?: string;
};

export const fetchMutation = <T>({
  request,
  variables,
  onCompleted,
  onError,
}: Props<T>) => {
  request({
    variables,
    onError: () => {
      toast.error("Oops! Algo deu errado.", {
        description:
          "Verifique sua conexão com a internet e tente novamente mais tarde.",
        duration: 1500,
      });
      if (onError) {
        onError();
      }
    },
    onCompleted: (response, errors) => {
      if (errors?.length) {
        errors?.forEach(({ message }) => {
          toast.warning("Atenção!", {
            description: message,
            duration: 1500,
          });
        });

        if (onError) {
          onError();
        }
        return;
      }

      const { message } = response as DefaultMutationResponse;

      toast.success("Sucesso!", {
        description: message || "Operação realizada com sucesso.",
        duration: 1500,
      });

      if (onCompleted) {
        onCompleted(response as T);
      }
    },
  });
};
