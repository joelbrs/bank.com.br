import { createBrowserRouter } from "react-router-dom";
import { EmailSignInPage } from "./pages/sign-in/email-sign-in";
import { AuthPageLayout } from "./layouts/auth";
import { PasswordSignInPage } from "./pages/sign-in/password-sign-in";
import { SignUpPage } from "./pages/sign-up";
import { ConfirmationPage } from "./pages/confirmation";
import { DashboardLayout } from "./layouts/dashboard";
import { NotFoundPage } from "./pages/not-found";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AuthPageLayout />,
    children: [
      {
        path: "/",
        element: <SignUpPage />,
      },
      {
        path: "/sign-in",
        element: <PasswordSignInPage />,
      },
      {
        path: "/sign-in/email",
        element: <EmailSignInPage />,
      },
    ],
  },
  {
    path: "/dashboard",
    element: <DashboardLayout />,
  },
  {
    path: "/confirmation",
    element: <ConfirmationPage />,
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
]);
