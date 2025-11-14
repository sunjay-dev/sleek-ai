import { SignIn } from "@clerk/clerk-react";

export default function AuthPage() {
  return (
    <div className="flex min-h-screen bg-neutral-50 ">
      <div className="hidden md:flex md:w-1/2 bg-neutral-50 items-center justify-center p-8 text-primary relative overflow-hidden">
        <div className="absolute inset-0 z-0">
            <div className="absolute bottom-0 left-[-20%] right-[-10%] top-[-10%] h-[500px] w-[500px] rounded-full bg-[radial-gradient(circle_farthest-side,rgba(255,0,182,.15),rgba(255,255,255,0))]"></div>
            <div className="absolute bottom-[-20%] right-[0%] top-[-10%] h-[500px] w-[500px] rounded-full bg-[radial-gradient(circle_farthest-side,rgba(255,0,182,.15),rgba(255,255,255,0))]"></div>
        </div>

        <div className="relative z-10 text-center">
          <h1 className="text-5xl font-bold mb-4 text-primary">Chatty AI</h1>
          <p className="text-lg text-neutral-600">Your intelligent conversation partner.</p>
          <div className="mt-12 p-4 border border-neutral-200 bg-neutral-100/50 rounded-lg backdrop-blur-sm">
            <p className="font-mono text-left text-sm text-neutral-500">
              <span className="text-green-400">{'>'} </span> Sign in to start your session...<br/>
              <span className="text-green-400">{'>'} </span> Access conversation history.<br/>
              <span className="text-green-400">{'>'} </span> Explore different AI models.
            </p>
          </div>
        </div>
      </div>

      <div className="w-full md:w-1/2 flex items-center justify-center p-4 bg-neutral-50">
        <SignIn
          path="/auth"
          routing="path"
          fallbackRedirectUrl="/"
          forceRedirectUrl="/"
          appearance={{
            elements: {
              footerAction: { display: "none" },
              }
          }}
        />
      </div>
    </div>
  )
}