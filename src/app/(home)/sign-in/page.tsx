import { SignInButton } from "@clerk/nextjs";

export default function SignIn() {
  return (
    <div className="flex h-80 flex-col items-center justify-center">
      <span className="rounded-full bg-gray-800 px-6 py-2 text-lg font-bold text-white transition duration-200 hover:bg-gray-700">
        <SignInButton />
      </span>
    </div>
  );
}
