import Building from "./Building"

export default function City() {

  const buildings = []

  for (let x = -5; x < 5; x++) {
    for (let z = -5; z < 5; z++) {

      const height = Math.random() * 5 + 1

      buildings.push(
        <Building
          key={`${x}-${z}`}
          position={[x * 2, z * 2]}
          height={height}
        />
      )
    }
  }

  return <>{buildings}</>
}