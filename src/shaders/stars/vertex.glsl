uniform vec3 uColorA;
uniform vec3 uColorB;
uniform float uSize;

varying vec3 vColor;

float random(vec2 st) {
        return fract(sin(dot(st.xy,
                        vec2(12.9898,78.233)))*
    43758.5453123);
}

void main()
{

    float randomFactor = fract(sin(dot(position.xz, vec2(12.9898,78.233)))*43758.5453123);

	vec4 modelViewPosition = modelViewMatrix * vec4(position, 1.0);
	vec4 projectedPosition = projectionMatrix * modelViewPosition;
    gl_Position = projectedPosition;

    gl_PointSize = uSize * randomFactor;

    

    vColor = mix(uColorA, uColorB, randomFactor);

}