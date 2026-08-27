'use client'

import { Suspense, useEffect, useMemo, useRef, useState, type RefObject } from 'react'
import * as THREE from 'three'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import {
  CubeCamera,
  Environment,
  Lightformer,
  MeshRefractionMaterial,
  OrbitControls,
  useGLTF,
} from '@react-three/drei'
import { RoomEnvironment, type OrbitControls as OrbitControlsImpl } from 'three-stdlib'
import { Bloom, EffectComposer } from '@react-three/postprocessing'
import type { MotionValue } from 'framer-motion'
import { PHONE_REVEAL_END } from '@/hooks/use-hero-scale'

/** A hair past `PHONE_REVEAL_END` — small enough that the roll starts on the very next bit of scroll once the slide-in finishes, not some separate later scroll milestone. See `AutoRotateGate`. */
const ROLL_START_Z = PHONE_REVEAL_END + 0.01

const MODEL_PATH = '/diamond.glb'

const REFRACTION_CONFIG = {
  bounces: 3,
  aberrationStrength: 0.01,
  ior: 2.75,
  fresnel: 1,
  color: '#51ebff',
  fastChroma: true,
}

/**
 * Mirrors the MutationObserver pattern in components/resume/DownloadResumeButton.tsx
 * — no theme context exists, so this reads the `.dark` class ThemeToggle writes
 * directly. Unlike that button, this component only ever mounts client-side
 * (dynamically imported with `ssr:false`, gated behind an IntersectionObserver),
 * so `document` is always available at first render — the initial read can happen
 * in the `useState` initializer instead of a post-mount effect.
 */
function useIsDarkMode() {
  const [isDark, setIsDark] = useState(() => document.documentElement.classList.contains('dark'))

  useEffect(() => {
    const root = document.documentElement
    const observer = new MutationObserver(() => setIsDark(root.classList.contains('dark')))
    observer.observe(root, { attributes: true, attributeFilter: ['class'] })
    return () => observer.disconnect()
  }, [])

  return isDark
}

/**
 * `MeshRefractionMaterial` needs a real `THREE.CubeTexture` to sample, which
 * is why this still routes through `CubeCamera` below — that part of the
 * original HDR-based setup is unrelated to the file itself. Only the source
 * environment changed: instead of loading an external .hdr, `RoomEnvironment`
 * (a small procedural room scene shipped with three.js, built purely for
 * feeding `PMREMGenerator`) stands in as the thing CubeCamera photographs.
 */
function Diamond({ isDark }: { isDark: boolean }) {
  const { nodes } = useGLTF(MODEL_PATH) as unknown as { nodes: { Cylinder: THREE.Mesh } }
  const meshRef = useRef<THREE.Mesh>(null)
  const { gl } = useThree()
  const texture = useMemo(() => {
    const pmremGenerator = new THREE.PMREMGenerator(gl)
    // three-stdlib's typings declare RoomEnvironment as a plain function even though it's a class at runtime.
    const roomEnvironment = new (RoomEnvironment as unknown as new () => THREE.Scene & { dispose: () => void })()
    const roomTexture = pmremGenerator.fromScene(roomEnvironment, 0.04).texture
    pmremGenerator.dispose()
    roomEnvironment.dispose()
    return roomTexture
  }, [gl])

  return (
    <CubeCamera resolution={256} frames={1} envMap={texture}>
      {(envTexture) => (
        <mesh castShadow receiveShadow ref={meshRef} geometry={nodes.Cylinder.geometry} scale={1.4}>
          {isDark ? (
            <meshStandardMaterial wireframe color="white" />
          ) : (
            <MeshRefractionMaterial envMap={envTexture} {...REFRACTION_CONFIG} toneMapped={false} />
          )}
        </mesh>
      )}
    </CubeCamera>
  )
}

/**
 * Source drove fov/rotation off raw page scrollY over a hardcoded [0,250]px
 * window — sensible when this scene was a full page-height background. Here
 * it's a small corner ornament that only ever exists within the hero's own
 * scroll-zoom sequence, so this reuses that sequence's own reveal progress
 * (`--hero-phone`, 0→1) instead of reintroducing an unrelated scroll listener.
 */
