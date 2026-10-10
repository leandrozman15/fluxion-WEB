# FluxiON Brand Guidelines

## Paleta principal

| Rol | Tono | HEX | Uso |
| --- | --- | --- | --- |
| Fondo base | Soft Canvas | #F8FAFC | Lienzo principal |
| Superficie | Pure Card White | #FFFFFF | Tarjetas y modales |
| Bordes | Subtle Slate | #E2E8F0 | Divisores y marcos |
| Texto principal | Deep Slate | #0F172A | Titulares y texto de máxima jerarquía |
| Texto secundario | Muted Slate | #475569 | Descripciones y metadatos |
| Primario | Electric Cobalt | #4F46E5 | CTA principal, enlaces y foco |
| Primario claro | Blue | #3B82F6 | Estados informativos y destellos sutiles |

## Acentos por ecosistema

| Versión | Acento | Badge |
| --- | --- | --- |
| Fluxion Edu | #8B5CF6 | #F5F3FF |
| Fluxion Industrial y Logistic | #0EA5E9 | #F0F9FF |
| Fluxion Sport | #10B981 | #ECFDF5 |
| Desarrollos a medida / Labs | #F59E0B | #FFFBEB |

## Botones

- Primario: fondo #4F46E5, texto #FFFFFF, hover #4338CA.
- Secundario: fondo #3B82F6, texto #FFFFFF.

## Estados

- Exito: #10B981
- Advertencia: #F59E0B
- Error: #EF4444
- Informacion: #3B82F6

## Tipografia

- Títulos: Manrope
- Cuerpo e interfaz: DM Sans

## Composicion visual

- Distribución recomendada: 60% neutros claros, 30% estructura y texto slate, 10% acentos funcionales.
- Tarjetas: radio de hasta 8 px, bordes sutiles y sombras suaves.
- Iconografia: lineal y simple.
- Los acentos se reservan para CTA, badges de versión y destellos discretos.

## Implementacion web

1. Cargar Manrope y DM Sans desde Google Fonts.
2. Importar `brand-tokens.css` al inicio de tu app.
3. Construir componentes base (`.btn-primary`, `.btn-secondary`, `.card`) usando tokens.
4. Evitar mezclar nuevos colores sin mapeo a variables.
