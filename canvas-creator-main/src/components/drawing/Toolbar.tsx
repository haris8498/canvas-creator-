import React from 'react';
import { Paintbrush, Eraser, Undo2, Redo2, Trash2, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface ToolbarProps {
  color: string;
  onColorChange: (color: string) => void;
  brushSize: number;
  onBrushSizeChange: (size: number) => void;
  tool: 'brush' | 'eraser';
  onToolChange: (tool: 'brush' | 'eraser') => void;
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  onClear: () => void;
  onDownload: () => void;
}

const PRESET_COLORS = [
  '#000000', '#ffffff', '#ef4444', '#f97316', '#eab308',
  '#22c55e', '#06b6d4', '#3b82f6', '#8b5cf6', '#ec4899',
];

const Toolbar: React.FC<ToolbarProps> = ({
  color,
  onColorChange,
  brushSize,
  onBrushSizeChange,
  tool,
  onToolChange,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  onClear,
  onDownload,
}) => {
  return (
    <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 flex items-center gap-4 bg-background/95 backdrop-blur-sm border border-border rounded-xl px-4 py-3 shadow-lg">
      {/* Color Picker */}
      <div className="flex items-center gap-2">
        <div className="flex gap-1">
          {PRESET_COLORS.map((c) => (
            <button
              key={c}
              onClick={() => onColorChange(c)}
              className={`w-6 h-6 rounded-full border-2 transition-transform hover:scale-110 ${
                color === c ? 'border-primary scale-110' : 'border-border'
              }`}
              style={{ backgroundColor: c }}
              aria-label={`Select color ${c}`}
            />
          ))}
        </div>
        <input
          type="color"
          value={color}
          onChange={(e) => onColorChange(e.target.value)}
          className="w-8 h-8 rounded cursor-pointer border-0"
          aria-label="Custom color picker"
        />
      </div>

      <div className="w-px h-8 bg-border" />

      {/* Brush Size */}
      <div className="flex items-center gap-3">
        <div
          className="rounded-full bg-foreground"
          style={{
            width: Math.max(4, brushSize),
            height: Math.max(4, brushSize),
          }}
        />
        <Slider
          value={[brushSize]}
          onValueChange={(v) => onBrushSizeChange(v[0])}
          min={2}
          max={50}
          step={1}
          className="w-24"
        />
      </div>

      <div className="w-px h-8 bg-border" />

      {/* Tools */}
      <div className="flex gap-1">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={tool === 'brush' ? 'default' : 'ghost'}
              size="icon"
              onClick={() => onToolChange('brush')}
            >
              <Paintbrush className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Brush</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={tool === 'eraser' ? 'default' : 'ghost'}
              size="icon"
              onClick={() => onToolChange('eraser')}
            >
              <Eraser className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Eraser</TooltipContent>
        </Tooltip>
      </div>

      <div className="w-px h-8 bg-border" />

      {/* Undo/Redo */}
      <div className="flex gap-1">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={onUndo}
              disabled={!canUndo}
            >
              <Undo2 className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Undo</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={onRedo}
              disabled={!canRedo}
            >
              <Redo2 className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Redo</TooltipContent>
        </Tooltip>
      </div>

      <div className="w-px h-8 bg-border" />

      {/* Clear & Download */}
      <div className="flex gap-1">
        <AlertDialog>
          <Tooltip>
            <TooltipTrigger asChild>
              <AlertDialogTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
            </TooltipTrigger>
            <TooltipContent>Clear Canvas</TooltipContent>
          </Tooltip>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Clear canvas?</AlertDialogTitle>
              <AlertDialogDescription>
                This will erase your entire drawing. This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={onClear}>Clear</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" onClick={onDownload}>
              <Download className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Download Image</TooltipContent>
        </Tooltip>
      </div>
    </div>
  );
};

export default Toolbar;
