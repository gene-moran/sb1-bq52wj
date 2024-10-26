import React, { useEffect, useRef } from 'react';
import { Globe, Users, Briefcase, Newspaper, Code, ShoppingCart } from 'lucide-react';
import type { HistoryNode } from '../utils/history';

const CATEGORY_ICONS = {
  social: Users,
  work: Briefcase,
  news: Newspaper,
  dev: Code,
  shopping: ShoppingCart,
  other: Globe
};

interface MindMapProps {
  nodes: HistoryNode[];
}

const MindMap: React.FC<MindMapProps> = ({ nodes }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current || nodes.length === 0) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d')!;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = 120;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw connections
    nodes.forEach((node, i) => {
      const angle = (i / nodes.length) * 2 * Math.PI;
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);

      // Draw line to center
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(x, y);
      ctx.strokeStyle = '#e2e8f0';
      ctx.stroke();

      // Draw connections between related nodes
      nodes.forEach((otherNode, j) => {
        if (i !== j && areNodesRelated(node, otherNode)) {
          const otherAngle = (j / nodes.length) * 2 * Math.PI;
          const otherX = centerX + radius * Math.cos(otherAngle);
          const otherY = centerY + radius * Math.sin(otherAngle);

          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.lineTo(otherX, otherY);
          ctx.strokeStyle = '#94a3b8';
          ctx.setLineDash([2, 2]);
          ctx.stroke();
          ctx.setLineDash([]);
        }
      });
    });
  }, [nodes]);

  return (
    <div className="relative w-full h-full">
      <canvas
        ref={canvasRef}
        width={600}
        height={320}
        className="absolute inset-0"
      />
      
      {/* Center node */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center">
          <Globe className="w-6 h-6 text-white" />
        </div>
      </div>

      {/* History nodes */}
      {nodes.map((node, i) => {
        const angle = (i / nodes.length) * 2 * Math.PI;
        const radius = 120;
        const x = 50 + radius * Math.cos(angle);
        const y = 50 + radius * Math.sin(angle);
        const Icon = CATEGORY_ICONS[node.category] || CATEGORY_ICONS.other;

        return (
          <div
            key={node.id}
            className="absolute -translate-x-1/2 -translate-y-1/2"
            style={{
              left: `${x}%`,
              top: `${y}%`
            }}
          >
            <div className="group relative">
              <div className="w-10 h-10 rounded-full bg-white border-2 border-gray-200 flex items-center justify-center hover:border-blue-500 transition-colors">
                <Icon className="w-5 h-5 text-gray-600" />
              </div>
              <div className="absolute left-1/2 -translate-x-1/2 -bottom-1 translate-y-full w-48 bg-white shadow-lg rounded-lg p-2 text-sm hidden group-hover:block">
                <p className="font-medium truncate">{node.title}</p>
                <p className="text-xs text-gray-500 truncate">{node.url}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

function areNodesRelated(node1: HistoryNode, node2: HistoryNode): boolean {
  // Simple relation check based on domain and category
  const domain1 = new URL(node1.url).hostname;
  const domain2 = new URL(node2.url).hostname;
  
  return domain1 === domain2 || node1.category === node2.category;
}

export default MindMap;