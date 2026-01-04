# Linha de tempo:

---
### Metas
 - [ ] Instalar libs pg (PostgreSQL), bcrypt (proteger senhas), jsonwebtoken (login + sessão via token)

#### Database
##### criar:
 - [ ] admin.users com:
  - 
  -  
 - [ ] admin.config com:
  - 
  -  
 - [ ] plataform.clients com:
  - 
  -  
 - [ ] plataform.products com:
  - 
  -  
 - [ ] plataform.lojaConfig com:
  - 
  -  
 - [ ] users.login com:
  - 
  -  
 - [ ] users.wishlist com:
  - 
  -  
 - [ ] users.cart com:
  - 
  -  

### Funções dentro do frontend plataform:
 - Sistema de login / auth para clientes
 - CRUD de produtos
 - Gerenciamento de banners e estética do site
 - Gerenciamento de usuários cadastrados
 - Gerenciamento de rotas e catálogos personalizáveis
 - Alteração de dados cadastrais, tais como formas de pagamento

### Funções dentro do Frontend Clients:
 - Sistema de login e senha
 - Mostrar produtos do respectivo cliente
 - 
[[../src/server.ts|Initial_file]]

## Cors:
Access-Control-Allow-Origin
Access-Control-Allow-Methods
Access-Control-Allow-Headers

project/
 ├─ src/
 │   ├─ server.js        -> servidor http raiz
 │   ├─ routes.js        -> roteador manual
 │   ├─ db.js            -> conexão banco
 │   ├─ controllers/
 │   │   ├─ auth.js
 │   │   └─ feedback.js
 │   ├─ utils.js         -> helpers (ex: parse body)
 ├─ package.json
 ├─ .env
