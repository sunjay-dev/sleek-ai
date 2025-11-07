import { UserButton } from "@clerk/clerk-react";

export default function Header() {
  return (
    <header className="p-4 flex justify-end items-center">
      <UserButton signInUrl="/auth" />
    </header>
  );
}