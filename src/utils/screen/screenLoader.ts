import { lazy } from "react";

const SCREEN_COMPONENTS: Record<string, React.ComponentType> = {
  "login-id": lazy(() => import("@/screens/login-id")),
  login: lazy(() => import("@/screens/login")),
  "login-password": lazy(() => import("@/screens/login-password")),
  "login-passwordless-email-code": lazy(() =>
    import("@/screens/login-passwordless-email-code")
  ),
};

export const getScreenComponent = (
  screenName: string
): React.ComponentType | null => {
  return SCREEN_COMPONENTS[screenName] || null;
};
