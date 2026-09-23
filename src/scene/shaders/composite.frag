// Dark grainy background; the hidden world shows through where the mask is bright,
// with a noisy edge, drag-direction distortion and a little chromatic split.
// Mixing happens in sRGB so ghost/edge amounts read the way they look.
uniform sampler2D uMask;
uniform sampler2D uHidden;
uniform vec2 uResolution;
uniform float uTime;
uniform vec3 uBg;
uniform vec3 uAccent;
uniform float uGhost;

varying vec2 vUv;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
             mix(hash(i + vec2(0.0, 1.0)), hash(i + 1.0), u.x), u.y);
}

void main() {
  vec2 aspect = vec2(uResolution.x / uResolution.y, 1.0);
  float n = noise(vUv * aspect * 5.0 + uTime * 0.2) - 0.5;

  vec4 m = texture2D(uMask, vUv + n * 0.02);
  vec2 velocity = m.gb - 0.5;
  float mask = smoothstep(0.08, 0.7, m.r + n * 0.3 * m.r);

  vec2 huv = vUv - velocity * mask * 0.05;
  float split = mask * (1.0 - mask) * 0.015 + length(velocity) * mask * 0.012;
  vec2 dir = normalize(velocity + vec2(1e-5));
  vec4 hr = texture2D(uHidden, huv + dir * split);
  vec4 hg = texture2D(uHidden, huv);
  vec4 hb = texture2D(uHidden, huv - dir * split);
  vec3 hidden = pow(vec3(hr.r, hg.g, hb.b), vec3(1.0 / 2.2));
  float alpha = max(hg.a, max(hr.a, hb.a));

  float grain = (hash(vUv * uResolution + fract(uTime) * 91.0) - 0.5) * 0.02;
  vec3 color = uBg + grain;
  color = mix(color, hidden, alpha * mix(uGhost, 1.0, mask));

  float edge = smoothstep(0.0, 0.45, mask) * (1.0 - smoothstep(0.45, 1.0, mask));
  color += uAccent * edge * 0.1;

  gl_FragColor = vec4(color, 1.0);
}
