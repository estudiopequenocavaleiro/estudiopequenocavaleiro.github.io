// Gera um pequeno modelo de teste sem depender de arquivos externos.
const fs = require('node:fs');
const path = require('node:path');

const materials = [
  ['Pedra', [0.19, 0.23, 0.26, 1], 0.95, 0],
  ['Pedra clara', [0.32, 0.39, 0.41, 1], 0.92, 0],
  ['Aco', [0.73, 0.84, 0.87, 1], 0.28, 0.75],
  ['Aco escuro', [0.28, 0.35, 0.39, 1], 0.38, 0.65],
  ['Laranja', [1, 0.31, 0.09, 1], 0.5, 0.2],
  ['Ouro', [0.9, 0.61, 0.18, 1], 0.32, 0.7],
  ['Cabo', [0.16, 0.10, 0.09, 1], 0.88, 0]
];
const parts = [];

function part(material, draw) {
  const triangles = [];
  const tri = (a, b, c) => triangles.push([a, b, c]);
  const quad = (a, b, c, d) => { tri(a, b, c); tri(a, c, d); };
  draw({ tri, quad });
  parts.push({ material, triangles });
}

function box(material, x, y, z, w, h, d) {
  part(material, ({ quad }) => {
    const a = [x-w/2,y-h/2,z-d/2], b = [x+w/2,y-h/2,z-d/2];
    const c = [x+w/2,y+h/2,z-d/2], e = [x-w/2,y+h/2,z-d/2];
    const f = [x-w/2,y-h/2,z+d/2], g = [x+w/2,y-h/2,z+d/2];
    const i = [x+w/2,y+h/2,z+d/2], j = [x-w/2,y+h/2,z+d/2];
    quad(a,b,c,e); quad(g,f,j,i); quad(f,a,e,j);
    quad(b,g,i,c); quad(e,c,i,j); quad(f,g,b,a);
  });
}

function cylinder(material, cx, bottom, cz, radius, height, sides = 10) {
  part(material, ({ tri, quad }) => {
    for (let n=0; n<sides; n++) {
      const a=2*Math.PI*n/sides, b=2*Math.PI*(n+1)/sides;
      const p=[cx+radius*Math.cos(a),bottom,cz+radius*Math.sin(a)];
      const q=[cx+radius*Math.cos(b),bottom,cz+radius*Math.sin(b)];
      const r=[p[0],bottom+height,p[2]], s=[q[0],bottom+height,q[2]];
      quad(p,q,s,r);
      tri([cx,bottom,cz],q,p);
      tri([cx,bottom+height,cz],r,s);
    }
  });
}

// Pedestal e pedra onde a espada está fincada.
cylinder(0, 0, -0.85, 0, 0.82, 0.18, 12);
cylinder(1, 0, -0.67, 0, 0.63, 0.10, 10);
cylinder(0, 0, -0.57, 0, 0.48, 0.12, 9);
box(1, 0, -0.30, 0, 0.55, 0.46, 0.49);

// Lâmina facetada com ponta, guarda e cabo.
part(2, ({ tri, quad }) => {
  const left=[-0.16,0.26,0], right=[0.16,0.26,0];
  const upperLeft=[-0.13,1.56,0], upperRight=[0.13,1.56,0];
  const tip=[0,1.88,0];
  const ridgeBottom=[0,0.26,0.065], ridgeTop=[0,1.56,0.065];
  const backBottom=[0,0.26,-0.055], backTop=[0,1.56,-0.055];
  quad(left,ridgeBottom,ridgeTop,upperLeft);
  quad(ridgeBottom,right,upperRight,ridgeTop);
  tri(upperLeft,ridgeTop,tip); tri(ridgeTop,upperRight,tip);
  quad(right,backBottom,backTop,upperRight);
  quad(backBottom,left,upperLeft,backTop);
  tri(upperRight,backTop,tip); tri(backTop,upperLeft,tip);
});
box(3, 0, 0.24, 0, 0.54, 0.11, 0.18);
box(5, 0, 0.23, 0.13, 0.62, 0.07, 0.055);
box(6, 0, -0.04, 0, 0.11, 0.42, 0.11);
cylinder(5, 0, -0.31, 0, 0.11, 0.13, 8);
box(4, 0, 0.24, 0.20, 0.11, 0.11, 0.055);

