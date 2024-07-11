import { Input, Label } from "@repo/ui/components";
import { Eye, EyeOff } from "lucide-react";
import type { InputHTMLAttributes } from "react";
import { forwardRef, useState } from "react";

interface InputPasswordProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

const InputPassword = forwardRef<HTMLInputElement, InputPasswordProps>(
  ({ label, onChange, value }, ref) => {
    const [showPass, setShowPass] = useState(false);

    const type = showPass ? "text" : "password";

    return (
      <>
        <Label>{label}</Label>
        <div className="flex items-center justify-center">
          <Input
            className="w-full"
            maxLength={20}
            onChange={onChange}
            type={type}
            value={value}
            ref={ref}
            placeholder={label}
          />

          <div className="relative right-8 w-0 hover:cursor-pointer">
            {!showPass ? (
              <Eye
                className="h-5 w-5"
                onClick={() => {
                  setShowPass(true);
                }}
              />
            ) : (
              <EyeOff
                className="h-5 w-5"
                onClick={() => {
                  setShowPass(false);
                }}
              />
            )}
          </div>
        </div>
      </>
    );
  }
);

InputPassword.displayName = "InputPassword";

export { InputPassword };