import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";

type Props = {
  senderName?: string;
  value?: number | string;
};

export function TransactionReceivedTemplate({
  senderName,
  value,
}: Props): JSX.Element {
  const previewText = "Transação recebida pela Bank";

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Tailwind>
        <Body className="bg-white my-auto mx-auto font-sans">
          <Container className="border border-solid border-[#eaeaea] rounded my-[40px] mx-auto p-[20px] w-[465px]">
            <Section className="mt-[32px] text-center">
              <span className="text-2xl">Bank</span>
            </Section>
            <Heading className="text-black text-[24px] font-normal text-center p-0 my-[30px] mx-0">
              {senderName} enviou uma transação de ${Number(value).toFixed(2)}{" "}
              para sua conta Bank.
            </Heading>
            <Text className="text-black text-[14px] leading-[24px]">
              Efetue Login para verificar o detalhe da transação e o seu saldo
              atualizado:{" "}
              <Link
                href="https://bank.joelf.tech/sign-in"
                className="text-sky-500 no-underline"
              >
                https://bank.joelf.tech/sign-in
              </Link>
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
