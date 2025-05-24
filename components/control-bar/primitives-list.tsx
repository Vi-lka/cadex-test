import type { Primitive } from '@/types'
import React from 'react'
import { ScrollArea } from '../ui/scroll-area'

interface PrimitivesListProps {
  primitives: Primitive[]
  selectedPrimitiveId: string | null
  onPrimitiveSelect: (id: string) => void
}

export default function PrimitivesList({ primitives, selectedPrimitiveId, onPrimitiveSelect }: PrimitivesListProps) {
  return (
    <ScrollArea className="">
      <div className="max-h-[calc(100vh-3rem-3rem-80px)] space-y-2">
          {primitives.length === 0 ? (
            <p className="text-muted-foreground text-sm">No primitives in scene</p>
          ) : (
            primitives.map((primitive) => {
              const step = 100 / primitive.faceColors.length;
              const stops = primitive.faceColors
                .map((color, index) => `${color} ${index * step}% ${(index + 1) * step}%`)
                .join(', ');
              const gradient = `conic-gradient(${stops})`;

              return (
                <div
                  key={primitive.id}
                  className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                    selectedPrimitiveId === primitive.id
                      ? "border-primary bg-primary/10"
                      : "border-border hover:bg-muted/50"
                  }`}
                  onClick={() => onPrimitiveSelect(primitive.id)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium capitalize">{primitive.type}</span>
                    <span style={{ background: gradient }} className="w-7 h-7 rounded-full" />
                  </div>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <div>
                      Position: ({primitive.position[0].toFixed(1)}, {primitive.position[1].toFixed(1)},{" "}
                      {primitive.position[2].toFixed(1)})
                    </div>
                    <div>
                      Size: {primitive.parameters.width} × {primitive.parameters.height} × {primitive.parameters.depth}
                    </div>
                  </div>
                </div>
              )
            })
          )}
      </div>
    </ScrollArea>
  )
}
