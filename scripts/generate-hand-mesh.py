"""Build an original, continuous illustrative hand surface; standard library only.

Rounded palm + tapered, articulated finger/thumb volumes are smoothly joined.
Marching tetrahedra extracts their zero surface. Normals come from the field,
so the Canvas renderer can shade the silhouette without visible component seams.
This is designed geometry, not a scan or a Neuralangelo reconstruction.
"""
from pathlib import Path
from collections import Counter, defaultdict
import json
import math


def capsule(p, a, b, ra, rb):
    delta = [b[i] - a[i] for i in range(3)]
    q = [p[i] - a[i] for i in range(3)]
    h = max(0, min(1, sum(q[i] * delta[i] for i in range(3)) /
                   sum(v * v for v in delta)))
    return math.sqrt(sum((q[i] - delta[i] * h) ** 2 for i in range(3))) - (ra + (rb - ra) * h)


def smooth_union(a, b, k):
    h = max(k - abs(a - b), 0) / k
    return min(a, b) - h * h * k * .25


# A relaxed, slightly spread hand: index, middle, ring and little fingers.
# Each chain narrows through two joints toward a rounded fingertip.
chains = [
    ([(-.48, .40, .00), (-.61, 1.06, .01), (-.66, 1.56, .06), (-.67, 1.91, .13)], [.185, .158, .137, .115]),
    ([(-.12, .49, .00), (-.14, 1.23, .00), (-.14, 1.83, .04), (-.14, 2.20, .11)], [.19, .164, .14, .12]),
    ([(.25, .44, .00), (.32, 1.13, .00), (.39, 1.65, .05), (.42, 1.99, .13)], [.18, .15, .13, .11]),
    ([(.55, .26, .00), (.71, .78, .02), (.83, 1.18, .08), (.89, 1.45, .16)], [.154, .13, .113, .094]),
    # Thumb emerges from its thenar pad and opposes the palm, out of plane.
    ([(-.47, -.43, .12), (-.85, -.10, .20), (-1.13, .20, .30), (-1.35, .43, .38)], [.28, .224, .18, .15]),
]


def field(p):
    x, y, z = p
    # Rounded rectangular palm: broad knuckle end and narrower heel.
    width = .48 + .11 * max(0, min(1, (y + .65) / 1.1))
    q = [abs(x) - width, abs(y + .12) - .52, abs(z) - .115]
    value = math.sqrt(sum(max(v, 0) ** 2 for v in q)) + min(max(q), 0) - .13
    value = smooth_union(value, capsule(p, (0, -.62, 0), (.035, -1.29, -.025), .34, .295), .18)
    for points, radii in chains:
        for i in range(len(points) - 1):
            value = smooth_union(value, capsule(p, points[i], points[i + 1], radii[i], radii[i + 1]), .09)
    # Small asymmetry on the palm provides a gentle, unified heel bulge.
    pad = math.sqrt(((x + .27) / .36) ** 2 + ((y + .28) / .49) ** 2 + ((z - .12) / .20) ** 2)
    return smooth_union(value, (pad - 1) * .20, .10)


def normal(p):
    eps = .001
    n = []
    for i in range(3):
        a, b = list(p), list(p)
        a[i] += eps
        b[i] -= eps
        n.append(field(a) - field(b))
    length = math.sqrt(sum(v * v for v in n)) or 1
    return [v / length for v in n]


def build():
    step = .10
    origin = (-1.60, -1.68, -.53)
    shape = (30, 43, 16)
    points, values = [], []
    for z in range(shape[2]):
        for y in range(shape[1]):
            for x in range(shape[0]):
                p = tuple(origin[i] + v * step for i, v in enumerate((x, y, z)))
                points.append(p)
                values.append(field(p))

    def idx(x, y, z):
        return x + shape[0] * (y + shape[1] * z)

    positions, normals, triangles, edges = [], [], [], {}

    def vertex(a, b):
        key = tuple(sorted((a, b)))
        if key not in edges:
            t = values[a] / (values[a] - values[b])
            p = tuple(points[a][i] + t * (points[b][i] - points[a][i]) for i in range(3))
            edges[key] = len(positions) // 3
            # Center the geometry for the existing drawing coordinate system.
            positions.extend(round(v, 4) for v in (p[0] + .18, p[1] - .33, p[2]))
            normals.extend(round(v, 4) for v in normal(p))
        return edges[key]

    def triangle(a, b, c):
        pa, pb, pc = [positions[i * 3:i * 3 + 3] for i in (a, b, c)]
        u, v = [[p[i] - pa[i] for i in range(3)] for p in (pb, pc)]
        cross = [u[1]*v[2]-u[2]*v[1], u[2]*v[0]-u[0]*v[2], u[0]*v[1]-u[1]*v[0]]
        n = normals[a * 3:a * 3 + 3]
        if sum(cross[i]*n[i] for i in range(3)) < 0:
            b, c = c, b
        triangles.extend((a, b, c))

    tetrahedra = [(0,5,1,6), (0,1,2,6), (0,2,3,6), (0,3,7,6), (0,7,4,6), (0,4,5,6)]
    corners = [(0,0,0),(1,0,0),(1,1,0),(0,1,0),(0,0,1),(1,0,1),(1,1,1),(0,1,1)]
    for z in range(shape[2] - 1):
        for y in range(shape[1] - 1):
            for x in range(shape[0] - 1):
                cube = [idx(x+dx, y+dy, z+dz) for dx,dy,dz in corners]
                if all(values[i] > 0 for i in cube) or all(values[i] < 0 for i in cube):
                    continue
                for tet in tetrahedra:
                    inside = [cube[i] for i in tet if values[cube[i]] < 0]
                    outside = [cube[i] for i in tet if values[cube[i]] >= 0]
                    if len(inside) == 1 or len(inside) == 3:
                        a, rest = (inside[0], outside) if len(inside) == 1 else (outside[0], inside)
                        triangle(*(vertex(a, b) for b in rest))
                    elif len(inside) == 2:
                        a, b = inside
                        c, d = outside
                        ac, ad, bc, bd = vertex(a,c), vertex(a,d), vertex(b,c), vertex(b,d)
                        triangle(ac, ad, bc)
                        triangle(ad, bd, bc)
    return dict(positions=positions, normals=normals, triangles=triangles)


def validate(mesh):
    edges, neighbors = Counter(), defaultdict(set)
    for i in range(0, len(mesh['triangles']), 3):
        a, b, c = mesh['triangles'][i:i+3]
        for x, y in ((a, b), (b, c), (c, a)):
            edges[tuple(sorted((x, y)))] += 1
            neighbors[x].add(y)
            neighbors[y].add(x)
    assert all(count == 2 for count in edges.values()), 'Surface has open or non-manifold edges'
    visited, pending = {0}, [0]
    while pending:
        for vertex in neighbors[pending.pop()] - visited:
            visited.add(vertex)
            pending.append(vertex)
    assert len(visited) == len(mesh['positions']) // 3, 'Surface has disconnected components'


if __name__ == '__main__':
    mesh = build()
    validate(mesh)
    target = Path(__file__).resolve().parents[1] / 'assets/js/figures/hand-mesh.js'
    target.write_text('/* Original illustrative hand mesh. Generated by scripts/generate-hand-mesh.py; not scan data. */\nFig.handMesh=' + json.dumps(mesh, separators=(',', ':')) + ';\n', encoding='utf-8')
    print(f'{len(mesh["positions"])//3} vertices, {len(mesh["triangles"])//3} triangles; {target.stat().st_size} bytes')