function ScrollCamera({ progress }: { progress: MotionValue<number> }) {
  useFrame(({ camera }) => {
    const t = progress.get()
    const perspective = camera as THREE.PerspectiveCamera
    perspective.fov = 30 + t * 5
    perspective.position.y = t * 5
    perspective.position.z = 5 - t * 3
    perspective.updateProjectionMatrix()
  })
  return null
}

/**
 * `phone` (driving the slide-in transform) reaches 1 — translating stops —
 * at `z === PHONE_REVEAL_END`. The hero's own pinned scroll sequence keeps
 * going past that point (z continues toward 1 as the visitor keeps
 * scrolling), so gating the idle spin on `z > ROLL_START_Z` rather than on
 * `phone` reaching 1 means the roll waits for that next bit of scroll
 * instead of starting the instant the slide-in animation ends.
 */
function AutoRotateGate({
  controlsRef,
  z,
}: {
  controlsRef: RefObject<OrbitControlsImpl | null>
  z: MotionValue<number>
}) {
  useFrame(() => {
    if (controlsRef.current) {
      controlsRef.current.autoRotate = z.get() > ROLL_START_Z
    }
  })
  return null
}

/**
 * `onCreated={({gl}) => gl.setClearAlpha(0)}` should be a one-time-enough
 * fix, but this reasserts it every frame as cheap insurance: the actual bug
 * hunted down here was drei's `Caustics` — its light-pattern floor plane
 * hardcodes `gl_FragColor = vec4(color, 1.0)` in its projection shader
 * (see @react-three/drei/core/Caustics.js), painting the whole canvas
 * opaque regardless of the renderer's own clear settings. `Caustics` is
 * gone now (dropped entirely — see `Diamond` above), but a per-frame
 * `setClearAlpha(0)` costs nothing and guards against the same class of bug
 * from any effect added here later.
 */
function TransparentBackground() {
  useFrame(({ gl }) => gl.setClearAlpha(0))
  return null
}

interface HeroDiamondProps {
  phone: MotionValue<number>
  z: MotionValue<number>
}

export default function HeroDiamond({ phone, z }: HeroDiamondProps) {
  const isDark = useIsDarkMode()
  const controlsRef = useRef<OrbitControlsImpl>(null)

  return (
    <Canvas
      dpr={[1, 2]}
      shadows
      camera={{ fov: 30, position: [0, 0, 5] }}
      gl={{ alpha: true, premultipliedAlpha: false }}
      onCreated={({ gl }) => gl.setClearAlpha(0)}
    >
      <TransparentBackground />
      <Suspense fallback={null}>
        <ambientLight intensity={0.5} />
        {isDark && <pointLight position={[-1, -10, -10]} />}
        <spotLight position={[5, 5, -10]} angle={0.15} penumbra={1} />

        <Diamond isDark={isDark} />
        <Environment resolution={64}>
          <Lightformer intensity={2} color="white" position={[0, 5, -5]} scale={[10, 10, 1]} />
          <Lightformer intensity={1} color="white" position={[-5, 1, 1]} rotation={[0, Math.PI / 2, 0]} scale={[10, 5, 1]} />
          <Lightformer intensity={1} color="white" position={[5, 1, 1]} rotation={[0, -Math.PI / 2, 0]} scale={[10, 5, 1]} />
        </Environment>

        <OrbitControls
          ref={controlsRef}
          makeDefault
          enableRotate={false}
          enablePan={false}
          enableZoom={false}
          autoRotateSpeed={-0.2}
          minPolarAngle={0}
          maxPolarAngle={Math.PI / 2}
        />
        <AutoRotateGate controlsRef={controlsRef} z={z} />
        <ScrollCamera progress={phone} />

        <EffectComposer>
          <Bloom luminanceThreshold={1} intensity={isDark ? 7 : 2} levels={9} mipmapBlur />
        </EffectComposer>
      </Suspense>
    </Canvas>
  )
}