// Escudo ao lado, com marca do estúdio.
box(3, 0.62, -0.22, -0.08, 0.54, 0.67, 0.09);
box(4, 0.62, -0.22, -0.02, 0.42, 0.55, 0.045);
box(5, 0.62, -0.22, 0.015, 0.08, 0.37, 0.025);
box(5, 0.62, -0.22, 0.015, 0.31, 0.08, 0.025);

const chunks = [], bufferViews = [], accessors = [], meshes = [], nodes = [];
let byteLength = 0;
function append(data) {
  const bytes = Buffer.from(data.buffer);
  const offset = byteLength;
  chunks.push(bytes);
  byteLength += bytes.length;
  bufferViews.push({ buffer: 0, byteOffset: offset, byteLength: bytes.length, target: 34962 });
  return bufferViews.length - 1;
}
for (const item of parts) {
  const positions = [], normals = [];
  for (const [a,b,c] of item.triangles) {
    const u=[b[0]-a[0],b[1]-a[1],b[2]-a[2]];
    const v=[c[0]-a[0],c[1]-a[1],c[2]-a[2]];
    const n=[u[1]*v[2]-u[2]*v[1],u[2]*v[0]-u[0]*v[2],u[0]*v[1]-u[1]*v[0]];
    const length=Math.hypot(...n) || 1;
    for (const vertex of [a,b,c]) { positions.push(...vertex); normals.push(...n.map(x=>x/length)); }
  }
  const positionView=append(new Float32Array(positions));
  const normalView=append(new Float32Array(normals));
  const positionAccessor=accessors.push({ bufferView: positionView, componentType: 5126, count: positions.length/3, type: 'VEC3', min: [Math.min(...positions.filter((_,i)=>i%3===0)),Math.min(...positions.filter((_,i)=>i%3===1)),Math.min(...positions.filter((_,i)=>i%3===2))], max: [Math.max(...positions.filter((_,i)=>i%3===0)),Math.max(...positions.filter((_,i)=>i%3===1)),Math.max(...positions.filter((_,i)=>i%3===2))] })-1;
  const normalAccessor=accessors.push({ bufferView: normalView, componentType: 5126, count: normals.length/3, type: 'VEC3' })-1;
  meshes.push({ primitives: [{ attributes: { POSITION: positionAccessor, NORMAL: normalAccessor }, material: item.material, mode: 4 }] });
  nodes.push({ mesh: meshes.length-1 });
}
const gltf = {
  asset: { version: '2.0', generator: 'Estúdio Pequeno Cavaleiro demo' },
  scene: 0, scenes: [{ nodes: nodes.map((_,i)=>i) }], nodes, meshes,
  materials: materials.map(([name, color, roughness, metallic]) => ({ name, doubleSided: true, pbrMetallicRoughness: { baseColorFactor: color, metallicFactor: metallic, roughnessFactor: roughness } })),
  accessors, bufferViews, buffers: [{ byteLength }]
};
const json=Buffer.from(JSON.stringify(gltf));
const paddedJson=Buffer.alloc(Math.ceil(json.length/4)*4, 0x20); json.copy(paddedJson);
const binary=Buffer.concat(chunks);
const paddedBinary=Buffer.alloc(Math.ceil(binary.length/4)*4); binary.copy(paddedBinary);
const header=Buffer.alloc(12), jsonHeader=Buffer.alloc(8), binHeader=Buffer.alloc(8);
header.write('glTF'); header.writeUInt32LE(2,4); header.writeUInt32LE(12+8+paddedJson.length+8+paddedBinary.length,8);
jsonHeader.writeUInt32LE(paddedJson.length,0); jsonHeader.write('JSON',4);
binHeader.writeUInt32LE(paddedBinary.length,0); binHeader.write('BIN\0',4);
fs.writeFileSync(path.join(__dirname,'espada-demo.glb'), Buffer.concat([header,jsonHeader,paddedJson,binHeader,paddedBinary]));
