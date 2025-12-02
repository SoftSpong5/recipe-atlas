import React, { useState } from 'react';
import { Volume2, StopCircle } from 'lucide-react';

interface Props {
  text: string;
}

const TTSButton: React.FC<Props> = ({ text }) => {
  const [speaking, setSpeaking] = useState(false);

  const handleSpeak = () => {
    if (!window.speechSynthesis) return;

    if (speaking) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.onend = () => setSpeaking(false);
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
    setSpeaking(true);
  };

  return (
    <button 
      onClick={handleSpeak}
      className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
        speaking 
        ? 'bg-orange-100 text-orange-700 animate-pulse' 
        : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
      }`}
    >
      {speaking ? <StopCircle size={16} /> : <Volume2 size={16} />}
      {speaking ? 'Stop Reading' : 'Read Aloud'}
    </button>
  );
};

export default TTSButton;
