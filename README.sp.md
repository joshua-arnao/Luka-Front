<p align="center">
    <b>Selecciona el idioma:</b><br>
    <a href="README.md">🇺🇸 English</a> |
    <a href="README.sp.md">🇪🇸 Español</a>
</p>

---

<p align="center">
  <h1 align="center">💸 LUKA Frontend — Aplicación de Billetera Digital</h1>
  <p align="center">PWA mobile-first con Angular 19 para la plataforma fintech LUKA</p>
</p>

---

## ¿Qué es esto?

Esta es la aplicación frontend de LUKA — una plataforma de billetera digital inspirada en Yape y Revolut. Construida con Angular 19 usando componentes standalone, se conecta a la API REST del [Backend de LUKA](https://github.com/joshua-arnao/luka).

La app está diseñada mobile-first con un tema oscuro, haciéndola sentir como una app fintech nativa en cualquier dispositivo.

---

## Funcionalidades

- **Autenticación** — Registro y login con gestión de tokens JWT
- **Dashboard** — Saldo en tiempo real, transacciones recientes y resumen de objetivos de ahorro
- **Enviar dinero** — Flujo de transferencia en dos pasos con búsqueda de contacto por email
- **Historial de transacciones** — Historial completo con indicadores de enviado/recibido
- **Objetivos de ahorro** — Crear objetivos con reglas de ahorro automático (porcentaje, redondeo, programado)
- **Notificaciones** — Notificaciones de eventos en tiempo real con marcar como leída
- **Responsive** — Diseño mobile-first que funciona en cualquier tamaño de pantalla

---

## Stack Tecnológico

| Tecnología | Versión | Propósito |
|-----------|---------|-----------|
| Angular | 19 | Framework frontend |
| TypeScript | 5.x | Lenguaje |
| RxJS | 7.x | Programación reactiva |
| Angular Router | 19 | Navegación del lado del cliente |
| Angular HttpClient | 19 | Comunicación con la API |
| SCSS | — | Estilos con variables CSS |

---

## Arquitectura

```
src/app/
    ├── core/
    │   ├── guards/         → AuthGuard — protege rutas autenticadas
    │   ├── interceptors/   → AuthInterceptor — adjunta JWT a cada petición
    │   ├── models/         → Interfaces TypeScript que coinciden con los DTOs del backend
    │   └── services/       → Servicios de API (auth, wallet, transaction, saving, notification)
    ├── pages/
    │   ├── login/          → Pantalla de login
    │   ├── register/       → Pantalla de registro
    │   ├── dashboard/      → Pantalla principal con saldo y resumen
    │   ├── transactions/   → Transferir dinero e historial
    │   ├── savings/        → Gestión de objetivos de ahorro
    │   └── notifications/  → Centro de notificaciones
    └── shared/
        └── components/     → Componentes UI reutilizables
```

### Decisiones arquitectónicas clave

**Componentes standalone** — Los componentes standalone de Angular 19 eliminan la necesidad de NgModules, haciendo cada componente completamente autónomo y más fácil de cargar de forma lazy:

**Lazy loading** — Cada página se carga de forma lazy a través del router, reduciendo el tamaño del bundle inicial:

```typescript
{
  path: 'dashboard',
  loadComponent: () => import('./pages/dashboard/dashboard.component')
    .then(m => m.DashboardComponent),
  canActivate: [authGuard]
}
```

**Interceptor JWT** — Un interceptor funcional adjunta automáticamente el token Bearer a cada petición HTTP saliente, para que los servicios nunca necesiten manejar la autenticación manualmente:

```typescript
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = inject(AuthService).getToken();
  if (token) {
    return next(req.clone({ headers: req.headers.set('Authorization', `Bearer ${token}`) }));
  }
  return next(req);
};
```

**Route guard** — `authGuard` protege todas las rutas autenticadas y redirige a los usuarios no autenticados al login.

**Variables CSS para theming** — Todos los colores están definidos como propiedades personalizadas CSS en `styles.scss`, haciendo trivial cambiar todo el tema desde un solo lugar:

```scss
:root {
  --luka-bg:           #0a0a0f;
  --luka-accent:       #7C3AED;
  --luka-green:        #10B981;
  --luka-red:          #EF4444;
  // ...
}
```

---

## Sistema de Diseño

LUKA usa un sistema de diseño oscuro personalizado inspirado en Revolut. Todos los tokens de diseño viven en `src/styles/tokens.scss`.

### Paleta de colores

| Token | Valor | Uso |
|-------|-------|-----|
| `--luka-bg` | `#0a0a0f` | Fondo de página |
| `--luka-surface` | `#13131a` | Elementos de superficie |
| `--luka-card` | `#1a1a24` | Tarjetas y paneles |
| `--luka-accent` | `#7C3AED` | Acciones primarias |
| `--luka-accent-light` | `#8B5CF6` | Estados hover |
| `--luka-green` | `#10B981` | Ingresos, éxito |
| `--luka-red` | `#EF4444` | Gastos, errores |
| `--luka-yellow` | `#F59E0B` | Ahorros, advertencias |
| `--luka-blue` | `#3B82F6` | Info, notificaciones |
| `--luka-text` | `#F9FAFB` | Texto primario |
| `--luka-muted` | `#6B7280` | Texto secundario |

---

## Ejecutar Localmente

### Prerrequisitos

- Node.js 20+
- Angular CLI 19

### Pasos

**1. Clonar el repositorio**
```bash
git clone https://github.com/joshua-arnao/luka-frontend.git
cd luka-frontend
```

**2. Instalar dependencias**
```bash
npm install
```

**3. Asegúrate de que el backend esté corriendo**

La app se conecta a `http://localhost:8080/api` por defecto. Ve al repositorio del [Backend de LUKA](https://github.com/joshua-arnao/luka) para configurarlo.

**4. Iniciar el servidor de desarrollo**
```bash
ng serve
```

**5. Abrir la app**
```
http://localhost:4200
```

---

## Configuración de Entorno

La URL base de la API está configurada en `src/environments/environment.ts`:

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080/api'
};
```

Para producción, actualiza `src/environments/environment.prod.ts` con la URL de tu backend desplegado.

---

## Flujo de Usuario

```
Registro → Login → Dashboard
                      ↓
              ┌───────┼───────┐
              ↓       ↓       ↓
         Enviar dinero  Ahorros  Notificaciones
              ↓           ↓
         Historial   Crear objetivo + regla
```

### Flujo de envío de dinero (2 pasos)
1. Ingresar email del destinatario → el sistema encuentra su billetera
2. Ingresar monto → confirmar y enviar

### Flujo de crear objetivo de ahorro
1. Ingresar nombre, descripción y meta del objetivo
2. Elegir regla de ahorro — Porcentaje / Redondeo / Programado
3. Configurar parámetros de la regla
4. Objetivo creado con regla de ahorro automático activa

---

## Lo que Aprendí Construyendo Esto

- **Componentes standalone de Angular 19** — Angular moderno sin NgModules
- **Interceptores funcionales** — el nuevo patrón de interceptor HTTP de Angular
- **Lazy loading basado en rutas** — optimizando el tamaño del bundle
- **Gestión de tokens JWT** — almacenar y enviar tokens de forma segura
- **Formularios reactivos con RxJS** — manejando llamadas API async con observables
- **CSS mobile-first** — diseñando para pantallas pequeñas primero
- **Propiedades personalizadas CSS** — construyendo un sistema de diseño mantenible

---

## Relacionado

- [Backend de LUKA](https://github.com/joshua-arnao/luka) — API REST con Spring Boot

---

## Autor

**Joshua Arnao**
Desarrollador autodidacta apasionado por el fintech y la arquitectura limpia.
