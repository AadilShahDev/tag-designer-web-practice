export type DrawingTool = 
  | 'pointer'
  | 'text'
  | 'rectangle'
  | 'circle'
  | 'line'
  | 'pencil';

export interface CanvasObject {
  id: string;
  type: string;
  left: number;
  top: number;
  width: number;
  height: number;
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  angle?: number;
  scaleX?: number;
  scaleY?: number;
  text?: string;
  fontSize?: number;
  fontFamily?: string;
  fontWeight?: string;
  fontStyle?: string;
  textAlign?: string;
}

export interface Template {
  id: string;
  name: string;
  description?: string;
  width: number;
  height: number;
  canvas: string; // JSON stringified canvas data
  thumbnail?: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  token: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface TemplateListResponse {
  templates: Template[];
  total: number;
}

export interface ShapeTemplate {
  id: string;
  name: string;
  category: string;
  svg: string;
  thumbnail?: string;
}

export interface DesignerState {
  currentTool: DrawingTool;
  selectedObject: any;
  zoom: number;
  showGrid: boolean;
  snapToGrid: boolean;
  gridSize: number;
  canvasWidth: number;
  canvasHeight: number;
  isDirty: boolean;
  currentTemplate?: Template;
}

export interface HistoryState {
  canUndo: boolean;
  canRedo: boolean;
}

export interface ExportOptions {
  format: 'pdf' | 'png' | 'jpg' | 'svg';
  quality?: number;
  scale?: number;
}
