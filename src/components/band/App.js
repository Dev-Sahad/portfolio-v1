import * as THREE from 'three'
import { useRef, useState, useMemo, useEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Text, Float } from '@react-three/drei'

// ─── Floating word that always faces camera ─────────────────────────
function FloatingWord({ text, position, color = '#ffffff', fontSize = 1.8, opacity = 0.72 }) {
  const ref = useRef()
  const [hovered, setHovered] = useState(false)
  const baseOpacity = useRef(opacity)
  const currentOpacity = useRef(opacity)

  useFrame(({ camera, clock }) => {
    if (!ref.current) return
    ref.current.quaternion.copy(camera.quaternion)

    // Gentle breathing opacity
    const breathe = Math.sin(clock.elapsedTime * 0.6 + position[0]) * 0.08
    const target = hovered
      ? Math.min(1, baseOpacity.current + 0.25)
      : baseOpacity.current + breathe

    currentOpacity.current += (target - currentOpacity.current) * 0.08

    if (ref.current.material) {
      ref.current.material.opacity = Math.max(0, Math.min(1, currentOpacity.current))
    }
  })

  return (
    <Text
      ref={ref}
      position={position}
      fontSize={hovered ? fontSize * 1.12 : fontSize}
      letterSpacing={-0.04}
      material-toneMapped={false}
      material-transparent={true}
      material-opacity={opacity}
      material-color={hovered ? '#ffffff' : color}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      {text}
    </Text>
  )
}

// ─── Wireframe torus ring ───────────────────────────────────────────
function Ring({ radius, tube, rotX, rotY, rotZ, speedX, speedY, color, opacity }) {
  const ref = useRef()
  useFrame((_, delta) => {
    if (!ref.current) return
    ref.current.rotation.x += delta * speedX
    ref.current.rotation.y += delta * speedY
  })
  return (
    <mesh ref={ref} rotation={[rotX, rotY, rotZ]}>
      <torusGeometry args={[radius, tube, 10, 90]} />
      <meshBasicMaterial color={color} transparent opacity={opacity} />
    </mesh>
  )
}

// ─── Drifting particle stars ────────────────────────────────────────
function StarField({ count = 180 }) {
  const ref = useRef()
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      const r = 30 + Math.random() * 50
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      arr[i * 3 + 0] = r * Math.sin(phi) * Math.cos(theta)
      arr[i * 3 + 1] = r * Math.cos(phi)
      arr[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta)
    }
    return arr
  }, [count])

  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * 0.018
      ref.current.rotation.x += delta * 0.006
    }
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.22}
        color="#ffffff"
        transparent
        opacity={0.55}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  )
}

// ─── Glowing distorted sphere ───────────────────────────────────────
function Orb({ position, color, size, speed, phase }) {
  const ref = useRef()
  useFrame(({ clock }) => {
    if (!ref.current) return
    const t = clock.elapsedTime
    ref.current.position.y = position[1] + Math.sin(t * speed + phase) * 2.5
    ref.current.position.x = position[0] + Math.cos(t * speed * 0.7 + phase) * 1.5
  })
  return (
    <mesh ref={ref} position={position}>
      <sphereGeometry args={[size, 24, 24]} />
      <meshBasicMaterial color={color} transparent opacity={0.12} />
    </mesh>
  )
}

// ─── Thin connecting lines between random word pairs ────────────────
function ConnectionLines({ positions }) {
  const ref = useRef()
  const geometry = useMemo(() => {
    const pairs = []
    for (let i = 0; i < positions.length; i++) {
      for (let j = i + 1; j < positions.length; j++) {
        const dx = positions[i][0] - positions[j][0]
        const dy = positions[i][1] - positions[j][1]
        const dz = positions[i][2] - positions[j][2]
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz)
        if (dist < 18) {
          pairs.push(...positions[i], ...positions[j])
        }
      }
    }
    const arr = new Float32Array(pairs)
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(arr, 3))
    return geo
  }, [positions])

  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.04
  })

  return (
    <lineSegments ref={ref} geometry={geometry}>
      <lineBasicMaterial color="#ffffff" transparent opacity={0.06} />
    </lineSegments>
  )
}

