# 📖 Guía paso a paso para ejecutar la aplicación *hotelrestfull* 🏨

## 🛠️ **Requisitos previos**

Antes de empezar, asegúrate de tener instalados los siguientes programas en tu computadora:

1. **Node.js** (versión 18 o superior)

   - Puedes descargarlo desde 👉 [https://nodejs.org](https://nodejs.org)
   - Para verificar si ya lo tienes instalado, abre la terminal y escribe:
     ```sh
     node -v
     ```
     Si ves algo como `v18.x.x`, ¡ya lo tienes! 🎉

2. **Git** (para clonar el repositorio, si es necesario)

   - Descárgalo aquí 👉 [https://git-scm.com/](https://git-scm.com/)
   - Para verificar si está instalado, en la terminal escribe:
     ```sh
     git --version
     ```
     Si ves un número de versión, ¡todo listo!

3. **PHP** (versión 8.2 o superior)

   - Descárgalo aquí 👉 [https://www.php.net/downloads](https://www.php.net/downloads)
   - Para verificar la versión instalada, ejecuta en la terminal:
     ```sh
     php -v
     ```
     Si ves algo como `PHP 8.2.x`, está todo bien.

---

## 🚀 **Pasos para ejecutar la aplicación**

### 1️⃣ **Descargar el código**

Si el código está en un repositorio, clónalo con este comando:

```sh
git clone https://github.com/luisbayona01/descameronrestfull.git
```

Luego entra a la carpeta del proyecto:

```sh
cd descameronrestfull/hotelfront
```

### 2️⃣ **Instalar las dependencias**

Dentro de la carpeta del proyecto, ejecuta el siguiente comando para instalar todo lo necesario:

```sh
npm install
```

⏳ Esto puede tardar unos minutos. Al finalizar, verás una carpeta llamada `node_modules`, que es donde se guardan todas las librerías necesarias.

### 3️⃣ **Ejecutar la aplicación en modo desarrollo**

Para iniciar la aplicación y verla en tu navegador, usa este comando:

```sh
npm run dev
```

🔹 Verás un mensaje como este en la terminal:

```
  VITE vX.X.X  ready in Xs
  ➜ Local: 📌 Abre tu navegador y ve a http://localhost:5173/ para ver la aplicación funcionando.
```

### 🔹 **Ejecutar el Backend**

Abre otra terminal y dirígete a la carpeta del backend con el siguiente comando:

```sh
cd descameronrestfull/hotelservices
```

Instala las dependencias de PHP y Laravel con:

```sh
composer install
```

Copia el archivo de configuración y ajusta las credenciales de la base de datos:

```sh
cp .env.example .env
```

Genera la clave de la aplicación:

```sh
php artisan key:generate
```

Instala Passport para la autenticación (responde "yes" a todo cuando sea necesario). Esto ejecutará automáticamente las migraciones:

```sh
php artisan passport:install
```

Llena la base de datos con datos de prueba:

```sh
php artisan db:seed
```

Levanta el servidor del backend:

```sh
php artisan serve
```

Por defecto, Laravel ejecutará el backend en `http://127.0.0.1:8000/`.

---

## 🔹 **Probar la aplicación**

Para acceder a la aplicación en local, abre tu navegador y ve a:

```sh
http://localhost:5173/
```

Puedes iniciar sesión con las siguientes credenciales:

- **Email:** `admin@example.com`
- **Contraseña:** `password123`

🌐 Entorno de producción
También puedes probar la aplicación funcionando en el entorno de producción:
 Copiar https://hotelesadmin.godelivery.site/
Credenciales de acceso
Para ambos entornos (desarrollo y producción), puedes iniciar sesión con las siguientes credenciales:

Email: admin@example.com
Contraseña: password123


