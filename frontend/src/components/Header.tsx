import { UserButton } from "@clerk/clerk-react";

export default function Header() {
  return (
    <header className="sticky top-0 z-10 p-4 flex justify-end items-center">
      <UserButton />
    </header>
  );
}