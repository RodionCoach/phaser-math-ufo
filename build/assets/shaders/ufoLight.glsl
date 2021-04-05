#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

uniform sampler2D iChannel0;
uniform sampler2D iChannel1;

varying vec2 fragCoord;

void main( void ) {
  vec2 vUv = fragCoord.xy/resolution;

  vec4 back = texture2D( iChannel0, vec2(vUv.x, -vUv.y));

  vec2 uv = vUv;
  float xx = uv.x;
  float yyP = clamp(uv.y + 1.0, 0.0, 1.0) + cos(0.25 + sin(time)) * (1.0-uv.y) * 0.1;
  float yyM = clamp(uv.y + 1.0, 0.0, 1.0) - cos(0.75 - sin(time)) * (1.0-uv.y) * 0.1;
  vec4 light = texture2D( iChannel1, vec2(xx + mix(yyP, yyM, uv.x), -vUv.y));

  gl_FragColor = vec4(back.rgb + back.rgb * light.rgb * 0.75, 1.0);
}
