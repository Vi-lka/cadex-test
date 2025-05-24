import { useFrame, useThree } from '@react-three/fiber'
import React from 'react'
import * as THREE from "three"

type TouchModeT = "rotate" | "pan" | "zoom"

const DAMPING_FACTOR = 0.95 // Damping factor (bigger = more inertia), must be lower than 1
const MIN_VELOCITY = 0.001 // Minimum velocity threshold to stop calculations
const ROTATION_SPEED = 0.005
const PAN_SPEED = 0.01
const ZOOM_SPEED = 0.01

export default function CameraControls() {
  const { camera } = useThree()

  // Mouse interaction states
  const [isDragging, setIsDragging] = React.useState(false)
  const [isRightDragging, setIsRightDragging] = React.useState(false)
  const [previousMousePosition, setPreviousMousePosition] = React.useState({ x: 0, y: 0 })

  // Touch interaction states
  const [isTouching, setIsTouching] = React.useState(false)
  const [previousTouchPosition, setPreviousTouchPosition] = React.useState({ x: 0, y: 0 })
  const [previousTouchDistance, setPreviousTouchDistance] = React.useState(0)
  const [touchMode, setTouchMode] = React.useState<TouchModeT>("rotate") // "rotate", "pan", "zoom"

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

  // Velocity for inertia
  const cameraVelocity = React.useRef({ x: 0, y: 0, z: 0 })
  const orbitCenterVelocity = React.useRef({ x: 0, y: 0, z: 0 })
  const rotationVelocity = React.useRef({ theta: 0, phi: 0 })

  const handleOrbitRotation = React.useCallback((
    clientX: number, 
    clientY: number,
    previousPosition: { x: number, y: number }
  ) => {
    const deltaX = clientX - previousPosition.x
    const deltaY = clientY - previousPosition.y

    // Convert movement to rotation angles
    const thetaDelta = -ROTATION_SPEED * deltaX
    const phiDelta = -ROTATION_SPEED * deltaY

    // Store rotation velocity for inertia
    rotationVelocity.current.theta = thetaDelta
    rotationVelocity.current.phi = phiDelta

    // Calculate current angles
    const currentPosition = new THREE.Vector3(
      cameraPosition.current.x - orbitCenter.current.x,
      cameraPosition.current.y - orbitCenter.current.y,
      cameraPosition.current.z - orbitCenter.current.z,
    )

    const radius = currentPosition.length()

    // Current spherical coordinates
    let theta = Math.atan2(currentPosition.x, currentPosition.z)
    let phi = Math.acos(Math.min(Math.max(currentPosition.y / radius, -1), 1))

    // Update angles
    theta += thetaDelta
    phi = Math.max(0.1, Math.min(Math.PI - 0.1, phi + phiDelta)) // Limit vertical rotation

    // Calculate new camera position
    cameraPosition.current.x = orbitCenter.current.x + radius * Math.sin(phi) * Math.sin(theta)
    cameraPosition.current.y = orbitCenter.current.y + radius * Math.cos(phi)
    cameraPosition.current.z = orbitCenter.current.z + radius * Math.sin(phi) * Math.cos(theta)
  }, []);

  const handlePaning = React.useCallback((
    clientX: number, 
    clientY: number,
    previousPosition: { x: number, y: number }
  ) => {
    const deltaX = clientX - previousPosition.x
    const deltaY = clientY - previousPosition.y

    // Calculate vectors for movement in plane perpendicular to view direction
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
    const offsetX = right.multiplyScalar(-deltaX * PAN_SPEED)
    const offsetY = up.multiplyScalar(deltaY * PAN_SPEED)

    const cameraPositionX = offsetX.x + offsetY.x
    const cameraPositionY = offsetX.y + offsetY.y
    const cameraPositionZ = offsetX.z + offsetY.z

    // Store velocity for inertia
    cameraVelocity.current.x = cameraPositionX * 0.5
    cameraVelocity.current.y = cameraPositionY * 0.5
    cameraVelocity.current.z = cameraPositionZ * 0.5
    orbitCenterVelocity.current.x = cameraPositionX * 0.5
    orbitCenterVelocity.current.y = cameraPositionY * 0.5
    orbitCenterVelocity.current.z = cameraPositionZ * 0.5

    // Move camera and orbit center
    cameraPosition.current.x += cameraPositionX
    cameraPosition.current.y += cameraPositionY
    cameraPosition.current.z += cameraPositionZ
    orbitCenter.current.x += cameraPositionX
    orbitCenter.current.y += cameraPositionY
    orbitCenter.current.z += cameraPositionZ
  }, []);

  const handleZoom = React.useCallback((delta: number) => {
    const zoomDelta = -delta * ZOOM_SPEED
    cameraDistance.current += -zoomDelta

    // Limit zoom distance
    cameraDistance.current = Math.max(1, Math.min(500, cameraDistance.current))

    // Get current direction vector from camera to orbit center
    const direction = new THREE.Vector3(
      orbitCenter.current.x - cameraPosition.current.x,
      orbitCenter.current.y - cameraPosition.current.y,
      orbitCenter.current.z - cameraPosition.current.z,
    ).normalize()

    // Update camera position
    if (cameraDistance.current > 1 && cameraDistance.current < 500) {
      cameraPosition.current.x += direction.x * zoomDelta
      cameraPosition.current.y += direction.y * zoomDelta
      cameraPosition.current.z += direction.z * zoomDelta
    }
  }, []);

  // ===== MOUSE EVENT HANDLERS ===== //
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

      // Reset velocities when start drag
      cameraVelocity.current = { x: 0, y: 0, z: 0 }
      orbitCenterVelocity.current = { x: 0, y: 0, z: 0 }
      rotationVelocity.current = { theta: 0, phi: 0 }
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
      if (isDragging) { // Orbit rotation (left mouse button)
        handleOrbitRotation(e.clientX, e.clientY, previousMousePosition)
        setPreviousMousePosition({ x: e.clientX, y: e.clientY })
      } else if (isRightDragging) { // Panning (right mouse button)
        handlePaning(e.clientX, e.clientY, previousMousePosition)
        setPreviousMousePosition({ x: e.clientX, y: e.clientY })
      }
    }

    // Zooming (mouse wheel)
    const handleWheel = (e: WheelEvent) => {
      handleZoom(e.deltaY)
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
  }, [isDragging, isRightDragging, previousMousePosition, handleOrbitRotation, handlePaning, handleZoom])

  // ===== TOUCH EVENT HANDLERS ===== // These are bad, need something better for touch (((
  React.useEffect(() => {

    const handleTouchStart = (e: TouchEvent) => {
      // e.preventDefault()
      setIsTouching(true)

      // Reset velocities when start touch
      cameraVelocity.current = { x: 0, y: 0, z: 0 }
      orbitCenterVelocity.current = { x: 0, y: 0, z: 0 }
      rotationVelocity.current = { theta: 0, phi: 0 }

      if (e.touches.length === 1) {
        // Single touch - rotation
        setTouchMode("rotate")
        setPreviousTouchPosition({
          x: e.touches[0].clientX,
          y: e.touches[0].clientY,
        })
      } else if (e.touches.length === 2) {
        // Two touches - determine if pan or zoom
        const touch1 = e.touches[0]
        const touch2 = e.touches[1]

        // Calculate center point between touches
        const centerX = (touch1.clientX + touch2.clientX) / 2
        const centerY = (touch1.clientY + touch2.clientY) / 2
        setPreviousTouchPosition({ x: centerX, y: centerY })

        // Calculate distance between touches for pinch zoom
        const dx = touch1.clientX - touch2.clientX
        const dy = touch1.clientY - touch2.clientY
        const distance = Math.sqrt(dx * dx + dy * dy)
        setPreviousTouchDistance(distance)

        // Default to pan mode for two fingers
        setTouchMode("pan")
      }
    }

    const handleTouchEnd = (e: TouchEvent) => {
      // e.preventDefault()
      if (e.touches.length === 0) {
        setIsTouching(false)
      } else if (e.touches.length === 1) {
        // Switch back to rotate mode with one finger
        setTouchMode("rotate")
        setPreviousTouchPosition({
          x: e.touches[0].clientX,
          y: e.touches[0].clientY,
        })
      }
    }

    const handleTouchCancel = (e: TouchEvent) => {
      e.preventDefault()
      setIsTouching(false)
    }
    
    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault()

      if (!isTouching) return

      if (e.touches.length === 1 && touchMode === "rotate") {
        // Single touch - rotation (like left mouse button)
        const touch = e.touches[0]

        handleOrbitRotation(touch.clientX, touch.clientY, previousTouchPosition)

        setPreviousTouchPosition({
          x: touch.clientX,
          y: touch.clientY,
        })
      } else if (e.touches.length === 2) {
        const touch1 = e.touches[0]
        const touch2 = e.touches[1]

        // Calculate center point between touches
        const centerX = (touch1.clientX + touch2.clientX) / 2
        const centerY = (touch1.clientY + touch2.clientY) / 2

        // Calculate distance between touches for pinch zoom
        const dx = touch1.clientX - touch2.clientX
        const dy = touch1.clientY - touch2.clientY
        const distance = Math.sqrt(dx * dx + dy * dy)

        // Handle pinch zoom
        const distanceDelta = distance - previousTouchDistance
        if (Math.abs(distanceDelta) > 10) {
          // Zoom effect (like mouse wheel)
          handleZoom(-distanceDelta)

          // Update touch mode to zoom
          setTouchMode("zoom")
        }

        // Handle pan if not primarily zooming
        if (touchMode === "pan") {
          const deltaX = centerX - previousTouchPosition.x
          const deltaY = centerY - previousTouchPosition.y

          if (Math.abs(deltaX) > 1 || Math.abs(deltaY) > 1) {
            handlePaning(centerX, centerY, previousTouchPosition)
          }
        }

        // Update previous touch positions and distance
        setPreviousTouchPosition({ x: centerX, y: centerY })
        setPreviousTouchDistance(distance)
      }
    }

    window.addEventListener("touchstart", handleTouchStart, { passive: false })
    window.addEventListener("touchend", handleTouchEnd, { passive: false })
    window.addEventListener("touchcancel", handleTouchCancel, { passive: false })
    window.addEventListener("touchmove", handleTouchMove, { passive: false })
  
    return () => {
      window.removeEventListener("touchstart", handleTouchStart)
      window.removeEventListener("touchend", handleTouchEnd)
      window.removeEventListener("touchcancel", handleTouchCancel)
      window.removeEventListener("touchmove", handleTouchMove)
    }
  }, [isTouching, touchMode, previousTouchDistance, previousTouchPosition, handleOrbitRotation, handleZoom, handlePaning])

  useFrame(() => {
    // Apply inertia when not interacting
    if (!isDragging && !isRightDragging && !isTouching) {
      // Apply rotation velocity with damping
      if (
        Math.abs(rotationVelocity.current.theta) > MIN_VELOCITY ||
        Math.abs(rotationVelocity.current.phi) > MIN_VELOCITY
      ) {
        // Calculate current angles
        const currentPosition = new THREE.Vector3(
          cameraPosition.current.x - orbitCenter.current.x,
          cameraPosition.current.y - orbitCenter.current.y,
          cameraPosition.current.z - orbitCenter.current.z,
        )

        const radius = currentPosition.length()

        // Current spherical coordinates
        let theta = Math.atan2(currentPosition.x, currentPosition.z)
        let phi = Math.acos(Math.min(Math.max(currentPosition.y / radius, -1), 1))

        // Apply velocity to angles
        theta += rotationVelocity.current.theta
        phi = Math.max(0.1, Math.min(Math.PI - 0.1, phi + rotationVelocity.current.phi))

        // Calculate new camera position
        cameraPosition.current.x = orbitCenter.current.x + radius * Math.sin(phi) * Math.sin(theta)
        cameraPosition.current.y = orbitCenter.current.y + radius * Math.cos(phi)
        cameraPosition.current.z = orbitCenter.current.z + radius * Math.sin(phi) * Math.cos(theta)

        // Apply damping to slow down rotation
        rotationVelocity.current.theta *= DAMPING_FACTOR
        rotationVelocity.current.phi *= DAMPING_FACTOR
      }

      // Apply velocity with damping to camera position
      if (
        Math.abs(cameraVelocity.current.x) > MIN_VELOCITY ||
        Math.abs(cameraVelocity.current.y) > MIN_VELOCITY ||
        Math.abs(cameraVelocity.current.z) > MIN_VELOCITY
      ) {
        cameraPosition.current.x += cameraVelocity.current.x
        cameraPosition.current.y += cameraVelocity.current.y
        cameraPosition.current.z += cameraVelocity.current.z

        // Apply damping to slow down movement
        cameraVelocity.current.x *= DAMPING_FACTOR
        cameraVelocity.current.y *= DAMPING_FACTOR
        cameraVelocity.current.z *= DAMPING_FACTOR
      }

      // Apply velocity with damping to orbit center
      if (
        Math.abs(orbitCenterVelocity.current.x) > MIN_VELOCITY ||
        Math.abs(orbitCenterVelocity.current.y) > MIN_VELOCITY ||
        Math.abs(orbitCenterVelocity.current.z) > MIN_VELOCITY
      ) {
        orbitCenter.current.x += orbitCenterVelocity.current.x
        orbitCenter.current.y += orbitCenterVelocity.current.y
        orbitCenter.current.z += orbitCenterVelocity.current.z

        // Apply damping to slow down movement
        orbitCenterVelocity.current.x *= DAMPING_FACTOR
        orbitCenterVelocity.current.y *= DAMPING_FACTOR
        orbitCenterVelocity.current.z *= DAMPING_FACTOR
      }
    }

    // Update camera position and view direction
    camera.position.set(cameraPosition.current.x, cameraPosition.current.y, cameraPosition.current.z)
    camera.lookAt(orbitCenter.current.x, orbitCenter.current.y, orbitCenter.current.z)
  })

  return null
}
