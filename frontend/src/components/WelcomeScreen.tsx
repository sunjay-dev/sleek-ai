type Props = {
  sendMessage: (text: string, file?: File | null) => void;
};

export default function WelcomeScreen({ sendMessage }: Props) {
  const suggestions = [
    "Weather in London today",
    "Latest news on artificial intelligence",
    "Current trends in web development?",
    "Weather forecast for New York this week",
  ];

  const handleSuggestionClick = (suggestion: string) => {
    sendMessage(suggestion);
  };

  return (
    <div className="h-full flex items-center justify-center">
      <div className="max-w-3xl w-full px-6">
        <div className="text-center mb-8 space-y-2">
          <h1 className="text-3xl font-semibold text-primary">Hey I'm Chatty AI</h1>
          <p className="text-md text-gray-lab">How can I assist you today?</p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              onClick={() => handleSuggestionClick(suggestion)}
              className="bg-primary-gradient border border-secondary text-primary sm:text-sm text-xs font-medium rounded-lg px-4 py-2 cursor-pointer transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50"
            >
              {suggestion}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
