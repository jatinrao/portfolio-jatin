'use client'

import { Suspense, useEffect, useMemo, useRef, type RefObject } from 'react'
import * as THREE from 'three'
import { Canvas, useFrame } from '@react-three/fiber'
import { Environment, useGLTF } from '@react-three/drei'

const MODEL_PATH = '/mac-draco.glb'
const HDR_PATH = '/dawn_1k.hdr'
const DRACO_DECODER_PATH = '/draco/'

const LID_CLOSED = 1.575
const LID_OPEN = -0.425
const LERP_FACTOR = 0.1

type MacGLTFResult = {
  nodes: {
    Cube008: THREE.Mesh
    Cube008_1: THREE.Mesh
    Cube008_2: THREE.Mesh
    keyboard: THREE.Mesh
    Cube002: THREE.Mesh
    Cube002_1: THREE.Mesh
    touchbar: THREE.Mesh
  }
  materials: {
    aluminium: THREE.Material
    'matte.001': THREE.Material
    'screen.001': THREE.Material
    keys: THREE.Material
    trackpad: THREE.Material
    touchbar: THREE.Material
  }
}

/**
 * Source drove the lid hinge and light color from a shared @react-spring
 * 0→1 value (not installed here, and the user opted against adding it for
 * one component). Replaced with the exact same per-frame
 * `THREE.MathUtils.lerp` technique the source already used for the body's
 * idle rotation/position — one shared `openT` ref, eased toward 0/1 each
 * frame, driving the hinge angle and light color the spring used to. Loses
 * spring overshoot/bounce, not correctness.
 */
function Model({ openRef }: { openRef: RefObject<boolean> }) {
  const group = useRef<THREE.Group>(null)
  const hinge = useRef<THREE.Group>(null)
  const light = useRef<THREE.PointLight>(null)
  const openT = useRef(0)
  const { nodes, materials } = useGLTF(MODEL_PATH, DRACO_DECODER_PATH) as unknown as MacGLTFResult

  const colorClosed = useMemo(() => new THREE.Color('#f0f0f0'), [])
  const colorOpen = useMemo(() => new THREE.Color('#d25578'), [])
  const tmpColor = useMemo(() => new THREE.Color(), [])

  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    const open = openRef.current
    if (group.current) {
      group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, open ? Math.cos(t / 10) / 10 + 0.25 : 0, LERP_FACTOR)
      group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, open ? Math.sin(t / 10) / 4 : 0, LERP_FACTOR)
      group.current.rotation.z = THREE.MathUtils.lerp(group.current.rotation.z, open ? Math.sin(t / 10) / 10 : 0, LERP_FACTOR)
      group.current.position.y = THREE.MathUtils.lerp(group.current.position.y, open ? (-2 + Math.sin(t)) / 3 : -4.3, LERP_FACTOR)
    }

    openT.current = THREE.MathUtils.lerp(openT.current, open ? 1 : 0, LERP_FACTOR)
    if (hinge.current) {
      hinge.current.rotation.x = THREE.MathUtils.lerp(LID_CLOSED, LID_OPEN, openT.current)
    }
    if (light.current) {
      tmpColor.lerpColors(colorClosed, colorOpen, openT.current)
      light.current.color.copy(tmpColor)
    }
  })

  return (
    <>
      <pointLight ref={light} position={[0, 0, 0]} intensity={1.5} />
      <group ref={group} dispose={null}>
        <group ref={hinge} position={[0, -0.04, 0.41]}>
          <group position={[0, 2.96, -0.13]} rotation={[Math.PI / 2, 0, 0]}>
            <mesh material={materials.aluminium} geometry={nodes.Cube008.geometry} />
            <mesh material={materials['matte.001']} geometry={nodes.Cube008_1.geometry} />
            <mesh material={materials['screen.001']} geometry={nodes.Cube008_2.geometry} />
          </group>
        </group>
        <mesh material={materials.keys} geometry={nodes.keyboard.geometry} position={[1.79, 0, 3.45]} />
        <group position={[0, -0.1, 3.39]}>
          <mesh material={materials.aluminium} geometry={nodes.Cube002.geometry} />
          <mesh material={materials.trackpad} geometry={nodes.Cube002_1.geometry} />
        </group>
        <mesh material={materials.touchbar} geometry={nodes.touchbar.geometry} position={[0, -0.03, 1.2]} />
      </group>
    </>
  )
}

export default function RoomIconExperience() {
  // Mounting this component at all already means the Experience room just
  // became active (see RoomsSection.tsx's mount gate) — no external trigger
  // needed, it opens itself once mounted, the lerp above providing the
  // "lid rising" animation. A ref (not state) so flipping it post-mount
  // doesn't need a render — useFrame reads it fresh every frame regardless.
  const openRef = useRef(false)
  useEffect(() => {
    openRef.current = true
  }, [])

  return (
    <Canvas
      dpr={[1, 2]}
      camera={{ position: [0, 0, -29], fov: 35 }}
      gl={{ alpha: true, premultipliedAlpha: false }}
      onCreated={({ gl }) => gl.setClearAlpha(0)}
      className='scale-125 -ml-4'
    >
      <Suspense fallback={null}>
        <group rotation={[0, Math.PI, 0]}>
          <Model openRef={openRef} />
        </group>
        <Environment files={HDR_PATH} />
      </Suspense>
    </Canvas>
  )
}
