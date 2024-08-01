export default `
    vec3 p = position.xyz;
    p += GerstnerWave(waveA, position.xyz);
    p += GerstnerWave(waveB, position.xyz);
    p += GerstnerWave(waveC, position.xyz);
    transformed += normalize(objectNormal) * p;

`