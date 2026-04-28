"use client";

import { useState, useCallback, useRef } from "react";

export const RAZINGER_VOICES = {
  ADAM: "pNInz6obpgDQGcFmaJcg", // Adam voice id from ElevenLabs
};

export function getRazingerGreeting() {
  return "RAZINGER systems online. Good evening, Commander. All intelligence modules are active. I have full context on Kivuli, EpiPredict, Netfluenz, and Cyber Guard. ElevenLabs voice layer is standing by. What's the mission?";
}

export function formatForVoice(text: string) {
  // Strip markdown, code blocks, bullet points etc for smoother voice reading
  return text
    .replace(/```[\s\S]*?```/g, " I am pushing the code implementation to your screen. ")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/[-*]\s+/g, ", ")
    .replace(/#/g, "")
    .trim();
}

export function useRazingerVoiceAgent(config: { apiKey: string; voiceId: string }) {
  const [isListening, setIsListening] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const recognitionRef = useRef<any>(null);

  const speak = useCallback(
    async (text: string) => {
      if (!config.apiKey) {
        console.warn("ElevenLabs API Key not found, skipping TTS.");
        return;
      }

      try {
        const response = await fetch(
          `https://api.elevenlabs.io/v1/text-to-speech/${config.voiceId}/stream`,
          {
            method: "POST",
            headers: {
              "Accept": "audio/mpeg",
              "Content-Type": "application/json",
              "xi-api-key": config.apiKey,
            },
            body: JSON.stringify({
              text,
              model_id: "eleven_turbo_v2",
              voice_settings: {
                stability: 0.75,
                similarity_boost: 0.85,
                style: 0.4,
                use_speaker_boost: true,
              },
            }),
          }
        );

        if (!response.ok) {
          console.error("Failed to fetch ElevenLabs TTS");
          return;
        }

        const arrayBuffer = await response.arrayBuffer();
        if (!audioContextRef.current) {
          audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
        }
        
        const audioBuffer = await audioContextRef.current.decodeAudioData(arrayBuffer);
        const source = audioContextRef.current.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(audioContextRef.current.destination);
        source.start(0);
      } catch (err) {
        console.error("Voice playback error:", err);
      }
    },
    [config.apiKey, config.voiceId]
  );

  const startListening = useCallback((onResult: (text: string) => void) => {
    if (!("webkitSpeechRecognition" in window) && !("SpeechRecognition" in window)) {
      console.warn("Speech recognition not supported in this browser.");
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;
    
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-US";

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      onResult(transcript);
    };

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error", event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  }, []);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsListening(false);
  }, []);

  return { speak, startListening, stopListening, isListening };
}
