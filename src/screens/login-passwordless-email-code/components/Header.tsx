import ULThemeLogo from "@/components/ULThemeLogo";
import ULThemeSubtitle from "@/components/ULThemeSubtitle";
import ULThemeTitle from "@/components/ULThemeTitle";

import { useLoginPasswordlessEmailCodeManager } from "../hooks/useLoginPasswordlessEmailCodeManager";

function Header() {
  const { texts } = useLoginPasswordlessEmailCodeManager();

  // Handle text fallbacks in component
  const logoAltText = texts?.logoAltText || "Application Logo";

  return (
    <>
      <ULThemeLogo altText={logoAltText}></ULThemeLogo>
      <ULThemeTitle>{texts?.title || "Check your email"}</ULThemeTitle>
      <ULThemeSubtitle>
        {texts?.description ||
          "We've sent a verification code to your email address."}
      </ULThemeSubtitle>
    </>
  );
}

export default Header;
