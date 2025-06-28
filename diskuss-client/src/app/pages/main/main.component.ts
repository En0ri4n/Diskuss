import { Component, ElementRef, AfterViewInit, ViewChild, OnDestroy } from '@angular/core';
import * as THREE from 'three';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
  imports: [
    RouterLink
  ]
})
export class MainComponent implements AfterViewInit, OnDestroy {
  @ViewChild('canvas') private canvasRef!: ElementRef;
  private renderer!: THREE.WebGLRenderer;
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private icosahedron!: THREE.Mesh;
  private frameId: number = 0;

  // Particle logic
  private particles!: THREE.Points;
  private particlePositions!: Float32Array;
  private particleSpeeds: number[] = [];
  private particleCount = 100;

  ngAfterViewInit(): void {
    this.initThree();
    this.animate();
  }

  private createCircleTexture(): THREE.Texture {
    const size = 128;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;

    const ctx = canvas.getContext('2d')!;
    const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
    gradient.addColorStop(0, 'white');
    gradient.addColorStop(1, 'transparent');

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
    ctx.fill();

    const texture = new THREE.Texture(canvas);
    texture.needsUpdate = true;
    return texture;
  }


  private initThree(): void {
    const canvas = this.canvasRef.nativeElement;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;

    // Set up renderer first
    this.renderer = new THREE.WebGLRenderer({ canvas, alpha: true });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(window.devicePixelRatio);

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    this.camera.position.z = 2.5;

    // Icosahedron
    const geometry = new THREE.IcosahedronGeometry(1.5, 0);
    const material = new THREE.MeshStandardMaterial({
      color: 0x0EF16E,
      flatShading: true,
      metalness: 0.5,
      roughness: 0.1,
    });
    this.icosahedron = new THREE.Mesh(geometry, material);
    this.scene.add(this.icosahedron);

    // Lights
    const ambientLight = new THREE.AmbientLight(0x404040, 2);
    const light = new THREE.PointLight(0xffffff, 100);
    ambientLight.position.set(0, 0, 0);
    light.position.set(5, 5, 5);
    this.scene.add(ambientLight, light);

    // Setup particles
    const { width: boundX, height: boundY } = this.getCanvasBoundsAtZ(0);
    this.particlePositions = new Float32Array(this.particleCount * 3);
    for (let i = 0; i < this.particleCount; i++) {
      this.particlePositions[i * 3] = (Math.random() - 0.5) * boundX;
      this.particlePositions[i * 3 + 1] = (Math.random() - 0.5) * boundY;
      this.particlePositions[i * 3 + 2] = 0;
      this.particleSpeeds.push((Math.random() - 0.5) * 0.01); // x speed
      this.particleSpeeds.push((Math.random() - 0.5) * 0.01); // y speed
    }

    const particleGeometry = new THREE.BufferGeometry();
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(this.particlePositions, 3));
    const particleMaterial = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.05,
      map: this.createCircleTexture(),
      transparent: true,
      alphaTest: 0.01,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    this.particles = new THREE.Points(particleGeometry, particleMaterial);
    this.scene.add(this.particles);
  }

  private getCanvasBoundsAtZ(z = 0): { width: number; height: number } {
    const fovInRadians = (this.camera.fov * Math.PI) / 180;
    const height = 2 * Math.tan(fovInRadians / 2) * Math.abs(this.camera.position.z - z);
    const width = height * this.camera.aspect;
    return { width, height };
  }

  private animate(): void {
    this.frameId = requestAnimationFrame(() => this.animate());

    this.icosahedron.rotation.x += 0.002;
    this.icosahedron.rotation.y += 0.002;
    this.icosahedron.position.y = Math.sin(Date.now() / 1000) * 0.1;

    const hue = (Date.now() / 100) % 360 / 360;
    // (this.icosahedron.material as THREE.MeshStandardMaterial).color.setHSL(hue, 1, 0.5);

    // Animate particles
    const bounds = this.getCanvasBoundsAtZ(0);
    const halfX = bounds.width / 2;
    const halfY = bounds.height / 2;

    for (let i = 0; i < this.particleCount; i++) {
      const xIndex = i * 3;
      const yIndex = i * 3 + 1;
      this.particlePositions[xIndex] += this.particleSpeeds[i * 2];
      this.particlePositions[yIndex] += this.particleSpeeds[i * 2 + 1];

      if (this.particlePositions[xIndex] > halfX || this.particlePositions[xIndex] < -halfX) {
        this.particleSpeeds[i * 2] *= -1;
      }
      if (this.particlePositions[yIndex] > halfY || this.particlePositions[yIndex] < -halfY) {
        this.particleSpeeds[i * 2 + 1] *= -1;
      }
    }

    (this.particles.geometry.attributes['position'] as THREE.BufferAttribute).needsUpdate = true;

    this.renderer.render(this.scene, this.camera);
  }

  ngOnDestroy(): void {
    if (this.frameId) {
      cancelAnimationFrame(this.frameId);
    }
  }

  protected readonly window = window;
}
