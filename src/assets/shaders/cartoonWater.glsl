---
uniform.isFoam: { "type": "1f", "value": 0.0 }
---

#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform float isFoam;

uniform sampler2D iChannel0;
uniform sampler2D iChannel1;
uniform sampler2D iChannel2;

varying vec2 fragCoord;

vec3 lig = normalize(vec3(0.9,0.35,-0.2));

void main( void ) {
  vec2 vUv = 2.0 * fragCoord.xy/resolution;

  vec3 gradient = texture2D(iChannel0, -vUv * 0.498).rgb;

  vec2 position = vUv * 10.0;
  float speed = 5.0;
  float brightness = 5.0;

  vec3 nor = vec3( 0.0, 1.0, 0.0 );
  float dif = max(dot(nor,lig),0.0);

  vec3 pos = vec3( position.x - 0.5, position.y, 0.0 );

  float timeScale = time * speed;

  float g = pow(vUv.y - 0.9, 30.0);
  float cc  = 0.2*texture2D( iChannel2, 1.8*0.06*pos.xy + 0.14*timeScale*vec2( 0.0, 0.4) ).r;
  cc += 0.25*texture2D( iChannel2, 1.8*0.04*pos.xy - 0.11*timeScale*vec2( 0.0, 0.5) ).r;
  cc += 0.10*texture2D( iChannel2, 1.8*0.08*pos.xy * vec2(0.75, 1.0) - 0.14*timeScale*vec2(0.0,1.0) ).r * g;
  cc = 0.6*(1.0-smoothstep( 0.0, 0.1, abs(cc-0.4))) +
  0.4*(1.0-smoothstep( 0.0, 0.5, abs(cc-0.4)));

  vec3 col = clamp(vec3(1.0, 1.0, 1.0) * cc * pow(vUv.y - 0.8, 30.0), 0.0, 1.0) * 0.75;

  float speed2 = 7.0;
  float timeScale2 = time * speed2;
  float cc2  = 0.35*texture2D( iChannel1, 1.8*0.02*pos.xy - 0.007*timeScale2*vec2( 0.0, 1.0) ).x;
  cc2 += 0.15*texture2D( iChannel1, 1.8*0.04*pos.xy - 0.011*timeScale2*vec2( -0.15, 1.0) ).x;
  cc2 += 0.05*texture2D( iChannel1, 1.8*0.08*pos.xy + 0.014*timeScale2*vec2( 0.15, 1.0) ).x;
  cc2 = 0.6*(1.0-smoothstep( 0.0, 0.025, abs(cc2-0.4))) +
  0.4*(1.0-smoothstep( 0.0, 0.15, abs(cc2-0.4)));

  vec3 col2 = vec3(1.0) * cc2;
  vec3 totalColor = col2 + col * isFoam;
  gl_FragColor = max(clamp(vec4(totalColor, 1.0), 0.0, 0.75) * max(totalColor.r, max(totalColor.g, totalColor.b)) + vec4(gradient, 1.0), vec4(col * isFoam, 1.0));
}
