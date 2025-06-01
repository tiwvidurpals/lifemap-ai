import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PlusCircle, Edit, Trash2, Check, X } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface Goal {
  id: string;
  title: string;
  description: string;
  actions: string[];
  completed: boolean;
}

interface DailyCommitment {
  content: string;
  lastSigned: string | null;
}

const MonthPlan = () => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [dailyCommitment, setDailyCommitment] = useState<DailyCommitment>({
    content: "",
    lastSigned: null
  });
  const [editingGoalId, setEditingGoalId] = useState<string | null>(null);
  const [editingDOR, setEditingDOR] = useState(false);
  const [newGoal, setNewGoal] = useState<Omit<Goal, "id" | "completed">>({
    title: "",
    description: "",
    actions: [""]
  });
  const [newAction, setNewAction] = useState("");
  const { toast } = useToast();

  // Load data from localStorage
  useEffect(() => {
    const storedGoals = localStorage.getItem("monthGoals");
    if (storedGoals) {
      setGoals(JSON.parse(storedGoals));
    }

    const storedDOR = localStorage.getItem("monthDOR");
    if (storedDOR) {
      setDailyCommitment(JSON.parse(storedDOR));
    }
  }, []);

  // Save data to localStorage
  useEffect(() => {
    localStorage.setItem("monthGoals", JSON.stringify(goals));
  }, [goals]);

  useEffect(() => {
    localStorage.setItem("monthDOR", JSON.stringify(dailyCommitment));
  }, [dailyCommitment]);

  const addGoal = () => {
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
    
    const goal: Goal = {
      id: `goal-${Date.now()}`,
      ...newGoal,
      actions: filteredActions,
      completed: false
    };

    setGoals([...goals, goal]);
    setNewGoal({
      title: "",
      description: "",
      actions: [""]
    });
    
    toast({
      title: "Goal created",
      description: "Your new goal has been added to your 1-month plan"
    });
  };

  const startEditingGoal = (goal: Goal) => {
    setEditingGoalId(goal.id);
    setNewGoal({
      title: goal.title,
      description: goal.description,
      actions: [...goal.actions]
    });
  };

  const updateGoal = () => {
    if (!editingGoalId) return;
    
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
    
    setEditingGoalId(null);
    setNewGoal({
      title: "",
      description: "",
      actions: [""]
    });
    
    toast({
      title: "Goal updated",
      description: "Your goal has been updated successfully"
    });
  };

  const deleteGoal = (id: string) => {
    setGoals(goals.filter(goal => goal.id !== id));
    
    toast({
      title: "Goal deleted",
      description: "Your goal has been deleted from your 1-month plan"
    });
  };

  const toggleGoalCompletion = (id: string) => {
    setGoals(goals.map(goal => 
      goal.id === id ? { ...goal, completed: !goal.completed } : goal
    ));
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

  const saveDOR = () => {
    setDailyCommitment({
      ...dailyCommitment,
      content: newAction
    });
    
    setEditingDOR(false);
    setNewAction("");
    
    toast({
      title: "Daily commitment updated",
      description: "Your daily commitment has been updated successfully"
    });
  };

  const signDOR = () => {
    setDailyCommitment({
      ...dailyCommitment,
      lastSigned: new Date().toISOString().split('T')[0]
    });
    
    toast({
      title: "Daily commitment signed",
      description: "You've committed to your daily actions today"
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b">
        <h1 className="text-2xl font-bold">1 Month Plan</h1>
        <p className="text-muted-foreground mt-1">Define your goals and daily commitments for the next month</p>
      </div>

      <div className="flex flex-col lg:flex-row h-full overflow-hidden">
        {/* Goals Section */}
        <div className="flex-1 p-4 overflow-auto">
          <div className="mb-4 flex justify-between items-center">
            <h2 className="text-xl font-semibold">Goals</h2>
          </div>

          <div className="space-y-4">
            {goals.map(goal => (
              <Card key={goal.id} className={goal.completed ? "opacity-70" : ""}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div className="flex items-start gap-2">
                      <input
                        type="checkbox"
                        checked={goal.completed}
                        onChange={() => toggleGoalCompletion(goal.id)}
                        className="mt-1"
                      />
                      <div>
                        <CardTitle className={goal.completed ? "line-through" : ""}>
                          {goal.title}
                        </CardTitle>
                        {goal.description && (
                          <p className="text-sm text-muted-foreground mt-1">{goal.description}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => startEditingGoal(goal)}
                        className="h-8 w-8"
                      >
                        <Edit size={16} />
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
                </CardHeader>
                <CardContent>
                  {goal.actions.length > 0 && (
                    <div className="mb-2">
                      <h4 className="text-sm font-medium mb-1">Action Steps:</h4>
                      <ul className="list-disc pl-5 space-y-1">
                        {goal.actions.map((action, idx) => (
                          <li key={idx} className="text-sm">{action}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Add/Edit Goal Form */}
          <div className="mt-8">
            <h3 className="text-lg font-semibold mb-2">{editingGoalId ? "Edit Goal" : "Add New Goal"}</h3>
            <div className="space-y-2">
              <Label htmlFor="goal-title">Title</Label>
              <Input
                id="goal-title"
                value={newGoal.title}
                onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
                placeholder="Goal title"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="goal-desc">Description</Label>
              <Textarea
                id="goal-desc"
                value={newGoal.description}
                onChange={(e) => setNewGoal({ ...newGoal, description: e.target.value })}
                placeholder="Describe your goal..."
              />
            </div>
            <div className="space-y-2">
              <Label>Action Steps</Label>
              {newGoal.actions.map((action, idx) => (
                <div key={idx} className="flex gap-2 mb-2">
                  <Input
                    value={action}
                    onChange={(e) => updateAction(idx, e.target.value)}
                    placeholder={`Step ${idx + 1}`}
                  />
                  {newGoal.actions.length > 1 && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeAction(idx)}
                      className="h-8 w-8"
                    >
                      <X size={16} />
                    </Button>
                  )}
                </div>
              ))}
              <Button variant="outline" size="sm" onClick={addActionField} className="mt-2">
                <PlusCircle size={16} className="mr-1" />
                Add Step
              </Button>
            </div>
            <div className="flex gap-2 mt-4">
              {editingGoalId ? (
                <>
                  <Button onClick={updateGoal} className="flex items-center gap-1">
                    <Check size={16} />
                    Update Goal
                  </Button>
                  <Button variant="ghost" onClick={() => {
                    setEditingGoalId(null);
                    setNewGoal({ title: "", description: "", actions: [""] });
                  }}>
                    <X size={16} />
                    Cancel
                  </Button>
                </>
              ) : (
                <Button onClick={addGoal} className="flex items-center gap-1">
                  <PlusCircle size={16} />
                  Add Goal
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Daily Commitment Section */}
        <div className="w-full lg:w-1/3 p-4 border-t lg:border-t-0 lg:border-l flex flex-col">
          <h2 className="text-xl font-semibold mb-2">Daily Commitment</h2>
          {editingDOR ? (
            <div className="space-y-2">
              <Textarea
                value={newAction}
                onChange={(e) => setNewAction(e.target.value)}
                placeholder="What will you commit to doing every day this month?"
                className="min-h-[80px]"
              />
              <div className="flex gap-2">
                <Button onClick={saveDOR} className="flex items-center gap-1">
                  <Check size={16} />
                  Save
                </Button>
                <Button variant="ghost" onClick={() => { setEditingDOR(false); setNewAction(""); }}>
                  <X size={16} />
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div className="mb-4">
              <p className="text-muted-foreground mb-2">{dailyCommitment.content || "No daily commitment set yet."}</p>
              <Button variant="outline" size="sm" onClick={() => { setEditingDOR(true); setNewAction(dailyCommitment.content); }}>
                Edit Commitment
              </Button>
            </div>
          )}
          <div className="mt-4">
            <Button onClick={signDOR} disabled={dailyCommitment.lastSigned === new Date().toISOString().split('T')[0]} className="w-full">
              {dailyCommitment.lastSigned === new Date().toISOString().split('T')[0] ? "Signed for Today" : "Sign Today's Commitment"}
            </Button>
            {dailyCommitment.lastSigned && (
              <p className="text-xs text-muted-foreground mt-2">Last signed: {formatDate(dailyCommitment.lastSigned)}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MonthPlan; 