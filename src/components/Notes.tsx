import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"; 
import { Textarea } from "@/components/ui/textarea";
import { Search, Plus, Trash2, Tag, Save, X, Edit, PencilIcon } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { fetchNotes, createNote, updateNote, deleteNote, DataMigrationService } from "@/services";
import { Note } from "@/types/database";
import { DatabaseSetupChecker } from "./DatabaseSetupChecker";

const Notes = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredNotes, setFilteredNotes] = useState<Note[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [newNote, setNewNote] = useState<Omit<Note, "id" | "user_id" | "created_at" | "updated_at">>({
    title: "",
    content: "",
    tags: []
  });
  const [tagInput, setTagInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [migrating, setMigrating] = useState(false);
  const [databaseError, setDatabaseError] = useState(false);
  const { toast } = useToast();

  // Load notes from database
  useEffect(() => {
    loadNotes();
  }, []);

  const loadNotes = async () => {
    try {
      setLoading(true);
      setDatabaseError(false);
      const data = await fetchNotes();
      setNotes(data);
    } catch (error) {
      console.error('Failed to load notes:', error);
      setDatabaseError(true);
      toast({
        title: "Database Error",
        description: "Failed to connect to database. Please check your setup.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Check for localStorage data and offer migration
  useEffect(() => {
    if (notes.length === 0 && DataMigrationService.hasLocalStorageData()) {
      toast({
        title: "Data Migration Available",
        description: "We found existing data in your browser. Would you like to migrate it to the cloud?",
        action: (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleMigration}
            disabled={migrating}
          >
            {migrating ? "Migrating..." : "Migrate Data"}
          </Button>
        ),
        duration: 10000
      });
    }
  }, [notes.length]);

  const handleMigration = async () => {
    try {
      setMigrating(true);
      const result = await DataMigrationService.migrateAllData();
      
      if (result.success) {
        const totalMigrated = Object.values(result.migrated).reduce((a: number, b: number) => a + b, 0);
        toast({
          title: "Migration Successful",
          description: `Migrated ${totalMigrated} items to the cloud.`,
        });
        await DataMigrationService.clearLocalStorage();
        await loadNotes(); // Reload notes after migration
      } else {
        toast({
          title: "Migration Failed",
          description: result.message,
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Migration Error",
        description: "Failed to migrate data. Please try again.",
        variant: "destructive"
      });
    } finally {
      setMigrating(false);
    }
  };

  // Filter notes based on search query
  useEffect(() => {
    if (!searchQuery) {
      setFilteredNotes(notes);
      return;
    }
    
    const lowerQuery = searchQuery.toLowerCase();
    const filtered = notes.filter(note => 
      note.title.toLowerCase().includes(lowerQuery) || 
      note.content.toLowerCase().includes(lowerQuery) ||
      note.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
    );
    
    setFilteredNotes(filtered);
  }, [searchQuery, notes]);

  const createNoteHandler = async () => {
    if (!newNote.title.trim()) {
      toast({
        title: "Title required",
        description: "Please provide a title for your note",
        variant: "destructive"
      });
      return;
    }

    try {
      const createdNote = await createNote(newNote);
      setNotes([createdNote, ...notes]);
      
      // Reset form
      setNewNote({
        title: "",
        content: "",
        tags: []
      });
      
      setIsCreating(false);
      
      toast({
        title: "Note created",
        description: "Your new note has been created successfully"
      });
    } catch (error) {
      console.error('Failed to create note:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to create note. Please try again.';
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      });
    }
  };

  const startEditingNote = (note: Note) => {
    setIsEditing(note.id);
    setNewNote({
      title: note.title,
      content: note.content,
      tags: [...note.tags]
    });
    setIsCreating(false);
  };

  const updateNoteHandler = async () => {
    if (!isEditing) return;
    
    if (!newNote.title.trim()) {
      toast({
        title: "Title required",
        description: "Please provide a title for your note",
        variant: "destructive"
      });
      return;
    }

    try {
      const updatedNote = await updateNote(isEditing, {
        title: newNote.title,
        content: newNote.content,
        tags: newNote.tags
      });

      setNotes(notes.map(note => 
        note.id === isEditing ? updatedNote : note
      ));
      
      cancelEdit();
      
      toast({
        title: "Note updated",
        description: "Your note has been updated successfully"
      });
    } catch (error) {
      console.error('Failed to update note:', error);
      toast({
        title: "Error",
        description: "Failed to update note. Please try again.",
        variant: "destructive"
      });
    }
  };

  const cancelEdit = () => {
    setIsEditing(null);
    setNewNote({
      title: "",
      content: "",
      tags: []
    });
  };

  const deleteNoteHandler = async (id: string) => {
    try {
      await deleteNote(id);
      setNotes(notes.filter(note => note.id !== id));
      
      toast({
        title: "Note deleted",
        description: "Your note has been deleted successfully"
      });
    } catch (error) {
      console.error('Failed to delete note:', error);
      toast({
        title: "Error",
        description: "Failed to delete note. Please try again.",
        variant: "destructive"
      });
    }
  };

  const addTag = () => {
    if (!tagInput.trim()) return;
    
    if (!newNote.tags.includes(tagInput.trim())) {
      setNewNote({
        ...newNote,
        tags: [...newNote.tags, tagInput.trim()]
      });
    }
    
    setTagInput("");
  };

  const removeTag = (tagToRemove: string) => {
    setNewNote({
      ...newNote,
      tags: newNote.tags.filter(tag => tag !== tagToRemove)
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading notes...</p>
        </div>
      </div>
    );
  }

  if (databaseError) {
    return (
      <div className="h-full flex items-center justify-center p-4">
        <DatabaseSetupChecker />
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b flex items-center justify-between">
        <h1 className="text-2xl font-bold">Notes</h1>
        <Button onClick={() => {
          setIsCreating(true);
          setIsEditing(null);
          setNewNote({
            title: "",
            content: "",
            tags: []
          });
        }} className="flex items-center gap-1">
          <Plus size={16} />
          New Note
        </Button>
      </div>

      <div className="p-4 border-b">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
          <Input
            placeholder="Search notes by title, content or tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {isCreating && (
        <div className="p-4 border-b bg-muted/20">
          <Card>
            <CardHeader className="pb-2">
              <Input
                placeholder="Note title"
                value={newNote.title}
                onChange={(e) => setNewNote({...newNote, title: e.target.value})}
                className="text-lg font-medium"
              />
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="Write your thoughts here..."
                value={newNote.content}
                onChange={(e) => setNewNote({...newNote, content: e.target.value})}
                className="min-h-[150px] resize-none"
              />
              
              <div>
                <label className="text-sm font-medium mb-1 block">Tags</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {newNote.tags.map(tag => (
                    <div key={tag} className="bg-secondary text-secondary-foreground px-2 py-1 rounded-full text-sm flex items-center gap-1">
                      <span>{tag}</span>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-4 w-4 rounded-full"
                        onClick={() => removeTag(tag)}
                      >
                        <X size={12} />
                      </Button>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
                    <Input
                      placeholder="Add a tag..."
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && addTag()}
                      className="pl-9"
                    />
                  </div>
                  <Button variant="outline" onClick={addTag}>Add</Button>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end gap-2">
              <Button variant="ghost" onClick={() => setIsCreating(false)}>Cancel</Button>
              <Button onClick={createNoteHandler} className="flex items-center gap-1">
                <Save size={16} />
                Save Note
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}

      {isEditing && (
        <div className="p-4 border-b bg-muted/20">
          <Card>
            <CardHeader className="pb-2">
              <Input
                placeholder="Note title"
                value={newNote.title}
                onChange={(e) => setNewNote({...newNote, title: e.target.value})}
                className="text-lg font-medium"
              />
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="Write your thoughts here..."
                value={newNote.content}
                onChange={(e) => setNewNote({...newNote, content: e.target.value})}
                className="min-h-[150px] resize-none"
              />
              
              <div>
                <label className="text-sm font-medium mb-1 block">Tags</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {newNote.tags.map(tag => (
                    <div key={tag} className="bg-secondary text-secondary-foreground px-2 py-1 rounded-full text-sm flex items-center gap-1">
                      <span>{tag}</span>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-4 w-4 rounded-full"
                        onClick={() => removeTag(tag)}
                      >
                        <X size={12} />
                      </Button>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
                    <Input
                      placeholder="Add a tag..."
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && addTag()}
                      className="pl-9"
                    />
                  </div>
                  <Button variant="outline" onClick={addTag}>Add</Button>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end gap-2">
              <Button variant="ghost" onClick={cancelEdit}>Cancel</Button>
              <Button onClick={updateNoteHandler} className="flex items-center gap-1">
                <Save size={16} />
                Update Note
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 p-4 overflow-auto">
        {filteredNotes.length > 0 ? (
          filteredNotes.map(note => (
            <Card key={note.id} className="flex flex-col">
              <CardHeader className="pb-2">
                <CardTitle>{note.title}</CardTitle>
                <p className="text-xs text-muted-foreground">
                  {formatDate(note.updated_at || note.created_at || '')}
                </p>
              </CardHeader>
              <CardContent className="flex-1">
                <p className="text-sm whitespace-pre-wrap line-clamp-4">{note.content}</p>
              </CardContent>
              {note.tags.length > 0 && (
                <CardFooter className="border-t pt-3 flex flex-wrap gap-1">
                  {note.tags.map(tag => (
                    <div key={tag} className="bg-secondary text-secondary-foreground px-2 py-1 rounded-full text-xs">
                      {tag}
                    </div>
                  ))}
                </CardFooter>
              )}
              <CardFooter className="justify-end gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => startEditingNote(note)}
                  className="flex items-center gap-1"
                >
                  <PencilIcon size={14} />
                  Edit
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => deleteNoteHandler(note.id)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 size={14} />
                </Button>
              </CardFooter>
            </Card>
          ))
        ) : (
          <div className="col-span-full flex flex-col items-center justify-center p-8 text-center">
            <div className="bg-muted rounded-full p-3 mb-4">
              <Search size={24} className="text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium mb-1">No notes found</h3>
            <p className="text-muted-foreground mb-4">
              {searchQuery ? "Try using different search terms" : "Create your first note to get started"}
            </p>
            {searchQuery && (
              <Button variant="outline" onClick={() => setSearchQuery("")}>Clear Search</Button>
            )}
            {!searchQuery && (
              <Button onClick={() => {
                setIsCreating(true);
                setIsEditing(null);
              }}>
                <Plus size={16} className="mr-2" />
                Create Note
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Notes;
