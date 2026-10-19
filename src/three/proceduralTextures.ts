import * as THREE from 'three';

/**
 * Procedural HTML5 2D Canvas textures for Three.js PBR materials.
 * Guaranteed zero 404 network dependencies.
 */

// 1. Royal Indian Velvet Mandala Carpet Texture
export function createMandalaCarpetTexture(renderer: THREE.WebGLRenderer): THREE.CanvasTexture {
  const size = 1024;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  // Deep royal crimson base
  const bgGrad = ctx.createRadialGradient(size / 2, size / 2, 50, size / 2, size / 2, size / 2);
  bgGrad.addColorStop(0, '#58081a');
  bgGrad.addColorStop(0.6, '#3a040e');
  bgGrad.addColorStop(1, '#1e0106');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, size, size);

  // Outer ornate gold filigree border
  ctx.strokeStyle = '#d4af37';
  ctx.lineWidth = 14;
  ctx.strokeRect(30, 30, size - 60, size - 60);

  ctx.strokeStyle = '#f5d77f';
  ctx.lineWidth = 4;
  ctx.strokeRect(48, 48, size - 96, size - 96);

  // Corner motifs
  const corners = [
    [50, 50],
    [size - 50, 50],
    [50, size - 50],
    [size - 50, size - 50]
  ];
  corners.forEach(([cx, cy]) => {
    ctx.save();
    ctx.translate(cx, cy);
    ctx.strokeStyle = '#e6bf55';
    ctx.lineWidth = 3;
    for (let r = 15; r <= 60; r += 15) {
      ctx.beginPath();
      ctx.arc(0, 0, r, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.restore();
  });

  // Central Grand Mandala
  const cx = size / 2;
  const cy = size / 2;

  // Outer star petals
  const petals = 24;
  for (let i = 0; i < petals; i++) {
    const angle = (i * Math.PI * 2) / petals;
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(angle);
    ctx.fillStyle = i % 2 === 0 ? 'rgba(212, 175, 55, 0.45)' : 'rgba(252, 224, 133, 0.35)';
    ctx.beginPath();
    ctx.ellipse(0, 240, 26, 65, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#fceda2';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.restore();
  }

  // Inner rings
  const rings = [70, 110, 150, 190, 230];
  rings.forEach((rad, idx) => {
    ctx.beginPath();
    ctx.arc(cx, cy, rad, 0, Math.PI * 2);
    ctx.strokeStyle = idx % 2 === 0 ? '#e5c058' : '#aa771c';
    ctx.lineWidth = idx === rings.length - 1 ? 6 : 3;
    ctx.stroke();
  });

  // Center lotus rosette
  const lotusPetals = 16;
  for (let i = 0; i < lotusPetals; i++) {
    const angle = (i * Math.PI * 2) / lotusPetals;
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(angle);
    ctx.fillStyle = '#fce085';
    ctx.beginPath();
    ctx.ellipse(0, 60, 14, 35, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  // Center gold disc
  ctx.beginPath();
  ctx.arc(cx, cy, 32, 0, Math.PI * 2);
  ctx.fillStyle = '#ffdf78';
  ctx.fill();
  ctx.strokeStyle = '#b8860b';
  ctx.lineWidth = 4;
  ctx.stroke();

  // Subtle fabric noise
  const imgData = ctx.getImageData(0, 0, size, size);
  const data = imgData.data;
  for (let i = 0; i < data.length; i += 4) {
    const noise = (Math.random() - 0.5) * 14;
    data[i] = Math.min(255, Math.max(0, data[i] + noise));
    data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + noise));
    data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + noise));
  }
  ctx.putImageData(imgData, 0, 0);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
  texture.wrapS = THREE.ClampToEdgeWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  return texture;
}

// 2. White Makrana Marble with Golden Veins
export function createMarbleTexture(renderer: THREE.WebGLRenderer): THREE.CanvasTexture {
  const size = 1024;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  // Warm off-white ivory marble base
  const grad = ctx.createLinearGradient(0, 0, size, size);
  grad.addColorStop(0, '#f9f6f0');
  grad.addColorStop(0.5, '#f5efe4');
  grad.addColorStop(1, '#ece3d2');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, size, size);

  // Marble veins
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  for (let v = 0; v < 14; v++) {
    ctx.beginPath();
    let x = (Math.random() * size * 0.8) + (size * 0.1);
    let y = 0;
    ctx.moveTo(x, y);

    const isGoldVein = v % 3 === 0;
    ctx.strokeStyle = isGoldVein ? 'rgba(218, 165, 32, 0.28)' : 'rgba(160, 140, 125, 0.18)';
    ctx.lineWidth = isGoldVein ? Math.random() * 4 + 2 : Math.random() * 8 + 3;

    while (y < size) {
      x += (Math.random() - 0.48) * 35;
      y += Math.random() * 25 + 15;
      ctx.lineTo(x, y);
    }
    ctx.stroke();
  }

  // Soft noise grain
  const imgData = ctx.getImageData(0, 0, size, size);
  const d = imgData.data;
  for (let i = 0; i < d.length; i += 4) {
    const grain = (Math.random() - 0.5) * 8;
    d[i] = Math.min(255, Math.max(0, d[i] + grain));
    d[i + 1] = Math.min(255, Math.max(0, d[i + 1] + grain));
    d[i + 2] = Math.min(255, Math.max(0, d[i + 2] + grain));
  }
  ctx.putImageData(imgData, 0, 0);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  return texture;
}

// 3. Procedural Radial Contact Shadow Texture
export function createContactShadowTexture(): THREE.CanvasTexture {
  const size = 256;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  const rad = size / 2;
  const grad = ctx.createRadialGradient(rad, rad, 0, rad, rad, rad);
  grad.addColorStop(0, 'rgba(0, 0, 0, 0.7)');
  grad.addColorStop(0.35, 'rgba(0, 0, 0, 0.45)');
  grad.addColorStop(0.7, 'rgba(0, 0, 0, 0.15)');
  grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, size, size);

  const texture = new THREE.CanvasTexture(canvas);
  return texture;
}

// 4. Procedural Rose & Marigold Petal Texture
export function createPetalTexture(): THREE.CanvasTexture {
  const size = 128;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  const cx = size / 2;
  const cy = size / 2;

  // Petal teardrop shape
  ctx.beginPath();
  ctx.moveTo(cx, 15);
  ctx.bezierCurveTo(size - 10, 30, size - 15, size - 25, cx, size - 10);
  ctx.bezierCurveTo(15, size - 25, 10, 30, cx, 15);
  ctx.closePath();

  const grad = ctx.createRadialGradient(cx, cy, 5, cx, cy, size / 2);
  grad.addColorStop(0, '#ff4d6d');
  grad.addColorStop(0.7, '#c9184a');
  grad.addColorStop(1, '#800f2f');
  ctx.fillStyle = grad;
  ctx.fill();

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}
