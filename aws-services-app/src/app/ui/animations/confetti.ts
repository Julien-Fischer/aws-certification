import {InjectionToken} from "@angular/core";

export const confettiInjectionToken = new InjectionToken<Confetti>('Confetti');

export interface Confetti {
    burst(quantity?: number): void;
}

export class DomConfetti implements Confetti {

  private static readonly COLORS = [
    '#ff0000', '#00ff00', '#0000ff',
    '#ffff00', '#ff00ff', '#00ffff',
    '#ff9900'
  ];

  burst(quantity: number = 100) {
    for (let i = 0; i < quantity; i++) {
      this.throwConfetti();
    }
  }

  private throwConfetti() {
    const confetti = DomConfetti.createDomElement();
    this.animate(confetti);
  }

  private animate(confetti: HTMLDivElement) {
    const duration = 2 + Math.random() * 3;
    const delay = Math.random() * 2;
    confetti.style.animation = `confetti-fall ${duration}s ${delay}s cubic-bezier(0.25, 0.8, 0.3, 1) forwards`;

    document.body.appendChild(confetti);

    setTimeout(() => {
      confetti.remove();
    }, (duration + delay) * 1000);
  }

  private static createDomElement() {
    const confetti = document.createElement('div');
    confetti.className = 'confetti-piece';
    confetti.style.backgroundColor = this.randomColor();
    confetti.style.left = Math.random() * 100 + 'vw';
    confetti.style.transform = `rotate(${Math.random() * 360}deg)`;
    confetti.style.width = 5 + Math.random() * 10 + 'px';
    confetti.style.height = 5 + Math.random() * 10 + 'px';
    return confetti;
  }

  private static randomColor(): string {
    const colors = this.COLORS;
    return colors[Math.floor(Math.random() * colors.length)];
  }

}
