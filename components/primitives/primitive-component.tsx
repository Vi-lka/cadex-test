import React from 'react'
import type { Primitive } from '@/types'
import type * as THREE from "three"
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
    >
      {primitive.type === "box" ? (
        <boxGeometry args={[primitive.parameters.width, primitive.parameters.height, primitive.parameters.depth]} />
      ) : (
        <coneGeometry
          args={[
            Math.max(primitive.parameters.width, primitive.parameters.depth) / 2, // radius
            primitive.parameters.height, // height
            4, // radial segments (4 for pyramid shape)
          ]}
        />
      )}
      <meshStandardMaterial
        color={isSelected ? "#ffffff" : primitive.color}
        emissive={isSelected ? primitive.color : "#000000"}
        emissiveIntensity={isSelected ? 0.3 : 0}
        roughness={0.4}
        metalness={0.1}
      />
    </mesh>
  )
}
