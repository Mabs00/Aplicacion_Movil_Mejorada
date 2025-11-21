### Evaluación 2: Aplicación Móvil de Tareas Persistentes 
Aplicación móvil desarrollada con React Native y Expo (TypeScript), diseñada para gestionar tareas de forma contextual, demostrando la correcta implementación de la gestión de estado global, navegación y persistencia de datos.

---

## ⚙️ Características Implementadas
Creación y Contextualización: Permite crear nuevas tareas que incluyen:

Título.

Fotografía (Base64).

Localización GPS (Coordenadas de creación).

Gestión CRUD: Las tareas pueden ser Eliminadas y Marcadas como completadas/no completadas (toggleTask).

Aislamiento de Datos: Las tareas están asociadas a un userId y se filtran para ser visibles únicamente por el usuario logueado.

💾 Persistencia y Gestión de Estado
Persistencia Local: Se utiliza el Context API para la gestión global del estado, el cual se sincroniza de forma persistente con AsyncStorage.

Navegación: Uso obligatorio de Expo Router para la navegación entre el Login y las pestañas principales.

---

## 👤 Usuarios de prueba

| Email                   | Contraseña |
|-------------------------|------------|
| `usuario.uno@gmail.com` |   `1234`   |
| `usuario.dos@gmail.com` |   `5678`   |

---
El siguiente apartado explica la decisión técnica tomada para la persistencia de las imágenes, vital para la comprensión del entregable:

📸 Persistencia Multimedia (Base64):

Se implementó la codificación Base64 para almacenar la fotografía directamente dentro del objeto Task en AsyncStorage (como una cadena de texto).

Esta decisión se tomó para mitigar un error persistente de entorno (TypeError: Cannot read property 'documentDirectory' of undefined) que impedía la correcta carga del módulo expo-file-system en el dispositivo de desarrollo, asegurando así la funcionalidad y la persistencia local de la imagen tal como lo exige la evaluación.
La IA fue utilizada como una herramienta de apoyo clave para la solución de problemas técnicos complejos, la optimización del código y la implementación de funcionalidades específicas.

Refactorización y Optimización de Código: Asistencia en la refactorización de la gestión de estado (useState local a Context API) y la implementación de useCallback y useMemo en TasksContext.tsx para mejorar la estabilidad y eficiencia del rendimiento.

Implementación de Requisitos Técnicos: Ayuda en la integración de librerías nativas como expo-location y expo-image-picker (Base64), asegurando la correcta solicitud de permisos y el manejo de objetos tipados (TypeScript). 

Depuración de Entorno: Asistencia en la identificación y resolución del error persistente de entorno (documentDirectory of undefined) mediante el diágnotisco de logs y la aplicación  de soluciones epecíficas de limpieza de caché (npm install, npx expo start --clear) para garantizar la estabilidad del proyecto.



---

## ¿QUIERES VER CÓMO FUNCIONA?
Aquí está el enlace al video demostrativo que cubre el flujo completo (Login, Creación de Tarea, Persistencia, Toggle y Delete):

https://youtube.com/shorts/DgjNSXkxMd8

## 📘 Aprendizajes Clave
Nos guiamos con reactjs.wiki para aprender sobre el uso avanzado de useEffect, useState y Context, y con Vibecoding para manejar estilos en la app.






