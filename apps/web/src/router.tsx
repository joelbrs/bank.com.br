import { createBrowserRouter } from "react-router-dom";
import { EmailSignInPage, PasswordSignInPage } from "./pages";

export const router: any = createBrowserRouter([
  {
    path: "/sign-in",
    element: <PasswordSignInPage />,
  },
  {
    path: "/sign-in/email",
    element: <EmailSignInPage />,
  },
]);
