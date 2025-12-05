# Kururin Game - Juego de Cumpleaños 🎮🎉

## 🎯 Objetivo del Proyecto

Un juego interactivo personalizado para un cumpleaños, donde el jugador debe derrotar 3 bosses en un entorno dinámico y desafiante.

---

## 🎮 Mecánicas del Juego

### Control Principal

- **Click/Tap en la pantalla**: Saltar
- **Evitar meteoritos**: Perder vida al colisionar
- **Tocar el cuadrado amarillo**: Devolverlo al jefe para atacar
- **Derrotar 3 bosses**: Ganar el juego

### Características de Jugabilidad

#### 1. Meteoritos

- **14 lanes** distribuidas uniformemente desde arriba hasta abajo
- **Sin safe zones**: El jugador es vulnerable en cualquier posición
- **Meteoritos explosivos**: Post-Boss 1, el 40% de los meteoritos explotan en 3 fragmentos circulares
- **Fragmentos**: Viajan en 3 direcciones (diagonal arriba, centro, diagonal abajo)

#### 2. Física del Juego

- **Gravedad**: 0.35 (rápida y agresiva)
- **Fuerza de salto**: -12 (salto potente)
- **Velocidad de caída**: Rápida, sin tiempo para escapar
- **Colisión**: Círculo-rectángulo para detectar impactos precisos

#### 3. Bosses

| Boss   | Distancia | Vidas | Patrón de Fuego       | Dificultad |
| ------ | --------- | ----- | --------------------- | ---------- |
| Boss 1 | 6,000m   | 3     | 3 disparos simples    | Fácil      |
| Boss 2 | 12 ,000m   | 5     | 5 disparos en abanico | Media      |
| Boss 3 | 18,000m   | 7     | 8 disparos en espiral | Difícil    |

#### 4. Barra de Progreso

- **Única barra visual** que muestra progreso total (0 → Boss 3)
- **3 círculos divisores** en las posiciones de cada boss
- **Números dentro** de los círculos (1, 2, 3)
- **Color dinámico**: Naranja si completado, gris si pendiente
- **Ubicación**: Parte superior de la pantalla (Y=50px)

---

## 🎨 Interfaz y Diseño

### Colores

- **Tema**: Azules y grises oscuros (compatible con fondo espacial)
- **Botones**: Azul muy oscuro (blue-950 y blue-900)
- **Textos**: Blanco y colores suaves
- **Efectos**: Sombras suaves, sin brillos excesivos

### Pantallas

#### Menú Principal

- Imagen de fondo (Fate Honkai)
- Overlay oscuro para legibilidad
- Botón "Sorpresa" (confetti + modal)
- Botón "Iniciar Juego" (oscuro)

#### Juego

- **HUD**: Distancia (números solo), Barra de vida (gradiente dinámico), Botón Pausa
- **Barra de progreso**: En la parte superior
- **Indicador de Boss**: Texto rojo + instrucciones claras
- **Personaje**: GIF animado del personaje principal

#### Menú de Pausa

- Fondo azul oscuro
- Botones: Continuar (verde) / Salir (rojo)
- Fácilmente identificable

#### Game Over

- Fondo gris oscuro
- Botones: Intentar de nuevo (verde) / Salir (rojo)
- Mensaje personalizado

#### Victoria

- **Pantalla especial** con confetti
- **Mensaje de cumpleaños**: "¡Felicidades en tu día especial!"
- **Texto animado** (bounce effect)
- **Confetti**: Se dispara al mostrar o al hacer click
- **Botón para volver**: También dispara confetti

---

## 🎯 Instructiones Claras para el Jugador

### Cuando aparece un boss:

```
"¡Toca el cuadrado amarillo para devolvérselo al jefe!"
```

- Ubicación: Bajo el indicador "BOSS X/3"
- Fondo semi-transparente negro
- Texto blanco claro y legible

### Flujo del Juego:

1. **Menú Principal**: Click en "Iniciar Juego"
2. **Juego**:
   - Salta usando clicks
   - Evita meteoritos (perdes vidas)
   - Cuando veas al Boss → toca el amarillo para atacar
   - Repite para derrotar 3 bosses
3. **Victoria**: Ves confetti y mensaje de cumpleaños

---

## 📊 Configuración Técnica

### Velocidades

```javascript
GRAVITY: 0.0045           // Rápido
JUMP_STRENGTH: -1.2      // Fuerte
OBSTACLE_SPAWN: 900ms   // Frecuente
BOSS_SPAWN_INTERVAL: 1500ms-800ms (según dificultad)
```

### Distancias (Optimizadas para sesión corta)

- Boss 1: 6,000m
- Boss 2: 12,000m
- Boss 3: 18,000m

**Tiempo estimado de juego**: 3-5 minutos por run

---

## 🛠️ Funcionalidades Especiales

### Botón Pausa

- Pausa el juego completamente
- Menú superpuesto con opciones
- Reanuda exactamente donde se pausó

### Confetti

- Aparece al ganar
- Se puede disparar haciendo click en pantalla de victoria
- Efecto visual celebratorio

### Sistema de Vidas

- Comienza con 3 vidas
- Barra visual que muestra vidas restantes
- Colores: Verde (3) → Amarillo (2) → Rojo (1)

### Meteoritos Explosivos

- Post-Boss 1: 40% de probabilidad de explosión
- Fragmentos circulares que viajan en 3 direcciones
- Efecto visual de brillo naranja

---

## 🎂 Contexto del Proyecto

Este es un **juego personalizado para un cumpleaños**:

- ✅ Rápido de jugar (3-5 minutos)
- ✅ Divertido y desafiante
- ✅ Mensaje de cumpleaños personalizado
- ✅ Confetti celebratorio al ganar
- ✅ Botón "Sorpresa" con sorpresa especial
- ✅ Diseño atractivo pero funcional

---

## 📁 Estructura de Archivos

```
src/
  Components/
    Game.jsx              # Lógica principal del juego
    Menu.jsx              # Menú de inicio
    PauseMenu.jsx         # Menú de pausa
    GameOver.jsx          # Pantalla de game over
  Modals/
    SurpriseModal.jsx     # Modal de sorpresa
  assets/
    starsBG.jpg           # Fondo espacial
    Meteor.png            # Imagen del meteorito
    kururin.gif           # Personaje principal
    rinTohsaka.gif        # GIF Game Over
    caelus.gif            # GIF Menú
    fateHonkai.jpeg       # Fondo Menú
```

---

## Mejoras Realizadas en Esta Sesión

1. ✅ Velocidad aumentada (3-5x más rápido)
2. ✅ Meteoritos explosivos post-Boss 1
3. ✅ Sin safe zones (meteoritos en todas partes)
4. ✅ Barra de progreso total (0 → Boss 3)
5. ✅ Colores mejorados (menos brillosos, más oscuros)
6. ✅ Botón Pausa funcional
7. ✅ Instrucciones claras cuando aparecen bosses
8. ✅ Pantalla de victoria con confetti y mensaje de cumpleaños
9. ✅ Botones oscurecidos en menú
10. ✅ Gravedad y salto mejorados

---

## Conclusión

El juego está completamente funcional y optimizado para proporcionar una **experiencia rápida, desafiante y celebratoria** para un cumpleaños. El jugador puede derrotar los 3 bosses, verá un mensaje personalizado de felicidades, y disfrutará del efecto de confetti.

**¡Listo para celebrar!**
