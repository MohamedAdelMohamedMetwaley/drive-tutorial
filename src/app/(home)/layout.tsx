import { CloudIcon } from "lucide-react";

export default function Home(props: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white">
      <header className="container mx-auto flex items-center justify-between px-4 py-6">
        <div className="flex items-center space-x-2">
          <CloudIcon className="h-8 w-8" />
          <span className="text-2xl font-bold">ZDrive</span>
        </div>
      </header>

      <main className="container mx-auto px-4 py-16">{props.children}</main>

      <footer className="container mx-auto mt-16 px-4 py-8 text-center text-gray-500">
        <p>&copy; {new Date().getFullYear()} ZDrive. All rights reserved.</p>
      </footer>
    </div>
  );
}
