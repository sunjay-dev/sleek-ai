import { useEffect } from 'react';
import {MessagesContainer, Header, InputContainer} from '../components';
import { models } from '../data/models';
import { useChat } from '../hooks/useChat';

export default function ChatPage() {
  const { messages, sendMessage, resendLastUser, isLoading, selectedModel, setSelectedModel, stopGeneration } = useChat();

  const handleModelChange = (modelId: string) => {
    setSelectedModel(modelId);
  }

  const scrollToBottom = () => {
    setTimeout(() => {
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })
    }, 100);
  }

  useEffect(() => {
    if (messages.length > 0) {
      scrollToBottom()
    }
  }, [messages]);

  return (
    <div className='min-h-screen bg-neutral-900 text-white'>
      <div className={`${messages.length === 0 ? 'h-screen' : 'min-h-screen'} bg-neutral-900 flex flex-col`}>
        <div className="md:max-w-3xl max-w-4xl mx-auto w-full flex-1 flex flex-col">
          <Header />
          <MessagesContainer messages={messages} onResend={resendLastUser} isLoading={isLoading} />
          <InputContainer
            onSend={sendMessage}
            isLoading={isLoading}
            models={models}
            selectedModel={selectedModel}
            onStop={stopGeneration}
            onModelChange={handleModelChange}
          />
        </div>
      </div>
    </div>
  );
}