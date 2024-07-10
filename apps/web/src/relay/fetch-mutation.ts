import { UseMutationConfig } from "react-relay";
import { MutationParameters } from "relay-runtime";
import { toast } from "sonner";

type Props<T> = {
  variables: Object;
  request: (_: UseMutationConfig<MutationParameters>) => void;
  onCompleted?: (_: T) => void;
};

export const fetchMutation = <T>({
  request,
  variables,
  onCompleted,
}: Props<T>) => {
  request({
    variables,
    onError: () => {
      toast.error("Oops! Algo deu errado.", {
        description:
          "Verifique sua conexão com a internet e tente novamente mais tarde.",
        duration: 1500,
      });
    },
    onCompleted: (response, errors) => {
      if (errors?.length) {
        errors?.forEach(({ message }) => {
          toast.warning("Atenção!", {
            description: message,
            duration: 1500,
          });
        });
        return;
      }
      toast.success("Sucesso!", {
        description: "Operação realizada com sucesso!",
        duration: 1500,
      });

      if (onCompleted) {
        onCompleted(response as T);
      }
    },
  });
};
