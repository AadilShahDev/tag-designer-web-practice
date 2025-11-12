'use client';

import { useState, useRef } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Upload, Search } from 'lucide-react';
import { ShapeTemplate } from '@/types/designer';

interface ShapeGalleryProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onShapeSelect: (shape: ShapeTemplate) => void;
  onImageUpload: (file: File) => void;
}

const predefinedShapes: ShapeTemplate[] = [
  {
    id: 'star',
    name: 'Star',
    category: 'basic',
    svg: '<svg viewBox="0 0 100 100"><polygon points="50,10 61,35 85,35 66,50 73,75 50,60 27,75 34,50 15,35 39,35" fill="currentColor"/></svg>',
  },
  {
    id: 'triangle',
    name: 'Triangle',
    category: 'basic',
    svg: '<svg viewBox="0 0 100 100"><polygon points="50,10 90,90 10,90" fill="currentColor"/></svg>',
  },
  {
    id: 'heart',
    name: 'Heart',
    category: 'shapes',
    svg: '<svg viewBox="0 0 100 100"><path d="M50,90 C50,90 10,65 10,40 C10,25 20,15 32,15 C40,15 47,20 50,27 C53,20 60,15 68,15 C80,15 90,25 90,40 C90,65 50,90 50,90 Z" fill="currentColor"/></svg>',
  },
  {
    id: 'arrow-right',
    name: 'Arrow Right',
    category: 'arrows',
    svg: '<svg viewBox="0 0 100 100"><path d="M10,35 L60,35 L60,15 L90,50 L60,85 L60,65 L10,65 Z" fill="currentColor"/></svg>',
  },
  {
    id: 'arrow-left',
    name: 'Arrow Left',
    category: 'arrows',
    svg: '<svg viewBox="0 0 100 100"><path d="M90,35 L40,35 L40,15 L10,50 L40,85 L40,65 L90,65 Z" fill="currentColor"/></svg>',
  },
  {
    id: 'arrow-up',
    name: 'Arrow Up',
    category: 'arrows',
    svg: '<svg viewBox="0 0 100 100"><path d="M35,90 L35,40 L15,40 L50,10 L85,40 L65,40 L65,90 Z" fill="currentColor"/></svg>',
  },
  {
    id: 'arrow-down',
    name: 'Arrow Down',
    category: 'arrows',
    svg: '<svg viewBox="0 0 100 100"><path d="M35,10 L35,60 L15,60 L50,90 L85,60 L65,60 L65,10 Z" fill="currentColor"/></svg>',
  },
  {
    id: 'hexagon',
    name: 'Hexagon',
    category: 'basic',
    svg: '<svg viewBox="0 0 100 100"><polygon points="50,10 90,30 90,70 50,90 10,70 10,30" fill="currentColor"/></svg>',
  },
  {
    id: 'pentagon',
    name: 'Pentagon',
    category: 'basic',
    svg: '<svg viewBox="0 0 100 100"><polygon points="50,10 90,40 75,85 25,85 10,40" fill="currentColor"/></svg>',
  },
  {
    id: 'cloud',
    name: 'Cloud',
    category: 'shapes',
    svg: '<svg viewBox="0 0 100 100"><path d="M25,65 C15,65 10,60 10,50 C10,42 15,35 23,33 C23,25 30,18 40,18 C45,18 49,20 52,23 C55,18 61,15 67,15 C77,15 85,23 85,33 C90,35 93,40 93,46 C93,54 87,60 79,60 L25,65 Z" fill="currentColor"/></svg>',
  },
  {
    id: 'diamond',
    name: 'Diamond',
    category: 'basic',
    svg: '<svg viewBox="0 0 100 100"><polygon points="50,10 90,50 50,90 10,50" fill="currentColor"/></svg>',
  },
  {
    id: 'badge',
    name: 'Badge',
    category: 'shapes',
    svg: '<svg viewBox="0 0 100 100"><path d="M50,5 L60,20 L77,17 L75,35 L90,45 L75,55 L77,73 L60,70 L50,85 L40,70 L23,73 L25,55 L10,45 L25,35 L23,17 L40,20 Z" fill="currentColor"/></svg>',
  },
];

export default function ShapeGallery({
  open,
  onOpenChange,
  onShapeSelect,
  onImageUpload,
}: ShapeGalleryProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const categories = ['all', 'basic', 'shapes', 'arrows'];

  const filteredShapes = predefinedShapes.filter((shape) => {
    const matchesSearch = shape.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || shape.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      onImageUpload(file);
      onOpenChange(false);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Shape Gallery</DialogTitle>
            <DialogDescription>
              Choose a predefined shape or upload your own image
            </DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="shapes" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="shapes">Shapes</TabsTrigger>
              <TabsTrigger value="upload">Upload Image</TabsTrigger>
            </TabsList>

            <TabsContent value="shapes" className="space-y-4">
              <div className="flex flex-col gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search shapes..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <div className="flex gap-2 flex-wrap">
                  {categories.map((category) => (
                    <Button
                      key={category}
                      variant={selectedCategory === category ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedCategory(category)}
                      className="capitalize"
                    >
                      {category}
                    </Button>
                  ))}
                </div>
              </div>

              <ScrollArea className="h-[450px] pr-4">
                <div className="grid grid-cols-4 gap-3 pb-2">
                  {filteredShapes.map((shape) => (
                    <button
                      key={shape.id}
                      onClick={() => {
                        onShapeSelect(shape);
                        onOpenChange(false);
                      }}
                      className="flex flex-col items-center gap-2 p-4 rounded-lg border-2 hover:border-primary hover:bg-accent transition-all group"
                    >
                      <div
                        className="w-20 h-20 flex items-center justify-center text-foreground group-hover:text-primary transition-colors"
                        dangerouslySetInnerHTML={{ __html: shape.svg }}
                      />
                      <span className="text-xs text-center font-medium">{shape.name}</span>
                    </button>
                  ))}
                </div>
                {filteredShapes.length === 0 && (
                  <div className="flex items-center justify-center h-[450px] text-muted-foreground">
                    No shapes found
                  </div>
                )}
              </ScrollArea>
            </TabsContent>

            <TabsContent value="upload" className="space-y-4">
              <div className="flex flex-col items-center justify-center h-[500px] border-2 border-dashed rounded-lg p-8 text-center hover:border-primary transition-colors">
                <Upload className="h-16 w-16 text-muted-foreground mb-4" />
                <h3 className="font-semibold text-lg mb-2">Upload an Image</h3>
                <p className="text-sm text-muted-foreground mb-6 max-w-sm">
                  Supports PNG, JPG, SVG, and GIF files. Drag and drop or click to browse.
                </p>
                <Button size="lg" onClick={() => fileInputRef.current?.click()}>
                  <Upload className="h-4 w-4 mr-2" />
                  Choose File
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </div>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </>
  );
}