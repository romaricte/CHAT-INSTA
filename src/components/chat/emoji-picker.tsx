"use client";

import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import { useTheme } from "next-themes";

interface EmojiPickerProps {
  onSelect: (emoji: string) => void;
}

export function EmojiPicker({ onSelect }: EmojiPickerProps) {
  const { theme } = useTheme();

  return (
    <Picker
      data={data}
      onEmojiSelect={(emoji: any) => onSelect(emoji.native)}
      theme={theme as "light" | "dark"}
      previewPosition="none"
      skinTonePosition="none"
    />
  );
}
