import { type Primitive, type PrimitiveFormData, type PrimitiveGroup } from "@/types"
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateRandomColor(): string {
  const colors = [
    "#ef4444",
    "#f97316",
    "#f59e0b",
    "#eab308",
    "#84cc16",
    "#22c55e",
    "#10b981",
    "#14b8a6",
    "#06b6d4",
    "#0ea5e9",
    "#3b82f6",
    "#6366f1",
    "#8b5cf6",
    "#a855f7",
    "#d946ef",
    "#ec4899",
    "#f43f5e",
  ]
  return colors[Math.floor(Math.random() * colors.length)]
}

export function generateRandomPosition(): [number, number, number] {
  return [
    (Math.random() - 0.5) * 10, // x: -5 to 5
    Math.random() * 3 + 0.5, // y: 0.5 to 3.5
    (Math.random() - 0.5) * 10, // z: -5 to 5
  ]
}

export function generatePrimitiveGroup(formData: PrimitiveFormData): PrimitiveGroup {
  const groupId = `group-${Date.now()}`
  const primitives: Primitive[] = []

  for (let i = 0; i < formData.count; i++) {
    const primitive: Primitive = {
      id: `${groupId}-primitive-${i}`,
      type: formData.type,
      position: generateRandomPosition(),
      parameters: {
        width: formData.width,
        height: formData.height,
        depth: formData.depth,
      },
      color: generateRandomColor(),
      groupId,
    }
    primitives.push(primitive)
  }

  return {
    id: groupId,
    type: formData.type,
    count: formData.count,
    parameters: {
      width: formData.width,
      height: formData.height,
      depth: formData.depth,
    },
    primitives,
  }
}
