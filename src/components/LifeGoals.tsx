
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PlusCircle, Edit2, Trash2, Check, X } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface LifeGoal {
  id: string;
  title: string;
  description: string;
  category: string;
  actions: string[];
}

const LifeGoals = () => {
  const [goals, setGoals] = useState<LifeGoal[]>([]);
  const [categories, setCategories] = useState<string[]>([
    "Career", "Health", "Relationships", "Personal Development", "Financial", "Travel", "Other"
  ]);
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [isEditing, setIsEditing] = useState(false);
  const [editingGoalId, setEditingGoalId] = useState<string | null>(null);
  const [newCategory, setNewCategory] = useState("");
  const [showCategoryInput, setShowCategoryInput] = useState(false);
  const [newGoal, setNewGoal] = useState<Omit<LifeGoal, "id">>({
    title: "",
    description: "",
    category: "Other",
    actions: [""]
  });
  const { toast } = useToast();

  // Load goals from localStorage
  useEffect(() => {
    const storedGoals = localStorage.getItem("lifeGoals");
    if (storedGoals) {
      setGoals(JSON.parse(storedGoals));
    }
    
    const storedCategories = localStorage.getItem("lifeGoalCategories");
    if (storedCategories) {
      setCategories(JSON.parse(storedCategories));
    }
  }, []);

  // Save goals to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("lifeGoals", JSON.stringify(goals));
  }, [goals]);

  // Save categories to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("lifeGoalCategories", JSON.stringify(categories));
  }, [categories]);

  const filteredGoals = activeCategory === "All" 
    ? goals 
    : goals.filter(goal => goal.category === activeCategory);

  const startEditing = (goal?: LifeGoal) => {
    if (goal) {
      setEditingGoalId(goal.id);
      setNewGoal({
        title: goal.title,
        description: goal.description,
        category: goal.category,
        actions: [...goal.actions]
      });
    } else {
      setEditingGoalId(null);
      setNewGoal({
        title: "",
        description: "",
        category: activeCategory === "All" ? "Other" : activeCategory,
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
      category: activeCategory === "All" ? "Other" : activeCategory,
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
              category: newGoal.category,
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
      const goal: LifeGoal = {
        id: `life-${Date.now()}`,
        title: newGoal.title,
        description: newGoal.description,
        category: newGoal.category,
        actions: filteredActions
      };
      
      setGoals([...goals, goal]);
      
      toast({
        title: "Goal created",
        description: "Your new goal has been added to your life goals"
      });
    }
    
    // Reset form
    setIsEditing(false);
    setEditingGoalId(null);
    setNewGoal({
      title: "",
      description: "",
      category: activeCategory === "All" ? "Other" : activeCategory,
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

  const addCategory = () => {
    if (!newCategory.trim()) return;
    
    if (!categories.includes(newCategory.trim())) {
      setCategories([...categories, newCategory.trim()]);
      setActiveCategory(newCategory.trim());
      
      toast({
        title: "Category added",
        description: `New category "${newCategory.trim()}" has been added`
      });
    }
    
    setNewCategory("");
    setShowCategoryInput(false);
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
        <h1 className="text-2xl font-bold">Life Goals</h1>
        <p className="text-muted-foreground mt-1">Define your ultimate life goals and the steps to achieve them</p>
      </div>

      <div className="p-4 border-b overflow-x-auto">
        <div className="flex gap-2 items-center">
          <Button
            variant={activeCategory === "All" ? "default" : "outline"}
            onClick={() => setActiveCategory("All")}
            size="sm"
          >
            All
          </Button>
          
          {categories.map(category => (
            <Button
              key={category}
              variant={activeCategory === category ? "default" : "outline"}
              onClick={() => setActiveCategory(category)}
              size="sm"
            >
              {category}
            </Button>
          ))}
          
          {showCategoryInput ? (
            <div className="flex gap-1 items-center">
              <Input
                placeholder="New category..."
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                className="w-40 h-9"
                onKeyDown={(e) => e.key === 'Enter' && addCategory()}
              />
              <Button variant="ghost" size="icon" onClick={addCategory} className="h-9 w-9">
                <Check size={16} />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => setShowCategoryInput(false)} className="h-9 w-9">
                <X size={16} />
              </Button>
            </div>
          ) : (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setShowCategoryInput(true)}
              className="flex items-center gap-1"
            >
              <PlusCircle size={14} />
              Add Category
            </Button>
          )}
        </div>
      </div>

      <div className="flex-1 p-4 overflow-auto">
        <div className="mb-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold">
            {activeCategory === "All" ? "All Life Goals" : `${activeCategory} Goals`}
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
                  placeholder="What's your ultimate goal?"
                  value={newGoal.title}
                  onChange={(e) => setNewGoal({...newGoal, title: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="goal-desc">Description</Label>
                <Textarea
                  id="goal-desc"
                  placeholder="Why is this goal important to you?"
                  value={newGoal.description}
                  onChange={(e) => setNewGoal({...newGoal, description: e.target.value})}
                  className="resize-none h-20"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="goal-category">Category</Label>
                <select
                  id="goal-category"
                  value={newGoal.category}
                  onChange={(e) => setNewGoal({...newGoal, category: e.target.value})}
                  className="w-full h-10 px-3 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label>Actions You Can Take Now</Label>
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
                    <div>
                      <CardTitle>{goal.title}</CardTitle>
                      <div className="mt-1 inline-block bg-secondary text-secondary-foreground px-2 py-1 rounded-full text-xs">
                        {goal.category}
                      </div>
                    </div>
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
                    <p className="text-sm text-muted-foreground mt-2">{goal.description}</p>
                  )}
                </CardHeader>
                <CardContent>
                  {goal.actions.length > 0 ? (
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium">Actions you can take now:</h3>
                      <ul className="list-disc pl-5 space-y-1">
                        {goal.actions.map((action, index) => (
                          <li key={index} className="text-sm">{action}</li>
                        ))}
                      </ul>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground italic">No immediate actions defined</p>
                  )}
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="col-span-full flex flex-col items-center justify-center p-8 text-center">
              <p className="text-muted-foreground">
                {activeCategory === "All" 
                  ? "You don't have any life goals yet. Add your first goal to get started!" 
                  : `You don't have any goals in the "${activeCategory}" category yet.`}
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

export default LifeGoals;
