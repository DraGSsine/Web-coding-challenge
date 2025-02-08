"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreVertical, Pencil, Trash2, Clock } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { EditTask } from "./edit-task";

interface TaskListProps {
  filter: "all" | "pending" | "completed";
}

interface Task {
  _id: string;
  title: string;
  status: "Pending" | "Completed";
  createdAt: string;
}

export function TaskList({ filter }: TaskListProps) {
  const queryClient = useQueryClient();
  const [editingTask, setEditingTask] = useState<{
    _id: string;
    title: string;
    status: string;
  } | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const { data: tasks, isLoading } = useQuery({
    queryKey: ["tasks"],
    queryFn: async () => {
      const response = await axios.get("http://localhost:9090/api/tasks");
      return response.data;
    },
  });

  const updateTask = useMutation({
    mutationFn: async ({
      id,
      status,
    }: {
      id: string;
      status: "Pending" | "Completed";
    }) => {
      return axios.put(`http://localhost:9090/api/tasks/${id}`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });

  const deleteTask = useMutation({
    mutationFn: async (id: string) => {
      return axios.delete(`http://localhost:9090/api/tasks/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });

  const handleEditClick = (task: Task) => {
    setEditingTask(task);
    setIsEditDialogOpen(true);
  };

  const filteredTasks = tasks?.filter((task: Task) => {
    if (filter === "all") return true;
    if (filter === "pending") return task.status === "Pending";
    if (filter === "completed") return task.status === "Completed";
    return true;
  });

  const handleStatusChange = async (taskId: string, currentStatus: string) => {
    const newStatus = currentStatus === "Pending" ? "Completed" : "Pending";
    updateTask.mutate({ id: taskId, status: newStatus });
  };

  if (isLoading) {
    return (
      <Card className="border-none shadow-md">
        <CardContent className="p-6">
          <div className="space-y-4">
            {[1, 2, 3].map((n) => (
              <div key={n} className="flex items-center space-x-4">
                <Skeleton className="h-4 w-4 rounded" />
                <Skeleton className="h-4 w-full" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className="border-none shadow-md">
        <CardHeader className="pb-3">
          <CardTitle className="text-xl font-semibold">
            {filter === "all"
              ? "All Tasks"
              : filter === "pending"
              ? "Pending Tasks"
              : "Completed Tasks"}
            <Badge variant="secondary" className="ml-2">
              {filteredTasks?.length || 0}
            </Badge>
          </CardTitle>
        </CardHeader>
        <ScrollArea className="h-[60vh]">
          <CardContent className="p-6">
            {!filteredTasks?.length ? (
              <div className="flex h-32 flex-col items-center justify-center gap-2 rounded-lg border border-dashed p-8 text-center">
                <div className="text-muted-foreground">No tasks found</div>
                <Button variant="outline" size="sm">
                  Add your first task
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredTasks.map((task: Task) => (
                  <div
                    key={task._id}
                    className="group flex items-center justify-between rounded-lg border bg-card p-4 transition-all hover:shadow-md"
                  >
                    <div className="flex items-center space-x-4">
                      <Checkbox
                        checked={task.status === "Completed"}
                        onCheckedChange={() =>
                          handleStatusChange(task._id, task.status)
                        }
                        className="h-5 w-5"
                      />
                      <div className="flex flex-col">
                        <span
                          className={
                            task.status === "Completed"
                              ? "text-muted-foreground line-through"
                              : "font-medium"
                          }
                        >
                          {task.title}
                        </span>
                        <span className="flex items-center text-xs text-muted-foreground">
                          <Clock className="mr-1 h-3 w-3" />
                          {format(new Date(task.createdAt), "MMM d, yyyy")}
                        </span>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="opacity-0 group-hover:opacity-100"
                        >
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-32">
                        <DropdownMenuItem
                          onClick={() => handleEditClick(task)}
                          className="cursor-pointer"
                        >
                          <Pencil className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="cursor-pointer text-destructive focus:text-destructive"
                          onClick={() => deleteTask.mutate(task._id)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </ScrollArea>
      </Card>
      <EditTask
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        task={editingTask}
      />
    </>
  );
}
