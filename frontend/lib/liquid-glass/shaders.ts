export const VERT = `#version 300 es
in vec2 aPos;
out vec2 vUv;
void main() {
  vUv = aPos * 0.5 + 0.5;
  gl_Position = vec4(aPos, 0.0, 1.0);
}
`

export const FRAG = `#version 300 es
precision highp float;

in vec2 vUv;
out vec4 fragColor;

uniform sampler2D uTexture;
uniform float uHasTexture;
uniform vec2 uResolution;
uniform vec2 uPointer;
uniform float uRadius;
uniform float uRefraction;
uniform float uDispersion;
uniform vec3 uTint;
uniform float uTintAmount;
uniform float uClear;
uniform float uReduceMotion;

float sdRoundRect(vec2 p, vec2 b, float r) {
  vec2 q = abs(p) - b + r;
  return min(max(q.x, q.y), 0.0) + length(max(q, 0.0)) - r;
}

void main() {
  vec2 frag = vUv * uResolution;
  vec2 center = uResolution * 0.5;
  vec2 size = uResolution * 0.5 - 1.0;
  float r = min(uRadius, min(size.x, size.y));
  float d = sdRoundRect(frag - center, size, r);
  if (d > 1.0) discard;

  float e = 1.5;
  vec2 n = normalize(vec2(
    sdRoundRect(frag + vec2(e, 0.0) - center, size, r) - sdRoundRect(frag - vec2(e, 0.0) - center, size, r),
    sdRoundRect(frag + vec2(0.0, e) - center, size, r) - sdRoundRect(frag - vec2(0.0, e) - center, size, r)
  ) + 1e-5);

  float edge = 1.0 - smoothstep(-18.0, 0.0, d);
  vec2 offset = n * uRefraction * edge;

  vec3 color = uTint;
  if (uHasTexture > 0.5) {
    vec2 uvR = clamp(vUv - offset * (1.0 + uDispersion), 0.0, 1.0);
    vec2 uvG = clamp(vUv - offset, 0.0, 1.0);
    vec2 uvB = clamp(vUv - offset * (1.0 - uDispersion), 0.0, 1.0);
    color = vec3(
      texture(uTexture, uvR).r,
      texture(uTexture, uvG).g,
      texture(uTexture, uvB).b
    );
  }

  vec2 light = uReduceMotion > 0.5 ? vec2(-0.35, 0.55) : (uPointer * 2.0 - 1.0);
  vec3 N = normalize(vec3(n * edge, 1.0));
  vec3 L = normalize(vec3(light, 0.85));
  float spec = pow(max(dot(N, L), 0.0), 28.0);

  vec3 tinted = mix(color, uTint, uTintAmount * 0.4);
  tinted += spec * 0.55;
  tinted *= mix(0.72, 1.0, edge);

  float alpha = uHasTexture > 0.5
    ? mix(0.78, 0.32, uClear)
    : mix(0.22, 0.08, uClear) + spec * 0.35;

  fragColor = vec4(tinted, clamp(alpha, 0.0, 0.92));
}
`
