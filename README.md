# CHATBOT WhatsApp para Salón de Belleza con Google Calendar y OpenAI GPT-3

<p align="center">
  <img width="300" src="https://raw.githubusercontent.com/juanperezzdp/ChatBotSalonDeBellezaCalendar/refs/heads/main/img/Logo.png">
</p>

Este proyecto es un chatbot diseñado para facilitar la gestión de turnos en un salón de belleza. Utiliza la API de Google Calendar y OpenAI GPT-3 para ofrecer una experiencia de usuario fluida y eficiente. El bot interactúa a través de WhatsApp, permitiendo a los clientes verificar la disponibilidad de fechas y reservar citas directamente en el calendario de manera automática.

## Características principales:

- **Agendamiento de turnos**: Los usuarios pueden programar sus citas, que se guardan automáticamente en Google Calendar.
- **Verificación de disponibilidad**: El bot consulta la disponibilidad del calendario antes de confirmar la cita.
- **Manejo de lenguaje natural**: Gracias a GPT-3 de OpenAI, el chatbot puede comprender y procesar solicitudes en lenguaje natural, mejorando la interacción con los usuarios.
- **Sugerencia de fechas**: Si la fecha solicitada no está disponible, el bot sugiere automáticamente fechas cercanas disponibles.
- **Flujos de conversación personalizables**: Los flujos están organizados de manera modular, permitiendo la fácil expansión y personalización del chatbot.

## Librerías utilizadas:

Con la librería **npm create bot-whatsapp@latest**, puedes construir flujos automatizados de conversación de manera agnóstica al proveedor de WhatsApp. Configura respuestas automáticas para preguntas frecuentes, responde y gestiona mensajes automáticamente, y lleva un seguimiento de las interacciones con los clientes. Además, puedes configurar fácilmente disparadores que expanden las funcionalidades sin límites.
👉 **[Ver documentación oficial](https://bot-whatsapp.netlify.app/)**

## Instalación y Configuración:

1. Clona este repositorio:
   ```bash
   git clone https://github.com/juanperezzdp/ChatBotSalonDeBellezaCalendar.git
   ```
   -Instala las dependencias:
   -Inicia la aplicación:

```
npm install
npm start
```
