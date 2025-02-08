"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ListTodo, CheckCircle2, Clock } from "lucide-react";
import { useState } from "react";
import { CreateTask } from "@/components/create-task";
import { TaskList } from "@/components/task-list";

export default function Home() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-muted p-4 md:p-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ListTodo className="h-8 w-8" />
            <h1 className="text-3xl font-bold">TaskMaster</h1>
          </div>
          <Button onClick={() => setIsCreateModalOpen(true)}>Add New Task</Button>
        </div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="all">All Tasks</TabsTrigger>
            <TabsTrigger value="pending">
              <Clock className="mr-2 h-4 w-4" />
              Pending
            </TabsTrigger>
            <TabsTrigger value="completed">
              <CheckCircle2 className="mr-2 h-4 w-4" />
              Completed
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            <TaskList filter="all" />
          </TabsContent>
          
          <TabsContent value="pending">
            <TaskList filter="pending" />
          </TabsContent>
          
          <TabsContent value="completed">
            <TaskList filter="completed" />
          </TabsContent>
        </Tabs>
      </div>

      <CreateTask open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen} />
    </main>
  );
}