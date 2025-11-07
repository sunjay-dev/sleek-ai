import { SignIn } from "@clerk/clerk-react";

export default function AuthPage() {
  return (
    <div className="flex min-h-screen bg-neutral-900 ">
      <div className="hidden md:flex md:w-1/2 bg-neutral-900 items-center justify-center p-8 text-white relative overflow-hidden">
        <div className="absolute inset-0 z-0">
            <div className="absolute bottom-0 left-[-20%] right-[-10%] top-[-10%] h-[500px] w-[500px] rounded-full bg-[radial-gradient(circle_farthest-side,rgba(255,0,182,.15),rgba(255,255,255,0))]"></div>
            <div className="absolute bottom-[-20%] right-[0%] top-[-10%] h-[500px] w-[500px] rounded-full bg-[radial-gradient(circle_farthest-side,rgba(255,0,182,.15),rgba(255,255,255,0))]"></div>
        </div>

        <div className="relative z-10 text-center">
          <h1 className="text-5xl font-bold mb-4 text-white">Chatty AI</h1>
          <p className="text-lg text-neutral-300">Your intelligent conversation partner.</p>
          <div className="mt-12 p-4 border border-neutral-700 bg-neutral-800/50 rounded-lg backdrop-blur-sm">
            <p className="font-mono text-left text-sm text-neutral-400">
              <span className="text-green-400">{'>'} </span> Sign in to start your session...<br/>
              <span className="text-green-400">{'>'} </span> Access conversation history.<br/>
              <span className="text-green-400">{'>'} </span> Explore different AI models.
            </p>
          </div>
        </div>
      </div>

      <div className="w-full md:w-1/2 flex items-center justify-center p-4 bg-neutral-900">
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