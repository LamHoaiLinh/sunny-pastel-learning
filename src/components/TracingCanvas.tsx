import { useEffect, useRef, useState } from 'react';
import type { PointerEvent } from 'react';

interface TracingCanvasProps {
  target: string;
  onComplete?: () => void;
}

const TracingCanvas = ({ target, onComplete }: TracingCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const drawingRef = useRef(false);
  const [drawPoints, setDrawPoints] = useState(0);
  const [message, setMessage] = useState('Tô theo nét mờ rồi bấm hoàn thành nhé.');

  const resizeCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const ratio = window.devicePixelRatio || 1;
    canvas.width = Math.floor(rect.width * ratio);
    canvas.height = Math.floor(rect.height * ratio);
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.scale(ratio, ratio);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth = 18;
    ctx.strokeStyle = '#C8A2C8';
  };

  useEffect(() => {
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    return () => window.removeEventListener('resize', resizeCanvas);
  }, [target]);

  const getPoint = (event: PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    return { x: event.clientX - rect.left, y: event.clientY - rect.top };
  };

  const startDrawing = (event: PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;
    canvas.setPointerCapture(event.pointerId);
    drawingRef.current = true;
    const p = getPoint(event);
    ctx.beginPath();
    ctx.moveTo(p.x, p.y);
    setDrawPoints((points) => points + 1);
  };

  const draw = (event: PointerEvent<HTMLCanvasElement>) => {
    if (!drawingRef.current) return;
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;
    const p = getPoint(event);
    ctx.lineTo(p.x, p.y);
    ctx.stroke();
    setDrawPoints((points) => points + 1);
  };

  const stopDrawing = () => {
    drawingRef.current = false;
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setDrawPoints(0);
    setMessage('Đã xóa nét. Sunny tô lại thật chậm nhé.');
  };

  const complete = () => {
    if (drawPoints < 22) {
      setMessage('Gần đúng rồi! Sunny tô thêm một chút nữa nhé.');
      return;
    }
    setMessage('Sunny tô tốt lắm!');
    onComplete?.();
  };

  return (
    <div className="tracing-panel">
      <div className="tracing-board">
        <div className="trace-target" aria-hidden="true">{target}</div>
        <canvas
          ref={canvasRef}
          className="trace-canvas"
          onPointerDown={startDrawing}
          onPointerMove={draw}
          onPointerUp={stopDrawing}
          onPointerCancel={stopDrawing}
        />
      </div>
      <p className="feedback-text">{message}</p>
      <div className="row-actions">
        <button className="secondary-button" onClick={clearCanvas} type="button">Xóa nét</button>
        <button className="primary-button" onClick={complete} type="button">Hoàn thành</button>
      </div>
    </div>
  );
};

export default TracingCanvas;
