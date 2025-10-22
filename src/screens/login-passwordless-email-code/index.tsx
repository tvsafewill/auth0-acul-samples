import ULThemeCard from "@/components/ULThemeCard";
import ULThemePageLayout from "@/components/ULThemePageLayout";
import { applyAuth0Theme } from "@/utils/theme/themeEngine";

import Footer from "./components/Footer";
import Header from "./components/Header";
import PasswordlessEmailForm from "./components/PasswordlessEmailForm";
import { useLoginPasswordlessEmailCodeManager } from "./hooks/useLoginPasswordlessEmailCodeManager";

function LoginPasswordlessEmailCodeScreen() {
  // Extracting attributes from hook made out of LoginPasswordlessEmailCode class of Auth0 JS SDK
  const { passwordlessInstance, texts } = useLoginPasswordlessEmailCodeManager();

  // Set page title
  document.title = texts?.pageTitle || "Email Verification";

  // Apply theme from SDK instance when screen loads
  applyAuth0Theme(passwordlessInstance);

  return (
    // Applying UDS theme overrides using the "theme-universal" class
    <ULThemePageLayout className="theme-universal">
      <ULThemeCard className="w-full max-w-[400px] gap-0">
        <Header />
        <PasswordlessEmailForm />
        <Footer />
      </ULThemeCard>
    </ULThemePageLayout>
  );
}

export default LoginPasswordlessEmailCodeScreen;
