'use client';

import { ZoomIn, ZoomOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';

interface StatusBarProps {
  zoom: number;
  onZoomChange: (zoom: number) => void;
  canvasWidth: number;
  canvasHeight: number;
  selectedObjectCount: number;
  cursorPosition?: { x: number; y: number };
}

export default function StatusBar({
  zoom,
  onZoomChange,
  canvasWidth,
  canvasHeight,
  selectedObjectCount,
  cursorPosition,
}: StatusBarProps) {
  const zoomPercentage = Math.round(zoom * 100);

  const handleZoomIn = () => {
    const newZoom = Math.min(zoom + 0.1, 5);
    onZoomChange(newZoom);
  };

  const handleZoomOut = () => {
    const newZoom = Math.max(zoom - 0.1, 0.1);
    onZoomChange(newZoom);
  };

  const handleZoomReset = () => {
    onZoomChange(1);
  };

  return (
    <div className="h-8 border-t flex items-center justify-between px-4 text-xs bg-[var(--toolbar-bg)] text-muted-foreground">
      <div className="flex items-center gap-4">
        <span>
          Canvas: {canvasWidth} × {canvasHeight}px
        </span>
        {selectedObjectCount > 0 && (
          <>
            <div className="h-4 w-px bg-border" />
            <span>
              {selectedObjectCount} object{selectedObjectCount !== 1 ? 's' : ''} selected
            </span>
          </>
        )}
        {cursorPosition && (
          <>
            <div className="h-4 w-px bg-border" />
            <span>
              X: {Math.round(cursorPosition.x)} Y: {Math.round(cursorPosition.y)}
            </span>
          </>
        )}
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6"
          onClick={handleZoomOut}
        >
          <ZoomOut className="h-3 w-3" />
        </Button>
        
        <div className="w-24">
          <Slider
            value={[zoom]}
            onValueChange={([value]) => onZoomChange(value)}
            min={0.1}
            max={5}
            step={0.1}
            className="cursor-pointer"
          />
        </div>
        
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6"
          onClick={handleZoomIn}
        >
          <ZoomIn className="h-3 w-3" />
        </Button>
        
        <button
          onClick={handleZoomReset}
          className="min-w-12 text-center hover:text-foreground px-2 py-1 rounded hover:bg-accent"
        >
          {zoomPercentage}%
        </button>
      </div>
    </div>
  );
}
