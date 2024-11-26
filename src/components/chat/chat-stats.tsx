"use client";

import { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { BarChart2, Clock, MessageSquare, User } from "lucide-react";
import { format } from "date-fns";

interface ChatStats {
  messageCount: number;
  participantCount: number;
  averageResponseTime: number;
  messagesByHour: {
    hour: number;
    count: number;
  }[];
  messagesByUser: {
    userId: string;
    userName: string;
    count: number;
  }[];
  activeHours: {
    hour: number;
    activity: number;
  }[];
}

interface ChatStatsProps {
  chatId: string;
}

export function ChatStats({ chatId }: ChatStatsProps) {
  const [stats, setStats] = useState<ChatStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch(`/api/chats/${chatId}/stats`);
        if (!response.ok) throw new Error("Failed to fetch stats");
        const data = await response.json();
        setStats(data);
      } catch (error) {
        console.error("Error fetching chat stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [chatId]);

  if (loading || !stats) {
    return <div>Loading stats...</div>;
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2">
          <BarChart2 className="h-4 w-4" />
          Chat Stats
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[400px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle>Chat Statistics</SheetTitle>
        </SheetHeader>
        <div className="mt-6 space-y-6">
          {/* Overview */}
          <div className="grid grid-cols-3 gap-4">
            <div className="p-4 rounded-lg bg-gray-50">
              <div className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-blue-500" />
                <span className="text-sm font-medium">Messages</span>
              </div>
              <p className="mt-2 text-2xl font-bold">{stats.messageCount}</p>
            </div>
            <div className="p-4 rounded-lg bg-gray-50">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-green-500" />
                <span className="text-sm font-medium">Participants</span>
              </div>
              <p className="mt-2 text-2xl font-bold">{stats.participantCount}</p>
            </div>
            <div className="p-4 rounded-lg bg-gray-50">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-purple-500" />
                <span className="text-sm font-medium">Avg Response</span>
              </div>
              <p className="mt-2 text-2xl font-bold">
                {Math.round(stats.averageResponseTime / 60)}m
              </p>
            </div>
          </div>

          {/* Activity by Hour */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Activity by Hour</h3>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.messagesByHour}>
                  <XAxis
                    dataKey="hour"
                    tickFormatter={(hour) => `${hour}:00`}
                  />
                  <YAxis />
                  <Tooltip
                    labelFormatter={(hour) => `${hour}:00`}
                    formatter={(value) => [value, "messages"]}
                  />
                  <Bar dataKey="count" fill="#4f46e5" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Messages by User */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Messages by User</h3>
            <div className="space-y-2">
              {stats.messagesByUser.map((user) => (
                <div
                  key={user.userId}
                  className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50"
                >
                  <span className="text-sm">{user.userName}</span>
                  <span className="text-sm font-medium">{user.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
