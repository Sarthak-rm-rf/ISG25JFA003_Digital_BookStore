import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import * as THREE from 'three';

@Component({
  selector: 'app-shader-animation',
  standalone: true,
  template: `
    <div #container 
         class="shader-container" 
         [style.background]="'#000'"
         [style.overflow]="'hidden'">
    </div>
  `,
  styles: [`
    .shader-container {
      width: 100%;
      height: 100%;
      position: absolute;
      top: 0;
      left: 0;
    }
  `]
})
export class ShaderAnimationComponent implements OnInit, OnDestroy {
  @ViewChild('container', { static: true }) containerRef!: ElementRef<HTMLDivElement>;
  
  private scene?: {
    camera: THREE.Camera;
    scene: THREE.Scene;
    renderer: THREE.WebGLRenderer;
    uniforms: any;
    animationId: number;
  };

  // Shaders
  private vertexShader = `
    void main() {
      gl_Position = vec4(position, 1.0);
    }
  `;

  private fragmentShader = `
    #define TWO_PI 6.2831853072
    #define PI 3.14159265359

    precision highp float;
    uniform vec2 resolution;
    uniform float time;

    void main(void) {
      vec2 uv = (gl_FragCoord.xy * 2.0 - resolution.xy) / min(resolution.x, resolution.y);
      float t = time*0.05;
      float lineWidth = 0.002;

      vec3 color = vec3(0.0);
      for(int j = 0; j < 3; j++){
        for(int i=0; i < 5; i++){
          color[j] += lineWidth*float(i*i) / abs(fract(t - 0.01*float(j)+float(i)*0.01)*5.0 - length(uv) + mod(uv.x+uv.y, 0.2));
        }
      }
      
      gl_FragColor = vec4(color[0],color[1],color[2],1.0);
    }
  `;

  ngOnInit() {
    this.initThreeJs();
  }

  private initThreeJs() {
    const container = this.containerRef.nativeElement;

    // Initialize Three.js scene
    const camera = new THREE.Camera();
    camera.position.z = 1;

    const scene = new THREE.Scene();
    const geometry = new THREE.PlaneGeometry(2, 2);

    const uniforms = {
      time: { type: 'f', value: 1.0 },
      resolution: { type: 'v2', value: new THREE.Vector2() },
    };

    const material = new THREE.ShaderMaterial({
      uniforms: uniforms,
      vertexShader: this.vertexShader,
      fragmentShader: this.fragmentShader,
    });

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);

    container.appendChild(renderer.domElement);

    // Handle window resize
    const onWindowResize = () => {
      const width = container.clientWidth;
      const height = container.clientHeight;
      renderer.setSize(width, height);
      uniforms.resolution.value.x = renderer.domElement.width;
      uniforms.resolution.value.y = renderer.domElement.height;
    };

    // Initial resize
    onWindowResize();
    window.addEventListener('resize', onWindowResize, false);

    // Animation loop
    const animate = () => {
      if (!this.scene) return;
      
      const animationId = requestAnimationFrame(animate);
      this.scene.uniforms.time.value += 0.05;
      this.scene.renderer.render(this.scene.scene, this.scene.camera);
      this.scene.animationId = animationId;
    };

    // Store scene references for cleanup
    this.scene = {
      camera,
      scene,
      renderer,
      uniforms,
      animationId: 0,
    };

    // Start animation
    animate();
  }

  ngOnDestroy() {
    if (this.scene) {
      window.removeEventListener('resize', () => {});
      cancelAnimationFrame(this.scene.animationId);

      const container = this.containerRef.nativeElement;
      if (container && this.scene.renderer.domElement) {
        container.removeChild(this.scene.renderer.domElement);
      }

      this.scene.renderer.dispose();
    }
  }
}
