// 구멍이 있는 판의 삼각형 메시 (FEM 제1강 그림 1용 개념도, 빌드 시점에만 실행).
//
// 만드는 방법 (O-grid 방식):
// 1. 외곽 사각형 경계에 절점을 놓는다. 네 모서리는 반드시 절점이 된다.
// 2. 외곽 절점과 같은 개수의 구멍 경계 절점을 원 위에 같은 간격으로 놓고, 순서대로 짝을 짓는다.
//    → 구멍 경계 절점은 모두 원 위에 있고, 원은 이 절점들을 잇는 짧은 직선 변(내접 다각형)으로 근사된다.
// 3. 짝지은 구멍 절점과 외곽 절점을 잇는 선분 위에 링 절점을 둔다(구멍 쪽을 더 촘촘하게).
// 4. 이웃한 두 선분과 두 링 사이의 사각형을 대각선 하나로 나눠 삼각형 두 개를 만든다.
//
// 모든 절점은 구멍 원 위 또는 바깥에 있고, 구멍 안쪽(내접 다각형 내부)에는 요소가 없다.
// 검증 조건(양의 면적, 겹침 없음, 면적 합 = 판 − 구멍 다각형)은 scratchpad 검사 스크립트로 확인한다.

export interface PlateWithHole {
  /** 판의 가로·세로 길이 (중심은 원점) */
  width: number;
  height: number;
  /** 원형 구멍 반지름 (중심은 원점) */
  radius: number;
}

export interface TriMesh {
  nodes: [number, number][];
  /** 반시계 방향 절점 번호 세 개 */
  triangles: [number, number, number][];
  /** 구멍 경계 절점 번호 (원 위의 절점, 반시계 순서) */
  holeNodes: number[];
}

export interface MeshDensity {
  /** 외곽 가로 변 하나의 분할 수 */
  segmentsX: number;
  /** 외곽 세로 변 하나의 분할 수 */
  segmentsY: number;
  /** 구멍과 외곽 사이의 링 개수 */
  rings: number;
  /** 링 간격 비율 (1이면 균일, 1보다 크면 구멍 쪽이 촘촘) */
  grading: number;
}

/** 외곽 사각형 경계 절점 (오른쪽 변 중앙에서 시작해 반시계 방향, 모서리 포함) */
function outerBoundary(plate: PlateWithHole, d: MeshDensity): [number, number][] {
  const hx = plate.width / 2;
  const hy = plate.height / 2;
  const pts: [number, number][] = [];
  const halfY = d.segmentsY / 2;
  // 오른쪽 변 위쪽 절반: (hx, 0) → (hx, hy)
  for (let i = 0; i < halfY; i++) pts.push([hx, (hy * i) / halfY]);
  // 위쪽 변: (hx, hy) → (−hx, hy)
  for (let i = 0; i < d.segmentsX; i++) pts.push([hx - (plate.width * i) / d.segmentsX, hy]);
  // 왼쪽 변: (−hx, hy) → (−hx, −hy)
  for (let i = 0; i < d.segmentsY; i++) pts.push([-hx, hy - (plate.height * i) / d.segmentsY]);
  // 아래쪽 변: (−hx, −hy) → (hx, −hy)
  for (let i = 0; i < d.segmentsX; i++) pts.push([-hx + (plate.width * i) / d.segmentsX, -hy]);
  // 오른쪽 변 아래쪽 절반: (hx, −hy) → (hx, 0) 직전
  for (let i = 0; i < halfY; i++) pts.push([hx, -hy + (hy * i) / halfY]);
  return pts;
}

export function plateWithHoleMesh(plate: PlateWithHole, density: MeshDensity): TriMesh {
  if (density.segmentsY % 2 !== 0) throw new Error('segmentsY는 짝수여야 합니다 (오른쪽 변 중앙에서 시작).');
  if (plate.radius <= 0 || 2 * plate.radius >= Math.min(plate.width, plate.height)) {
    throw new Error('구멍은 판 안에 있어야 합니다.');
  }
  const outer = outerBoundary(plate, density);
  const rays = outer.length;
  const rings = density.rings;

  // 링 위치 t_k ∈ [0, 1]: 0 = 구멍 경계, 1 = 외곽 경계 (등비 간격)
  const g = density.grading;
  const steps = Array.from({ length: rings }, (_, k) => g ** k);
  const total = steps.reduce((s, v) => s + v, 0);
  const t: number[] = [0];
  for (const step of steps) t.push(t.at(-1)! + step / total);
  t[rings] = 1;

  const nodes: [number, number][] = [];
  const id = (ray: number, ring: number) => ring * rays + (ray % rays);
  for (let k = 0; k <= rings; k++) {
    for (let i = 0; i < rays; i++) {
      const [ox, oy] = outer[i];
      // 구멍 절점 각도: 외곽 둘레를 따라 잰 위치 비율과 같은 비율로 원을 균등 분할
      // (외곽 절점이 둘레 위에 같은 간격이면 구멍 절점도 원 위에 같은 간격으로 놓인다)
      const angle = (2 * Math.PI * i) / rays;
      const hx = plate.radius * Math.cos(angle);
      const hy = plate.radius * Math.sin(angle);
      nodes.push(k === rings ? [ox, oy] : [hx + t[k] * (ox - hx), hy + t[k] * (oy - hy)]);
    }
  }

  const triangles: [number, number, number][] = [];
  for (let k = 0; k < rings; k++) {
    for (let i = 0; i < rays; i++) {
      const a = id(i, k); // 안쪽 링, 현재 선분
      const b = id(i + 1, k); // 안쪽 링, 다음 선분
      const c = id(i + 1, k + 1); // 바깥 링, 다음 선분
      const d = id(i, k + 1); // 바깥 링, 현재 선분
      // 반시계 방향 순서로 저장한다. 사각형의 두 대각선 중 짧은 쪽으로 나눠 납작한 삼각형을 줄인다
      const dist = (p: number, q: number) => Math.hypot(nodes[p][0] - nodes[q][0], nodes[p][1] - nodes[q][1]);
      if (dist(a, c) <= dist(b, d)) {
        triangles.push([a, c, b], [a, d, c]);
      } else {
        triangles.push([a, d, b], [b, d, c]);
      }
    }
  }
  return { nodes, triangles, holeNodes: Array.from({ length: rays }, (_, i) => id(i, 0)) };
}
