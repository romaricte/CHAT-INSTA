"use client";

import { useState } from "react";
import { MoreHorizontal, Trash, Edit, Pin, Reply, EmojiSmile } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface MessageActionsProps {
  messageId: string;
  chatId: string;
  content: string;
  isOwner: boolean;
  onEdit: (content: string) => void;
}

export default function MessageActions({
  messageId,
  chatId,
  content,
  isOwner,
  onEdit,
}: MessageActionsProps) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(content);

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/messages/${messageId}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete message");

      toast.success("Message deleted");
      router.refresh();
    } catch (error) {
      toast.error("Failed to delete message");
    }
  };

  const handleEdit = async () => {
    try {
      const response = await fetch(`/api/messages/${messageId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: editedContent }),
      });

      if (!response.ok) throw new Error("Failed to edit message");

      setIsEditing(false);
      onEdit(editedContent);
      toast.success("Message updated");
    } catch (error) {
      toast.error("Failed to edit message");
    }
  };

  const handlePin = async () => {
    try {
      const response = await fetch(`/api/messages/${messageId}/pin`, {
        method: "POST",
      });

      if (!response.ok) throw new Error("Failed to pin message");

      toast.success("Message pinned");
      router.refresh();
    } catch (error) {
      toast.error("Failed to pin message");
    }
  };

  if (isEditing) {
    return (
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={editedContent}
          onChange={(e) => setEditedContent(e.target.value)}
          className="flex-1 p-2 border rounded"
        />
        <Button onClick={handleEdit} size="sm">
          Save
        </Button>
        <Button onClick={() => setIsEditing(false)} variant="ghost" size="sm">
          Cancel
        </Button>
      </div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {isOwner && (
          <>
            <DropdownMenuItem onClick={() => setIsEditing(true)}>
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleDelete}>
              <Trash className="h-4 w-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </>
        )}
        <DropdownMenuItem onClick={handlePin}>
          <Pin className="h-4 w-4 mr-2" />
          Pin
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Reply className="h-4 w-4 mr-2" />
          Reply
        </DropdownMenuItem>
        <DropdownMenuItem>
          <EmojiSmile className="h-4 w-4 mr-2" />
          React
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
