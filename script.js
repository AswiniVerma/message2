

let highestZ = 1;

class Paper {
  holdingPaper = false;
  touchX = 0;
  touchY = 0;
  mouseX = 0;
  mouseY = 0;
  prevMouseX = 0;
  prevMouseY = 0;
  velX = 0;
  velY = 0;
  rotation = Math.random() * 30 - 15;
  currentPaperX = 0;
  currentPaperY = 0;
  rotating = false;

  init(paper) {
    const moveHandler = (e) => {
      e.preventDefault(); // Prevent the default behavior

      if (!this.rotating) {
        if (e.type.startsWith('mouse')) {
          this.mouseX = e.clientX;
          this.mouseY = e.clientY;
        } else if (e.type.startsWith('touch')) {
          this.mouseX = e.touches[0].clientX;
          this.mouseY = e.touches[0].clientY;
        }

        this.velX = this.mouseX - this.prevMouseX;
        this.velY = this.mouseY - this.prevMouseY;
      }

      const dirX = this.mouseX - this.touchX;
      const dirY = this.mouseY - this.touchY;
      const dirLength = Math.sqrt(dirX * dirX + dirY * dirY);
      const dirNormalizedX = dirX / dirLength;
      const dirNormalizedY = dirY / dirLength;

      const angle = Math.atan2(dirNormalizedY, dirNormalizedX);
      let degrees = (180 * angle) / Math.PI;
      degrees = (360 + Math.round(degrees)) % 360;
      if (this.rotating) {
        this.rotation = degrees;
      }

      if (this.holdingPaper) {
        if (!this.rotating) {
          this.currentPaperX += this.velX;
          this.currentPaperY += this.velY;
        }
        this.prevMouseX = this.mouseX;
        this.prevMouseY = this.mouseY;

        paper.style.transform = `translateX(${this.currentPaperX}px) translateY(${this.currentPaperY}px) rotateZ(${this.rotation}deg)`;
      }
    };

    paper.addEventListener('mousedown', (e) => {
      this.handlePaperInteraction(e);
    });

    paper.addEventListener('touchstart', (e) => {
      this.handlePaperInteraction(e);
    });

    window.addEventListener('mouseup', () => {
      this.holdingPaper = false;
      this.rotating = false;
    });

    window.addEventListener('touchend', () => {
      this.holdingPaper = false;
      this.rotating = false;
    });

    document.addEventListener('mousemove', moveHandler);
    document.addEventListener('touchmove', moveHandler, { passive: false });
  }

  handlePaperInteraction(e) {
    e.preventDefault(); // Prevent the default behavior

    if (this.holdingPaper) return;
    this.holdingPaper = true;

    if (e.type === 'mousedown') {
      this.mouseX = this.touchX = e.clientX;
      this.mouseY = this.touchY = e.clientY;
    } else if (e.type === 'touchstart') {
      this.mouseX = this.touchX = e.touches[0].clientX;
      this.mouseY = this.touchY = e.touches[0].clientY;
    }

    this.prevMouseX = this.mouseX;
    this.prevMouseY = this.mouseY;

    if (e.button === 2) {
      this.rotating = true;
    }
  }
}

const papers = Array.from(document.querySelectorAll('.paper'));

papers.forEach((paper) => {
  const p = new Paper();
  p.init(paper);
});

// Disable scrolling
document.body.style.overflow = 'hidden';
