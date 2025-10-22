import { useMemo } from "react";

import type { ScreenMembersOnLoginPasswordlessEmailCode } from "@auth0/auth0-acul-js";
import LoginPasswordlessEmailCode from "@auth0/auth0-acul-js/login-passwordless-email-code";

import { executeSafely } from "@/utils/helpers/executeSafely";

/**
 * Custom hook to manage the LoginPasswordlessEmailCode screen functionality.
 * This hook provides methods and properties to handle passwordless login via email OTP,
 * including sending verification codes and verifying them.
 */
export const useLoginPasswordlessEmailCodeManager = () => {
  // Initialize the LoginPasswordlessEmailCode instance
  const passwordlessInstance = useMemo(
    () => new LoginPasswordlessEmailCode(),
    []
  );

  // Extract transaction and screen properties from the instance
  const { transaction, screen } = passwordlessInstance;

  // Extract relevant flags from the transaction object
  const { isSignupEnabled } = transaction;

  // Extract relevant properties from the screen object
  const { signupLink, texts, captchaImage, links, data } = screen;

  /**
   * Handles sending an OTP code to the provided email address.
   * Optionally includes a CAPTCHA value if required.
   *
   * @param email - The email address to send the verification code to.
   * @param captcha - (Optional) The CAPTCHA value if required.
   * @returns A promise that resolves when the code is sent.
   */
  const handleSendCode = async (
    email: string,
    captcha?: string
  ): Promise<void> => {
    const options: { email: string; captcha?: string } = {
      email: email?.trim() || "",
    };

    // Include CAPTCHA in the options if available and provided
    if (screen.isCaptchaAvailable && captcha?.trim()) {
      options.captcha = captcha.trim();
    }

    // Execute the send code process safely and log any errors
    executeSafely(
      `Send passwordless email code with options: ${JSON.stringify(options)}`,
      () => passwordlessInstance.resendCode({ email: options.email })
    );
  };

  /**
   * Handles verifying the OTP code entered by the user.
   *
   * @param code - The verification code entered by the user.
   * @returns A promise that resolves when the code is verified.
   */
  const handleVerifyCode = async (code: string): Promise<void> => {
    const options = {
      code: code?.trim() || "",
    };

    // Execute the verify code process safely and log any errors
    executeSafely(
      `Verify passwordless email code with options: ${JSON.stringify(options)}`,
      () => passwordlessInstance.submitCode(options)
    );
  };

  /**
   * Handles resending the OTP code to the same email address.
   *
   * @returns A promise that resolves when the code is resent.
   */
  const handleResendCode = async (): Promise<void> => {
    executeSafely(`Resend passwordless email code`, () =>
      passwordlessInstance.resendCode()
    );
  };

  return {
    passwordlessInstance,
    handleSendCode,
    handleVerifyCode,
    handleResendCode,
    texts: (texts || {}) as ScreenMembersOnLoginPasswordlessEmailCode["texts"],
    isSignupEnabled: isSignupEnabled === true,
    isCaptchaAvailable: screen.isCaptchaAvailable === true,
    errors: passwordlessInstance.getError(),
    links,
    signupLink,
    captchaImage,
    data,
  };
};
