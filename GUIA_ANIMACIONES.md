# 🎨 Guía de Librerías de Animación

Este proyecto incluye las siguientes librerías para mejorar la experiencia visual del landing:

## 📦 Librerías Instaladas

### 1. **GSAP (GreenSock Animation Platform)**
La librería más potente para animaciones complejas, timelines y efectos avanzados.

**Uso básico:**
```tsx
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function MiComponente() {
  const elementRef = useRef(null);

  useEffect(() => {
    // Animación simple
    gsap.to(elementRef.current, {
      opacity: 1,
      y: 0,
      duration: 1,
      ease: 'power3.out'
    });

    // Con ScrollTrigger
    gsap.from(elementRef.current, {
      scrollTrigger: {
        trigger: elementRef.current,
        start: 'top 80%',
        end: 'bottom 20%',
        scrub: true,
      },
      opacity: 0,
      scale: 0.8,
    });
  }, []);

  return <div ref={elementRef}>Contenido animado</div>;
}
```

**Timeline (múltiples animaciones en secuencia):**
```tsx
const tl = gsap.timeline();
tl.to('.box1', { x: 100, duration: 1 })
  .to('.box2', { y: 100, duration: 1 })
  .to('.box3', { rotation: 360, duration: 1 });
```

### 2. **AOS (Animate On Scroll)**
Librería ligera para animaciones al hacer scroll. Ya está configurada globalmente.

**Uso en cualquier componente:**
```tsx
<div data-aos="fade-up">
  Aparece desde abajo
</div>

<div data-aos="zoom-in" data-aos-delay="200">
  Aparece con zoom después de 200ms
</div>

<div data-aos="flip-left" data-aos-duration="1000">
  Voltea desde la izquierda en 1 segundo
</div>
```

**Animaciones disponibles:**
- **Fade:** `fade-up`, `fade-down`, `fade-left`, `fade-right`, `fade-up-right`, `fade-up-left`, etc.
- **Flip:** `flip-up`, `flip-down`, `flip-left`, `flip-right`
- **Slide:** `slide-up`, `slide-down`, `slide-left`, `slide-right`
- **Zoom:** `zoom-in`, `zoom-in-up`, `zoom-in-down`, `zoom-in-left`, `zoom-in-right`, `zoom-out`, etc.

**Opciones disponibles:**
- `data-aos-offset="200"` - Distancia en px antes de activar (default: 120)
- `data-aos-duration="1000"` - Duración en ms (default: 400)
- `data-aos-delay="100"` - Delay en ms
- `data-aos-easing="ease-in-out"` - Tipo de easing
- `data-aos-once="true"` - Animar solo una vez (default: false)
- `data-aos-anchor-placement="top-center"` - Punto de anclaje

### 3. **Typed.js**
Para efectos de texto tipo "máquina de escribir".

**Uso básico:**
```tsx
import { useEffect, useRef } from 'react';
import Typed from 'typed.js';

export function TypedText() {
  const elementRef = useRef(null);

  useEffect(() => {
    const typed = new Typed(elementRef.current, {
      strings: [
        'Monitoreo en tiempo real',
        'Protección ambiental',
        'Datos confiables',
      ],
      typeSpeed: 50,
      backSpeed: 30,
      backDelay: 2000,
      loop: true,
      showCursor: true,
      cursorChar: '|',
    });

    return () => typed.destroy();
  }, []);

  return <span ref={elementRef}></span>;
}
```

**Opciones:**
- `typeSpeed` - Velocidad de escritura (ms por carácter)
- `backSpeed` - Velocidad de borrado
- `backDelay` - Delay antes de borrar
- `startDelay` - Delay antes de empezar
- `loop` - Repetir infinitamente
- `showCursor` - Mostrar cursor parpadeante
- `fadeOut` - Hacer fade out al borrar

### 4. **Lottie (lottie-web)**
Para animaciones vectoriales exportadas desde After Effects.

**Uso básico:**
```tsx
import { useEffect, useRef } from 'react';
import lottie from 'lottie-web';

export function LottieAnimation() {
  const containerRef = useRef(null);

  useEffect(() => {
    const animation = lottie.loadAnimation({
      container: containerRef.current!,
      renderer: 'svg',
      loop: true,
      autoplay: true,
      path: '/animations/loading.json', // Ruta a tu archivo JSON
    });

    return () => animation.destroy();
  }, []);

  return <div ref={containerRef} style={{ width: 300, height: 300 }} />;
}
```

**Con control manual:**
```tsx
const animation = lottie.loadAnimation({...});

// Controles
animation.play();
animation.pause();
animation.stop();
animation.setSpeed(2); // 2x velocidad
animation.goToAndStop(50, true); // ir al frame 50
```

## 🎯 Ejemplos de Uso en el Landing

### Título con efecto de escritura
```tsx
// En HeroSection.tsx
import Typed from 'typed.js';

const typedRef = useRef(null);

useEffect(() => {
  const typed = new Typed(typedRef.current, {
    strings: ['Monitoreo Ambiental Inteligente', 'Protección del Amazonas'],
    typeSpeed: 60,
    backSpeed: 40,
    backDelay: 3000,
    loop: true,
  });
  return () => typed.destroy();
}, []);

<h1>
  <span ref={typedRef}></span>
</h1>
```

### Cards con AOS
```tsx
// En FeaturesSection.tsx
<div className="grid md:grid-cols-3 gap-8">
  <div data-aos="fade-up" data-aos-delay="0">
    Card 1
  </div>
  <div data-aos="fade-up" data-aos-delay="200">
    Card 2
  </div>
  <div data-aos="fade-up" data-aos-delay="400">
    Card 3
  </div>
</div>
```

### Parallax con GSAP
```tsx
// Efecto parallax en imágenes
useEffect(() => {
  gsap.to('.parallax-image', {
    scrollTrigger: {
      trigger: '.parallax-section',
      scrub: true,
    },
    y: 100,
    ease: 'none',
  });
}, []);
```

### Contador animado con GSAP
```tsx
// En StatsSection.tsx
useEffect(() => {
  gsap.to('.counter', {
    scrollTrigger: {
      trigger: '.stats-section',
      start: 'top 80%',
    },
    innerHTML: 1000,
    duration: 2,
    snap: { innerHTML: 1 },
    onUpdate: function() {
      this.targets()[0].innerHTML = Math.ceil(this.targets()[0].innerHTML);
    }
  });
}, []);

<div className="counter">0</div>
```

## 🎨 Mejores Prácticas

1. **No abuses de las animaciones** - Úsalas para guiar la atención, no para distraer
2. **Mantén la consistencia** - Usa el mismo estilo de animaciones en todo el sitio
3. **Optimiza el rendimiento** - Usa `will-change` en CSS para animaciones frecuentes
4. **Respeta las preferencias del usuario** - Detecta `prefers-reduced-motion`
5. **Timing adecuado** - Animaciones rápidas (200-400ms) para microinteracciones, más lentas (800-1200ms) para transiciones importantes

## 📚 Recursos

- [GSAP Docs](https://greensock.com/docs/)
- [AOS GitHub](https://github.com/michalsnik/aos)
- [Typed.js](https://mattboldt.com/demos/typed-js/)
- [Lottie Files](https://lottiefiles.com/) - Biblioteca de animaciones gratuitas
