'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Save,
  FolderOpen,
  Download,
  Settings,
  User,
  Menu,
  FileText,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface HeaderProps {
  templateName: string;
  onTemplateNameChange: (name: string) => void;
  onSave: () => void;
  onLoad: () => void;
  onExport: () => void;
  onNew: () => void;
  isDirty: boolean;
  isSaving: boolean;
}

export default function Header({
  templateName,
  onTemplateNameChange,
  onSave,
  onLoad,
  onExport,
  onNew,
  isDirty,
  isSaving,
}: HeaderProps) {
  const [isEditingName, setIsEditingName] = useState(false);

  return (
    <header className="h-14 border-b flex items-center justify-between px-4 bg-[var(--toolbar-bg)]">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <FileText className="h-6 w-6" />
          <span className="font-semibold text-lg">Tag Designer</span>
        </div>
        
        <div className="h-6 w-px bg-border" />
        
        {isEditingName ? (
          <Input
            value={templateName}
            onChange={(e) => onTemplateNameChange(e.target.value)}
            onBlur={() => setIsEditingName(false)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') setIsEditingName(false);
            }}
            className="h-8 w-64"
            autoFocus
          />
        ) : (
          <button
            onClick={() => setIsEditingName(true)}
            className="text-sm font-medium hover:text-primary px-2 py-1 rounded hover:bg-accent"
          >
            {templateName || 'Untitled Template'}
            {isDirty && ' *'}
          </button>
        )}
      </div>

      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" onClick={onNew}>
          <FileText className="h-4 w-4 mr-2" />
          New
        </Button>
        
        <Button variant="ghost" size="sm" onClick={onLoad}>
          <FolderOpen className="h-4 w-4 mr-2" />
          Open
        </Button>
        
        <Button
          variant="default"
          size="sm"
          onClick={onSave}
          disabled={!isDirty || isSaving}
        >
          <Save className="h-4 w-4 mr-2" />
          {isSaving ? 'Saving...' : 'Save'}
        </Button>
        
        <Button variant="ghost" size="sm" onClick={onExport}>
          <Download className="h-4 w-4 mr-2" />
          Export
        </Button>

        <div className="h-6 w-px bg-border mx-2" />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="h-4 w-4 mr-2" />
              Account
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
