"use client";

import { User } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface NewChatFormProps {
  users: User[];
  currentUserId: string;
}

export default function NewChatForm({ users, currentUserId }: NewChatFormProps) {
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const filteredUsers = users.filter((user) =>
    user.name?.toLowerCase().includes(search.toLowerCase())
  );

  const onSelect = async (userId: string) => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/conversations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
        }),
      });

      if (response.ok) {
        const conversation = await response.json();
        router.push(`/chat/${conversation.id}`);
      }
    } catch (error) {
      console.error("Error creating conversation:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search users..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>
      <div className="space-y-2">
        {filteredUsers.map((user) => (
          <Button
            key={user.id}
            variant="ghost"
            className="w-full justify-start"
            disabled={isLoading}
            onClick={() => onSelect(user.id)}
          >
            <span className="truncate">{user.name}</span>
          </Button>
        ))}
      </div>
    </div>
  );
}
