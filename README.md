# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript and enable type-aware lint rules. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
 

## ¿Como usar knex con la base de datos?
Tienen que ejecutar el archivo `init.sh`

Para los que tienen sistema UNIX vas a tener que darle permiso de ejecution con el siguiente comando `chmod +x init.sh`

Te va a pedir la contraseña de tu usuario de postgres repetidamene, asi que solo ingresenla

Despues de terminar con la ejecucion del `init.sh` ya tendran una nueva base de datos llamada connect_the_schools con un usuario admin que tiene los permisos necesarios para alterar connect_the_schools

Apartir de aqui ya pueden hacer las migraciones de tablas existentes y nuevas con knex

Para crear una nueva tabla tendran que usar el commando el `npm run knex migrate:make nombre_de_tabla` esto les va a crear un archivo .js en la carpeta migrations y es hay donde van a crear la tabla

Para hacer las migraciones usen `npm run knex migrate:up` esto para crear su nueva tabla dentro de la base de datos

Para mas informacion del manejo de migraciones vea: https://www.luisllamas.es/en/what-is-and-how-to-use-knex/
