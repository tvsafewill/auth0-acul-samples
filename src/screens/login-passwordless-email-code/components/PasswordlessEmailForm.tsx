import { useForm } from "react-hook-form";

import type { Error } from "@auth0/auth0-acul-js";

import Captcha from "@/components/Captcha/index";
import { ULThemeFloatingLabelField } from "@/components/form/ULThemeFloatingLabelField";
import { ULThemeFormMessage } from "@/components/form/ULThemeFormMessage";
import { Form, FormField, FormItem } from "@/components/ui/form";
import { ULThemeAlert, ULThemeAlertTitle } from "@/components/ULThemeError";
import ULThemeLink from "@/components/ULThemeLink";
import { ULThemePrimaryButton } from "@/components/ULThemePrimaryButton";
import { useCaptcha } from "@/hooks/useCaptcha";
import { getFieldError } from "@/utils/helpers/errorUtils";

import { useLoginPasswordlessEmailCodeManager } from "../hooks/useLoginPasswordlessEmailCodeManager";
import OTPInput from "./OTPInput";

interface PasswordlessEmailFormData {
  email?: string;
  code?: string;
  captcha?: string;
}

function PasswordlessEmailForm() {
  const {
    handleSendCode,
    handleVerifyCode,
    handleResendCode,
    errors,
    isCaptchaAvailable,
    passwordlessInstance,
    texts,
  } = useLoginPasswordlessEmailCodeManager();

  const form = useForm<PasswordlessEmailFormData>({
    defaultValues: {
      email: "",
      code: "",
      captcha: "",
    },
  });

  const {
    formState: { isSubmitting },
  } = form;

  const getCaptchaTheme = (): "light" | "dark" | "auto" => {
    const allowedThemes = ["light", "dark", "auto"] as const;
    const rawTheme =
      passwordlessInstance?.branding?.themes?.default?.colors?.captcha_widget_theme;

    const isValidTheme = (
      theme: unknown
    ): theme is "light" | "dark" | "auto" => {
      return allowedThemes.includes(theme as "light" | "dark" | "auto");
    };

    return isValidTheme(rawTheme) ? rawTheme : "auto";
  };

  // Handle text fallbacks
  const emailPlaceholder = texts?.emailPlaceholder || "Email address";
  const codePlaceholder = texts?.codePlaceholder || "Verification code";
  const buttonText = texts?.buttonText || "Continue";
  const resendCodeText = texts?.resendCodeText || "Resend code";
  const captchaLabel = texts?.captchaCodePlaceholder?.concat("*") || "CAPTCHA*";

  // Get general errors (not field-specific)
  const generalErrors =
    errors?.filter((error: Error) => !error.field || error.field === null) ||
    [];

  const emailSDKError = getFieldError("email", errors);
  const codeSDKError = getFieldError("code", errors);
  const captchaSDKError = getFieldError("captcha", errors);

  const { captchaConfig, captchaProps, captchaValue } = useCaptcha(
    passwordlessInstance?.screen?.captcha || undefined,
    captchaLabel,
    getCaptchaTheme()
  );

  // Determine if we're in email entry or code verification step
  // This is a simple implementation - in production, you'd track state more robustly
  const isCodeSent = passwordlessInstance?.screen?.data?.email;

  // Proper submit handler with form data
  const onSubmit = async (data: PasswordlessEmailFormData) => {
    if (isCodeSent) {
      // Verify code step
      await handleVerifyCode(data.code || "");
    } else {
      // Send code step
      await handleSendCode(data.email || "", captchaValue);
    }
  };

  const handleResend = async () => {
    await handleResendCode();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
        {/* General alerts at the top */}
        {generalErrors.length > 0 && (
          <div className="space-y-3 mb-4">
            {generalErrors.map((error: Error, index: number) => (
              <ULThemeAlert key={index} variant="destructive">
                <ULThemeAlertTitle>{error.message}</ULThemeAlertTitle>
              </ULThemeAlert>
            ))}
          </div>
        )}

        {!isCodeSent ? (
          <>
            {/* Email entry step */}
            <FormField
              control={form.control}
              name="email"
              rules={{
                required: "Email is required",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Please enter a valid email address",
                },
              }}
              render={({ field, fieldState }) => (
                <FormItem>
                  <ULThemeFloatingLabelField
                    {...field}
                    label={emailPlaceholder}
                    type="email"
                    autoFocus={true}
                    autoComplete="email"
                    error={!!fieldState.error || !!emailSDKError}
                  />
                  <ULThemeFormMessage
                    sdkError={emailSDKError}
                    hasFormError={!!fieldState.error}
                  />
                </FormItem>
              )}
            />

            {/* CAPTCHA Box */}
            {isCaptchaAvailable && captchaConfig && (
              <Captcha
                control={form.control}
                name="captcha"
                captcha={captchaConfig}
                {...captchaProps}
                sdkError={captchaSDKError}
                rules={{
                  required: "Please complete the CAPTCHA",
                  maxLength: {
                    value: 15,
                    message: "CAPTCHA too long",
                  },
                }}
              />
            )}
          </>
        ) : (
          <>
            {/* Code verification step - Modern 6-digit OTP input */}
            <div className="mb-2">
              <label className="block text-sm font-medium text-body-text mb-2">
                {codePlaceholder}
              </label>
              <FormField
                control={form.control}
                name="code"
                rules={{
                  required: "Verification code is required",
                  minLength: {
                    value: 6,
                    message: "Code must be 6 digits",
                  },
                  maxLength: {
                    value: 6,
                    message: "Code must be 6 digits",
                  },
                  pattern: {
                    value: /^\d{6}$/,
                    message: "Code must be 6 digits",
                  },
                }}
                render={({ field, fieldState }) => (
                  <FormItem>
                    <OTPInput
                      length={6}
                      value={field.value || ""}
                      onChange={field.onChange}
                      error={!!fieldState.error || !!codeSDKError}
                      disabled={isSubmitting}
                    />
                    <ULThemeFormMessage
                      sdkError={codeSDKError}
                      hasFormError={!!fieldState.error}
                    />
                  </FormItem>
                )}
              />
            </div>

            {/* Resend code link */}
            <div className="text-center mb-4">
              <ULThemeLink onClick={handleResend} href="#">
                {resendCodeText}
              </ULThemeLink>
            </div>
          </>
        )}

        {/* Submit button */}
        <ULThemePrimaryButton
          type="submit"
          className="w-full"
          disabled={isSubmitting}
        >
          {buttonText}
        </ULThemePrimaryButton>
      </form>
    </Form>
  );
}

export default PasswordlessEmailForm;
