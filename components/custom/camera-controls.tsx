import { useFrame, useThree } from '@react-three/fiber'
import React from 'react'
import * as THREE from "three"

export default function CameraControls() {
  const { camera } = useThree()
  
  const [isDragging, setIsDragging] = React.useState(false)
  const [isRightDragging, setIsRightDragging] = React.useState(false)
  const [previousMousePosition, setPreviousMousePosition] = React.useState({ x: 0, y: 0 })

  const orbitCenter = React.useRef({ x: 0, y: 0, z: 0 })
  const cameraDistance = React.useRef(
    Math.sqrt(
      camera.position.x ** 2 + 
      camera.position.y ** 2 + 
      camera.position.z ** 2
    )
  )
  const cameraPosition = React.useRef({ 
    x: camera.position.x, 
    y: camera.position.y, 
    z: camera.position.z 
  })
    
  React.useEffect(() => {
    const handleMouseDown = (e: MouseEvent) => {
      if (e.button === 2) {
        // Right mouse button
        setIsRightDragging(true)
      } else {
        // Left mouse button
        setIsDragging(true)
      }
      setPreviousMousePosition({ x: e.clientX, y: e.clientY })
    }

    const handleMouseUp = (e: MouseEvent) => {
      if (e.button === 2) {
        // Right mouse button
        setIsRightDragging(false)
      } else {
        // Left mouse button
        setIsDragging(false)
      }
    }

    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) { // Camera rotation around the center (orbit)
        const deltaX = e.clientX - previousMousePosition.x
        const deltaY = e.clientY - previousMousePosition.y

        // Convert mouse movement to rotation angles
        const rotationSpeed = 0.005
        const thetaDelta = -rotationSpeed * deltaX
        const phiDelta = -rotationSpeed * deltaY

        // Update camera position using spherical coordinates
        const theta = Math.atan2(cameraPosition.current.x, cameraPosition.current.z) + thetaDelta
        let phi = Math.acos(cameraPosition.current.y / cameraDistance.current) + phiDelta

        // Limit vertical rotation
        phi = Math.max(0.1, Math.min(Math.PI - 0.1, phi))

        // Calculate new camera position
        cameraPosition.current.x = cameraDistance.current * Math.sin(phi) * Math.sin(theta)
        cameraPosition.current.y = cameraDistance.current * Math.cos(phi)
        cameraPosition.current.z = cameraDistance.current * Math.sin(phi) * Math.cos(theta)

        setPreviousMousePosition({ x: e.clientX, y: e.clientY })
      } else if (isRightDragging) { // Panning (moving the camera and the center of the orbit)
        const deltaX = e.clientX - previousMousePosition.x
        const deltaY = e.clientY - previousMousePosition.y

        const panSpeed = 0.01

        // Calculating vectors to move in the plane perpendicular to the direction of view
        const forward = new THREE.Vector3(
          orbitCenter.current.x - cameraPosition.current.x,
          orbitCenter.current.y - cameraPosition.current.y,
          orbitCenter.current.z - cameraPosition.current.z,
        ).normalize()

        // Vector right (perpendicular to forward and up)
        const right = new THREE.Vector3()
        right.crossVectors(forward, new THREE.Vector3(0, 1, 0)).normalize()

        // Vector up (perpendicular to forward and right)
        const up = new THREE.Vector3()
        up.crossVectors(right, forward).normalize()

        // Calculating offset
        const offsetX = right.multiplyScalar(-deltaX * panSpeed)
        const offsetY = up.multiplyScalar(deltaY * panSpeed)

        // Move camera and orbit center
        cameraPosition.current.x += offsetX.x + offsetY.x
        cameraPosition.current.y += offsetX.y + offsetY.y
        cameraPosition.current.z += offsetX.z + offsetY.z

        orbitCenter.current.x += offsetX.x + offsetY.x
        orbitCenter.current.y += offsetX.y + offsetY.y
        orbitCenter.current.z += offsetX.z + offsetY.z

        setPreviousMousePosition({ x: e.clientX, y: e.clientY })
      }
    }

    const handleWheel = (e: WheelEvent) => {
      const zoomStep = 0.01
      cameraDistance.current += e.deltaY * zoomStep

      // Limit zoom distance
      cameraDistance.current = Math.max(2, Math.min(50, cameraDistance.current))

      // Update camera position while maintaining direction
      const direction = new THREE.Vector3(
        cameraPosition.current.x,
        cameraPosition.current.y,
        cameraPosition.current.z,
      ).normalize()

      cameraPosition.current.x = direction.x * cameraDistance.current
      cameraPosition.current.y = direction.y * cameraDistance.current
      cameraPosition.current.z = direction.z * cameraDistance.current
    }

    // Prevent context menu on right mouse button click
    const handlePreventContextMenu = (e: MouseEvent) => {
      e.preventDefault()
    }

    window.addEventListener("mousedown", handleMouseDown)
    window.addEventListener("mouseup", handleMouseUp)
    window.addEventListener("mousemove", handleMouseMove)
    window.addEventListener("wheel", handleWheel)
    window.addEventListener("contextmenu", handlePreventContextMenu)

    return () => {
      window.removeEventListener("mousedown", handleMouseDown)
      window.removeEventListener("mouseup", handleMouseUp)
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("wheel", handleWheel)
      window.removeEventListener("contextmenu", handlePreventContextMenu)
    }
  }, [isDragging, isRightDragging, previousMousePosition])

  useFrame(() => {
    // Update camera position and view direction each frame
    camera.position.set(cameraPosition.current.x, cameraPosition.current.y, cameraPosition.current.z)
    camera.lookAt(orbitCenter.current.x, orbitCenter.current.y, orbitCenter.current.z)
  })

  return null
}
