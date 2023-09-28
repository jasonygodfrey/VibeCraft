document.addEventListener("DOMContentLoaded", function() {
    // Initialize three.js
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById('visualizer').appendChild(renderer.domElement);
  
    // Create a green cube
    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);
  
    // Position the camera
    camera.position.z = 5;

    // Create an object for GUI controls
    const guiControls = {
        color: "#" + material.color.getHexString(), // Initialize with the existing color of the material
        rotationSpeedX: 0.01,
        rotationSpeedY: 0.01,
      };
      
      
      // Initialize dat.GUI
      const gui = new dat.GUI({ autoPlace: false });
      gui.domElement.id = 'dat-gui-container';
      document.getElementById('liveCoding').appendChild(gui.domElement);
      
      // GUI for cube color
      gui.addColor(guiControls, "color").onChange(function(value) {
        material.color.set(value); // directly set the color
      });

    // GUI for cube rotation
    gui.add(guiControls, "rotationSpeedX", 0, 0.1).name("X Rotation Speed");
    gui.add(guiControls, "rotationSpeedY", 0, 0.1).name("Y Rotation Speed");
  
    //
      // Add button to add a sphere to the scene
      gui.add({
        addSphere: function() {
          const sphereGeometry = new THREE.SphereGeometry(1, 32, 32);
          const sphereMaterial = new THREE.MeshBasicMaterial({ color: 0xFF0000 });
          const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
          sphere.position.x = Math.random() * 5 - 2.5;
          sphere.position.y = Math.random() * 5 - 2.5;
          sphere.position.z = Math.random() * 5 - 2.5;
          scene.add(sphere);
        }
      }, 'addSphere').name("Add Sphere");
  
      // Add button to change camera FOV
      gui.add(camera, 'fov', 50, 110).onChange(function(fov) {
        camera.updateProjectionMatrix();
      }).name("Camera FOV");
  
// Add button to add a ground plane to the scene
gui.add({
    addGround: function() {
        const groundGeometry = new THREE.PlaneGeometry(10, 10, 10, 10);
        const groundMaterial = new THREE.MeshBasicMaterial({ color: 0x555555, side: THREE.DoubleSide });
        const ground = new THREE.Mesh(groundGeometry, groundMaterial);
        ground.rotation.x = -Math.PI / 2;
        ground.position.y = -1;  // Slightly below the cube
        scene.add(ground);
    }
}, 'addGround').name("Add Ground");


// Add button to add a simple geometric tree to the scene
gui.add({
    addTree: function() {
        // Trunk
        const trunkGeometry = new THREE.CylinderGeometry(0.2, 0.2, 1, 16);
        const trunkMaterial = new THREE.MeshBasicMaterial({ color: 0x8B4513 });
        const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
        trunk.position.y = 0.5;  // Position the trunk above ground

        // Leaves (Cone)
        const leavesGeometry = new THREE.ConeGeometry(0.5, 1, 16);
        const leavesMaterial = new THREE.MeshBasicMaterial({ color: 0x00FF00 });
        const leaves = new THREE.Mesh(leavesGeometry, leavesMaterial);
        leaves.position.y = 1.5;  // Position the leaves above the trunk

        // Combine and add to scene
        const tree = new THREE.Group();
        tree.add(trunk);
        tree.add(leaves);
        tree.position.x = Math.random() * 5 - 2.5;
        tree.position.z = Math.random() * 5 - 2.5;
        scene.add(tree);
    }
}, 'addTree').name("Add Tree");

      // Add button to reset scene
      gui.add({
        resetScene: function() {
          // Here you could clear the scene, reset camera position, etc.
          // For now, we're just logging
          console.log('Reset scene clicked!');
        }
      }, 'resetScene').name("Reset Scene");
    // Animation loop
    function animate() {
      requestAnimationFrame(animate);
      cube.rotation.x += guiControls.rotationSpeedX;
      cube.rotation.y += guiControls.rotationSpeedY;
      renderer.render(scene, camera);
    }
    animate();
  
    // Handle live code input
    const runCodeButton = document.getElementById('runCode');
    const resetButton = document.getElementById('resetScene');
    const codeInput = document.getElementById('codeInput');

    runCodeButton.addEventListener('click', function() {
      const code = codeInput.value;
      try {
        eval(code);
      } catch (e) {
        console.error('Error in executing code:', e);
      }
    });

    // Reset cube and camera to original state
    resetButton.addEventListener('click', function() {
      // Reset cube
      cube.rotation.x = 0;
      cube.rotation.y = 0;
      cube.scale.set(1, 1, 1);
      material.color.set(0x00ff00);

      // Reset camera
      camera.position.z = 5;

      // You could also reset other things here
    });
});
