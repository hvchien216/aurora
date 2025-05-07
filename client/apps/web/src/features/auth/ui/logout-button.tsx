import React from "react";
import { Button } from "@leww/ui";
import { LogOut } from "lucide-react";

import { clientSessionToken, httpRequest } from "~/lib";
import { tryCatch } from "@leww/utils";

export const LogoutButton = () => {
  const [isPending, startTransition] = React.useTransition();

  const onLogout = async () => {
    startTransition(async () => {
      await tryCatch(
        httpRequest.post(`${process.env.NEXT_PUBLIC_HOST_URL}/api/auth/logout`),
      );

      clientSessionToken.value = null;
      clientSessionToken.refreshToken = null;
      location.href = "/login";
    });
  };

  return (
    <Button
      onClick={onLogout}
      loading={isPending}
      className="w-full cursor-pointer"
      leftSection={<LogOut />}
    >
      Log out
    </Button>
  );
};
