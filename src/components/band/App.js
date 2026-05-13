import * as THREE from 'three'
import { useEffect, useRef, useState, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Text, TrackballControls } from '@react-three/drei'
import { useRouter } from 'next/navigation'

function Word({ children, ...props }) {
  const color = new THREE.Color()
  const fontProps = {
    font: './fonts/inter.woff',
    fontSize: 2.5,
    letterSpacing: -0.05,
    lineHeight: 1,
    'material-toneMapped': false,
  }
  const ref = useRef()
  const [hovered, setHovered] = useState(false)
  const router = useRouter()

  const over = (e) => (e.stopPropagation(), setHovered(true))
  const out = () => setHovered(false)

  const handleClick = () => {
    if (props.isLink) {
      router.push(props.path)
    }
  }

  useEffect(() => {
    if (hovered) {
      document.body.style.cursor = 'pointer'
    }
    return () => (document.body.style.cursor = 'auto')
  }, [hovered])

  useFrame(({ camera }) => {
    ref.current.quaternion.copy(camera.quaternion)
    ref.current.material.color.lerp(
      color.set(hovered ? '#fa2720' : 'white'),
      0.1,
    )
  })

  return (
    <Text
      ref={ref}
      onPointerOver={over}
      onPointerOut={out}
      onClick={handleClick}
      {...props}
      {...fontProps}
    >
      {children}
    </Text>
  )
}

const japanese = ['設計', '開発']
const english = ['Design', 'Development']
const links = [
  {
    name: 'About',
    path: '/#about',
  },
  {
    name: 'Portfolio',
    path: '/#portfolio',
  },
  {
    name: 'Contact',
    path: '/#contact',
  },
]
const socials = [
  {
    name: 'Github',
    url: 'https://github.com/Dev-Sahad',
  },
  {
    name: 'Linkedin',
    url: 'https://www.linkedin.com/in/muhammad-sahad-78b827352',
  },
  {
    name: 'Instagram',
    url: 'https://www.instagram.com/sahad_____sha',
  },
]

const combined = [...links, ...socials]
const cloudWords = [
  ...japanese.map((text, i) => ({ text, isLink: false, index: i })),
  ...english.map((text, i) => ({ text, isLink: false, index: i + 2 })),
  ...combined.map((item, i) => ({
    text: item.name,
    isLink: true,
    path: item.path || item.url,
    index: i + 4,
  })),
]

function Cloud({ count = 4, radius = 20 }) {
  const words = useMemo(() => {
    const temp = []
    const spherical = new THREE.Spherical()
    const phiSpan = Math.PI / (count + 1)
    const thetaSpan = (Math.PI * 2) / count
    for (let i = 1; i < count + 1; i++) {
      for (let j = 0; j < count; j++) {
        temp.push([
          new THREE.Vector3().setFromSpherical(
            spherical.set(radius, phiSpan * i, thetaSpan * j),
          ),
          cloudWords[j % cloudWords.length],
        ])
      }
    }
    return temp
  }, [count, radius])

  return words.map(([pos, word], index) => (
    <Word
      key={index}
      position={pos}
      isLink={word.isLink}
      path={word.path}
    >
      {word.text}
    </Word>
  ))
}

const Spline = () => {
  const [curve] = useState(() => {
    let curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(1, 1, 1),
      new THREE.Vector3(1, 1, 1),
      new THREE.Vector3(1, 1, 1),
      new THREE.Vector3(1, 1, 1),
      new THREE.Vector3(1, 1, 1),
      new THREE.Vector3(1, 1, 1),
    ])
    return curve
  })

  const [texture] = useState(() => {
    return new THREE.TextureLoader().load(
      'https://fiqry.dev/images/band-texture.png',
    )
  })

  return (
    <mesh>
      <tubeGeometry args={[curve, 64, 0.001, 2, false]} />
      <meshStandardMaterial />
    </mesh>
  )
}

export default function App() {
  return (
    <Canvas dpr={[1, 2]} camera={{ position: [0, 0, 35], fov: 90 }}>
      <fog attach="fog" args={['#0a0a0a', 8, 40]} />
      <Cloud count={8} radius={28} />
      <TrackballControls noZoom noPan />
    </Canvas>
  )
}
