##### Documentação básica:
 - ***Clientes*** = pessoas que pagam pela minha plataforma SaaS para terem minha API para alimentar a loja online delas
 - ***Usuários*** = Clientes dos meus **Clientes** (que vou tentar pegar uma porcentagemzinha boba também 😝 por volta de 1% SE DER)

### Sequências:

##### Rota dos **Clientes**:
1. ***Cliente*** entra na plataforma.
2. Servidor pede login e senha.
3. Se login e senha existir, entra no sistema da plataforma de loja.
4. Cliente adiciona formato de envio de pagamento.
5. Cliente adiciona seu primeiro produto.
6. Informações básicas da loja.
7. Deploy da loja com configurações iniciais dadas.

##### Rota dos **Usuários**:
1. ***Usuário*** entra no site.
2. Servidor puxa dados do cliente da loja atual.
3. Servidor puxa dados da estética da loja atual.
4. Servidor carrega o CRUD de produtos.
5. Servidor junta esses dados e devolve para o Frontend do User.
6. Usuário tentou adicionar algo ao carrinho = Servidor pede para se logar / Auth.
7. Quando logado, permite adicionar itens ao carrinho e ao wishlist.
8. Usuário tentou comprar algo = tela de compra para dados seguros.