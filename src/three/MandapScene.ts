import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import {
  createMandalaCarpetTexture,
  createMarbleTexture,
  createContactShadowTexture,
  createPetalTexture
} from './proceduralTextures.ts';

export type CameraPreset = 'front' | 'havan' | 'thrones' | 'orbit';
export type LightingAmbiance = 'evening' | 'sunset' | 'midnight';

// Pre-allocated scratch vectors to prevent GC pauses
const _targetPos = new THREE.Vector3();
const _lookTarget = new THREE.Vector3();
const _dummyMatrix = new THREE.Matrix4();
const _dummyPosition = new THREE.Vector3();
const _dummyRotation = new THREE.Euler();
const _dummyScale = new THREE.Vector3();
const _petalQuat = new THREE.Quaternion();

interface PetalData {
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
  rotX: number;
  rotY: number;
  rotZ: number;
  vRotX: number;
  vRotY: number;
  scale: number;
}

export class MandapScene {
  private container: HTMLDivElement;
  private renderer!: THREE.WebGLRenderer;
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private controls!: OrbitControls;
  private animFrameId: number | null = null;
  private clock = new THREE.Clock();

  // Lights
  private keyLight!: THREE.DirectionalLight;
  private fillLight!: THREE.HemisphereLight;
  private havanFireLight!: THREE.PointLight;
  private diyaLights: THREE.PointLight[] = [];

  // Particle systems & animated elements
  private petalMesh!: THREE.InstancedMesh;
  private petalCount = 140;
  private petals: PetalData[] = [];
  private flameParticles: THREE.Points[] = [];
  private havanFlamesGroup!: THREE.Group;
  private starField: THREE.Points | null = null;

  // Camera state & damping
  private currentPreset: CameraPreset = 'front';
  private currentAmbiance: LightingAmbiance = 'evening';
  private cameraTargetPos = new THREE.Vector3(0, 3.8, 11);
  private cameraTargetLook = new THREE.Vector3(0, 2.2, 0);
  private isAutoOrbiting = false;
  private orbitAngle = 0;

  // Disposables
  private disposables: (THREE.BufferGeometry | THREE.Material | THREE.Texture)[] = [];

  constructor(container: HTMLDivElement) {
    this.container = container;
    this.init();
  }

  private init() {
    const width = this.container.clientWidth || window.innerWidth;
    const height = this.container.clientHeight || window.innerHeight;

    // 1. Renderer Setup (r160+ PBR standards)
    const isHeadless = navigator.webdriver || /HeadlessChrome/i.test(navigator.userAgent);
    this.renderer = new THREE.WebGLRenderer({
      antialias: !isHeadless,
      alpha: false,
      powerPreference: 'high-performance'
    });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(isHeadless ? 1 : Math.min(window.devicePixelRatio, 2));
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.15;
    this.renderer.shadowMap.enabled = !isHeadless;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    this.container.appendChild(this.renderer.domElement);

    // 2. Scene & Environment
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color('#14070c');
    this.scene.fog = new THREE.FogExp2('#14070c', 0.028);

    const pmremGenerator = new THREE.PMREMGenerator(this.renderer);
    pmremGenerator.compileEquirectangularShader();
    const envTexture = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    this.scene.environment = envTexture;
    this.disposables.push(envTexture);
    pmremGenerator.dispose();

    // 3. Camera & OrbitControls
    this.camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 80);
    this.camera.position.set(0, 3.8, 11);

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    this.controls.maxPolarAngle = Math.PI / 2 - 0.05; // prevent going below ground
    this.controls.minDistance = 3.5;
    this.controls.maxDistance = 18;
    this.controls.target.set(0, 2.2, 0);

    // 4. Lighting Rig (3-Point Studio + Ceremonial Fire & Diyas)
    this.setupLighting();

    // 5. Procedural Textures & Materials
    const marbleTex = createMarbleTexture(this.renderer);
    const carpetTex = createMandalaCarpetTexture(this.renderer);
    const shadowTex = createContactShadowTexture();
    const petalTex = createPetalTexture();
    this.disposables.push(marbleTex, carpetTex, shadowTex, petalTex);

    // 6. Build the Procedural Royal Mandap (3-12 Part Composite Models)
    this.buildRoyalGroundAndPlinth(marbleTex, carpetTex, shadowTex);
    this.buildMandapArchitecture();
    this.buildSacredHavanKund(shadowTex);
    this.buildRoyalThrones(shadowTex);
    this.buildDiyaLamps();
    this.buildHangingBellsAndTorans();
    this.buildPetalParticleSystem(petalTex);
    this.buildStarField();

    // 7. Event listeners
    window.addEventListener('resize', this.onResize);

    // 8. Pre-compile shaders
    this.renderer.compile(this.scene, this.camera);

