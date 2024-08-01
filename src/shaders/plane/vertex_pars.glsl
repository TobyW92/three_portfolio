uniform float uTime;
uniform vec4 waveA;
uniform vec4 waveB;
uniform vec4 waveC;

vec3 GerstnerWave (vec4 wave, vec3 p) {
  float steepness = wave.z;
  float wavelength = wave.w;
  float k = 2.0 * PI / wavelength;
  float c = sqrt(9.8 / k);
  vec2 d = normalize(wave.xy);
  float f = k * (dot(d, p.xy) - c * (uTime*0.001));
  float a = steepness / k;

  return vec3(
    d.x * (a * cos(f)),
    d.y * (a * cos(f)),
    a * sin(f)
  );
}