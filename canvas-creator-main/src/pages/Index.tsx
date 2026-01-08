import React, { useState, useCallback, useRef } from 'react';
import DrawingCanvas from '@/components/drawing/DrawingCanvas';
import Toolbar from '@/components/drawing/Toolbar';

const Index = () => {
  const [color, setColor] = useState('#000000');
  const [brushSize, setBrushSize] = useState(8);
  const [tool, setTool] = useState<'brush' | 'eraser'>('brush');
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const [undoTrigger, setUndoTrigger] = useState(0);
  const [redoTrigger, setRedoTrigger] = useState(0);
  const [clearTrigger, setClearTrigger] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const handleHistoryChange = useCallback((undo: boolean, redo: boolean) => {
    setCanUndo(undo);
    setCanRedo(redo);
  }, []);

  const handleUndo = () => setUndoTrigger((t) => t + 1);
  const handleRedo = () => setRedoTrigger((t) => t + 1);
  const handleClear = () => setClearTrigger((t) => t + 1);

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement('a');
    link.download = 'my-drawing.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  const handleCanvasReady = useCallback((canvas: HTMLCanvasElement) => {
    canvasRef.current = canvas;
  }, []);

  return (
    <div className="h-screen w-screen bg-muted overflow-hidden relative">
      <Toolbar
        color={color}
        onColorChange={setColor}
        brushSize={brushSize}
        onBrushSizeChange={setBrushSize}
        tool={tool}
        onToolChange={setTool}
        canUndo={canUndo}
        canRedo={canRedo}
        onUndo={handleUndo}
        onRedo={handleRedo}
        onClear={handleClear}
        onDownload={handleDownload}
      />
      <div className="absolute inset-4 top-20 bg-white rounded-xl shadow-lg overflow-hidden">
        <DrawingCanvas
          color={color}
          brushSize={brushSize}
          tool={tool}
          onHistoryChange={handleHistoryChange}
          undoTrigger={undoTrigger}
          redoTrigger={redoTrigger}
          clearTrigger={clearTrigger}
          onCanvasReady={handleCanvasReady}
        />
      </div>
    </div>
  );
};

export default Index;
