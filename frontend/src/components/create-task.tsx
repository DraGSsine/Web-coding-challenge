"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Plus, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface CreateTaskProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateTask({ open, onOpenChange }: CreateTaskProps) {
  const [title, setTitle] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const createTaskMutation = useMutation({
    mutationFn: async (newTask: { title: string; status: string }) => {
      const response = await axios.post("http://localhost:9090/api/tasks", newTask);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      setTitle("");
      onOpenChange(false);
      toast({
        title: "✨ Task Created",
        description: "Your new task has been added to the list",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to create task",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      toast({
        title: "Hold on!",
        description: "Please enter a task title",
        variant: "destructive",
      });
      return;
    }

    createTaskMutation.mutate({
      title: title.trim(),
      status: "Pending"
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit} className="space-y-6">
          <DialogHeader>
            <DialogTitle className="text-2xl">Create New Task</DialogTitle>
            <DialogDescription className="text-base">
              Add a new task to your list. Make it clear and actionable.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-sm font-medium">
                Task Title
              </Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Complete project presentation"
                className={cn(
                  "h-12 text-base",
                  createTaskMutation.isPending && "opacity-50"
                )}
                disabled={createTaskMutation.isPending}
                autoFocus
              />
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="w-full sm:w-auto"
              disabled={createTaskMutation.isPending}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="w-full sm:w-auto"
              disabled={createTaskMutation.isPending}
            >
              {createTaskMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Task
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}