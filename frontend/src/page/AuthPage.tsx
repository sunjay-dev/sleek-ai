import { SignIn } from "@clerk/clerk-react";

export default function AuthPage() {
  function getCurrentYear() {
    return new Date().getFullYear();
  }

  return (
    <div className="min-h-screen w-full relative bg-light text-primary">
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `
        linear-gradient(45deg, transparent 49%, #e5e7eb 49%, #e5e7eb 51%, transparent 51%),
        linear-gradient(-45deg, transparent 49%, #e5e7eb 49%, #e5e7eb 51%, transparent 51%)
      `,
          backgroundSize: "40px 40px",
          WebkitMaskImage: "radial-gradient(ellipse 60% 60% at 50% 50%, #000 30%, transparent 80%)",
          maskImage: "radial-gradient(ellipse 60% 60% at 50% 50%, #000 30%, transparent 80%)",
        }}
      />

      <div className="relative z-10 flex min-h-screen w-full">
        <div className="hidden w-1/2 flex-col justify-between p-12 md:flex">
          <div className="flex items-center gap-2 font-semibold tracking-tighter text-xl">
            <img src="./logo.webp" alt="Chatty AI Logo" className="h-8 w-8 object-cover" />
            Chatty AI
          </div>
          <div className="max-w-lg mb-20">
            <h1 className="mb-6 text-5xl font-medium tracking-tight leading-tight">
              Unlock limitless <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 via-amber-500 to-orange-600 animate-gradient-x">
                intelligence.
              </span>
            </h1>
            <p className="text-lg text-neutral-600 font-light leading-relaxed">
              Turn ideas into reality with an AI partner that understands context, code, and no sense. The smartest way to build, write, and learn is
              right here.
            </p>
          </div>

          <div className="text-xs text-neutral-400">© {getCurrentYear()} Chatty AI Inc. All rights reserved.</div>
        </div>

        <div className="flex w-full flex-col items-center justify-center p-4 md:w-1/2">
          <div className="md:hidden flex flex-col items-center mb-8 text-center space-y-2">
            <div className="flex items-center gap-1 font-semibold sm:font-bold tracking-tighter text-2xl">
              <img src="./logo.webp" alt="Chatty AI Logo" className="h-8 w-8 object-cover" />
              Chatty AI
            </div>
            <p className="text-sm text-neutral-500">Turn ideas into reality with an AI partner.</p>
          </div>

          <div className="w-full max-w-sm flex justify-center">
            <SignIn
              path="/auth"
              routing="path"
              fallbackRedirectUrl="/"
              forceRedirectUrl="/"
              appearance={{
                elements: {
                  footerAction: { display: "none" },
                },
              }}
            />
          </div>

          <div className="md:hidden mt-8 text-xs text-neutral-400">© {getCurrentYear()} Chatty AI Inc.</div>
        </div>
      </div>
    </div>
  );
}
