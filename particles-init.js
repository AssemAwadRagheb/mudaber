document.addEventListener("DOMContentLoaded", function() {
    tsParticles.load("tsparticles", {
        fpsLimit: 60,
        particles: {
            color: { value: "#f5e642" },
            links: { color: "#ffffff", distance: 150, enable: true, opacity: 0.15, width: 1 },
            move: { enable: true, speed: 1.5, direction: "none", random: true, straight: false, outModes: "out" },
            number: { density: { enable: true, area: 800 }, value: 30 },
            opacity: { value: 0.4 },
            shape: { type: "circle" },
            size: { value: { min: 1, max: 2.5 } }
        },
        detectRetina: true
    });
});
