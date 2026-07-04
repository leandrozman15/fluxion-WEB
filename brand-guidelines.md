# FluxiON Brand Guidelines

## Paleta principal

| Uso | Color | HEX | RGB |
| --- | --- | --- | --- |
| Color principal (logo) | Naranja FluxiON | #FF7A1A | 255, 122, 26 |
| Color secundario | Azul FluxiON | #2316B8 | 35, 22, 184 |
| Texto principal | Negro | #1A1A1A | 26, 26, 26 |
| Fondo | Blanco | #FFFFFF | 255, 255, 255 |
| Fondo secundario | Gris muy claro | #F6F8FB | 246, 248, 251 |
| Acento | Verde claro | #CDEFD7 | 205, 239, 215 |

## Botones

- Primario: fondo #FF7A1A, texto #FFFFFF, hover #E86800.
- Secundario: fondo #2316B8, texto #FFFFFF, hover #1A1194.

## Estados

- Exito: #22C55E
- Advertencia: #F59E0B
- Error: #EF4444
- Informacion: #3B82F6

## Tipografia

- Titulos: Poppins
- Cuerpo e interfaz: Inter

## Composicion visual

- Distribucion recomendada de color:
  - 70% blanco y grises claros
  - 20% azul
  - 10% naranja
- Tarjetas: radio de 12 a 16 px y sombras suaves.
- Iconografia: lineal y simple.
- Uso del naranja: solo para CTA y elementos de alto foco.

## Implementacion web

1. Cargar fuentes Poppins e Inter desde Google Fonts.
2. Importar `brand-tokens.css` al inicio de tu app.
3. Construir componentes base (`.btn-primary`, `.btn-secondary`, `.card`) usando tokens.
4. Evitar mezclar nuevos colores sin mapeo a variables.
