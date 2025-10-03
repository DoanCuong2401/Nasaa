import { useEffect, useRef } from "react";

export default function StarBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Resize canvas khi đổi kích thước cửa sổ
    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    // Tạo danh sách ngôi sao
    const stars: { x: number; y: number; size: number; speed: number; opacity: number }[] = [];
    for (let i = 0; i < 200; i++) {
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 2 + 0.5,   // ngôi sao nhỏ 0.5–2.5px
        speed: Math.random() * 0.7 + 0.2, // tốc độ rơi
        opacity: Math.random()
      });
    }

    function drawStars() {
      if (!ctx) return;

      // Vẽ nền đen
      ctx.fillStyle = "black";
      ctx.fillRect(0, 0, width, height);

      // Vẽ từng ngôi sao
      stars.forEach((star) => {
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
        ctx.fill();

        // Update vị trí (rơi xuống)
        star.y += star.speed;
        if (star.y > height) {
          star.y = 0;
          star.x = Math.random() * width;
        }

        // Hiệu ứng nhấp nháy
        star.opacity += Math.random() * 0.05 - 0.025;
        if (star.opacity < 0.2) star.opacity = 0.2;
        if (star.opacity > 1) star.opacity = 1;
      });

      requestAnimationFrame(drawStars);
    }
    drawStars();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute top-0 left-0 w-full h-full -z-10 bg-black"
    />
  );
}
