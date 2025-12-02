import React, { useState, useEffect } from 'react';
import { Mic, MicOff } from 'lucide-react';

interface Props {
  onTranscript: (text: string) => void;
  isListening?: boolean;
}

const VoiceSearchInput: React.FC<Props> = ({ onTranscript }) => {
  const [listening, setListening] = useState(false);
  const [supported, setSupported] = useState(false);

  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      setSupported(true);
    }
  }, []);

  const toggleListen = () => {
    if (!supported) return;

    if (listening) {
      // Logic to stop handled by end event usually, but simplistic toggle here
      setListening(false);
      return;
    }

    const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.start();
    setListening(true);

    recognition.onresult = (event: any) => {
      const text = event.results[0][0].transcript;
      onTranscript(text);
      setListening(false);
    };

    recognition.onerror = () => {
      setListening(false);
    };

    recognition.onend = () => {
      setListening(false);
    };
  };

  if (!supported) return null;

  return (
    <button
      type="button"
      onClick={toggleListen}
      className={`p-3 rounded-xl transition-colors ${
        listening ? 'bg-red-50 text-red-600 animate-pulse' : 'bg-stone-100 text-stone-500 hover:bg-stone-200'
      }`}
      aria-label="Voice Input"
    >
      {listening ? <MicOff size={20} /> : <Mic size={20} />}
    </button>
  );
};

export default VoiceSearchInput;
