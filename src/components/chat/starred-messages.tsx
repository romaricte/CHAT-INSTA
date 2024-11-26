"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Star, Trash } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface StarredMessage {
  id: string;
  content: string;
  createdAt: Date;
  sender: {
    id: string;
    name: string;
    image?: string;
  };
}

interface StarredMessagesProps {
  chatId: string;
  initialMessages: StarredMessage[];
}

export function StarredMessages({
  chatId,
  initialMessages,
}: StarredMessagesProps) {
  const [messages, setMessages] = useState(initialMessages);
  const [open, setOpen] = useState(false);

  const handleUnstar = async (messageId: string) => {
    try {
      const response = await fetch(`/api/messages/${messageId}/star`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to unstar message");

      setMessages((prev) => prev.filter((msg) => msg.id !== messageId));
      toast.success("Message removed from favorites");
    } catch (error) {
      toast.error("Failed to remove message from favorites");
    }
  };

  const handleJumpToMessage = async (messageId: string) => {
    // Implement scroll to message logic
    const element = document.getElementById(`message-${messageId}`);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "center" });
      element.classList.add("highlight");
      setTimeout(() => element.classList.remove("highlight"), 2000);
    }
    setOpen(false);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2">
          <Star className="h-4 w-4" />
          Starred Messages
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Starred Messages</SheetTitle>
        </SheetHeader>
        <div className="mt-4 space-y-4">
          {messages.length === 0 ? (
            <p className="text-center text-gray-500">No starred messages</p>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50"
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage src={message.sender.image} />
                  <AvatarFallback>
                    {message.sender.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">
                      {message.sender.name}
                    </span>
                    <span className="text-xs text-gray-500">
                      {format(new Date(message.createdAt), "MMM d, h:mm a")}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700">{message.content}</p>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleJumpToMessage(message.id)}
                    >
                      Jump to message
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleUnstar(message.id)}
                    >
                      <Trash className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
