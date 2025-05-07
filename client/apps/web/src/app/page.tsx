import Link from "next/link";
import { GradientBackground, Wordmark } from "@leww/ui";

export default function Home() {
  // const { toast } = useToast();

  // const onClick = async () => {
  // console.log("clientSessionToken.value", clientSessionToken.value);
  // const { data, error } = await tryCatch<unknown, AppError>(
  //   httpRequest.get(`/v1/profile`),
  // );
  // await tryCatch<unknown, AppError>(httpRequest.get(`/v1/profile`));
  // console.log("data", data, !!error);
  // if (error) {
  //   console.log("alo alo");
  //   toast({
  //     title: error.message,
  //     description: "Friday, February 10, 2023 at 5:57 PM",
  //   });
  // }
  // const { data: workspaces } = await tryCatch(
  //   httpRequest.get(`/v1/workspaces`),
  // );
  // console.log("🚀 ~ onClick ~ workspaces:", workspaces);
  // const [workspacesResult, profileResult] = await Promise.allSettled([
  //   tryCatch<Workspace[]>(httpRequest.get("/v1/workspaces")),
  //   tryCatch<any>(httpRequest.get("/v1/profile1")),
  // ]);
  // console.log("🚀 ~ onClick ~ profileResult:", profileResult);
  // console.log("🚀 ~ onClick ~ workspacesResult:", workspacesResult);
  //   const [workspacesResult, profileResult] = await Promise.allSettled([
  //     httpRequest.get("/v1/workspaces"),
  //     httpRequest.get("/v1/profile1"),
  //   ]);
  //       console.log("🚀 ~ onClick ~ profileResult:", profileResult);
  //       console.log("🚀 ~ onClick ~ workspacesResult:", workspacesResult);
  // };

  // const onRedirect = async () => {
  //   router.push("/YXAMCOg");
  // };
  return (
    <>
      <GradientBackground />
      <div className="relative flex min-h-screen w-full items-center justify-center space-x-3">
        <Link href="/login" className="flex items-center gap-2">
          <Wordmark />
        </Link>
        {/* <div className="space-x-3">
          <Button onClick={onClick}>Get Profile</Button>
          <Button onClick={onRedirect}>Redirect to /YXAMCOg</Button>
        </div> */}
      </div>
    </>
  );
}
