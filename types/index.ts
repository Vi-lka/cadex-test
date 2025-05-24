export type PrimitiveType = "box" | "pyramid"

export interface Primitive {
  id: string
  type: PrimitiveType
  position: [number, number, number]
  parameters: {
    width: number
    height: number
    depth: number
  }
  color: string
  groupId: string
}

export interface PrimitiveGroup {
  id: string
  type: PrimitiveType
  count: number
  parameters: {
    width: number
    height: number
    depth: number
  }
  primitives: Primitive[]
}

export interface PrimitiveFormData {
  type: PrimitiveType
  count: number
  width: number
  height: number
  depth: number
}