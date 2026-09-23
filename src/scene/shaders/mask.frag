// Trail mask, ping-ponged every frame.
// r = reveal intensity, gb = brush velocity (encoded around 0.5).
uniform sampler2D uPrev;
uniform vec2 uPointer;
uniform vec2 uPrevPointer;
uniform float uAspect;
uniform float uRadius;
uniform float uStrength;
uniform float uDecay;

varying vec2 vUv;

float segmentDistance(vec2 p, vec2 a, vec2 b) {
  vec2 pa = p - a;
  vec2 ba = b - a;
  float h = clamp(dot(pa, ba) / max(dot(ba, ba), 1e-6), 0.0, 1.0);
  return length(pa - ba * h);
}

void main() {
  vec4 prev = texture2D(uPrev, vUv);
  vec2 aspect = vec2(uAspect, 1.0);

  // The linear term makes sure 8-bit values always reach zero.
  float intensity = prev.r * uDecay - 0.003;
  vec2 velocity = (prev.gb - 0.5) * uDecay;

  // Drawing a capsule from the last pointer position to this one keeps fast strokes gap-free.
  float d = segmentDistance(vUv * aspect, uPrevPointer * aspect, uPointer * aspect);
  float brush = (1.0 - smoothstep(uRadius * 0.2, uRadius, d)) * uStrength;

  intensity = clamp(intensity + brush * 0.35, 0.0, 1.0);
  vec2 move = (uPointer - uPrevPointer) * aspect;
  velocity = mix(velocity, clamp(move * 12.0, -0.5, 0.5), brush);

  gl_FragColor = vec4(intensity, velocity + 0.5, 1.0);
}
