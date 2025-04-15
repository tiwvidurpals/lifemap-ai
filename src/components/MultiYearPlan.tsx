
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Check, Edit2, PlusCircle, Trash2, X } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface LongTermGoal {
  id: string;
  title: string;
  description: string;
  timeframe: "2years" | "5years";
  actions: string[];
}

const MultiYearPlan = () => {
  const [goals, setGoals] = useState<LongTermGoal[]>([]);
  const [activeTimeframe, setActiveTimeframe] = useState<"2years" | "5years">("2years");
  const [isEditing, setIsEditing] = useState(false);
  const [editingGoalId, setEditingGoalId] = useState<string | null>(null);
  const [newGoal, setNewGoal] = useState<Omit<LongTermGoal, "id">>({
    title: "",
    description: "",
    timeframe: "2years",
    actions: [""]
  });
  const { toast } = useToast();

  // Load goals from localStorage
  useEffect(() => {
    const storedGoals = localStorage.getItem("multiYearGoals");
    if (storedGoals) {
      setGoals(JSON.parse(storedGoals));
    }
  }, []);

  // Save goals to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("multiYearGoals", JSON.stringify(goals));
  }, [goals]);

  const filteredGoals = goals.filter(goal => goal.timeframe === activeTimeframe);

  const startEditing = (goal?: LongTermGoal) => {
    if (goal) {
      setEditingGoalId(goal.id);
      setNewGoal({
        title: goal.title,
        description: goal.description,
        timeframe: goal.timeframe,
        actions: [...goal.actions]
      });
    } else {
      setEditingGoalId(null);
      setNewGoal({
        title: "",
        description: "",
        timeframe: activeTimeframe,
        actions: [""]
      });
    }
    setIsEditing(true);
  };

  const cancelEditing = () => {
    setIsEditing(false);
    setEditingGoalId(null);
    setNewGoal({
      title: "",
      description: "",
      timeframe: activeTimeframe,
      actions: [""]
    });
  };

  const saveGoal = () => {
    if (!newGoal.title.trim()) {
      toast({
        title: "Title required",
        description: "Please provide a title for your goal",
        variant: "destructive"
      });
      return;
    }

    // Filter out empty actions
    const filteredActions = newGoal.actions.filter(action => action.trim() !== "");
    
    if (editingGoalId) {
      // Update existing goal
      setGoals(goals.map(goal => 
        goal.id === editingGoalId 
          ? { 
              ...goal, 
              title: newGoal.title,
              description: newGoal.description,
              actions: filteredActions
            } 
          : goal
      ));
      
      toast({
        title: "Goal updated",
        description: "Your goal has been updated successfully"
      });
    } else {
      // Add new goal
      const goal: LongTermGoal = {
        id: `longterm-${Date.now()}`,
        title: newGoal.title,
        description: newGoal.description,
        timeframe: newGoal.timeframe,
        actions: filteredActions
      };
      
      setGoals([...goals, goal]);
      
      toast({
        title: "Goal created",
        description: "Your new goal has been added to your multi-year plan"
      });
    }
    
    // Reset form
    setIsEditing(false);
    setEditingGoalId(null);
    setNewGoal({
      title: "",
      description: "",
      timeframe: activeTimeframe,
      actions: [""]
    });
  };

  const deleteGoal = (id: string) => {
    setGoals(goals.filter(goal => goal.id !== id));
    
    toast({
      title: "Goal deleted",
      description: "Your goal has been deleted successfully"
    });
  };

  const addActionField = () => {
    setNewGoal({
      ...newGoal,
      actions: [...newGoal.actions, ""]
    });
  };

  const updateAction = (index: number, value: string) => {
    const updatedActions = [...newGoal.actions];
    updatedActions[index] = value;
    setNewGoal({
      ...newGoal,
      actions: updatedActions
    });
  };

  const removeAction = (index: number) => {
    const updatedActions = [...newGoal.actions];
    updatedActions.splice(index, 1);
    setNewGoal({
      ...newGoal,
      actions: updatedActions
    });
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b">
        <h1 className="text-2xl font-bold">Multi-Year Plan</h1>
        <p className="text-muted-foreground mt-1">Define your longer-term goals for the next 2-5 years</p>
      </div>

      <div className="p-4 border-b">
        <div className="flex gap-2">
          <Button
            variant={activeTimeframe === "2years" ? "default" : "outline"}
            onClick={() => setActiveTimeframe("2years")}
          >
            2 Year Plan
          </Button>
          <Button
            variant={activeTimeframe === "5years" ? "default" : "outline"}
            onClick={() => setActiveTimeframe("5years")}
          >
            5 Year Plan
          </Button>
        </div>
      </div>

      <div className="flex-1 p-4 overflow-auto">
        <div className="mb-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold">
            {activeTimeframe === "2years" ? "2 Year Goals" : "5 Year Goals"}
          </h2>
          {!isEditing && (
            <Button onClick={() => startEditing()} className="flex items-center gap-1">
              <PlusCircle size={16} />
              Add Goal
            </Button>
          )}
        </div>

        {isEditing ? (
          <Card className="mb-4">
            <CardHeader className="pb-2">
              <CardTitle>{editingGoalId ? "Edit Goal" : "New Goal"}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="goal-title">Goal Title</Label>
                <Input
                  id="goal-title"
                  placeholder="What do you want to achieve in this timeframe?"
                  value={newGoal.title}
                  onChange={(e) => setNewGoal({...newGoal, title: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="goal-desc">Description</Label>
                <Textarea
                  id="goal-desc"
                  placeholder="Add some details about your goal..."
                  value={newGoal.description}
                  onChange={(e) => setNewGoal({...newGoal, description: e.target.value})}
                  className="resize-none h-20"
                />
              </div>

              <div className="space-y-2">
                <Label>Timeframe</Label>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant={newGoal.timeframe === "2years" ? "default" : "outline"}
                    onClick={() => setNewGoal({...newGoal, timeframe: "2years"})}
                    className="flex-1"
                  >
                    2 Years
                  </Button>
                  <Button
                    type="button"
                    variant={newGoal.timeframe === "5years" ? "default" : "outline"}
                    onClick={() => setNewGoal({...newGoal, timeframe: "5years"})}
                    className="flex-1"
                  >
                    5 Years
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Actions</Label>
                {newGoal.actions.map((action, index) => (
                  <div key={index} className="flex gap-2 items-center">
                    <Input
                      placeholder={`Action step ${index + 1}`}
                      value={action}
                      onChange={(e) => updateAction(index, e.target.value)}
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeAction(index)}
                      disabled={newGoal.actions.length <= 1}
                      className="h-10 w-10 flex-shrink-0"
                    >
                      <X size={16} />
                    </Button>
                  </div>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={addActionField}
                  className="flex items-center gap-1"
                >
                  <PlusCircle size={16} />
                  Add Another Action
                </Button>
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="ghost" onClick={cancelEditing}>
                  Cancel
                </Button>
                <Button onClick={saveGoal} className="flex items-center gap-1">
                  <Check size={16} />
                  {editingGoalId ? "Update Goal" : "Save Goal"}
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : null}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredGoals.length > 0 ? (
            filteredGoals.map(goal => (
              <Card key={goal.id}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle>{goal.title}</CardTitle>
                    <div className="flex gap-1">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => startEditing(goal)}
                        className="h-8 w-8"
                      >
                        <Edit2 size={16} />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => deleteGoal(goal.id)}
                        className="h-8 w-8 text-destructive"
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </div>
                  {goal.description && (
                    <p className="text-sm text-muted-foreground">{goal.description}</p>
                  )}
                </CardHeader>
                <CardContent>
                  {goal.actions.length > 0 ? (
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium">Actions:</h3>
                      <ul className="list-disc pl-5 space-y-1">
                        {goal.actions.map((action, index) => (
                          <li key={index} className="text-sm">{action}</li>
                        ))}
                      </ul>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground italic">No actions defined</p>
                  )}
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="col-span-full flex flex-col items-center justify-center p-8 text-center">
              <p className="text-muted-foreground">
                {`You don't have any ${activeTimeframe === "2years" ? "2-year" : "5-year"} goals yet. Add your first goal to get started!`}
              </p>
              <Button onClick={() => startEditing()} variant="outline" className="mt-4">
                Add Your First Goal
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MultiYearPlan;
