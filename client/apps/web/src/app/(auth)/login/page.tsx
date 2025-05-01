import { Suspense } from "react";

import LoginPageClient from "./page-client";

function LoginPage() {
  return (
    <Suspense>
      <LoginPageClient />
    </Suspense>
  );
}

export default LoginPage;
