type Props = {
  error?: Error;
  resetErrorBoundary?: () => void;
};

export default function ErrorPage({ error, resetErrorBoundary }: Props) {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-white text-primary p-4 text-center z-50 overflow-hidden">
      <img
        src="https://cdn.dribbble.com/users/285475/screenshots/2083086/dribbble_1.gif"
        alt="Error animation"
        className="w-90 h-90 -mt-16 object-cover"
      />
      <h1 className="text-2xl font-semibold mb-2 -mt-16">Oops! Something broke.</h1>
      <p className="mb-4 text-gray-600">{error?.message || "An unexpected error occurred. Please try again."}</p>
      {resetErrorBoundary && (
        <button
          onClick={resetErrorBoundary}
          className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 active:bg-green-600  transition"
        >
          Try Again
        </button>
      )}
    </div>
  );
}