// ─── Main Scene ─────────────────────────────────────────────────────
const DEFAULT_WORDS = [
  { text: 'Design',     color: '#ffffff', fontSize: 2.1, opacity: 0.80 },
  { text: 'Frontend',   color: '#aaaaff', fontSize: 2.3, opacity: 0.85 },
  { text: 'React',      color: '#ffffff', fontSize: 1.9, opacity: 0.75 },
  { text: 'TypeScript', color: '#88aaff', fontSize: 1.7, opacity: 0.72 },
  { text: '設計',        color: '#ffffff', fontSize: 2.4, opacity: 0.65 },
  { text: '開発',        color: '#aaaaff', fontSize: 2.2, opacity: 0.60 },
  { text: 'Three.js',   color: '#ffffff', fontSize: 1.7, opacity: 0.70 },
  { text: 'Tailwind',   color: '#66ffaa', fontSize: 1.7, opacity: 0.68 },
  { text: 'Next.js',    color: '#ffffff', fontSize: 2.0, opacity: 0.78 },
  { text: 'Creative',   color: '#ffcc44', fontSize: 1.9, opacity: 0.72 },
  { text: 'UI / UX',    color: '#ff6688', fontSize: 1.9, opacity: 0.72 },
  { text: 'Motion',     color: '#ffffff', fontSize: 1.7, opacity: 0.65 },
]

function Scene({ words }) {
  const groupRef = useRef()
  const activeWords = words && words.length > 0 ? words : DEFAULT_WORDS

  // Fibonacci sphere — most even distribution
  const wordPositions = useMemo(() => {
    const n = activeWords.length
    const golden = Math.PI * (3 - Math.sqrt(5))
    const R = 20
    return activeWords.map((w, i) => {
      const y = 1 - (i / (n - 1)) * 2
      const r = Math.sqrt(1 - y * y)
      const theta = golden * i
      return {
        ...w,
        position: [R * r * Math.cos(theta), R * y, R * r * Math.sin(theta)],
      }
    })
  }, [activeWords])

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.055
      groupRef.current.rotation.x += delta * 0.012
    }
  })

  const justPositions = useMemo(
    () => wordPositions.map((w) => w.position),
    [wordPositions],
  )

  return (
    <>
      <ambientLight intensity={0.2} />
      <pointLight position={[30, 30, 20]} intensity={1.2} color="#ffffff" />
      <pointLight position={[-25, -15, -25]} intensity={0.5} color="#6666ff" />

      {/* Stars */}
      <StarField count={200} />

      {/* Decorative rings */}
      <Ring radius={30} tube={0.045} rotX={0.5}  rotY={0}   rotZ={0}   speedX={0.10} speedY={0.06} color="#ffffff" opacity={0.10} />
      <Ring radius={24} tube={0.035} rotX={1.3}  rotY={0.4} rotZ={0}   speedX={0.07} speedY={0.09} color="#aaaaff" opacity={0.08} />
      <Ring radius={18} tube={0.025} rotX={0.2}  rotY={1.1} rotZ={0.6} speedX={0.12} speedY={0.05} color="#ffffff" opacity={0.07} />

      {/* Ambient glowing orbs */}
      <Orb position={[10,  5, -8]}  color="#6655ff" size={5} speed={0.5} phase={0}   />
      <Orb position={[-12,-6,  6]}  color="#ffffff"  size={4} speed={0.7} phase={2.1} />
      <Orb position={[3,  -10,-12]} color="#4444cc" size={3.5} speed={0.4} phase={4.2} />

      {/* Word sphere + connection lines */}
      <group ref={groupRef}>
        <ConnectionLines positions={justPositions} />
        {wordPositions.map((w, i) => (
          <Float key={i} speed={0.5 + (i % 3) * 0.2} floatIntensity={0.4} rotationIntensity={0}>
            <FloatingWord
              text={w.text}
              position={w.position}
              color={w.color || '#ffffff'}
              fontSize={w.fontSize || 1.8}
              opacity={w.opacity || 0.72}
            />
          </Float>
        ))}
      </group>
    </>
  )
}

export default function App({ words }) {
  return (
    <Canvas
      dpr={[1, 2]}
      camera={{ position: [0, 0, 48], fov: 72 }}
      events={false}
      style={{ pointerEvents: 'none' }}
      gl={{ antialias: true, alpha: true }}
    >
      <fog attach="fog" args={['#0a0a0a', 35, 90]} />
      <Scene words={words} />
    </Canvas>
  )
}
