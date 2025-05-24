import React from 'react'
import type { Primitive } from '@/types'
import * as THREE from "three"
import { useFrame } from '@react-three/fiber'

interface PrimitiveComponentProps {
  primitive: Primitive
  isSelected: boolean
  onClick: () => void
}

export default function PrimitiveComponent({ primitive, isSelected, onClick }: PrimitiveComponentProps) {
  const meshRef = React.useRef<THREE.Mesh>(null)
  const originalRotationY = React.useRef<number>(0)

  const [hovered, setHovered] = React.useState(false)

  // Store original rotation when component mounts
  React.useEffect(() => {
    if (meshRef.current) {
      originalRotationY.current = meshRef.current.rotation.y
    }
  }, [])

  // Reset rotation when primitive is deselected
  React.useEffect(() => {
    if (!isSelected && meshRef.current) {
      meshRef.current.rotation.y = originalRotationY.current
    }
  }, [isSelected])

  // Change cursor on hover
  React.useEffect(() => {
    document.body.style.cursor = hovered ? "pointer" : "auto"
    return () => {
      document.body.style.cursor = "auto"
    }
  }, [hovered])

  useFrame((_, delta) => {
    if (meshRef.current && isSelected) {
      // Rotation animation for selected primitive
      meshRef.current.rotation.y += delta * 0.5
    }
  })

    // Create geometry with material groups
  const { geometry, materials } = React.useMemo(() => {
    if (primitive.type === "box") {
      return createBoxWithMaterialGroups(primitive, isSelected)
    } else {
      return createPyramidWithMaterialGroups(primitive, isSelected)
    }
  }, [primitive, isSelected])

  return (
    <mesh
      ref={meshRef}
      position={primitive.position}
      onClick={(e) => {
        e.stopPropagation()
        onClick()
      }}
      onPointerEnter={(e) => {
        e.stopPropagation()
        setHovered(true)
      }}
      onPointerLeave={(e) => {
        e.stopPropagation()
        setHovered(false)
      }}
      castShadow
      receiveShadow
      geometry={geometry}
      material={materials}
    />
  )
}

function createBoxWithMaterialGroups(primitive: Primitive, isSelected: boolean) {
  const { width, height, depth } = primitive.parameters
  const geometry = new THREE.BoxGeometry(width, height, depth)

  // Clear existing groups
  geometry.clearGroups()

  // Add material groups for each face
  // Each face consists of 2 triangles (6 vertices)
  geometry.addGroup(0, 6, 0)
  geometry.addGroup(6, 6, 1)
  geometry.addGroup(12, 6, 2)
  geometry.addGroup(18, 6, 3)
  geometry.addGroup(24, 6, 4)
  geometry.addGroup(30, 6, 5)

  const materials = primitive.faceColors.map(
    (color) =>
      new THREE.MeshStandardMaterial({
        color: isSelected ? "#ffffff" : color,
        emissive: isSelected ? color : "#000000",
        emissiveIntensity: isSelected ? 0.3 : 0,
        roughness: 0.4,
        metalness: 0.1,
      }),
  )

  return { geometry, materials }
}

function createPyramidWithMaterialGroups(primitive: Primitive, isSelected: boolean) {
  const { width, height, depth } = primitive.parameters
  const geometry = new THREE.ConeGeometry(
    Math.max(width, depth) / 2,
    height,
    4, // 4 segments for pyramid shape
  )

  // Clear existing groups
  geometry.clearGroups()

  // Add material groups for each face
  // Cone geometry: base + 4 side faces
  geometry.addGroup(0, 3, 0)
  geometry.addGroup(3, 3, 1)
  geometry.addGroup(6, 3, 2)
  geometry.addGroup(9, 3, 3)
  geometry.addGroup(12, 12, 4)

  const materials = primitive.faceColors.map(
    (color) =>
      new THREE.MeshStandardMaterial({
        color: isSelected ? "#ffffff" : color,
        emissive: isSelected ? color : "#000000",
        emissiveIntensity: isSelected ? 0.3 : 0,
        roughness: 0.4,
        metalness: 0.1,
      }),
  )

  return { geometry, materials }
}