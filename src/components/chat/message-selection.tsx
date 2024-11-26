"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import {
  Trash,
  Forward,
  Star,
  Download,
  Copy,
  MoreHorizontal,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Message {
  id: string;
  content: string;
  senderId: string;
}

interface MessageSelectionProps {
  messages: Message[];
  currentUserId: string;
  onForwardMessages: (messageIds: string[]) => void;
}

export function MessageSelection({
  messages,
  currentUserId,
  onForwardMessages,
}: MessageSelectionProps) {
  const [selectedMessages, setSelectedMessages] = useState<Set<string>>(new Set());
  const [isSelectionMode, setIsSelectionMode] = useState(false);

  const toggleMessageSelection = (messageId: string) => {
    setSelectedMessages((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(messageId)) {
        newSet.delete(messageId);
      } else {
        newSet.add(messageId);
      }
      return newSet;
    });
  };

  const handleDeleteSelected = async () => {
    try {
      const response = await fetch("/api/messages/bulk-delete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messageIds: Array.from(selectedMessages),
        }),
      });

      if (!response.ok) throw new Error("Failed to delete messages");

      toast.success("Messages deleted");
      setSelectedMessages(new Set());
      setIsSelectionMode(false);
    } catch (error) {
      toast.error("Failed to delete messages");
    }
  };

  const handleStarSelected = async () => {
    try {
      const response = await fetch("/api/messages/bulk-star", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messageIds: Array.from(selectedMessages),
        }),
      });

      if (!response.ok) throw new Error("Failed to star messages");

      toast.success("Messages starred");
      setSelectedMessages(new Set());
      setIsSelectionMode(false);
    } catch (error) {
      toast.error("Failed to star messages");
    }
  };

  const handleCopySelected = () => {
    const selectedContent = messages
      .filter((msg) => selectedMessages.has(msg.id))
      .map((msg) => msg.content)
      .join("\n");

    navigator.clipboard.writeText(selectedContent);
    toast.success("Messages copied to clipboard");
    setSelectedMessages(new Set());
    setIsSelectionMode(false);
  };

  const handleDownloadSelected = () => {
    const selectedContent = messages
      .filter((msg) => selectedMessages.has(msg.id))
      .map((msg) => msg.content)
      .join("\n");

    const blob = new Blob([selectedContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "selected-messages.txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast.success("Messages downloaded");
    setSelectedMessages(new Set());
    setIsSelectionMode(false);
  };

  if (!isSelectionMode) {
    return (
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsSelectionMode(true)}
        className="mb-2"
      >
        Select Messages
      </Button>
    );
  }

  return (
    <div className="sticky top-0 z-10 bg-white p-2 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setIsSelectionMode(false);
              setSelectedMessages(new Set());
            }}
          >
            Cancel
          </Button>
          <span className="text-sm text-gray-500">
            {selectedMessages.size} selected
          </span>
        </div>
        <div className="flex items-center gap-2">
          {selectedMessages.size > 0 && (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onForwardMessages(Array.from(selectedMessages))}
              >
                <Forward className="h-4 w-4 mr-2" />
                Forward
              </Button>
              <Button variant="ghost" size="sm" onClick={handleStarSelected}>
                <Star className="h-4 w-4 mr-2" />
                Star
              </Button>
              <Button variant="ghost" size="sm" onClick={handleCopySelected}>
                <Copy className="h-4 w-4 mr-2" />
                Copy
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={handleDownloadSelected}>
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={handleDeleteSelected}
                    className="text-red-600"
                  >
                    <Trash className="h-4 w-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export function SelectableMessage({
  message,
  isSelectionMode,
  isSelected,
  onSelect,
  children,
}: {
  message: Message;
  isSelectionMode: boolean;
  isSelected: boolean;
  onSelect: () => void;
  children: React.ReactNode;
}) {
  if (!isSelectionMode) return <>{children}</>;

  return (
    <div className="flex items-start gap-2">
      <Checkbox checked={isSelected} onCheckedChange={onSelect} />
      <div className={isSelected ? "opacity-70" : ""}>{children}</div>
    </div>
  );
}
