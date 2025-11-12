'use client';

import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Shapes } from 'lucide-react';

interface PropertiesPanelProps {
  selectedObject: any;
  onPropertyChange: (property: string, value: any) => void;
  onOpenShapeGallery?: () => void;
}

export default function PropertiesPanel({
  selectedObject,
  onPropertyChange,
  onOpenShapeGallery,
}: PropertiesPanelProps) {
  if (!selectedObject) {
    return (
      <div className="w-72 border-l bg-[var(--panel-bg)] flex flex-col items-center justify-center text-sm text-muted-foreground p-4 gap-4">
        <p>Select an object to view properties</p>
        {onOpenShapeGallery && (
          <>
            <Separator className="w-full" />
            <Button
              variant="outline"
              className="w-full"
              onClick={onOpenShapeGallery}
            >
              <Shapes className="h-4 w-4 mr-2" />
              Add Shape
            </Button>
          </>
        )}
      </div>
    );
  }

  const isText = selectedObject.type === 'textbox' || selectedObject.type === 'text';
  const isShape = ['rect', 'circle', 'ellipse', 'triangle', 'polygon'].includes(selectedObject.type);

  return (
    <div className="w-72 border-l bg-[var(--panel-bg)]">
      <ScrollArea className="h-full">
        <div className="p-4 space-y-6">
          {onOpenShapeGallery && (
            <>
              <Button
                variant="outline"
                className="w-full"
                onClick={onOpenShapeGallery}
              >
                <Shapes className="h-4 w-4 mr-2" />
                Add Shape
              </Button>
              <Separator />
            </>
          )}

          <div>
            <h3 className="font-semibold mb-3">Properties</h3>
            
            {/* Position */}
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label htmlFor="x" className="text-xs">X Position</Label>
                  <Input
                    id="x"
                    type="number"
                    value={Math.round(selectedObject.left || 0)}
                    onChange={(e) => onPropertyChange('left', Number(e.target.value))}
                    className="h-8 mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="y" className="text-xs">Y Position</Label>
                  <Input
                    id="y"
                    type="number"
                    value={Math.round(selectedObject.top || 0)}
                    onChange={(e) => onPropertyChange('top', Number(e.target.value))}
                    className="h-8 mt-1"
                  />
                </div>
              </div>

              {/* Size */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label htmlFor="width" className="text-xs">Width</Label>
                  <Input
                    id="width"
                    type="number"
                    value={Math.round((selectedObject.width || 0) * (selectedObject.scaleX || 1))}
                    onChange={(e) => {
                      const newWidth = Number(e.target.value);
                      onPropertyChange('width', newWidth);
                      onPropertyChange('scaleX', 1);
                    }}
                    className="h-8 mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="height" className="text-xs">Height</Label>
                  <Input
                    id="height"
                    type="number"
                    value={Math.round((selectedObject.height || 0) * (selectedObject.scaleY || 1))}
                    onChange={(e) => {
                      const newHeight = Number(e.target.value);
                      onPropertyChange('height', newHeight);
                      onPropertyChange('scaleY', 1);
                    }}
                    className="h-8 mt-1"
                  />
                </div>
              </div>

              {/* Rotation */}
              <div>
                <Label htmlFor="rotation" className="text-xs">Rotation</Label>
                <div className="flex gap-2 items-center mt-1">
                  <Slider
                    id="rotation"
                    value={[selectedObject.angle || 0]}
                    onValueChange={([value]) => onPropertyChange('angle', value)}
                    min={0}
                    max={360}
                    step={1}
                    className="flex-1"
                  />
                  <span className="text-xs w-12 text-right">
                    {Math.round(selectedObject.angle || 0)}°
                  </span>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Text Properties */}
          {isText && (
            <div className="space-y-3">
              <h4 className="font-medium text-sm">Text</h4>
              
              <div>
                <Label htmlFor="text" className="text-xs">Content</Label>
                <Input
                  id="text"
                  value={selectedObject.text || ''}
                  onChange={(e) => onPropertyChange('text', e.target.value)}
                  className="h-8 mt-1"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label htmlFor="fontSize" className="text-xs">Font Size</Label>
                  <Input
                    id="fontSize"
                    type="number"
                    value={selectedObject.fontSize || 16}
                    onChange={(e) => onPropertyChange('fontSize', Number(e.target.value))}
                    className="h-8 mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="fontFamily" className="text-xs">Font</Label>
                  <Select
                    value={selectedObject.fontFamily || 'Arial'}
                    onValueChange={(value) => onPropertyChange('fontFamily', value)}
                  >
                    <SelectTrigger className="h-8 mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Arial">Arial</SelectItem>
                      <SelectItem value="Times New Roman">Times New Roman</SelectItem>
                      <SelectItem value="Courier New">Courier New</SelectItem>
                      <SelectItem value="Georgia">Georgia</SelectItem>
                      <SelectItem value="Verdana">Verdana</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  variant={selectedObject.fontWeight === 'bold' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => 
                    onPropertyChange('fontWeight', 
                      selectedObject.fontWeight === 'bold' ? 'normal' : 'bold'
                    )
                  }
                  className="flex-1"
                >
                  B
                </Button>
                <Button
                  variant={selectedObject.fontStyle === 'italic' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => 
                    onPropertyChange('fontStyle', 
                      selectedObject.fontStyle === 'italic' ? 'normal' : 'italic'
                    )
                  }
                  className="flex-1"
                >
                  I
                </Button>
                <Button
                  variant={selectedObject.underline ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => onPropertyChange('underline', !selectedObject.underline)}
                  className="flex-1"
                >
                  U
                </Button>
              </div>
            </div>
          )}

          <Separator />

          {/* Color Properties */}
          <div className="space-y-3">
            <h4 className="font-medium text-sm">Colors</h4>
            
            {(isText || isShape) && (
              <div>
                <Label htmlFor="fill" className="text-xs">Fill Color</Label>
                <div className="flex gap-2 mt-1">
                  <Input
                    id="fill"
                    type="color"
                    value={selectedObject.fill || '#000000'}
                    onChange={(e) => onPropertyChange('fill', e.target.value)}
                    className="h-8 w-16 p-1"
                  />
                  <Input
                    value={selectedObject.fill || '#000000'}
                    onChange={(e) => onPropertyChange('fill', e.target.value)}
                    className="h-8 flex-1"
                  />
                </div>
              </div>
            )}

            <div>
              <Label htmlFor="stroke" className="text-xs">Stroke Color</Label>
              <div className="flex gap-2 mt-1">
                <Input
                  id="stroke"
                  type="color"
                  value={selectedObject.stroke || '#000000'}
                  onChange={(e) => onPropertyChange('stroke', e.target.value)}
                  className="h-8 w-16 p-1"
                />
                <Input
                  value={selectedObject.stroke || '#000000'}
                  onChange={(e) => onPropertyChange('stroke', e.target.value)}
                  className="h-8 flex-1"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="strokeWidth" className="text-xs">Stroke Width</Label>
              <Input
                id="strokeWidth"
                type="number"
                value={selectedObject.strokeWidth || 1}
                onChange={(e) => onPropertyChange('strokeWidth', Number(e.target.value))}
                className="h-8 mt-1"
                min={0}
              />
            </div>
          </div>

          <Separator />

          {/* Opacity */}
          <div>
            <Label htmlFor="opacity" className="text-xs">Opacity</Label>
            <div className="flex gap-2 items-center mt-1">
              <Slider
                id="opacity"
                value={[(selectedObject.opacity || 1) * 100]}
                onValueChange={([value]) => onPropertyChange('opacity', value / 100)}
                min={0}
                max={100}
                step={1}
                className="flex-1"
              />
              <span className="text-xs w-12 text-right">
                {Math.round((selectedObject.opacity || 1) * 100)}%
              </span>
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}