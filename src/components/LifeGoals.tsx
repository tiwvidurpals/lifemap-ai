import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PlusCircle, Edit2, Trash2, Check, X, GripVertical, AlertCircle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface LifeGoal {
  id: string;
  title: string;
  description: string;
  category: string;
  actions: string[];
}

interface SortableCategoryProps {
  id: string;
  isActive: boolean;
  onClick: () => void;
  onRemove: () => void;
  hasGoals: boolean;
}

const SortableCategory = ({ id, isActive, onClick, onRemove, hasGoals }: SortableCategoryProps) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
  };

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      className={`flex items-center ${isDragging ? 'opacity-50' : ''}`}
    >
      <div className="flex items-center">
        <Button
          variant={isActive ? "default" : "outline"}
          onClick={onClick}
          size="sm"
          className="relative pr-8 group"
        >
          <span>{id}</span>
          {hasGoals ? null : (
            <span 
              className="absolute right-1 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity" 
              onClick={(e) => {
                e.stopPropagation();
                onRemove();
              }}
            >
              <X size={14} className="text-destructive hover:text-destructive/80" />
            </span>
          )}
        </Button>
        <div
          {...attributes}
          {...listeners}
          className="px-1 py-2 cursor-grab text-muted-foreground hover:text-foreground"
        >
          <GripVertical size={14} />
        </div>
      </div>
    </div>
  );
};

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
  const [categoryToRemove, setCategoryToRemove] = useState<string | null>(null);
  const [newGoal, setNewGoal] = useState<Omit<LifeGoal, "id">>({
    title: "",
    description: "",
    category: "Other",
    actions: [""]
  });
  const { toast } = useToast();

  // DnD sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

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

  const confirmRemoveCategory = (category: string) => {
    // Check if category has any goals
    const hasGoals = goals.some(goal => goal.category === category);
    
    if (hasGoals) {
      toast({
        title: "Cannot remove category",
        description: "This category contains goals. Please move or delete them first.",
        variant: "destructive"
      });
      return;
    }

    setCategoryToRemove(category);
  };

  const removeCategory = () => {
    if (!categoryToRemove) return;
    
    setCategories(categories.filter(c => c !== categoryToRemove));
    
    if (activeCategory === categoryToRemove) {
      setActiveCategory("All");
    }
    
    toast({
      title: "Category removed",
      description: `Category "${categoryToRemove}" has been removed`
    });
    
    setCategoryToRemove(null);
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

  // Handle the drag end event
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      setCategories((items) => {
        const oldIndex = items.indexOf(active.id.toString());
        const newIndex = items.indexOf(over.id.toString());
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  // Check if a category has goals
  const categoryHasGoals = (category: string) => {
    return goals.some(goal => goal.category === category);
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b">
        <h1 className="text-2xl font-bold">Life Goals</h1>
        <p className="text-muted-foreground mt-1">Define your ultimate life goals and the steps to achieve them</p>
      </div>

      <div className="p-4 border-b overflow-x-auto">
        <div className="flex gap-2 items-center mb-2">
          <Button
            variant={activeCategory === "All" ? "default" : "outline"}
            onClick={() => setActiveCategory("All")}
            size="sm"
          >
            All
          </Button>
          
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={categories}
              strategy={horizontalListSortingStrategy}
            >
              {categories.map(category => (
                <SortableCategory
                  key={category}
                  id={category}
                  isActive={activeCategory === category}
                  onClick={() => setActiveCategory(category)}
                  onRemove={() => confirmRemoveCategory(category)}
                  hasGoals={categoryHasGoals(category)}
                />
              ))}
            </SortableContext>
          </DndContext>
          
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
            <Button variant="outline" size="sm" onClick={() => setShowCategoryInput(true)} className="ml-1">
              <PlusCircle size={16} className="mr-1" />
              Add Category
            </Button>
          )}
        </div>
        <div className="text-xs text-muted-foreground">
          <span className="flex items-center gap-1 mt-1">
            <GripVertical size={14} /> 
            <span>Drag categories to reorder. Hover to see remove option.</span>
          </span>
        </div>
      </div>

      {isEditing ? (
        <div className="p-4 border-b bg-muted/20">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg">
                  {editingGoalId ? "Edit Goal" : "Create New Goal"}
                </CardTitle>
                <div className="flex gap-1">
                  <Button size="sm" variant="ghost" onClick={cancelEditing} className="h-8">
                    <X size={16} className="mr-1" />
                    Cancel
                  </Button>
                  <Button size="sm" onClick={saveGoal} className="h-8">
                    <Check size={16} className="mr-1" />
                    Save
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Goal Title</Label>
                <Input 
                  id="title"
                  value={newGoal.title}
                  onChange={(e) => setNewGoal({...newGoal, title: e.target.value})}
                  placeholder="What do you want to achieve?"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <select 
                  id="category"
                  value={newGoal.category}
                  onChange={(e) => setNewGoal({...newGoal, category: e.target.value})}
                  className="w-full h-10 rounded-md border border-input bg-background px-3 py-2"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea 
                  id="description"
                  value={newGoal.description}
                  onChange={(e) => setNewGoal({...newGoal, description: e.target.value})}
                  placeholder="Describe your goal in detail..."
                  className="min-h-[100px]"
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Action Steps</Label>
                  <Button variant="ghost" size="sm" onClick={addActionField} className="h-8">
                    <PlusCircle size={14} className="mr-1" />
                    Add Step
                  </Button>
                </div>
                
                <div className="space-y-2">
                  {newGoal.actions.map((action, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <Input
                        value={action}
                        onChange={(e) => updateAction(index, e.target.value)}
                        placeholder={`Step ${index + 1}`}
                        className="flex-1"
                      />
                      {newGoal.actions.length > 1 && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeAction(index)}
                          className="h-10 w-10 text-destructive hover:text-destructive/80"
                        >
                          <Trash2 size={16} />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="p-4 flex justify-end">
          <Button onClick={() => startEditing()} className="flex items-center gap-1">
            <PlusCircle size={16} />
            New Goal
          </Button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4 overflow-auto">
        {filteredGoals.length > 0 ? (
          filteredGoals.map(goal => (
            <Card key={goal.id}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-base">{goal.title}</CardTitle>
                    <div className="text-xs text-muted-foreground mt-1">{goal.category}</div>
                  </div>
                  <div className="flex gap-1">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => startEditing(goal)} 
                      className="h-8 w-8"
                    >
                      <Edit2 size={14} />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => deleteGoal(goal.id)} 
                      className="h-8 w-8 text-destructive hover:text-destructive/80"
                    >
                      <Trash2 size={14} />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {goal.description && (
                  <p className="text-sm text-muted-foreground mb-4">{goal.description}</p>
                )}
                
                {goal.actions.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium mb-2">Action Steps:</h4>
                    <ul className="space-y-1 pl-5 list-disc text-sm marker:text-primary">
                      {goal.actions.map((action, index) => (
                        <li key={index}>{action}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-full flex flex-col items-center justify-center p-8 text-center">
            {activeCategory === "All" ? (
              <>
                <div className="bg-muted rounded-full p-3 mb-4">
                  <PlusCircle size={24} className="text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium mb-1">No goals yet</h3>
                <p className="text-muted-foreground mb-4">
                  Start defining your life goals to track your journey
                </p>
                <Button onClick={() => startEditing()}>Create Your First Goal</Button>
              </>
            ) : (
              <>
                <div className="bg-muted rounded-full p-3 mb-4">
                  <AlertCircle size={24} className="text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium mb-1">No goals in this category</h3>
                <p className="text-muted-foreground mb-4">
                  Add goals to the "{activeCategory}" category or select a different one
                </p>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setActiveCategory("All")}>
                    View All Goals
                  </Button>
                  <Button onClick={() => startEditing()}>Add Goal to {activeCategory}</Button>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      <AlertDialog open={categoryToRemove !== null} onOpenChange={(open) => !open && setCategoryToRemove(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Category</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove the "{categoryToRemove}" category? 
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={removeCategory}>Remove</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default LifeGoals;
