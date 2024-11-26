"use client";

import { useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { SendHorizontal } from "lucide-react";

interface ChatInputProps {
  onSend: (content: string) => Promise<void>;
  isLoading: boolean;
}

export default function ChatInput({ onSend, isLoading }: ChatInputProps) {
  const [content, setContent] = useState("");

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

  return (
    <form
      onSubmit={handleSubmit}
      className="p-4 border-t flex items-center gap-2"
    >
      <Input
        type="text"
        placeholder="Type a message..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        disabled={isLoading}
        className="flex-1"
      />
      <Button type="submit" size="icon" disabled={isLoading || !content.trim()}>
        <SendHorizontal className="h-5 w-5" />
      </Button>
    </form>
  );
}
