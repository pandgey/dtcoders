export default function Building({ position, height }) {
  return (
    <mesh position={[position[0], height / 2, position[1]]}>
      <boxGeometry args={[1, height, 1]} />
      <meshStandardMaterial color="orange" />
    </mesh>
  )
}