import { createBrowserRouter } from "react-router-dom";
import { EmailSignInPage } from "./pages/sign-in/email-sign-in";
import { AuthPageLayout } from "./layouts/auth";
import { PasswordSignInPage } from "./pages/sign-in/password-sign-in";
import { SignUpPage } from "./pages/sign-up";
import { ConfirmationPage } from "./pages/confirmation";
import { DashboardPage } from "./pages/dashboard";
import { AppLayout } from "./layouts/app";
import { AuthProvider } from "./context/auth-context";

export const router: any = createBrowserRouter([
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
    path: '/',
    element: (
      <AuthProvider>
        <AppLayout />
      </AuthProvider>
    ),
    children: [
      {
        path: '/dashboard',
        element: <DashboardPage />
      }
    ]
  },
  {
    path: "/confirmation",
    element: <ConfirmationPage />,
  },
]);