    // 9. Start Animation Loop
    this.animate();
  }

  private setupLighting() {
    // Warm Key Light with tight shadow bounds
    this.keyLight = new THREE.DirectionalLight('#fff0d4', 2.2);
    this.keyLight.position.set(6, 12, 8);
    this.keyLight.castShadow = true;
    this.keyLight.shadow.mapSize.width = 2048;
    this.keyLight.shadow.mapSize.height = 2048;
    this.keyLight.shadow.camera.near = 1;
    this.keyLight.shadow.camera.far = 30;
    const d = 7;
    this.keyLight.shadow.camera.left = -d;
    this.keyLight.shadow.camera.right = d;
    this.keyLight.shadow.camera.top = d;
    this.keyLight.shadow.camera.bottom = -d;
    this.keyLight.shadow.bias = -0.0004;
    this.keyLight.shadow.normalBias = 0.02;
    this.scene.add(this.keyLight);

    // Cool fill light for subtle contrast
    this.fillLight = new THREE.HemisphereLight('#f5d79e', '#1f0d14', 0.85);
    this.scene.add(this.fillLight);

    // Ceremonial Havan Kund Fire Glow
    this.havanFireLight = new THREE.PointLight('#ff7722', 3.5, 9, 1.8);
    this.havanFireLight.position.set(0, 0.7, 0.3);
    this.scene.add(this.havanFireLight);

    // Soft Rim Light from behind mandap
    const rimLight = new THREE.DirectionalLight('#ffd580', 1.2);
    rimLight.position.set(0, 7, -8);
    this.scene.add(rimLight);
  }

  // 1. Royal Platform, Marble Plinth, Carpet & Grounding Shadows
  private buildRoyalGroundAndPlinth(marbleTex: THREE.Texture, carpetTex: THREE.Texture, shadowTex: THREE.Texture) {
    const group = new THREE.Group();

    // Outer royal courtyard floor
    const courtGeo = new THREE.PlaneGeometry(50, 50);
    const courtMat = new THREE.MeshStandardMaterial({
      color: '#1a0c10',
      roughness: 0.85,
      metalness: 0.1
    });
    const courtMesh = new THREE.Mesh(courtGeo, courtMat);
    courtMesh.rotation.x = -Math.PI / 2;
    courtMesh.position.y = -0.01;
    courtMesh.receiveShadow = true;
    group.add(courtMesh);
    this.disposables.push(courtGeo, courtMat);

    // Radial Contact Shadow under the entire Mandap pavilion
    const shadowGeo = new THREE.PlaneGeometry(13, 13);
    const shadowMat = new THREE.MeshBasicMaterial({
      map: shadowTex,
      transparent: true,
      opacity: 0.65,
      depthWrite: false
    });
    const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
    shadowMesh.rotation.x = -Math.PI / 2;
    shadowMesh.position.y = 0.005;
    group.add(shadowMesh);
    this.disposables.push(shadowGeo, shadowMat);

    // 3-Tier Stepped Octagonal Marble Mandap Plinth (Pivoted at ground)
    const tierHeights = [0.18, 0.14, 0.10];
    const tierRadii = [4.8, 4.4, 4.0];

    tierHeights.forEach((h, idx) => {
      const yBottom = tierHeights.slice(0, idx).reduce((a, b) => a + b, 0);
      const tierGeo = new THREE.CylinderGeometry(tierRadii[idx], tierRadii[idx] + 0.1, h, 8);
      const tierMat = new THREE.MeshStandardMaterial({
        map: marbleTex,
        roughness: 0.25,
        metalness: 0.15
      });
      const tierMesh = new THREE.Mesh(tierGeo, tierMat);
      tierMesh.position.y = yBottom + h / 2;
      tierMesh.receiveShadow = true;
      tierMesh.castShadow = true;
      group.add(tierMesh);
      this.disposables.push(tierGeo, tierMat);

      // Gold inlaid rim trim on tier edge
      const rimGeo = new THREE.TorusGeometry(tierRadii[idx] + 0.03, 0.03, 8, 32);
      const rimMat = new THREE.MeshStandardMaterial({
        color: '#d4af37',
        roughness: 0.18,
        metalness: 0.9
      });
      const rimMesh = new THREE.Mesh(rimGeo, rimMat);
      rimMesh.rotation.x = Math.PI / 2;
      rimMesh.position.y = yBottom + h;
      group.add(rimMesh);
      this.disposables.push(rimGeo, rimMat);
    });

    const totalPlinthHeight = tierHeights.reduce((a, b) => a + b, 0);

    // Ornate Crimson Velvet Mandala Carpet on Mandap Floor
    const carpetGeo = new THREE.PlaneGeometry(6.2, 6.2);
    const carpetMat = new THREE.MeshStandardMaterial({
      map: carpetTex,
      roughness: 0.6,
      metalness: 0.1,
      polygonOffset: true,
      polygonOffsetFactor: -1,
      polygonOffsetUnits: -1
    });
    const carpetMesh = new THREE.Mesh(carpetGeo, carpetMat);
    carpetMesh.rotation.x = -Math.PI / 2;
    carpetMesh.position.y = totalPlinthHeight + 0.01;
    carpetMesh.receiveShadow = true;
    group.add(carpetMesh);
    this.disposables.push(carpetGeo, carpetMat);

    this.scene.add(group);
  }

  // 2. 4 Royal Fluted Marble & Gold Pillars with Chhatri Dome & Arches
  private buildMandapArchitecture() {
    const mandapGroup = new THREE.Group();
    const pillarPositions = [
      { x: -2.3, z: -2.3 },
      { x: 2.3, z: -2.3 },
      { x: -2.3, z: 2.3 },
      { x: 2.3, z: 2.3 },
    ];

    const goldMat = new THREE.MeshStandardMaterial({
      color: '#e6be55',
      roughness: 0.2,
      metalness: 0.88
    });
    const marbleColumnMat = new THREE.MeshStandardMaterial({
      color: '#fbf7ee',
      roughness: 0.28,
      metalness: 0.12
    });
    this.disposables.push(goldMat, marbleColumnMat);

    const basePlatformY = 0.42;

    pillarPositions.forEach((pos) => {
      // Composite 6-part Pillar Model
      const pillar = new THREE.Group();
      pillar.position.set(pos.x, basePlatformY, pos.z);

      // Part 1: Square stepped pedestal base
      const baseGeo = new THREE.BoxGeometry(0.7, 0.45, 0.7);
      const baseMesh = new THREE.Mesh(baseGeo, goldMat);
      baseMesh.position.y = 0.225;
      baseMesh.castShadow = true;
      baseMesh.receiveShadow = true;
      pillar.add(baseMesh);

      // Part 2: Fluted Column Shaft (using Lathe geometry with curved taper)
      const points: THREE.Vector2[] = [];
      const segs = 14;
      for (let i = 0; i <= segs; i++) {
        const t = i / segs;
        const rad = 0.20 + Math.sin(t * Math.PI) * 0.035;
        points.push(new THREE.Vector2(rad, t * 3.2));
      }
      const shaftGeo = new THREE.LatheGeometry(points, 24);
      const shaftMesh = new THREE.Mesh(shaftGeo, marbleColumnMat);
      shaftMesh.position.y = 0.45;
      shaftMesh.castShadow = true;
      shaftMesh.receiveShadow = true;
      pillar.add(shaftMesh);

      // Part 3: Middle Ornamental Gold Filigree Ring
      const midRingGeo = new THREE.TorusGeometry(0.24, 0.04, 12, 24);
      const midRingMesh = new THREE.Mesh(midRingGeo, goldMat);
      midRingMesh.rotation.x = Math.PI / 2;
      midRingMesh.position.y = 2.05;
      pillar.add(midRingMesh);

      // Part 4: Upper Gold Band Ring
      const topRingGeo = new THREE.TorusGeometry(0.23, 0.035, 12, 24);
      const topRingMesh = new THREE.Mesh(topRingGeo, goldMat);
      topRingMesh.rotation.x = Math.PI / 2;
      topRingMesh.position.y = 3.3;
      pillar.add(topRingMesh);

      // Part 5: Carved Bell Capital
      const capPoints: THREE.Vector2[] = [
        new THREE.Vector2(0.21, 0),
        new THREE.Vector2(0.28, 0.15),
        new THREE.Vector2(0.38, 0.35),
        new THREE.Vector2(0.42, 0.45)
      ];
      const capGeo = new THREE.LatheGeometry(capPoints, 16);
      const capMesh = new THREE.Mesh(capGeo, goldMat);
      capMesh.position.y = 3.4;
      capMesh.castShadow = true;
      pillar.add(capMesh);

      // Part 6: Square Arch Bracket Abacus
      const abacusGeo = new THREE.BoxGeometry(0.85, 0.16, 0.85);
      const abacusMesh = new THREE.Mesh(abacusGeo, marbleColumnMat);
      abacusMesh.position.y = 3.93;
      abacusMesh.castShadow = true;
      pillar.add(abacusMesh);

      mandapGroup.add(pillar);
    });

    // 4 Connecting Royal Arch Beams
    const archY = basePlatformY + 3.95;
    const archPairs = [
      { start: [-2.3, -2.3], end: [2.3, -2.3], rot: 0 },
      { start: [2.3, -2.3], end: [2.3, 2.3], rot: Math.PI / 2 },
      { start: [2.3, 2.3], end: [-2.3, 2.3], rot: Math.PI },
      { start: [-2.3, 2.3], end: [-2.3, -2.3], rot: -Math.PI / 2 }
    ];

    archPairs.forEach((arch) => {
      const beamGroup = new THREE.Group();
      const midX = (arch.start[0] + arch.end[0]) / 2;
      const midZ = (arch.start[1] + arch.end[1]) / 2;
      beamGroup.position.set(midX, archY, midZ);
      beamGroup.rotation.y = arch.rot;

      // Main lintel beam
      const lintelGeo = new THREE.BoxGeometry(4.6, 0.22, 0.4);
      const lintelMesh = new THREE.Mesh(lintelGeo, goldMat);
      lintelMesh.castShadow = true;
      beamGroup.add(lintelMesh);

      // Curved carved arch shape underneath beam
      const curve = new THREE.EllipseCurve(0, -0.45, 1.8, 0.45, 0, Math.PI, false, 0);
      const points = curve.getPoints(24);
      const archShape = new THREE.Shape(points);
      archShape.lineTo(1.8, 0);
      archShape.lineTo(-1.8, 0);
      archShape.closePath();

      const extrudeSettings = {
        depth: 0.12,
        bevelEnabled: true,
        bevelSegments: 3,
        steps: 1,
        bevelSize: 0.02,
        bevelThickness: 0.02
      };
      const archExtrudeGeo = new THREE.ExtrudeGeometry(archShape, extrudeSettings);
      const archExtrudeMesh = new THREE.Mesh(archExtrudeGeo, goldMat);
      archExtrudeMesh.position.set(0, 0, -0.06);
      beamGroup.add(archExtrudeMesh);

      // Decorative central gold sunburst / crest medallion
      const crestGeo = new THREE.CylinderGeometry(0.24, 0.24, 0.14, 16);
      const crestMesh = new THREE.Mesh(crestGeo, goldMat);
      crestMesh.rotation.x = Math.PI / 2;
      crestMesh.position.set(0, 0.2, 0.2);
      beamGroup.add(crestMesh);

      mandapGroup.add(beamGroup);
    });

    // Grand Indian Chhatri Dome (Composite 4-part Dome Roof)
    const domeGroup = new THREE.Group();
    domeGroup.position.set(0, archY + 0.15, 0);

    // 1. Octagonal cornice cornice base
    const domeBaseGeo = new THREE.CylinderGeometry(3.3, 3.4, 0.25, 8);
    const domeBaseMesh = new THREE.Mesh(domeBaseGeo, marbleColumnMat);
    domeBaseMesh.castShadow = true;
    domeGroup.add(domeBaseMesh);

    // 2. Lathe Royal Onion / Lotus Dome Silhouette
    const domePoints: THREE.Vector2[] = [];
    for (let i = 0; i <= 20; i++) {
      const t = i / 20;
      // Classic Mughal/Rajasthani curved dome curve
      const y = t * 1.8;
      let r = Math.sin(t * Math.PI) * 1.9 + (1 - t) * 1.5;
      if (t > 0.85) r = (1 - t) * 1.8; // sharp point to apex
      domePoints.push(new THREE.Vector2(Math.max(0.05, r), y));
    }
    const domeGeo = new THREE.LatheGeometry(domePoints, 32);
    const domeMesh = new THREE.Mesh(domeGeo, goldMat);
    domeMesh.position.y = 0.12;
    domeMesh.castShadow = true;
    domeGroup.add(domeMesh);

    // 3. Gold Kalash (Sacred finial with lotus ring and spire)
    const kalashPoints: THREE.Vector2[] = [
      new THREE.Vector2(0.28, 0),
      new THREE.Vector2(0.42, 0.22),
      new THREE.Vector2(0.24, 0.42),
      new THREE.Vector2(0.38, 0.65),
      new THREE.Vector2(0.12, 0.85),
      new THREE.Vector2(0.02, 1.3)
    ];
    const kalashGeo = new THREE.LatheGeometry(kalashPoints, 20);
    const kalashMesh = new THREE.Mesh(kalashGeo, goldMat);
    kalashMesh.position.y = 1.92;
    kalashMesh.castShadow = true;
    domeGroup.add(kalashMesh);

    mandapGroup.add(domeGroup);
    this.scene.add(mandapGroup);
  }

  // 3. Sacred Havan Kund (Fire Pit) with Copper Tiers, Logs, and Particle Fire
  private buildSacredHavanKund(shadowTex: THREE.Texture) {
    const havanGroup = new THREE.Group();
    havanGroup.position.set(0, 0.43, 0.3); // centered on carpet

    // Contact shadow beneath havan
    const shadowGeo = new THREE.PlaneGeometry(2.4, 2.4);
    const shadowMat = new THREE.MeshBasicMaterial({
      map: shadowTex,
      transparent: true,
      opacity: 0.6,
      depthWrite: false
    });
    const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
    shadowMesh.rotation.x = -Math.PI / 2;
    shadowMesh.position.y = 0.01;
    havanGroup.add(shadowMesh);

    const copperMat = new THREE.MeshStandardMaterial({
      color: '#b85c38',
      roughness: 0.35,
      metalness: 0.8
    });
    const brassRimMat = new THREE.MeshStandardMaterial({
      color: '#e5be58',
      roughness: 0.2,
      metalness: 0.9
    });
    this.disposables.push(copperMat, brassRimMat);

    // 3 Stepped Copper Tiers
    const steps = [
      { size: 1.5, height: 0.12, y: 0.06 },
      { size: 1.25, height: 0.12, y: 0.18 },
      { size: 1.0, height: 0.12, y: 0.30 }
    ];

    steps.forEach((s) => {
      const stepGeo = new THREE.BoxGeometry(s.size, s.height, s.size);
      const stepMesh = new THREE.Mesh(stepGeo, copperMat);
      stepMesh.position.y = s.y;
      stepMesh.castShadow = true;
      stepMesh.receiveShadow = true;
      havanGroup.add(stepMesh);

      // Gold lip on top of each step
      const rimGeo = new THREE.BoxGeometry(s.size + 0.04, 0.03, s.size + 0.04);
      const rimMesh = new THREE.Mesh(rimGeo, brassRimMat);
      rimMesh.position.y = s.y + s.height / 2;
      havanGroup.add(rimMesh);
    });

    // Glowing Ember Bed inside
    const emberGeo = new THREE.PlaneGeometry(0.75, 0.75);
    const emberMat = new THREE.MeshStandardMaterial({
      color: '#ff3a00',
      emissive: '#ff2200',
      emissiveIntensity: 1.4,
      roughness: 0.9
    });
    const emberMesh = new THREE.Mesh(emberGeo, emberMat);
    emberMesh.rotation.x = -Math.PI / 2;
    emberMesh.position.y = 0.365;
    havanGroup.add(emberMesh);

    // Sacred Havan Wooden Logs arranged in square cross
    const logMat = new THREE.MeshStandardMaterial({
      color: '#3d2314',
      roughness: 0.9,
      metalness: 0.05
    });
    const logGeo = new THREE.CylinderGeometry(0.045, 0.045, 0.65, 8);
    const logAngles = [0.2, -0.4, 1.6, -1.3];
    const logOffsets = [
      [-0.15, 0.40, 0.1],
      [0.15, 0.40, -0.1],
      [0, 0.44, 0.15],
      [0, 0.44, -0.15]
    ];
    logAngles.forEach((ang, idx) => {
      const log = new THREE.Mesh(logGeo, logMat);
      log.rotation.z = Math.PI / 2;
      log.rotation.y = ang;
      log.position.set(logOffsets[idx][0], logOffsets[idx][1], logOffsets[idx][2]);
      log.castShadow = true;
      havanGroup.add(log);
    });

    // Animated Procedural Fire Sparks and Flames Group
    this.havanFlamesGroup = new THREE.Group();
    this.havanFlamesGroup.position.set(0, 0.45, 0);

    // Flame Core Mesh (Layered transmissive fiery cone)
    const flameGeo = new THREE.ConeGeometry(0.18, 0.65, 8);
    const flameMat = new THREE.MeshBasicMaterial({
      color: '#ffb703',
      transparent: true,
      opacity: 0.85
    });
    const flameMesh = new THREE.Mesh(flameGeo, flameMat);
    flameMesh.position.y = 0.32;
    this.havanFlamesGroup.add(flameMesh);

    // Secondary Inner White Flame
    const innerFlameGeo = new THREE.ConeGeometry(0.09, 0.4, 8);
    const innerFlameMat = new THREE.MeshBasicMaterial({
      color: '#ffffff',
      transparent: true,
      opacity: 0.9
    });
    const innerFlameMesh = new THREE.Mesh(innerFlameGeo, innerFlameMat);
    innerFlameMesh.position.y = 0.2;
    this.havanFlamesGroup.add(innerFlameMesh);

    // Rising Ember Sparks (Points geometry)
    const sparkCount = 35;
    const sparkGeo = new THREE.BufferGeometry();
    const sparkPositions = new Float32Array(sparkCount * 3);
    for (let i = 0; i < sparkCount; i++) {
      sparkPositions[i * 3] = (Math.random() - 0.5) * 0.35;
      sparkPositions[i * 3 + 1] = Math.random() * 0.8;
      sparkPositions[i * 3 + 2] = (Math.random() - 0.5) * 0.35;
    }
    sparkGeo.setAttribute('position', new THREE.BufferAttribute(sparkPositions, 3));
    const sparkMat = new THREE.PointsMaterial({
      color: '#ffdd55',
      size: 0.045,
      transparent: true,
      opacity: 0.85
    });
    const sparkPoints = new THREE.Points(sparkGeo, sparkMat);
    this.havanFlamesGroup.add(sparkPoints);
    this.flameParticles.push(sparkPoints);

    havanGroup.add(this.havanFlamesGroup);
    this.scene.add(havanGroup);
  }

  // 4. Ishita & Harnav Royal Thrones (Composite 7-part chairs with velvet cushions)
  private buildRoyalThrones(shadowTex: THREE.Texture) {
    const thronesGroup = new THREE.Group();
    thronesGroup.position.set(0, 0.43, -1.35); // positioned behind havan kund

    const goldFrameMat = new THREE.MeshStandardMaterial({
      color: '#ffd055',
      roughness: 0.18,
      metalness: 0.92
    });
    const velvetMat = new THREE.MeshStandardMaterial({
      color: '#70091d', // Royal Indian Crimson Velvet
      roughness: 0.75,
      metalness: 0.12
    });
    const goldPillowMat = new THREE.MeshStandardMaterial({
      color: '#e6bf55',
      roughness: 0.3,
      metalness: 0.7
    });
    this.disposables.push(goldFrameMat, velvetMat, goldPillowMat);

    // Build Single Throne Function (7 parts)
    const buildThrone = (xOffset: number, label: string) => {
      const chair = new THREE.Group();
      chair.position.x = xOffset;
      chair.name = `Throne_${label}`;

      // Contact shadow
      const sGeo = new THREE.PlaneGeometry(1.2, 1.2);
      const sMat = new THREE.MeshBasicMaterial({
        map: shadowTex,
        transparent: true,
        opacity: 0.55,
        depthWrite: false
      });
      const sMesh = new THREE.Mesh(sGeo, sMat);
      sMesh.rotation.x = -Math.PI / 2;
      sMesh.position.y = 0.01;
      chair.add(sMesh);

      // Part 1: Four Carved Gold Legs
      const legGeo = new THREE.CylinderGeometry(0.04, 0.03, 0.52, 8);
      const legPositions = [
        [-0.32, -0.32],
        [0.32, -0.32],
        [-0.32, 0.32],
        [0.32, 0.32]
      ];
      legPositions.forEach(([lx, lz]) => {
        const leg = new THREE.Mesh(legGeo, goldFrameMat);
        leg.position.set(lx, 0.26, lz);
        leg.castShadow = true;
        chair.add(leg);
      });

      // Part 2: Seat Frame Gold Base
      const seatBaseGeo = new THREE.BoxGeometry(0.78, 0.08, 0.78);
      const seatBase = new THREE.Mesh(seatBaseGeo, goldFrameMat);
      seatBase.position.y = 0.54;
      seatBase.castShadow = true;
      chair.add(seatBase);

      // Part 3: Deep Velvet Seat Cushion (Padded bevel)
      const cushionGeo = new THREE.BoxGeometry(0.72, 0.12, 0.72);
      const cushion = new THREE.Mesh(cushionGeo, velvetMat);
      cushion.position.y = 0.62;
      cushion.castShadow = true;
      cushion.receiveShadow = true;
      chair.add(cushion);

      // Part 4: Curved High Velvet Backrest
      const backrestGeo = new THREE.BoxGeometry(0.70, 1.1, 0.12);
      const backrest = new THREE.Mesh(backrestGeo, velvetMat);
      backrest.position.set(0, 1.18, -0.32);
      backrest.rotation.x = 0.08;
      backrest.castShadow = true;
      chair.add(backrest);

      // Part 5: Ornate Royal Crown Crest / Filigree on Backrest
      const crownGeo = new THREE.CylinderGeometry(0.38, 0.36, 0.08, 16);
      const crown = new THREE.Mesh(crownGeo, goldFrameMat);
      crown.rotation.x = Math.PI / 2;
      crown.position.set(0, 1.82, -0.36);
      crown.castShadow = true;
      chair.add(crown);

      // Top spire pinnacle on throne
      const spireGeo = new THREE.ConeGeometry(0.08, 0.25, 8);
      const spire = new THREE.Mesh(spireGeo, goldFrameMat);
      spire.position.set(0, 2.05, -0.36);
      chair.add(spire);

      // Part 6 & 7: Velvet Padded Armrests
      const armGeo = new THREE.BoxGeometry(0.08, 0.06, 0.55);
      const leftArm = new THREE.Mesh(armGeo, velvetMat);
      leftArm.position.set(-0.36, 0.82, -0.05);
      const rightArm = new THREE.Mesh(armGeo, velvetMat);
      rightArm.position.set(0.36, 0.82, -0.05);
      chair.add(leftArm, rightArm);

      // Armrest golden supports
      const armSupGeo = new THREE.CylinderGeometry(0.03, 0.03, 0.25, 8);
      const leftSup = new THREE.Mesh(armSupGeo, goldFrameMat);
      leftSup.position.set(-0.36, 0.68, 0.18);
      const rightSup = new THREE.Mesh(armSupGeo, goldFrameMat);
      rightSup.position.set(0.36, 0.68, 0.18);
      chair.add(leftSup, rightSup);

      return chair;
    };

    // Ishita Throne (Bride) - Left
    const ishitaThrone = buildThrone(-0.65, 'Ishita');
    ishitaThrone.rotation.y = 0.12;
    thronesGroup.add(ishitaThrone);

    // Aarnav Throne (Groom) - Right
    const aarnavThrone = buildThrone(0.65, 'Aarnav');
    aarnavThrone.rotation.y = -0.12;
    thronesGroup.add(aarnavThrone);

    // Central Royal Bolster Cushion (Golden Masnad)
    const bolsterGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.5, 16);
    const bolster = new THREE.Mesh(bolsterGeo, goldPillowMat);
    bolster.rotation.z = Math.PI / 2;
    bolster.position.set(0, 0.65, -0.2);
    bolster.castShadow = true;
    thronesGroup.add(bolster);

    this.scene.add(thronesGroup);
  }

  // 5. Diya Brass Lampstands on Mandap Perimeters with Flickering Point Lights
  private buildDiyaLamps() {
    const diyaPositions = [
      { x: -1.8, z: 1.8 },
      { x: 1.8, z: 1.8 },
      { x: -1.8, z: -1.8 },
      { x: 1.8, z: -1.8 },
    ];

    const brassMat = new THREE.MeshStandardMaterial({
      color: '#d4af37',
      roughness: 0.22,
      metalness: 0.85
    });

    const flameMat = new THREE.MeshBasicMaterial({
      color: '#ffcc33'
    });

    diyaPositions.forEach((pos) => {
      const diya = new THREE.Group();
      diya.position.set(pos.x, 0.43, pos.z);

      // Turned brass pedestal stand (Lathe)
      const points: THREE.Vector2[] = [
        new THREE.Vector2(0.14, 0),
        new THREE.Vector2(0.08, 0.08),
        new THREE.Vector2(0.04, 0.45),
        new THREE.Vector2(0.12, 0.65),
        new THREE.Vector2(0.18, 0.72),
        new THREE.Vector2(0.02, 0.72)
      ];
      const standGeo = new THREE.LatheGeometry(points, 16);
      const standMesh = new THREE.Mesh(standGeo, brassMat);
      standMesh.castShadow = true;
      diya.add(standMesh);

      // Flame tear
      const flameGeo = new THREE.ConeGeometry(0.04, 0.14, 8);
      const flameMesh = new THREE.Mesh(flameGeo, flameMat);
      flameMesh.position.y = 0.78;
      diya.add(flameMesh);

      // Warm diya point light
      const pLight = new THREE.PointLight('#ffaa33', 1.2, 4.5, 2);
      pLight.position.set(pos.x, 1.2, pos.z);
      this.scene.add(pLight);
      this.diyaLights.push(pLight);

      this.scene.add(diya);
    });
  }

  // 6. Hanging Brass Temple Bells & Festive Marigold Toran Garlands
  private buildHangingBellsAndTorans() {
    const group = new THREE.Group();
    const goldMat = new THREE.MeshStandardMaterial({
      color: '#f0c34e',
      roughness: 0.2,
      metalness: 0.9
    });
    const marigoldOrangeMat = new THREE.MeshStandardMaterial({
      color: '#ff7700',
      roughness: 0.9,
      metalness: 0.05
    });
    const marigoldYellowMat = new THREE.MeshStandardMaterial({
      color: '#ffcc00',
      roughness: 0.9,
      metalness: 0.05
    });

    // Hanging Brass Bells from 4 Mandap Arch Apexes
    const bellPositions = [
      { x: 0, y: 4.15, z: 2.3 },
      { x: 0, y: 4.15, z: -2.3 },
      { x: 2.3, y: 4.15, z: 0 },
      { x: -2.3, y: 4.15, z: 0 }
    ];

    bellPositions.forEach((bPos) => {
      const bellGroup = new THREE.Group();
      bellGroup.position.set(bPos.x, bPos.y, bPos.z);

      // Hanging chain
      const chainGeo = new THREE.CylinderGeometry(0.015, 0.015, 0.55, 6);
      const chain = new THREE.Mesh(chainGeo, goldMat);
      chain.position.y = -0.275;
      bellGroup.add(chain);

      // Temple Bell Body (Lathe)
      const bPoints: THREE.Vector2[] = [
        new THREE.Vector2(0.04, 0),
        new THREE.Vector2(0.08, -0.1),
        new THREE.Vector2(0.14, -0.22),
        new THREE.Vector2(0.18, -0.26),
        new THREE.Vector2(0.17, -0.28)
      ];
      const bGeo = new THREE.LatheGeometry(bPoints, 16);
      const bMesh = new THREE.Mesh(bGeo, goldMat);
      bMesh.position.y = -0.55;
      bMesh.castShadow = true;
      bellGroup.add(bMesh);

      // Bell Clapper
      const clapperGeo = new THREE.SphereGeometry(0.035, 8, 8);
      const clapper = new THREE.Mesh(clapperGeo, goldMat);
      clapper.position.y = -0.82;
      bellGroup.add(clapper);

      group.add(bellGroup);
    });

    // Marigold Flower Garland Swags (Torans) along the arches
    // Using InstancedMesh for high performance
    const flowerGeo = new THREE.SphereGeometry(0.05, 8, 6);
    const archSwags = [
      { start: [-2.2, 4.0, 2.3], mid: [0, 3.4, 2.3], end: [2.2, 4.0, 2.3] },
      { start: [-2.2, 4.0, -2.3], mid: [0, 3.4, -2.3], end: [2.2, 4.0, -2.3] },
      { start: [2.3, 4.0, -2.2], mid: [2.3, 3.4, 0], end: [2.3, 4.0, 2.2] },
      { start: [-2.3, 4.0, -2.2], mid: [-2.3, 3.4, 0], end: [-2.3, 4.0, 2.2] }
    ];

    archSwags.forEach((swag) => {
      const curve = new THREE.QuadraticBezierCurve3(
        new THREE.Vector3(...swag.start as [number, number, number]),
        new THREE.Vector3(...swag.mid as [number, number, number]),
        new THREE.Vector3(...swag.end as [number, number, number])
      );
      const flowerCount = 32;
      const pts = curve.getPoints(flowerCount);

      pts.forEach((pt, idx) => {
        const flower = new THREE.Mesh(flowerGeo, idx % 2 === 0 ? marigoldOrangeMat : marigoldYellowMat);
        flower.position.copy(pt);
        flower.scale.set(1 + Math.sin(idx) * 0.2, 1, 1 + Math.cos(idx) * 0.2);
        group.add(flower);
      });
    });

    this.scene.add(group);
  }

  // 7. Rose & Marigold Petal Shower Particle System (InstancedMesh)
  private buildPetalParticleSystem(petalTex: THREE.Texture) {
    const petalGeo = new THREE.PlaneGeometry(0.14, 0.18);
    const petalMat = new THREE.MeshStandardMaterial({
      map: petalTex,
      side: THREE.DoubleSide,
      transparent: true,
      alphaTest: 0.1,
      roughness: 0.6,
      metalness: 0.1
    });
    this.disposables.push(petalGeo, petalMat);

    this.petalMesh = new THREE.InstancedMesh(petalGeo, petalMat, this.petalCount);
    this.petalMesh.castShadow = false;
    this.petalMesh.frustumCulled = false;

    for (let i = 0; i < this.petalCount; i++) {
      const p: PetalData = {
        x: (Math.random() - 0.5) * 8.5,
        y: 2 + Math.random() * 6.5,
        z: (Math.random() - 0.5) * 8.5,
        vx: (Math.random() - 0.5) * 0.008,
        vy: -0.015 - Math.random() * 0.02,
        vz: (Math.random() - 0.5) * 0.008,
        rotX: Math.random() * Math.PI * 2,
        rotY: Math.random() * Math.PI * 2,
        rotZ: Math.random() * Math.PI * 2,
        vRotX: (Math.random() - 0.5) * 0.03,
        vRotY: (Math.random() - 0.5) * 0.03,
        scale: 0.75 + Math.random() * 0.5
      };
      this.petals.push(p);

      // Alternate color tint between rich crimson rose and golden marigold
      const isMarigold = i % 3 === 0;
      const tint = isMarigold ? new THREE.Color('#ffaa00') : new THREE.Color('#ff2a55');
      this.petalMesh.setColorAt(i, tint);
    }

    if (this.petalMesh.instanceColor) {
      this.petalMesh.instanceColor.needsUpdate = true;
    }
    this.scene.add(this.petalMesh);
  }

  // 8. Celestial Star Field (Matching "Taaron Ki Chhaon Mein")
  private buildStarField() {
    const starCount = 600;
    const starGeo = new THREE.BufferGeometry();
    const starPositions = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 0.9); // upper hemisphere dome
      const rad = 25 + Math.random() * 15;
      starPositions[i * 3] = rad * Math.sin(phi) * Math.cos(theta);
      starPositions[i * 3 + 1] = rad * Math.cos(phi) + 2;
      starPositions[i * 3 + 2] = rad * Math.sin(phi) * Math.sin(theta);
    }
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    const starMat = new THREE.PointsMaterial({
      color: '#fff3d1',
      size: 0.12,
      transparent: true,
      opacity: 0.75
    });
    this.starField = new THREE.Points(starGeo, starMat);
    this.scene.add(this.starField);
    this.disposables.push(starGeo, starMat);
  }

  // Camera Presets with Silky Exponential Damping
  public setCameraPreset(preset: CameraPreset) {
    this.currentPreset = preset;
    this.isAutoOrbiting = preset === 'orbit';

    switch (preset) {
      case 'front':
        this.cameraTargetPos.set(0, 3.2, 10.5);
        this.cameraTargetLook.set(0, 2.3, 0);
        break;
      case 'havan':
        this.cameraTargetPos.set(0, 1.8, 3.2);
        this.cameraTargetLook.set(0, 0.9, 0.3);
        break;
      case 'thrones':
        this.cameraTargetPos.set(0, 1.9, 2.2);
        this.cameraTargetLook.set(0, 1.4, -1.35);
        break;
      case 'orbit':
        // Starts continuous cinematic slow orbit
        this.orbitAngle = Math.atan2(this.camera.position.x, this.camera.position.z);
        break;
    }
  }

  public getCameraPreset(): CameraPreset {
    return this.currentPreset;
  }

  // Lighting Ambiance Presets
  public setAmbiance(ambiance: LightingAmbiance) {
    this.currentAmbiance = ambiance;
    switch (ambiance) {
      case 'evening':
        this.scene.background = new THREE.Color('#14070c');
        if (this.scene.fog instanceof THREE.FogExp2) {
          this.scene.fog.color = new THREE.Color('#14070c');
        }
        this.keyLight.color.set('#fff0d4');
        this.keyLight.intensity = 2.2;
        this.fillLight.color.set('#f5d79e');
        this.fillLight.groundColor.set('#1f0d14');
        this.renderer.toneMappingExposure = 1.15;
        if (this.starField) this.starField.visible = true;
        break;
      case 'sunset':
        this.scene.background = new THREE.Color('#220c15');
        if (this.scene.fog instanceof THREE.FogExp2) {
          this.scene.fog.color = new THREE.Color('#220c15');
        }
        this.keyLight.color.set('#ff9944');
        this.keyLight.intensity = 2.6;
        this.fillLight.color.set('#ffbb77');
        this.fillLight.groundColor.set('#3a101b');
        this.renderer.toneMappingExposure = 1.25;
        if (this.starField) this.starField.visible = false;
        break;
      case 'midnight':
        // "Taaron Ki Chhaon Mein" deep indigo night
        this.scene.background = new THREE.Color('#060513');
        if (this.scene.fog instanceof THREE.FogExp2) {
          this.scene.fog.color = new THREE.Color('#060513');
        }
        this.keyLight.color.set('#9cb6e6');
        this.keyLight.intensity = 1.1;
        this.fillLight.color.set('#556b9e');
        this.fillLight.groundColor.set('#0d0a1d');
        this.renderer.toneMappingExposure = 1.05;
        if (this.starField) this.starField.visible = true;
        break;
    }
  }

  public getAmbiance(): LightingAmbiance {
    return this.currentAmbiance;
  }

  // Trigger Burst of Flower Shower
  public triggerFlowerBurst() {
    this.petals.forEach((p) => {
      p.y = 4.5 + Math.random() * 4;
      p.vy = -0.025 - Math.random() * 0.035;
      p.vx = (Math.random() - 0.5) * 0.04;
      p.vz = (Math.random() - 0.5) * 0.04;
    });
  }

  private onResize = () => {
    if (!this.container || !this.renderer || !this.camera) return;
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  };

  private animate = () => {
    this.animFrameId = requestAnimationFrame(this.animate);
    const dt = this.clock.getDelta();
    const elapsedTime = this.clock.getElapsedTime();

    // 1. Camera exponential damping & auto-orbit
    if (this.isAutoOrbiting) {
      this.orbitAngle += dt * 0.22;
      const radius = 10.5;
      const camY = 3.2 + Math.sin(elapsedTime * 0.3) * 0.4;
      this.cameraTargetPos.set(
        Math.sin(this.orbitAngle) * radius,
        camY,
        Math.cos(this.orbitAngle) * radius
      );
      this.cameraTargetLook.set(0, 2.0, 0);
    }

    // Exponential Damping for Camera Position & Look Target
    const dampFactor = 1 - Math.exp(-4.5 * dt);
    this.camera.position.lerp(this.cameraTargetPos, dampFactor);
    this.controls.target.lerp(this.cameraTargetLook, dampFactor);
    this.controls.update();

    // 2. Ceremonial Sacred Fire Animation
    if (this.havanFireLight) {
      // Natural organic flicker
      const flicker = Math.sin(elapsedTime * 14) * 0.35 + Math.cos(elapsedTime * 23) * 0.25;
      this.havanFireLight.intensity = 3.4 + flicker;
    }

    if (this.havanFlamesGroup) {
      // Subtle rhythmic dance of flame core
      this.havanFlamesGroup.scale.set(
        1 + Math.sin(elapsedTime * 12) * 0.08,
        1 + Math.cos(elapsedTime * 16) * 0.14,
        1 + Math.sin(elapsedTime * 15) * 0.08
      );
    }

    // 3. Diya Lamp Soft Flickering
    this.diyaLights.forEach((dl, i) => {
      dl.intensity = 1.2 + Math.sin(elapsedTime * 9 + i * 2.1) * 0.25;
    });

    // 4. Update Petal Particle Simulation (InstancedMesh)
    if (this.petalMesh) {
      for (let i = 0; i < this.petalCount; i++) {
        const p = this.petals[i];

        p.y += p.vy;
        p.x += p.vx + Math.sin(elapsedTime * 1.5 + i) * 0.003;
        p.z += p.vz + Math.cos(elapsedTime * 1.5 + i) * 0.003;

        p.rotX += p.vRotX;
        p.rotY += p.vRotY;

        // Reset when falling below plinth level
        if (p.y < 0.45) {
          p.y = 6.8 + Math.random() * 2;
          p.x = (Math.random() - 0.5) * 7.5;
          p.z = (Math.random() - 0.5) * 7.5;
        }

        _dummyPosition.set(p.x, p.y, p.z);
        _dummyRotation.set(p.rotX, p.rotY, p.rotZ);
        _dummyScale.set(p.scale, p.scale, p.scale);
        _petalQuat.setFromEuler(_dummyRotation);

        _dummyMatrix.compose(_dummyPosition, _petalQuat, _dummyScale);
        this.petalMesh.setMatrixAt(i, _dummyMatrix);
      }
      this.petalMesh.instanceMatrix.needsUpdate = true;
    }

    // 5. Gentle twinkling stars rotation
    if (this.starField) {
      this.starField.rotation.y = elapsedTime * 0.008;
    }

    // 6. Lossless 60fps Render
    this.renderer.render(this.scene, this.camera);
  };

  public dispose() {
    if (this.animFrameId !== null) {
      cancelAnimationFrame(this.animFrameId);
    }
    window.removeEventListener('resize', this.onResize);
    this.controls.dispose();

    this.disposables.forEach((item) => {
      item.dispose();
    });

    this.renderer.dispose();
    if (this.renderer.domElement.parentElement) {
      this.renderer.domElement.parentElement.removeChild(this.renderer.domElement);
    }
  }
}
