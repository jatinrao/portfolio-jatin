'use client'

import { Suspense, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Bounds, Environment, Lightformer, useAnimations, useGLTF } from '@react-three/drei'

const MODEL_PATH = '/wall-e.glb'
const DRACO_DECODER_PATH = '/draco/'

/**
 * Unlike the Atom/MacBook (hand-tuned camera + geometry authored/adapted for
 * this exact use), this model's own scale/proportions were never tuned for
 * a tiny corner icon — `Bounds` auto-frames whatever it wraps instead of a
 * manually guessed camera distance.
 */
function Model() {
  const { scene, animations } = useGLTF(MODEL_PATH, DRACO_DECODER_PATH)
  const { actions, names } = useAnimations(animations, scene)

  useEffect(() => {
    const action = actions[names[0]]
    action?.reset().play()
    return () => {
      action?.stop()
    }
  }, [actions, names])

  // dispose={null}: useGLTF caches `scene` by URL — letting R3F's default
  // unmount cleanup dispose it would break the cache on the next mount
  // (scrolling back into the Projects room).
  return <primitive object={scene} dispose={null} />
}

function TransparentBackground() {
  useFrame(({ gl }) => gl.setClearAlpha(0))
  return null
}

export default function RoomIconProjects() {
  return (
    <Canvas
      dpr={[1, 2]}
      camera={{ fov: 35 }}
      gl={{ alpha: true, premultipliedAlpha: false }}
      onCreated={({ gl }) => gl.setClearAlpha(0)}
    >
      <TransparentBackground />
      <ambientLight intensity={0.6} />
      <directionalLight position={[3, 5, 2]} intensity={1.2} />
      <Suspense fallback={null}>
        <Bounds fit clip observe margin={1.2}>
          <Model />
        </Bounds>
        <Environment resolution={64}>
          <Lightformer intensity={2} color="white" position={[0, 5, -5]} scale={[10, 10, 1]} />
          <Lightformer intensity={1} color="white" position={[-5, 1, 1]} rotation={[0, Math.PI / 2, 0]} scale={[10, 5, 1]} />
          <Lightformer intensity={1} color="white" position={[5, 1, 1]} rotation={[0, -Math.PI / 2, 0]} scale={[10, 5, 1]} />
        </Environment>
      </Suspense>
    </Canvas>
  )
}
