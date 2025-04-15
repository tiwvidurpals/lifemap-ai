
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

const YearPlan = () => {
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
    const storedGoals = localStorage.getItem("yearGoals");
    if (storedGoals) {
      setGoals(JSON.parse(storedGoals));
    }

    const storedDOR = localStorage.getItem("yearDOR");
    if (storedDOR) {
      setDailyCommitment(JSON.parse(storedDOR));
    }
  }, []);

  // Save data to localStorage
  useEffect(() => {
    localStorage.setItem("yearGoals", JSON.stringify(goals));
  }, [goals]);

  useEffect(() => {
    localStorage.setItem("yearDOR", JSON.stringify(dailyCommitment));
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
      description: "Your new goal has been added to your 1-year plan"
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
      description: "Your goal has been deleted from your 1-year plan"
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
        <h1 className="text-2xl font-bold">1 Year Plan</h1>
        <p className="text-muted-foreground mt-1">Define your goals and daily commitments for the next year</p>
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
                      {!goal.completed && (
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => startEditingGoal(goal)}
                          className="h-8 w-8"
                        >
                          <Edit size={16} />
                        </Button>
                      )}
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
                  {goal.actions.length > 0 ? (
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium">Actions:</h3>
                      <ul className="list-disc pl-5 space-y-1">
                        {goal.actions.map((action, index) => (
                          <li key={index} className={`text-sm ${goal.completed ? "line-through" : ""}`}>
                            {action}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground italic">No actions defined</p>
                  )}
                </CardContent>
              </Card>
            ))}

            {/* Add new goal form */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>{editingGoalId ? "Edit Goal" : "Add New Goal"}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="goal-title">Goal Title</Label>
                  <Input
                    id="goal-title"
                    placeholder="What do you want to achieve this year?"
                    value={newGoal.title}
                    onChange={(e) => setNewGoal({...newGoal, title: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="goal-desc">Description (Optional)</Label>
                  <Textarea
                    id="goal-desc"
                    placeholder="Add some details about your goal..."
                    value={newGoal.description}
                    onChange={(e) => setNewGoal({...newGoal, description: e.target.value})}
                    className="resize-none h-20"
                  />
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
                  {editingGoalId ? (
                    <>
                      <Button variant="ghost" onClick={() => {
                        setEditingGoalId(null);
                        setNewGoal({
                          title: "",
                          description: "",
                          actions: [""]
                        });
                      }}>
                        Cancel
                      </Button>
                      <Button onClick={updateGoal}>Update Goal</Button>
                    </>
                  ) : (
                    <Button onClick={addGoal}>Save Goal</Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Daily Commitment Section */}
        <div className="w-full lg:w-96 border-t lg:border-t-0 lg:border-l p-4 overflow-auto">
          <h2 className="text-xl font-semibold mb-4">Daily Commitment</h2>
          
          <Card>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle>Declaration of Resolve</CardTitle>
                {!editingDOR ? (
                  <Button variant="ghost" size="icon" onClick={() => {
                    setEditingDOR(true);
                    setNewAction(dailyCommitment.content);
                  }}>
                    <Edit size={16} />
                  </Button>
                ) : (
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" onClick={saveDOR}>
                      <Check size={16} />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => setEditingDOR(false)}>
                      <X size={16} />
                    </Button>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {editingDOR ? (
                <Textarea
                  placeholder="Write your daily commitment here..."
                  value={newAction}
                  onChange={(e) => setNewAction(e.target.value)}
                  className="resize-none h-40"
                />
              ) : (
                <>
                  {dailyCommitment.content ? (
                    <div className="prose prose-sm max-w-none">
                      <p className="whitespace-pre-wrap">{dailyCommitment.content}</p>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground italic">
                      You haven't set a daily commitment yet. This is where you define what you'll do every day to reach your goals.
                    </p>
                  )}
                  
                  {dailyCommitment.content && (
                    <div className="mt-4">
                      <Button 
                        className="w-full"
                        onClick={signDOR}
                        disabled={dailyCommitment.lastSigned === new Date().toISOString().split('T')[0]}
                      >
                        {dailyCommitment.lastSigned === new Date().toISOString().split('T')[0]
                          ? "Signed Today"
                          : "Sign for Today"}
                      </Button>
                      
                      {dailyCommitment.lastSigned && (
                        <p className="text-xs text-center text-muted-foreground mt-2">
                          Last signed: {formatDate(dailyCommitment.lastSigned)}
                        </p>
                      )}
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default YearPlan;
