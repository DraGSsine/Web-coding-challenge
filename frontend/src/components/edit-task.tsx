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
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Loader2, Save } from "lucide-react";
import { cn } from "@/lib/utils";

interface EditTaskProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task: {
    _id: string;
    title: string;
    status: string;
  } | null;
}

export function EditTask({ open, onOpenChange, task }: EditTaskProps) {
  const [title, setTitle] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (task) {
      setTitle(task.title);
    }
  }, [task]);

  const editTaskMutation = useMutation({
    mutationFn: async ({ id, title }: { id: string; title: string }) => {
      const response = await axios.put(`http://localhost:9090/api/tasks/${id}`, {
        title,
        status: task?.status,
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      onOpenChange(false);
      toast({
        title: "✨ Task Updated",
        description: "Your task has been updated successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to update task",
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

    if (task?._id) {
      editTaskMutation.mutate({
        id: task._id,
        title: title.trim(),
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit} className="space-y-6">
          <DialogHeader>
            <DialogTitle className="text-2xl">Edit Task</DialogTitle>
            <DialogDescription className="text-base">
              Make changes to your task here.
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
                placeholder="Enter task title"
                className={cn(
                  "h-12 text-base",
                  editTaskMutation.isPending && "opacity-50"
                )}
                disabled={editTaskMutation.isPending}
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
              disabled={editTaskMutation.isPending}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="w-full sm:w-auto"
              disabled={editTaskMutation.isPending}
            >
              {editTaskMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}