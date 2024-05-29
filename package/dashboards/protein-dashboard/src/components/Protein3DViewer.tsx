import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

export type secondaryStructures = "Helix" | "Coil" | "Sheet";

interface ProteinData {
  sequence: string;
  secondaryStructure: secondaryStructures[];
}

const Protein3DViewer = (props: ProteinData) => {
  const { sequence, secondaryStructure } = props;
  const mountRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (mountRef.current) {
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
      );
      const renderer = new THREE.WebGLRenderer();
      renderer.setSize(window.innerWidth, window.innerHeight / 2);
      mountRef.current.appendChild(renderer.domElement);

      const controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.dampingFactor = 0.25;
      controls.screenSpacePanning = false;
      controls.maxPolarAngle = Math.PI / 2;

      // Disable zoom with scroll unless Ctrl key is pressed
      //    controls.enableZoom = false;
      //    renderer.domElement.addEventListener('wheel', (event) => {
      //      if (event.ctrlKey) {
      //        controls.enableZoom = true;
      //      } else {
      //        controls.enableZoom = false;
      //      }
      //    });

      // Create materials
      const helixMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
      const sheetMaterial = new THREE.MeshBasicMaterial({ color: 0x0000ff });
      const coilMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });

      // Create geometries
      const helixGeometry = new THREE.CylinderGeometry(0.1, 0.1, 1, 32);
      const sheetGeometry = new THREE.BoxGeometry(1, 0.1, 0.5);
      const coilGeometry = new THREE.SphereGeometry(0.1, 32, 32);

      const createProteinStructure = () => {
        const structureGroup = new THREE.Group();
        let position = new THREE.Vector3(0, 0, 0);
        let direction = new THREE.Vector3(1, 0, 0); // Initial direction

        secondaryStructure.forEach((structure, index) => {
          let element;

          if (structure === "Helix") {
            element = new THREE.Mesh(helixGeometry, helixMaterial);
          } else if (structure === "Sheet") {
            element = new THREE.Mesh(sheetGeometry, sheetMaterial);
          } else {
            element = new THREE.Mesh(coilGeometry, coilMaterial);
          }

          // Set position and direction
          element.position.copy(position);
          element.lookAt(position.clone().add(direction));
          structureGroup.add(element);

          // Update position and direction for the next element
          const step = 1.2; // Adjust the step size for better visualization
          position.add(direction.clone().multiplyScalar(step));

          // Randomly change direction for more complex shapes
          const randomAngle = Math.random() * Math.PI * 2;
          direction.applyAxisAngle(new THREE.Vector3(0, 1, 0), randomAngle);
        });

        return structureGroup;
      };

      const proteinStructure = createProteinStructure();
      scene.add(proteinStructure);

      //   camera.position.z = 5;

      // Set camera for top-down view
      camera.position.set(0, 20, 0);
      camera.lookAt(0, 0, 0);

      //   camera.zoom = 10;

      const animate = () => {
        requestAnimationFrame(animate);
        proteinStructure.rotation.x += 0.0005;
        proteinStructure.rotation.y += 0.0005;
        controls.update();
        renderer.render(scene, camera);
      };

      animate();

      return () => {
        mountRef.current?.removeChild(renderer.domElement);
      };
    }
  }, [sequence, secondaryStructure]);

  return (
    <div className="flex flex-col justify-center">
      <header className="bg-gray-800 p-4 text-white text-center text-2xl">
        Protein Structure
      </header>
      <div className="overflow-y-auto" ref={mountRef}></div>
      {/* <div className="flex gap-2">
        <h2>
          <strong>Legend</strong>
        </h2>
        <p>
          <span style={{ color: "#ff0000" }}>■</span> Helix
        </p>
        <p>
          <span style={{ color: "#0000ff" }}>■</span> Sheet
        </p>
        <p>
          <span style={{ color: "#00ff00" }}>■</span> Coil
        </p>
      </div> */}
    </div>
  );
};

export default Protein3DViewer;
