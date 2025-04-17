# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript and enable type-aware lint rules. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
 

## ¿Como usar knex con la base de datos?
Las caracteristicas de la base de datos son las siguientes:
    database: 'connect_the_schools'
    user: 'admin'
    password: 'admin'
    host: 'localhost'
    port: 5432

Para crear la base de datos debes usar los siguientes comandos en este orden:
`psql -U postgres`
`create database connect_the_schools;`
`create user admin with encrypted password 'admin';`
`grant all privileges on database connect_the_schools to admin;`
`\q`
`psql -U postgres -d connect_the_schools`
`grant create on schema public to admin;`
`grant usage on schema public to admin;`

Ya que tengas la base de datos conectada ahora DEBES de ir a la carpeta "node-app" para crear tu tabla desde knex (este paso varia dependiendo de que tabla quieras generar con knex)
`npx knex migrate:make nombre_de_la_migracion`
Con el paso anterior se crear un archivo dentro de la carpeta migrations en donde podras editar lo que tendra tu tabla que quieras desarrollar
