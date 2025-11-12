'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Search, Trash2, Calendar } from 'lucide-react';
import { Template } from '@/types/designer';
import TemplateService from '@/services/TemplateService';
import { toast } from 'sonner';

interface TemplateListModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onTemplateSelect: (template: Template) => void;
}

export default function TemplateListModal({
  open,
  onOpenChange,
  onTemplateSelect,
}: TemplateListModalProps) {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const templateService = TemplateService.getInstance();

  useEffect(() => {
    if (open) {
      loadTemplates();
    }
  }, [open]);

  const loadTemplates = async () => {
    setLoading(true);
    try {
      // Load from local storage for now
      const localTemplates = templateService.getLocalTemplates();
      setTemplates(localTemplates);
    } catch (error) {
      toast.error('Failed to load templates');
      console.error('Load templates error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (templateId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!confirm('Are you sure you want to delete this template?')) {
      return;
    }

    try {
      templateService.deleteLocalTemplate(templateId);
      setTemplates(prev => prev.filter(t => t.id !== templateId));
      toast.success('Template deleted successfully');
    } catch (error) {
      toast.error('Failed to delete template');
      console.error('Delete template error:', error);
    }
  };

  const filteredTemplates = templates.filter(template =>
    template.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Load Template</DialogTitle>
          <DialogDescription>
            Choose a template to load into the designer
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search templates..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>

          <ScrollArea className="h-[500px]">
            {loading ? (
              <div className="flex items-center justify-center h-[500px] text-muted-foreground">
                Loading templates...
              </div>
            ) : filteredTemplates.length > 0 ? (
              <div className="grid grid-cols-2 gap-4 p-1">
                {filteredTemplates.map((template) => (
                  <button
                    key={template.id}
                    onClick={() => {
                      onTemplateSelect(template);
                      onOpenChange(false);
                    }}
                    className="flex flex-col gap-2 p-4 rounded-lg border hover:border-primary hover:bg-accent transition-colors text-left group"
                  >
                    <div className="aspect-video bg-muted rounded flex items-center justify-center text-muted-foreground">
                      <div className="text-center">
                        <div className="text-2xl mb-1">📄</div>
                        <div className="text-xs">
                          {template.width} × {template.height}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex-1">
                      <h4 className="font-medium line-clamp-1 group-hover:text-primary transition-colors">
                        {template.name}
                      </h4>
                      {template.description && (
                        <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                          {template.description}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(template.updatedAt).toLocaleDateString()}
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={(e) => handleDelete(template.id, e)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-[500px] text-muted-foreground">
                <p className="text-lg mb-2">No templates found</p>
                <p className="text-sm">
                  {searchTerm
                    ? 'Try a different search term'
                    : 'Create and save a template to see it here'}
                </p>
              </div>
            )}
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
}
