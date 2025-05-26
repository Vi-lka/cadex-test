import { BufferGeometry, Float32BufferAttribute } from 'three';

export default class PyramidGeometry extends BufferGeometry {
  constructor(width = 1, height = 1, depth = 1) {
    super();
    
    const hw = width / 2;
    const hh = height / 2;
    const hd = depth / 2;

    // 5 vertices: 4 for the base, 1 for the apex
    const vertices = new Float32Array([
      // Base (y = -height/2)
      -hw, -hh, hd,  // 1
      hw, -hh, hd,   // 2
      hw, -hh, -hd,  // 3
      -hw, -hh, -hd, // 4
      // Apex (y = height/2)
      0, hh, 0,      // 5
    ]);

    // Indices for 6 triangles (4 sides + 2 for base)
    const indices = [
      0, 1, 4,  // 1
      1, 2, 4,  // 2
      2, 3, 4,  // 3
      3, 0, 4,  // 4
      0, 3, 2,  // 5 (Base)
      0, 2, 1,  // 6 (Base)
    ];

    // Set attributes
    this.setIndex(indices);
    this.setAttribute('position', new Float32BufferAttribute(vertices, 3));

    this.computeVertexNormals();
  }
}