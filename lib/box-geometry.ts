import { BufferGeometry, Float32BufferAttribute } from "three";

export default class BoxGeometry extends BufferGeometry {
  constructor(width = 1, height = 1, depth = 1) {
    super();

    const hw = width / 2;
    const hh = height / 2;
    const hd = depth / 2;

    // We need 8 vertices of the box
    const vertices = new Float32Array([
      -hw, -hh, hd,  // 1
      hw, -hh, hd,   // 2
      hw, hh, hd,    // 3
      -hw, hh, hd,   // 4
      
      -hw, -hh, -hd, // 5
      hw, -hh, -hd,  // 6
      hw, hh, -hd,   // 7
      -hw, hh, -hd,  // 8
    ]);

    // 12 triangles (2 per face)
    const indices = [
      0, 1, 2,  0, 2, 3,  // 1
      5, 4, 7,  5, 7, 6,  // 2
      3, 2, 6,  3, 6, 7,  // 3
      4, 5, 1,  4, 1, 0,  // 4
      1, 5, 6,  1, 6, 2,  // 5
      4, 0, 3,  4, 3, 7,  // 6
    ];

    // Set attributes
    this.setIndex(indices);
    this.setAttribute('position', new Float32BufferAttribute(vertices, 3));

    this.computeVertexNormals();
  }
}