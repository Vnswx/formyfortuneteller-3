const envelopeClosed = document.getElementById('envelopeClosed');
const envelopeOpen = document.getElementById('envelopeOpen');
const backgroundCircle = document.createElement('div');
const revealedContent = document.getElementById('revealedContent');
const instruction = document.getElementById('instruction');
const draggableContainer = document.getElementById('draggableContainer');

let hoverAnim = null;
let clickAnim = null;
let idleAnim = null;

let draggedElement = null;
let initialX = 0;
let initialY = 0;
let currentX = 0;
let currentY = 0;

function makeDraggable(element) {
    element.addEventListener('mousedown', dragStart);
    element.addEventListener('touchstart', dragStart, { passive: false });
}

function dragStart(e) {
    e.preventDefault();
    draggedElement = e.target.closest('.draggable-item');

    if (e.type === 'mousedown') {
        initialX = e.clientX;
        initialY = e.clientY;
    } else {
        initialX = e.touches[0].clientX;
        initialY = e.touches[0].clientY;
    }

    const rect = draggedElement.getBoundingClientRect();
    currentX = rect.left;
    currentY = rect.top;

    draggedElement.style.zIndex = '1000';

    document.addEventListener('mousemove', drag);
    document.addEventListener('mouseup', dragEnd);
    document.addEventListener('touchmove', drag, { passive: false });
    document.addEventListener('touchend', dragEnd);
}

function drag(e) {
    if (!draggedElement) return;

    e.preventDefault();

    let clientX, clientY;
    if (e.type === 'mousemove') {
        clientX = e.clientX;
        clientY = e.clientY;
    } else {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
    }

    const deltaX = clientX - initialX;
    const deltaY = clientY - initialY;

    const newX = currentX + deltaX;
    const newY = currentY + deltaY;

    draggedElement.style.left = newX + 'px';
    draggedElement.style.top = newY + 'px';
}

function dragEnd() {
    if (draggedElement) {
        draggedElement.style.zIndex = '11';
        draggedElement = null;
    }

    document.removeEventListener('mousemove', drag);
    document.removeEventListener('mouseup', dragEnd);
    document.removeEventListener('touchmove', drag);
    document.removeEventListener('touchend', dragEnd);
}

function createDraggableItems() {
    const items = [
        { type: 'heart', content: '💖' },
        { type: 'heart', content: '🌸' },
        { type: 'heart', content: '🌹' },
        { type: 'heart', content: '💐' },
    ];

    const itemSize = Math.min(80, window.innerWidth * 0.12);

    items.forEach((item, index) => {
        const draggableItem = document.createElement('div');
        draggableItem.className = `draggable-item ${item.type}`;

        if (item.type === 'heart') {
            draggableItem.textContent = item.content;
        } else {
            const img = document.createElement('img');
            img.src = item.content;
            img.alt = 'Draggable image';
            draggableItem.appendChild(img);
        }

        const cols = Math.floor(window.innerWidth / (itemSize + 20));
        const rows = Math.ceil(items.length / cols);
        const col = index % cols;
        const row = Math.floor(index / cols);

        const startX = (window.innerWidth - (cols * (itemSize + 20) - 20)) / 2;
        const startY = window.innerHeight * 0.9;

        const randomX = startX + col * (itemSize + 20) + Math.random() * 20 - 10;
        const randomY = startY + row * (itemSize + 20) + Math.random() * 20 - 10;

        draggableItem.style.left = randomX + 'px';
        draggableItem.style.top = randomY + 'px';

        document.body.appendChild(draggableItem);
        makeDraggable(draggableItem);

        anime({
            targets: draggableItem,
            scale: [0, 1],
            rotate: [0, 360],
            opacity: [0, 1],
            duration: 1000,
            delay: index * 100,
            easing: 'easeOutElastic(1, .8)'
        });
    });
}

function startIdleAnimation() {
    if (envelopeClosed) {
        idleAnim = anime({
            targets: envelopeClosed,
            rotate: [
                { value: -1, duration: 1500, easing: 'easeInOutSine' },
                { value: 1, duration: 1500, easing: 'easeInOutSine' }
            ],
            loop: true,
            direction: 'alternate'
        });
    }
}

backgroundCircle.classList.add('background-circle');
document.body.insertBefore(backgroundCircle, document.body.firstChild);

