# Quadruple Square

<div align="center">
<img src="public/img/duckfault.jpg" width="100%" alt="Quadruple Square Logo">
</div>

## Descripción

'Quadruple Square' es un proyecto backend que implementa un juego de cartas estratégico inspirado en un minijuego de Square Enix. El sistema permite a los jugadores construir un mazo compuesto por cinco cartas y enfrentarse a un oponente controlado por la máquina en partidas sobre un tablero de 3x3.

El objetivo del juego es capturar el mayor número posible de cartas del rival mediante la colocación estratégica de las propias. Al finalizar la partida, el jugador ganador obtiene una de las cartas previamente seleccionadas por su oponente, incorporándola a su colección.

El proyecto incluye:

- Selección de cartas desde la colección del jugador.
- Partidas contra bots.
- Lógica de captura automática por poder de cartas en los cuatro lados.
- Estado de partida, turno y fin de juego.
- Fase final de robo de carta al ganador.
- Vistas renderizadas con EJS y una API para el cliente.

## Requisitos

Antes de instalarlo necesitas:

- Node.js
- npm
- docker y docker compose
- Variables de entorno configuradas en un archivo `.env`

El resto de módulos se integran directamente desde el package.json disponible en el repositorio. Estos representan:
    
`dotenv
ejs
express
pg
sequelize`


## Instalación

1. Clone el repositorio con:
```bash
git clone https://github.com/r3dc0m/quadruple-square.git
```

2. Acceda al directorio e instale las dependencias:

```bash
cd quadruple-square/
npm install
```

3. Renombre el archivo `.env.example` a `.env` en la raíz del proyecto con la configuración necesaria para su base de datos y el puerto de la aplicación. Se recomienda cambiar las contraseñas de la base de datos y de administrador de aplicación.

Un ejemplo orientativo:

```env
# App
APP_HOST=quadruple-square
APP_PORT=3000

# DB
DB_HOST=localhost
DB_NAME=quadruple
DB_USER=adminuser
DB_PASSWORD=password
DB_PORT=5432

# Admin
ADMIN_USERNAME=admin
ADMIN_EMAIL=admin@quadruple-square.com  
ADMIN_PASSWORD=admin123
ADMIN_CURRENCY=4181
```

4. Arranque la aplicación con docker compose:

```bash
docker compose up --build
```

Si desea desarrollar el proyecto modifique la linea del Dockerfile comentando la segunda linea y descomentando la primera, o si no va a hacer cambios en el servidor comente sólo la primera descomentando la segunda. 

Por ejemplo para desarrollo:

```bash
CMD ["npm", "run", "dev"]
#CMD ["npm", "start"]
```

O para producción:

```bash
#CMD ["npm", "run", "dev"]
CMD ["npm", "start"]
```

## Datos iniciales

El proyecto incluye un archivo `seed.js` con datos base para poder comenzar a jugar, incluyendo usuario admin y configuración inicial para poder probar la aplicación desde el inicio.

Al arrancar la aplicación, si no hay usuarios en la base de datos, el sistema ejecuta el seed automáticamente.

## Cómo funciona

### Nueva partida

Desde la pantalla de nueva partida:

- elija un bot,
- seleccione exactamente cinco cartas de su colección,
- y lance la partida.

Si ya tiene una partida activa, puede continuarla o cancelarla.

### Juego

La partida se desarrolla en un tablero de 9 posiciones. En cada turno coloque una carta en una casilla vacía.

Cuando coloque una carta, si su poder en un lado supera al poder de la carta adyacente en ese lado, y esa carta pertenece al oponente, puede capturar esa carta.

### Fin de partida

Cuando el tablero se llena:

- se cuenta cuántas cartas controla cada jugador,
- gana quien tenga más cartas capturadas,
- y el ganador entra en una fase de adquisición de carta del rival.

### Colección

Cada jugador tiene una colección de cartas con una cantidad disponible de cada una. Las cartas seleccionadas para la partida se descuentan de la colección y, al cancelar o reiniciar la selección, se recuperan.

## Estructura general

- `src/controllers`: controladores de vistas y API.
- `src/services`: lógica principal del juego.
- `src/models`: modelos de Sequelize.
- `src/routes`: rutas de la aplicación.
- `src/views`: plantillas EJS.
- `public`: recursos estáticos como imágenes y estilos.

## Notas

Es un proyecto en desarrollo, se puede cara al futuro integrar un sistema de intercambio de cartas por puntos que permitan adquirir cartas menos comunes.

De momento no considera roles ni autencicación.