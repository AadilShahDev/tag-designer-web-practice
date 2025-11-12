'use client';

import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  MousePointer2,
  Type,
  Square,
  Circle,
  Minus,
  Pencil,
  Trash2,
  Copy,
  Undo2,
  Redo2,
} from 'lucide-react';
import { DrawingTool } from '@/types/designer';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface DrawingToolbarProps {
  currentTool: DrawingTool;
  onToolChange: (tool: DrawingTool) => void;
  onDelete: () => void;
  onDuplicate: () => void;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  hasSelection: boolean;
}

const tools: Array<{
  id: DrawingTool;
  icon: React.ReactNode;
  label: string;
  shortcut: string;
}> = [
  { id: 'pointer', icon: <MousePointer2 className="h-5 w-5" />, label: 'Select', shortcut: 'V' },
  { id: 'text', icon: <Type className="h-5 w-5" />, label: 'Text', shortcut: 'T' },
  { id: 'rectangle', icon: <Square className="h-5 w-5" />, label: 'Rectangle', shortcut: 'R' },
  { id: 'circle', icon: <Circle className="h-5 w-5" />, label: 'Circle', shortcut: 'C' },
  { id: 'line', icon: <Minus className="h-5 w-5" />, label: 'Line', shortcut: 'L' },
  { id: 'pencil', icon: <Pencil className="h-5 w-5" />, label: 'Pencil', shortcut: 'P' },
];

export default function DrawingToolbar({
  currentTool,
  onToolChange,
  onDelete,
  onDuplicate,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  hasSelection,
}: DrawingToolbarProps) {
  return (
    <TooltipProvider>
      <div className="w-16 border-r flex flex-col items-center py-4 gap-1 bg-[var(--toolbar-bg)]">
        {tools.map((tool) => (
          <Tooltip key={tool.id}>
            <TooltipTrigger asChild>
              <Button
                variant={currentTool === tool.id ? 'default' : 'ghost'}
                size="icon"
                onClick={() => onToolChange(tool.id)}
                className={`w-12 h-12 transition-all ${
                  currentTool === tool.id 
                    ? 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm' 
                    : 'hover:bg-muted'
                }`}
              >
                {tool.icon}
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>{tool.label}</p>
              <p className="text-xs text-muted-foreground">Press {tool.shortcut}</p>
            </TooltipContent>
          </Tooltip>
        ))}

        <Separator className="my-2 w-10" />

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={onUndo}
              disabled={!canUndo}
              className="w-12 h-12 hover:bg-muted disabled:opacity-30"
            >
              <Undo2 className="h-5 w-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">
            <p>Undo</p>
            <p className="text-xs text-muted-foreground">Ctrl+Z</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={onRedo}
              disabled={!canRedo}
              className="w-12 h-12 hover:bg-muted disabled:opacity-30"
            >
              <Redo2 className="h-5 w-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">
            <p>Redo</p>
            <p className="text-xs text-muted-foreground">Ctrl+Y</p>
          </TooltipContent>
        </Tooltip>

        <Separator className="my-2 w-10" />

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={onDuplicate}
              disabled={!hasSelection}
              className="w-12 h-12 hover:bg-muted disabled:opacity-30"
            >
              <Copy className="h-5 w-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">
            <p>Duplicate</p>
            <p className="text-xs text-muted-foreground">Ctrl+D</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={onDelete}
              disabled={!hasSelection}
              className="w-12 h-12 hover:bg-muted hover:text-destructive disabled:opacity-30"
            >
              <Trash2 className="h-5 w-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">
            <p>Delete</p>
            <p className="text-xs text-muted-foreground">Del</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
}