function createSparkles() {
    const container = document.querySelector('.envelope-container');
    if (!container) return; 

    for (let i = 0; i < 15; i++) {
        let sparkle = document.createElement('div');
        sparkle.classList.add('sparkle');
        container.appendChild(sparkle);

        sparkle.style.left = "50%";
        sparkle.style.top = "50%";

        anime({
            targets: sparkle,
            translateX: anime.random(-100, 100),
            translateY: anime.random(-100, 100),
            scale: [
                { value: 1, duration: 0 },
                { value: 0, duration: 1000, easing: 'easeOutQuad' }
            ],
            opacity: [
                { value: 1, duration: 200 },
                { value: 0, duration: 800 }
            ],
            duration: 1000,
            complete: () => sparkle.remove()
        });
    }
}

function createFloatingHeartsOrFlowers() {
    const container = document.querySelector('.envelope-container');
    if (!container) return; 
    const icons = ["❤️", "🌸", "💖", "💐"];
    for (let i = 0; i < 8; i++) {
        let particle = document.createElement('div');
        particle.classList.add('floating-particle');
        particle.textContent = icons[Math.floor(Math.random() * icons.length)];
        container.appendChild(particle);

        particle.style.left = "50%";
        particle.style.top = "50%";
        particle.style.position = "absolute";
        particle.style.fontSize = anime.random(16, 28) + "px";

        anime({
            targets: particle,
            translateX: anime.random(-80, 80),
            translateY: anime.random(-150, -250),
            opacity: [
                { value: 1, duration: 300 },
                { value: 0, duration: 1500 }
            ],
            duration: 1800,
            easing: 'easeOutCubic',
            complete: () => particle.remove()
        });
    }
}

if (envelopeClosed) {
    startIdleAnimation();

    envelopeClosed.addEventListener('mouseenter', () => {
        if (clickAnim) return;
        hoverAnim = anime({
            targets: envelopeClosed,
            scale: [
                { value: 1, duration: 700, easing: 'easeInOutSine' },
                { value: 1.05, duration: 700, easing: 'easeInOutSine' }
            ],
            loop: true,
            direction: 'alternate'
        });
    });

    envelopeClosed.addEventListener('mouseleave', () => {
        if (hoverAnim) {
            hoverAnim.pause();
            hoverAnim = null;
            anime({
                targets: envelopeClosed,
                scale: 1,
                duration: 300,
                easing: 'easeOutQuad'
            });
        }
    });

    document.querySelector('.envelope-container').addEventListener('click', function () {
        if (hoverAnim) {
            hoverAnim.pause();
            hoverAnim = null;
        }
        if (idleAnim) {
            idleAnim.pause();
            idleAnim = null;
        }

        clickAnim = anime({
            targets: envelopeClosed,
            scale: [1, 1.1],
            duration: 400,
            loop: 4,
            direction: 'alternate',
            easing: 'easeInOutSine',
            complete: () => {
                anime({
                    targets: backgroundCircle,
                    width: ['0px', '300vw'],
                    height: ['0px', '300vw'],
                    backgroundColor: ['#ffffff', '#ffeaf0'],
                    easing: 'easeInOutQuad',
                    duration: 1500
                });

                anime({
                    targets: envelopeClosed,
                    opacity: 0,
                    scale: 0.5,
                    duration: 800,
                    easing: 'easeInOutQuad',
                    delay: 200
                });

                anime({
                    targets: envelopeOpen,
                    opacity: 1,
                    scale: [0.5, 1.2, 1],
                    duration: 800,
                    easing: 'easeInOutQuad',
                    delay: 200,
                    complete: () => {
                        createSparkles();
                        createFloatingHeartsOrFlowers();

                        setTimeout(() => {
                            anime({
                                targets: '.envelope-container',
                                opacity: 0,
                                scale: 0.8,
                                duration: 1000,
                                easing: 'easeInOutQuad',
                                complete: () => {
                                    document.querySelector('.envelope-container').style.display = 'none';
                                    revealedContent.classList.add('show');
                                    anime({
                                        targets: '.love-message',
                                        // translateY: [50, 0],
                                        opacity: [0, 1],
                                        duration: 1000,
                                        easing: 'easeOutQuad',
                                        complete: () => {
                                            createDraggableItems();
                                            setTimeout(() => {
                                                instruction.classList.add('show');
                                                anime({
                                                    targets: instruction,
                                                    translateY: [20, 0],
                                                    duration: 500,
                                                    easing: 'easeOutQuad'
                                                });
                                            }, 500);
                                        }
                                    });
                                }
                            });
                        }, 2000);
                    }
                });
            }
        });
    });
}
