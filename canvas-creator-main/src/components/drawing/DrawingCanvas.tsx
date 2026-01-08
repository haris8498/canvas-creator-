import React, { useRef, useEffect, useState, useCallback } from 'react';

interface DrawingCanvasProps {
  color: string;
  brushSize: number;
  tool: 'brush' | 'eraser';
  onHistoryChange: (canUndo: boolean, canRedo: boolean) => void;
  undoTrigger: number;
  redoTrigger: number;
  clearTrigger: number;
  onCanvasReady: (canvas: HTMLCanvasElement) => void;
}

interface HistoryState {
  past: ImageData[];
  future: ImageData[];
}

const DrawingCanvas: React.FC<DrawingCanvasProps> = ({
  color,
  brushSize,
  tool,
  onHistoryChange,
  undoTrigger,
  redoTrigger,
  clearTrigger,
  onCanvasReady,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [history, setHistory] = useState<HistoryState>({ past: [], future: [] });
  const lastPos = useRef<{ x: number; y: number } | null>(null);

  const getContext = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    return canvas.getContext('2d');
  }, []);

  const saveToHistory = useCallback(() => {
    const ctx = getContext();
    const canvas = canvasRef.current;
    if (!ctx || !canvas) return;

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    setHistory(prev => ({
      past: [...prev.past.slice(-20), imageData],
      future: [],
    }));
  }, [getContext]);

  // Initialize canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      const ctx = canvas.getContext('2d');
      
      // Save current content
      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = canvas.width;
      tempCanvas.height = canvas.height;
      const tempCtx = tempCanvas.getContext('2d');
      if (tempCtx && canvas.width > 0 && canvas.height > 0) {
        tempCtx.drawImage(canvas, 0, 0);
      }

      // Resize
      canvas.width = rect.width;
      canvas.height = rect.height;

      // Restore content
      if (ctx && tempCanvas.width > 0 && tempCanvas.height > 0) {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(tempCanvas, 0, 0);
      }
    };

    resizeCanvas();
    onCanvasReady(canvas);

    // Fill with white initially
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      saveToHistory();
    }

    window.addEventListener('resize', resizeCanvas);
    return () => window.removeEventListener('resize', resizeCanvas);
  }, [onCanvasReady, saveToHistory]);

  // Update history state notification
  useEffect(() => {
    onHistoryChange(history.past.length > 1, history.future.length > 0);
  }, [history, onHistoryChange]);

  // Undo
  useEffect(() => {
    if (undoTrigger === 0) return;
    const ctx = getContext();
    const canvas = canvasRef.current;
    if (!ctx || !canvas || history.past.length <= 1) return;

    const currentState = history.past[history.past.length - 1];
    const previousState = history.past[history.past.length - 2];

    ctx.putImageData(previousState, 0, 0);
    setHistory(prev => ({
      past: prev.past.slice(0, -1),
      future: [currentState, ...prev.future],
    }));
  }, [undoTrigger, getContext, history.past]);

  // Redo
  useEffect(() => {
    if (redoTrigger === 0) return;
    const ctx = getContext();
    const canvas = canvasRef.current;
    if (!ctx || !canvas || history.future.length === 0) return;

    const nextState = history.future[0];
    ctx.putImageData(nextState, 0, 0);
    setHistory(prev => ({
      past: [...prev.past, nextState],
      future: prev.future.slice(1),
    }));
  }, [redoTrigger, getContext, history.future]);

  // Clear canvas
  useEffect(() => {
    if (clearTrigger === 0) return;
    const ctx = getContext();
    const canvas = canvasRef.current;
    if (!ctx || !canvas) return;

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    saveToHistory();
  }, [clearTrigger, getContext, saveToHistory]);

  const getPosition = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    
    if ('touches' in e) {
      const touch = e.touches[0];
      return {
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top,
      };
    }
    
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    const pos = getPosition(e);
    lastPos.current = pos;
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    e.preventDefault();

    const ctx = getContext();
    if (!ctx || !lastPos.current) return;

    const pos = getPosition(e);

    ctx.beginPath();
    ctx.moveTo(lastPos.current.x, lastPos.current.y);
    ctx.lineTo(pos.x, pos.y);
    ctx.strokeStyle = tool === 'eraser' ? '#ffffff' : color;
    ctx.lineWidth = brushSize;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();

    lastPos.current = pos;
  };

  const stopDrawing = () => {
    if (isDrawing) {
      saveToHistory();
    }
    setIsDrawing(false);
    lastPos.current = null;
  };

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full cursor-crosshair touch-none"
      onMouseDown={startDrawing}
      onMouseMove={draw}
      onMouseUp={stopDrawing}
      onMouseLeave={stopDrawing}
      onTouchStart={startDrawing}
      onTouchMove={draw}
      onTouchEnd={stopDrawing}
    />
  );
};

export default DrawingCanvas;
