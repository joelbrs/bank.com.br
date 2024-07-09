import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";

interface Props {
  email: string;
  link: string;
}

export function UserLoginTemplate({ email, link }: Props) {
  const previewText = "Faça Login na Bank";

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
              Faça Login na Bank
            </Heading>
            <Text className="text-black text-[14px] leading-[24px]">
              Você solicitou um link para login na Bank através do email {email}
              .
            </Text>
            <Section className="text-center mt-[32px] mb-[32px]">
              <Button
                className="bg-sky-500 rounded text-white px-5 py-3 text-[12px] font-semibold no-underline text-center"
                href={link}
              >
                Acessar Agora
              </Button>
            </Section>
            <Text className="text-black text-[14px] leading-[24px]">
              ou copie a URL abaixo e cole em seu navegador:{" "}
              <Link href={link} className="text-sky-500 no-underline">
                {link}
              </Link>
            </Text>
            <Hr className="border border-solid border-[#eaeaea] my-[26px] mx-0 w-full" />
            <Text className="text-[#666666] text-[12px] leading-[24px]">
              Se você não solicitou esse link de autenticação, apenas descarte
              esse e-mail.
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
