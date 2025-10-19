import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-2">
      <h1 className="text-5xl font-bold">Login Auth using Next.js</h1>
      <p className="text-muted-foreground text-xl mt-2">This is just a project to learn more about next.js, auth.js and database interactions</p>

      <Link href={'sign-in'}>
        <Button className="mt-2">Navigate to Sign In</Button>
      </Link>
    </div>
  );
}
