import { ARView, Box } from 'react-native-arkit'

const ARPackagePreview = () => (
  <ARView
    style={{ flex: 1 }}
    enablePlaneDetection
    lightEstimationEnabled
  >
    <Box
      position={{ x: 0, y: 0, z: 0 }}
      shape={{ width: 0.3, height: 0.3, length: 0.3 }}
      material={{
        color: '#6C63FF',
        metalness: 0.8,
        roughness: 0.2
      }}
    />
  </ARView>
)