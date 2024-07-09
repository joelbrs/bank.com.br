import { RegisterUserMutation as RegisterUser } from "./register-user";
import { ConfirmUserMutation as ConfirmUser } from "./confirm-user";
import { LoginPasswordAccessMutation as LoginPasswordAccess } from "./login-password-access";
import { LoginEmailAccessMutation as LoginEmailAccess } from "./login-email-access";

export const UserMutations = {
  RegisterUser,
  ConfirmUser,
  LoginPasswordAccess,
  LoginEmailAccess,
};
