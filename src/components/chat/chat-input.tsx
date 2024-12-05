"use client";

import { useState, useRef, useEffect } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { SendHorizontal, Paperclip, Image as ImageIcon, Smile } from "lucide-react";
import { motion } from "framer-motion";

interface ChatInputProps {
  onSend: (content: string) => Promise<void>;
  isLoading: boolean;
}

export default function ChatInput({ onSend, isLoading }: ChatInputProps) {
  const [content, setContent] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!content.trim()) return;

    try {
      await onSend(content);
      setContent("");
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (content.trim()) {
        handleSubmit(e as any);
      }
    }
  };

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
    >
      <form
        onSubmit={handleSubmit}
        className="container mx-auto p-4 flex items-center gap-2 max-w-4xl"
      >
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:text-foreground"
          >
            <Paperclip className="h-5 w-5" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:text-foreground"
          >
            <ImageIcon className="h-5 w-5" />
          </Button>
        </div>
        
        <div className="flex-1 relative">
          <Input
            ref={inputRef}
            type="text"
            placeholder="Écrivez votre message..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onKeyDown={handleKeyPress}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            disabled={isLoading}
            className={`pr-12 transition-shadow duration-200 ${
              isFocused ? 'shadow-md' : ''
            }`}
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <Smile className="h-5 w-5" />
          </Button>
        </div>

        <Button 
          type="submit" 
          size="icon"
          disabled={isLoading || !content.trim()}
          className="transition-all duration-200 ease-in-out"
        >
          <SendHorizontal className={`h-5 w-5 ${isLoading ? 'animate-pulse' : ''}`} />
        </Button>
      </form>
    </motion.div>
  );
}
