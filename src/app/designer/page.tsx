'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import * as fabric from 'fabric';
import jsPDF from 'jspdf';
import Header from '@/components/designer/Header';
import DrawingToolbar from '@/components/designer/DrawingToolbar';
import PropertiesPanel from '@/components/designer/PropertiesPanel';
import StatusBar from '@/components/designer/StatusBar';
import ShapeGallery from '@/components/designer/ShapeGallery';
import TemplateListModal from '@/components/designer/TemplateListModal';
import ExportModal from '@/components/designer/ExportModal';
import { DrawingTool, DesignerState, Template, ShapeTemplate, ExportOptions } from '@/types/designer';
import TemplateService from '@/services/TemplateService';
import { useToast } from '@/hooks/use-toast';
import { Toaster } from '@/components/ui/sonner';
import { toast as sonnerToast } from 'sonner';

export default function DesignerPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricCanvasRef = useRef<fabric.Canvas | null>(null);
  const [state, setState] = useState<DesignerState>({
    currentTool: 'pointer',
    selectedObject: null,
    zoom: 1,
    showGrid: true,
    snapToGrid: false,
    gridSize: 20,
    canvasWidth: 800,
    canvasHeight: 600,
    isDirty: false,
  });
  const [templateName, setTemplateName] = useState('Untitled Template');
  const [isSaving, setIsSaving] = useState(false);
  const [history, setHistory] = useState<string[]>([]);
  const [historyStep, setHistoryStep] = useState(-1);
  const [cursorPosition, setCursorPosition] = useState<{ x: number; y: number }>();
  const [showShapeGallery, setShowShapeGallery] = useState(false);
  const [showTemplateList, setShowTemplateList] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  
  const isDrawing = useRef(false);
  const drawingObject = useRef<fabric.Object | null>(null);
  const templateService = TemplateService.getInstance();
  const autoSaveTimeoutRef = useRef<NodeJS.Timeout>();

  // Initialize Fabric.js canvas
  useEffect(() => {
    if (!canvasRef.current || fabricCanvasRef.current) return;

    const canvas = new fabric.Canvas(canvasRef.current, {
      width: state.canvasWidth,
      height: state.canvasHeight,
      backgroundColor: '#ffffff',
      selection: state.currentTool === 'pointer',
    });

    fabricCanvasRef.current = canvas;

    // Add grid background
    if (state.showGrid) {
      drawGrid(canvas);
    }

    // Save initial state
    saveHistory(canvas);

    // Event listeners
    canvas.on('selection:created', handleSelection);
    canvas.on('selection:updated', handleSelection);
    canvas.on('selection:cleared', () => {
      setState(prev => ({ ...prev, selectedObject: null }));
    });
    canvas.on('object:modified', () => {
      markDirty();
      saveHistory(canvas);
    });
    canvas.on('mouse:move', (e) => {
      if (e.pointer) {
        setCursorPosition({ x: e.pointer.x, y: e.pointer.y });
      }
    });

    // Mouse events for drawing
    canvas.on('mouse:down', handleMouseDown);
    canvas.on('mouse:move', handleMouseMove);
    canvas.on('mouse:up', handleMouseUp);

    return () => {
      canvas.dispose();
      fabricCanvasRef.current = null;
    };
  }, []);

  // Update canvas selection mode when tool changes
  useEffect(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;

    canvas.selection = state.currentTool === 'pointer';
    canvas.defaultCursor = state.currentTool === 'pointer' ? 'default' : 'crosshair';
    canvas.hoverCursor = state.currentTool === 'pointer' ? 'move' : 'crosshair';
    
    // Disable drawing mode if switching away from pencil
    if (state.currentTool !== 'pencil') {
      canvas.isDrawingMode = false;
    }
    
    if (state.currentTool !== 'pointer') {
      canvas.discardActiveObject();
      canvas.renderAll();
    }
  }, [state.currentTool]);

  const drawGrid = (canvas: fabric.Canvas) => {
    const gridSize = state.gridSize;
    const width = canvas.getWidth();
    const height = canvas.getHeight();

    for (let i = 0; i < width / gridSize; i++) {
      canvas.add(new fabric.Line([i * gridSize, 0, i * gridSize, height], {
        stroke: '#e0e0e0',
        strokeWidth: 1,
        selectable: false,
        evented: false,
      }));
    }

    for (let i = 0; i < height / gridSize; i++) {
      canvas.add(new fabric.Line([0, i * gridSize, width, i * gridSize], {
        stroke: '#e0e0e0',
        strokeWidth: 1,
        selectable: false,
        evented: false,
      }));
    }
  };

  const handleSelection = (e: any) => {
    const activeObject = e.selected?.[0] || e.target;
    setState(prev => ({ ...prev, selectedObject: activeObject }));
  };

  const handleMouseDown = (e: fabric.IEvent) => {
    const canvas = fabricCanvasRef.current;
    if (!canvas || !e.pointer || state.currentTool === 'pointer') return;

    isDrawing.current = true;
    const pointer = canvas.getPointer(e.e);

    switch (state.currentTool) {
      case 'rectangle':
        drawingObject.current = new fabric.Rect({
          left: pointer.x,
          top: pointer.y,
          width: 0,
          height: 0,
          fill: 'rgba(99, 102, 241, 0.3)',
          stroke: '#6366F1',
          strokeWidth: 2,
        });
        canvas.add(drawingObject.current);
        break;

      case 'circle':
        drawingObject.current = new fabric.Circle({
          left: pointer.x,
          top: pointer.y,
          radius: 0,
          fill: 'rgba(16, 185, 129, 0.3)',
          stroke: '#10B981',
          strokeWidth: 2,
        });
        canvas.add(drawingObject.current);
        break;

      case 'line':
        drawingObject.current = new fabric.Line([pointer.x, pointer.y, pointer.x, pointer.y], {
          stroke: '#000000',
          strokeWidth: 2,
        });
        canvas.add(drawingObject.current);
        break;

      case 'text':
        const text = new fabric.Textbox('Double click to edit', {
          left: pointer.x,
          top: pointer.y,
          width: 200,
          fontSize: 20,
          fill: '#000000',
        });
        canvas.add(text);
        canvas.setActiveObject(text);
        text.enterEditing();
        isDrawing.current = false;
        setState(prev => ({ ...prev, currentTool: 'pointer', selectedObject: text }));
        markDirty();
        saveHistory(canvas);
        break;

      case 'pencil':
        // Drawing mode should already be enabled from handleToolChange
        // No need to set brush properties here
        break;
    }
  };

  const handleMouseMove = (e: fabric.IEvent) => {
    const canvas = fabricCanvasRef.current;
    if (!canvas || !isDrawing.current || !drawingObject.current || !e.pointer) return;

    const pointer = canvas.getPointer(e.e);
    const obj = drawingObject.current;

    switch (state.currentTool) {
      case 'rectangle':
        if (obj.type === 'rect') {
          const rect = obj as fabric.Rect;
          const startX = rect.left || 0;
          const startY = rect.top || 0;
          
          if (pointer.x < startX) {
            rect.set({ left: pointer.x });
          }
          if (pointer.y < startY) {
            rect.set({ top: pointer.y });
          }
          
          rect.set({
            width: Math.abs(pointer.x - startX),
            height: Math.abs(pointer.y - startY),
          });
        }
        break;

      case 'circle':
        if (obj.type === 'circle') {
          const circle = obj as fabric.Circle;
          const startX = circle.left || 0;
          const startY = circle.top || 0;
          const radius = Math.sqrt(
            Math.pow(pointer.x - startX, 2) +
            Math.pow(pointer.y - startY, 2)
          );
          circle.set({ radius });
        }
        break;

      case 'line':
        if (obj.type === 'line') {
          const line = obj as fabric.Line;
          line.set({ x2: pointer.x, y2: pointer.y });
        }
        break;
    }

    canvas.renderAll();
  };

  const handleMouseUp = () => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;

    if (isDrawing.current && drawingObject.current) {
      // Select the newly created object and switch to pointer tool
      canvas.setActiveObject(drawingObject.current);
      setState(prev => ({ 
        ...prev, 
        currentTool: 'pointer',
        selectedObject: drawingObject.current 
      }));
      markDirty();
      saveHistory(canvas);
    }

    if (state.currentTool === 'pencil') {
      canvas.isDrawingMode = false;
      setTimeout(() => {
        saveHistory(canvas);
        markDirty();
        setState(prev => ({ ...prev, currentTool: 'pointer' }));
      }, 100);
    }

    isDrawing.current = false;
    drawingObject.current = null;
  };

  const saveHistory = (canvas: fabric.Canvas) => {
    const json = JSON.stringify(canvas.toJSON());
    setHistory(prev => {
      const newHistory = prev.slice(0, historyStep + 1);
      newHistory.push(json);
      return newHistory;
    });
    setHistoryStep(prev => prev + 1);
  };

  const handleUndo = () => {
    const canvas = fabricCanvasRef.current;
    if (!canvas || historyStep <= 0) return;

    const newStep = historyStep - 1;
    setHistoryStep(newStep);
    canvas.loadFromJSON(history[newStep], () => {
      canvas.renderAll();
    });
  };

  const handleRedo = () => {
    const canvas = fabricCanvasRef.current;
    if (!canvas || historyStep >= history.length - 1) return;

    const newStep = historyStep + 1;
    setHistoryStep(newStep);
    canvas.loadFromJSON(history[newStep], () => {
      canvas.renderAll();
    });
  };

  const markDirty = () => {
    setState(prev => ({ ...prev, isDirty: true }));
  };

  const handleToolChange = (tool: DrawingTool) => {
    setState(prev => ({ ...prev, currentTool: tool }));
    
    // If switching to pencil, enable drawing mode
    const canvas = fabricCanvasRef.current;
    if (canvas && tool === 'pencil') {
      canvas.isDrawingMode = true;
      // Configure brush after drawing mode is enabled
      if (canvas.freeDrawingBrush) {
        canvas.freeDrawingBrush.width = 2;
        canvas.freeDrawingBrush.color = '#000000';
      }
    } else if (canvas) {
      canvas.isDrawingMode = false;
    }
  };

  const handleDelete = () => {
    const canvas = fabricCanvasRef.current;
    if (!canvas || !state.selectedObject) return;

    canvas.remove(state.selectedObject);
    setState(prev => ({ ...prev, selectedObject: null }));
    markDirty();
    saveHistory(canvas);
  };

  const handleDuplicate = () => {
    const canvas = fabricCanvasRef.current;
    if (!canvas || !state.selectedObject) return;

    state.selectedObject.clone((cloned: fabric.Object) => {
      cloned.set({
        left: (cloned.left || 0) + 10,
        top: (cloned.top || 0) + 10,
      });
      canvas.add(cloned);
      canvas.setActiveObject(cloned);
      canvas.renderAll();
      markDirty();
      saveHistory(canvas);
    });
  };

  const handlePropertyChange = (property: string, value: any) => {
    const canvas = fabricCanvasRef.current;
    if (!canvas || !state.selectedObject) return;

    state.selectedObject.set(property, value);
    canvas.renderAll();
    setState(prev => ({ ...prev, selectedObject: state.selectedObject }));
    markDirty();
    
    // Save history for significant changes
    if (['left', 'top', 'width', 'height', 'angle'].includes(property)) {
      saveHistory(canvas);
    }
  };

  const handleZoomChange = (zoom: number) => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;

    canvas.setZoom(zoom);
    setState(prev => ({ ...prev, zoom }));
  };

  const handleSave = async () => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;

    setIsSaving(true);
    try {
      const canvasData = JSON.stringify(canvas.toJSON());
      const template: Omit<Template, 'id' | 'createdAt' | 'updatedAt' | 'userId'> = {
        name: templateName,
        width: state.canvasWidth,
        height: state.canvasHeight,
        canvas: canvasData,
      };

      // Save locally for now
      const savedTemplate: Template = {
        ...template,
        id: state.currentTemplate?.id || `template-${Date.now()}`,
        createdAt: state.currentTemplate?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        userId: 'local-user',
      };

      await templateService.saveTemplateLocally(savedTemplate);
      setState(prev => ({ ...prev, isDirty: false, currentTemplate: savedTemplate }));
      sonnerToast.success('Template saved successfully!');
    } catch (error) {
      sonnerToast.error('Failed to save template');
      console.error('Save error:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleLoad = () => {
    setShowTemplateList(true);
  };

  const handleExport = () => {
    setShowExportModal(true);
  };

  const handleExportWithOptions = async (options: ExportOptions) => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;

    try {
      const { format, quality = 1, scale = 1 } = options;

      // Temporarily hide grid for export
      const gridObjects = canvas.getObjects().filter(
        (obj) => !obj.selectable && !obj.evented
      );
      gridObjects.forEach((obj) => obj.set('opacity', 0));
      canvas.renderAll();

      if (format === 'pdf') {
        // Export as PDF
        const dataUrl = canvas.toDataURL({
          format: 'png',
          quality: 1,
          multiplier: scale,
        });

        const pdf = new jsPDF({
          orientation: state.canvasWidth > state.canvasHeight ? 'landscape' : 'portrait',
          unit: 'px',
          format: [state.canvasWidth, state.canvasHeight],
        });

        pdf.addImage(dataUrl, 'PNG', 0, 0, state.canvasWidth, state.canvasHeight);
        pdf.save(`${templateName || 'design'}.pdf`);
        sonnerToast.success('PDF exported successfully!');
      } else if (format === 'svg') {
        // Export as SVG
        const svg = canvas.toSVG();
        const blob = new Blob([svg], { type: 'image/svg+xml' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${templateName || 'design'}.svg`;
        link.click();
        URL.revokeObjectURL(url);
        sonnerToast.success('SVG exported successfully!');
      } else {
        // Export as PNG or JPG
        const dataUrl = canvas.toDataURL({
          format: format === 'jpg' ? 'jpeg' : 'png',
          quality,
          multiplier: scale,
        });

        const link = document.createElement('a');
        link.href = dataUrl;
        link.download = `${templateName || 'design'}.${format}`;
        link.click();
        sonnerToast.success(`${format.toUpperCase()} exported successfully!`);
      }

      // Restore grid
      gridObjects.forEach((obj) => obj.set('opacity', 1));
      canvas.renderAll();
    } catch (error) {
      sonnerToast.error('Export failed');
      console.error('Export error:', error);
    }
  };

  // Auto-save functionality
  useEffect(() => {
    if (!state.isDirty || !state.currentTemplate) return;

    // Clear existing timeout
    if (autoSaveTimeoutRef.current) {
      clearTimeout(autoSaveTimeoutRef.current);
    }

    // Set new timeout for auto-save (5 seconds after last change)
    autoSaveTimeoutRef.current = setTimeout(() => {
      handleSave();
    }, 5000);

    return () => {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }
    };
  }, [state.isDirty, state.currentTemplate]);

  const handleNew = () => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;

    if (state.isDirty && !confirm('You have unsaved changes. Create new template?')) {
      return;
    }

    canvas.clear();
    canvas.backgroundColor = '#ffffff';
    if (state.showGrid) {
      drawGrid(canvas);
    }
    setTemplateName('Untitled Template');
    setState(prev => ({ 
      ...prev, 
      isDirty: false, 
      currentTemplate: undefined,
      selectedObject: null,
    }));
    setHistory([]);
    setHistoryStep(-1);
    saveHistory(canvas);
    canvas.renderAll();
  };

  const handleShapeSelect = (shape: ShapeTemplate) => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;

    // Parse SVG and add to canvas
    fabric.loadSVGFromString(shape.svg, (objects, options) => {
      const obj = fabric.util.groupSVGElements(objects, options);
      obj.set({
        left: canvas.getWidth() / 2 - (obj.width || 0) / 2,
        top: canvas.getHeight() / 2 - (obj.height || 0) / 2,
        scaleX: 1,
        scaleY: 1,
      });
      canvas.add(obj);
      canvas.setActiveObject(obj);
      canvas.renderAll();
      setState(prev => ({ ...prev, selectedObject: obj, currentTool: 'pointer' }));
      markDirty();
      saveHistory(canvas);
    });
  };

  const handleImageUpload = (file: File) => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      fabric.FabricImage.fromURL(dataUrl).then((img) => {
        // Scale image to fit canvas if it's too large
        const maxWidth = canvas.getWidth() * 0.5;
        const maxHeight = canvas.getHeight() * 0.5;
        const scale = Math.min(maxWidth / (img.width || 1), maxHeight / (img.height || 1), 1);
        
        img.set({
          left: 100,
          top: 100,
          scaleX: scale,
          scaleY: scale,
        });
        
        canvas.add(img);
        canvas.setActiveObject(img);
        canvas.renderAll();
        markDirty();
        saveHistory(canvas);
      });
    };
    reader.readAsDataURL(file);
  };

  const handleTemplateLoad = (template: Template) => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;

    if (state.isDirty && !confirm('You have unsaved changes. Load template?')) {
      return;
    }

    try {
      canvas.loadFromJSON(template.canvas, () => {
        canvas.renderAll();
        setTemplateName(template.name);
        setState(prev => ({ 
          ...prev, 
          isDirty: false, 
          currentTemplate: template,
          canvasWidth: template.width,
          canvasHeight: template.height,
        }));
        canvas.setWidth(template.width);
        canvas.setHeight(template.height);
        setHistory([]);
        setHistoryStep(-1);
        saveHistory(canvas);
        sonnerToast.success('Template loaded successfully!');
      });
    } catch (error) {
      sonnerToast.error('Failed to load template');
      console.error('Load template error:', error);
    }
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const canvas = fabricCanvasRef.current;
      if (!canvas) return;

      // Check if user is typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      const activeObject = canvas.getActiveObject();

      // Tool shortcuts
      if (!e.ctrlKey && !e.metaKey) {
        switch (e.key.toLowerCase()) {
          case 'v':
            handleToolChange('pointer');
            e.preventDefault();
            break;
          case 't':
            handleToolChange('text');
            e.preventDefault();
            break;
          case 'r':
            handleToolChange('rectangle');
            e.preventDefault();
            break;
          case 'c':
            handleToolChange('circle');
            e.preventDefault();
            break;
          case 'l':
            handleToolChange('line');
            e.preventDefault();
            break;
          case 'p':
            handleToolChange('pencil');
            e.preventDefault();
            break;
        }
      }

      // Delete
      if ((e.key === 'Delete' || e.key === 'Backspace') && activeObject) {
        handleDelete();
        e.preventDefault();
      }

      // Undo/Redo
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
        if (e.shiftKey) {
          handleRedo();
        } else {
          handleUndo();
        }
        e.preventDefault();
      }

      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'y') {
        handleRedo();
        e.preventDefault();
      }

      // Duplicate
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'd' && activeObject) {
        handleDuplicate();
        e.preventDefault();
      }

      // Save
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
        handleSave();
        e.preventDefault();
      }

      // Nudge with arrow keys
      if (activeObject && ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        const step = e.shiftKey ? 10 : 1;
        switch (e.key) {
          case 'ArrowUp':
            activeObject.set('top', (activeObject.top || 0) - step);
            break;
          case 'ArrowDown':
            activeObject.set('top', (activeObject.top || 0) + step);
            break;
          case 'ArrowLeft':
            activeObject.set('left', (activeObject.left || 0) - step);
            break;
          case 'ArrowRight':
            activeObject.set('left', (activeObject.left || 0) + step);
            break;
        }
        canvas.renderAll();
        markDirty();
        e.preventDefault();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [state.currentTool, state.selectedObject, historyStep, history.length]);

  return (
    <div className="flex flex-col h-screen">
      <Header
        templateName={templateName}
        onTemplateNameChange={setTemplateName}
        onSave={handleSave}
        onLoad={handleLoad}
        onExport={handleExport}
        onNew={handleNew}
        isDirty={state.isDirty}
        isSaving={isSaving}
      />
      
      <div className="flex flex-1 overflow-hidden">
        <DrawingToolbar
          currentTool={state.currentTool}
          onToolChange={handleToolChange}
          onDelete={handleDelete}
          onDuplicate={handleDuplicate}
          onUndo={handleUndo}
          onRedo={handleRedo}
          canUndo={historyStep > 0}
          canRedo={historyStep < history.length - 1}
          hasSelection={!!state.selectedObject}
        />
        
        <div className="flex-1 flex items-center justify-center bg-[var(--canvas-bg)] overflow-auto p-8">
          <div className="shadow-lg" style={{ 
            width: state.canvasWidth, 
            height: state.canvasHeight 
          }}>
            <canvas ref={canvasRef} />
          </div>
        </div>
        
        <PropertiesPanel
          selectedObject={state.selectedObject}
          onPropertyChange={handlePropertyChange}
          onOpenShapeGallery={() => setShowShapeGallery(true)}
        />
      </div>
      
      <StatusBar
        zoom={state.zoom}
        onZoomChange={handleZoomChange}
        canvasWidth={state.canvasWidth}
        canvasHeight={state.canvasHeight}
        selectedObjectCount={state.selectedObject ? 1 : 0}
        cursorPosition={cursorPosition}
      />
      
      <ShapeGallery
        open={showShapeGallery}
        onOpenChange={setShowShapeGallery}
        onShapeSelect={handleShapeSelect}
        onImageUpload={handleImageUpload}
      />
      
      <TemplateListModal
        open={showTemplateList}
        onOpenChange={setShowTemplateList}
        onTemplateSelect={handleTemplateLoad}
      />
      
      <ExportModal
        open={showExportModal}
        onOpenChange={setShowExportModal}
        onExport={handleExportWithOptions}
      />
      
      <Toaster />
    </div>
  );
}