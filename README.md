# Tag Designer - Professional Canvas-Based Design Tool

A powerful, web-based tag designer application built with Next.js 15, Fabric.js, and modern UI components. Create stunning tag designs with an intuitive interface featuring comprehensive drawing tools, template management, and multi-format export capabilities.

## 🚀 Features

### Core Drawing Tools
- **6 Drawing Tools**: Pointer (Select), Text, Rectangle, Circle, Line, and Pencil
- **Object Manipulation**: Move, resize, rotate, and transform objects with precision
- **Keyboard Shortcuts**: Quick tool switching and commands for power users
- **Undo/Redo**: Full history management with keyboard shortcuts (Ctrl+Z, Ctrl+Y)
- **Object Nudging**: Arrow keys for pixel-perfect positioning (Shift for 10px steps)

### Canvas Features
- **Interactive Canvas**: 800x600px default canvas with customizable dimensions
- **Grid System**: Visual grid overlay for better alignment
- **Zoom Controls**: Adjustable zoom from 10% to 500%
- **Real-time Cursor Position**: Live coordinate tracking in status bar
- **Auto-save**: Automatic template saving after 5 seconds of inactivity

### Properties Panel
- **Position & Size**: Precise numeric inputs for X, Y, width, and height
- **Rotation**: 360° rotation slider with degree display
- **Text Formatting**: Font family, size, bold, italic, and underline
- **Color Controls**: Fill and stroke color pickers with hex input
- **Opacity**: Adjustable transparency from 0-100%
- **Stroke Width**: Customizable border thickness

### Shape Gallery
- **12+ Predefined Shapes**: Stars, triangles, hearts, arrows, hexagons, and more
- **Category Filtering**: Basic, shapes, and arrows categories
- **Search Functionality**: Quick shape discovery
- **Image Upload**: Support for PNG, JPG, SVG, and GIF files
- **Smart Scaling**: Automatic image sizing to fit canvas

### Template Management
- **Save Templates**: Store designs locally with metadata
- **Load Templates**: Quick access to saved designs
- **Template List**: Visual grid with search and delete options
- **Canvas Serialization**: Complete state preservation including all objects

### Export Capabilities
- **PDF Export**: High-quality PDF generation with jsPDF
- **PNG Export**: Raster export with quality settings
- **JPG Export**: Compressed image format with adjustable quality
- **SVG Export**: Vector format for scalable graphics
- **Quality Controls**: 10-100% quality slider for raster formats
- **Scale Options**: 0.5x to 4x resolution multiplier

### Authentication
- **Login/Register**: Full authentication flow (UI ready for API integration)
- **Guest Access**: No-account-required option for quick access
- **Token Management**: Secure storage with localStorage
- **Protected Routes**: Authentication state management

## 🎨 User Interface

### Layout Structure
- **Header**: Template name, save/load/export actions, and user menu
- **Left Toolbar**: Vertical tool palette with icons and tooltips
- **Canvas Area**: Centered workspace with shadow and grid
- **Right Panel**: Context-sensitive properties for selected objects
- **Status Bar**: Zoom controls, canvas dimensions, and cursor position

### Keyboard Shortcuts
- `V` - Select/Pointer tool
- `T` - Text tool
- `R` - Rectangle tool
- `C` - Circle tool
- `L` - Line tool
- `P` - Pencil tool
- `Ctrl+Z` - Undo
- `Ctrl+Shift+Z` / `Ctrl+Y` - Redo
- `Ctrl+D` - Duplicate selected object
- `Ctrl+S` - Save template
- `Delete` / `Backspace` - Delete selected object
- `Arrow Keys` - Nudge object (add Shift for 10px)

## 🛠️ Technical Stack

- **Framework**: Next.js 15 (App Router)
- **UI Library**: React 18 with TypeScript
- **Canvas Engine**: Fabric.js 6.9.0
- **PDF Generation**: jsPDF 3.0.3
- **Component Library**: Shadcn/UI
- **Styling**: Tailwind CSS v4
- **Icons**: Lucide React
- **Notifications**: Sonner (toast notifications)
- **State Management**: React Hooks (useState, useRef, useEffect)

## 🚦 Getting Started

### Prerequisites
- Node.js 18+ or Bun
- npm, yarn, pnpm, or bun package manager

### Installation

1. Install dependencies:
```bash
npm install
# or
bun install
```

2. Run the development server:
```bash
npm run dev
# or
bun dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

The application will automatically redirect to `/designer` where you can start creating designs.

## 💡 Usage Examples

### Creating a Basic Tag Design

1. **Start Fresh**: Click "New" to create a blank canvas
2. **Add Shapes**: Click rectangle tool (R) or use Shape Gallery
3. **Add Text**: Click text tool (T) and click on canvas
4. **Customize**: Use properties panel to adjust colors, sizes, and positions
5. **Save**: Click "Save" or press Ctrl+S to save your template
6. **Export**: Click "Export" to download as PDF, PNG, JPG, or SVG

### Working with Templates

1. **Save Current Design**: Name your template and click Save
2. **Load Template**: Click "Open" to browse saved templates
3. **Delete Template**: Hover over template card and click trash icon
4. **Auto-save**: Changes automatically save after 5 seconds

## 📁 Project Structure

```
src/
├── app/
│   ├── designer/          # Main designer page
│   ├── login/            # Authentication page
│   ├── page.tsx          # Home redirect
│   ├── layout.tsx        # Root layout
│   └── globals.css       # Global styles
├── components/
│   ├── designer/
│   │   ├── Header.tsx              # Top navigation bar
│   │   ├── DrawingToolbar.tsx      # Left tool palette
│   │   ├── PropertiesPanel.tsx     # Right properties panel
│   │   ├── StatusBar.tsx           # Bottom status bar
│   │   ├── ShapeGallery.tsx        # Shape picker modal
│   │   ├── TemplateListModal.tsx   # Template browser
│   │   └── ExportModal.tsx         # Export options dialog
│   └── ui/               # Shadcn UI components
├── services/
│   ├── AuthService.ts    # Authentication logic
│   └── TemplateService.ts # Template CRUD operations
└── types/
    └── designer.ts       # TypeScript type definitions
```

## 🎯 API Integration (Ready)

The application includes service classes ready for backend integration:

### AuthService
- `login(email, password)` - User authentication
- `register(email, password, name)` - Account creation
- `logout()` - Clear session
- `isAuthenticated()` - Check auth status

### TemplateService
- `listTemplates(page, limit)` - Fetch template list
- `getTemplate(id)` - Load specific template
- `createTemplate(template)` - Save new template
- `updateTemplate(id, template)` - Update existing
- `deleteTemplate(id)` - Remove template

---

**Built with ❤️ using Next.js, Fabric.js, and Shadcn/UI**