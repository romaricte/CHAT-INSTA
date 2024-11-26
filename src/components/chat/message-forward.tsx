"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Forward } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface Conversation {
  id: string;
  users: {
    id: string;
    name: string;
    image?: string;
  }[];
}

interface MessageForwardProps {
  messageId: string;
  currentChatId: string;
  conversations: Conversation[];
}

export function MessageForward({
  messageId,
  currentChatId,
  conversations,
}: MessageForwardProps) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const handleForward = async (targetChatId: string) => {
    try {
      const response = await fetch(`/api/messages/${messageId}/forward`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ targetChatId }),
      });

      if (!response.ok) throw new Error("Failed to forward message");

      toast.success("Message forwarded");
      setOpen(false);
      router.refresh();
    } catch (error) {
      toast.error("Failed to forward message");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="text-gray-500 hover:text-gray-900">
          <Forward className="h-4 w-4 mr-2" />
          Forward
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Forward Message</DialogTitle>
        </DialogHeader>
        <div className="space-y-2 mt-4">
          {conversations
            .filter((conv) => conv.id !== currentChatId)
            .map((conversation) => (
              <Button
                key={conversation.id}
                variant="ghost"
                className="w-full justify-start"
                onClick={() => handleForward(conversation.id)}
              >
                <div className="flex items-center">
                  <span className="ml-2">
                    {conversation.users
                      .map((user) => user.name)
                      .join(", ")}
                  </span>
                </div>
              </Button>
            ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
