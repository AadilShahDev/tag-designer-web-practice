'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Download, FileImage, FileText, Loader2 } from 'lucide-react';
import { ExportOptions } from '@/types/designer';

interface ExportModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onExport: (options: ExportOptions) => Promise<void>;
}

export default function ExportModal({
  open,
  onOpenChange,
  onExport,
}: ExportModalProps) {
  const [format, setFormat] = useState<'pdf' | 'png' | 'jpg' | 'svg'>('pdf');
  const [quality, setQuality] = useState(100);
  const [scale, setScale] = useState(1);
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      await onExport({
        format,
        quality: quality / 100,
        scale,
      });
      onOpenChange(false);
    } catch (error) {
      console.error('Export error:', error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Export Design</DialogTitle>
          <DialogDescription>
            Choose your export format and quality settings
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <Label>Export Format</Label>
            <Select value={format} onValueChange={(value: any) => setFormat(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pdf">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    <span>PDF Document</span>
                  </div>
                </SelectItem>
                <SelectItem value="png">
                  <div className="flex items-center gap-2">
                    <FileImage className="h-4 w-4" />
                    <span>PNG Image</span>
                  </div>
                </SelectItem>
                <SelectItem value="jpg">
                  <div className="flex items-center gap-2">
                    <FileImage className="h-4 w-4" />
                    <span>JPG Image</span>
                  </div>
                </SelectItem>
                <SelectItem value="svg">
                  <div className="flex items-center gap-2">
                    <FileImage className="h-4 w-4" />
                    <span>SVG Vector</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {(format === 'png' || format === 'jpg') && (
            <div className="space-y-2">
              <Label>Quality: {quality}%</Label>
              <Slider
                value={[quality]}
                onValueChange={([value]) => setQuality(value)}
                min={10}
                max={100}
                step={10}
              />
              <p className="text-xs text-muted-foreground">
                Higher quality means larger file size
              </p>
            </div>
          )}

          <div className="space-y-2">
            <Label>Scale: {scale}x</Label>
            <Slider
              value={[scale]}
              onValueChange={([value]) => setScale(value)}
              min={0.5}
              max={4}
              step={0.5}
            />
            <p className="text-xs text-muted-foreground">
              Scale the export resolution (1x = original size)
            </p>
          </div>

          <div className="rounded-lg bg-muted p-4 space-y-1">
            <p className="text-sm font-medium">Preview Info</p>
            <p className="text-xs text-muted-foreground">
              Format: <span className="font-medium">{format.toUpperCase()}</span>
            </p>
            {(format === 'png' || format === 'jpg') && (
              <p className="text-xs text-muted-foreground">
                Quality: <span className="font-medium">{quality}%</span>
              </p>
            )}
            <p className="text-xs text-muted-foreground">
              Scale: <span className="font-medium">{scale}x</span>
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleExport} disabled={isExporting}>
            {isExporting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Exporting...
              </>
            ) : (
              <>
                <Download className="h-4 w-4 mr-2" />
                Export
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
