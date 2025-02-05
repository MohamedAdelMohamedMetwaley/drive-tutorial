import { CloudIcon } from "lucide-react";
import { Button } from "~/components/ui/button";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default function Home() {
  return (
    <>
      <section className="mb-16 text-center">
        <h1 className="mb-4 text-5xl font-bold">
          Your files, anywhere, anytime
        </h1>
        <p className="mb-8 text-xl">
          Secure cloud storage for all your important data
        </p>
        <form
          action={async () => {
            "use server";
            const session = await auth();

            if (!session.userId) {
              return redirect("/sign-in");
            }

            return redirect("/drive");
          }}
        >
          <Button
            size={"lg"}
            type="submit"
            className="rounded-full bg-gray-800 px-6 py-2 text-lg font-bold text-white transition duration-200 hover:bg-gray-700"
          >
            Get Started
          </Button>
        </form>
      </section>

      <section className="grid gap-8 md:grid-cols-2">
        <div className="text-center">
          <CloudIcon className="mx-auto mb-4 h-12 w-12" />
          <h2 className="mb-2 text-2xl font-semibold">Cloud Storage</h2>
          <p>Store and access your files from anywhere, on any device</p>
        </div>
        <div className="text-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="mx-auto mb-4 h-12 w-12"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z"
            />
          </svg>
          <h2 className="mb-2 text-2xl font-semibold">Secure & Private</h2>
          <p>Your data is encrypted and protected at all times</p>
        </div>
      </section>
    </>
  );
}
