uniform float uTime;
uniform float uBigWavesElevation;
uniform vec2 uBigWavesFrequency;
uniform float uBigWavesSpeed;
uniform vec3 uDepthColor;
uniform vec3 uSurfaceColor;

varying vec3 vDepthColor;
varying vec3 vSurfaceColor;

void main() {
	vec4 modelPosition = modelMatrix * vec4(position, 1.0);

	/* Elevation */
	float elevation = +sin(modelPosition.x * uBigWavesFrequency.x + uTime * uBigWavesSpeed) * sin(modelPosition.z * uBigWavesFrequency.y + uTime * uBigWavesSpeed) * uBigWavesElevation;
	modelPosition.y += elevation;
	vec4 viewPosition = viewMatrix * modelPosition;
	vec4 projectedPosition = projectionMatrix * viewPosition;

	vDepthColor = uDepthColor;
	vSurfaceColor = uSurfaceColor;

	gl_Position = projectedPosition;
}