cat << 'EOF' > README.md
# 🛠️ EastQG Backend

Backend do projeto **EastQG**, responsável por fornecer dados de produtos e serviços para o front-end, integrando com a API do **Mercado Livre** para listar produtos do nosso vendedor e fornecer detalhes individuais de cada item.

---

## 📦 Tecnologias utilizadas

- **Node.js** – Runtime para rodar o backend  
- **Express** – Framework para criar o servidor e os endpoints  
- **node-fetch** – Para fazer requisições HTTP à API do Mercado Livre  
- **Hooks customizados** – Para gerenciar token de acesso e persistência de dados  

---

## 📁 Estrutura do projeto

\`\`\`
/backend
│
├─ /config
│   └─ config.js           # Configurações como USER_ID
│
├─ /hooks
│   └─ useLocalStorage.js  # Hook customizado para salvar dados
│
├─ /services
│   ├─ meliservice.js      # Funções de integração com Mercado Livre
│   └─ tokenService.js     # Funções para obter token de acesso
│
├─ /routes
│   └─ productsRoute.js    # Rotas para produtos
│
├─ index.js                # Arquivo principal do servidor Express
└─ package.json
\`\`\`

---

## ⚙️ Configuração

1. Clone o repositório:  
   \`\`\`bash
   git clone <url-do-repo>
   \`\`\`

2. Instale as dependências:  
   \`\`\`bash
   npm install
   \`\`\`

3. Configure seu arquivo **config/config.js**:  
   \`\`\`js
   export const USER_ID = '<SEU_USER_ID>';
   \`\`\`

4. Configure o **tokenService.js** para gerar o token de acesso do Mercado Livre.

5. Rode o servidor:  
   \`\`\`bash
   npm start
   \`\`\`

> O backend vai rodar por padrão em:  
> 🖥️ `http://localhost:3000`

---

## 🔹 Endpoints disponíveis

### 1. Listar produtos do vendedor

**GET** `/api/products`

Retorna a lista de produtos cadastrados pelo vendedor (`USER_ID`) no Mercado Livre.

#### 🧾 Exemplo de retorno:
\`\`\`json
[
  {
    "id": "MLB4144510177",
    "title": "Dockstation Dell Universal D6000 Com Fonte 130w",
    "price": 920,
    "image": "http://http2.mlstatic.com/D_885430-MLB89149768489_082025-I.jpg",
    "category": "MLB430800",
    "description": "D6000",
    "available_quantity": 1,
    "condition": "used",
    "permalink": "https://produto.mercadolivre.com.br/MLB-4144510177-dockstation-dell-universal-d6000-com-fonte-130w-_JM"
  }
]
\`\`\`

> ⚠️ Observação: O campo `category` retorna apenas o **ID da categoria** (ex.: `MLB430800`).  
> Não há `category_name` nesta rota.

---

### 2. Detalhes de um produto específico

**GET** `/api/product/:id`

Retorna todos os detalhes de um produto pelo seu ID no Mercado Livre.

#### 🧠 Exemplo de uso:
\`\`\`bash
GET http://localhost:3000/api/product/MLB5844608196
\`\`\`

#### 📦 Exemplo de retorno:
\`\`\`json
{
  "id": "MLB5844608196",
  "title": "Filtro De Ar Cônico + Filtro De Respiro De Óleo Race Chrome",
  "price": 320,
  "image": "http://http2.mlstatic.com/D_623081-MLB95698220278_102025-I.jpg",
  "category": "MLB47119",
  "description": "Filtro De Ar Cônico + Filtro De Respiro De Óleo Race Chrome",
  "available_quantity": 1,
  "condition": "new",
  "permalink": "https://produto.mercadolivre.com.br/MLB-5844608196-filtro-de-ar-cnico-filtro-de-respiro-de-oleo-race-chrome-_JM",
  "attributes": [ ... ],
  "warranty": "Garantia do vendedor: 20 dias",
  "seller_id": 290679032
}
\`\`\`

> ✅ Aqui é onde você consegue obter todos os dados completos, inclusive atributos e garantia.

---

## 💡 Observações importantes

- O backend **não precisa de `category_name`** na lista de produtos.  
  Se precisar do nome da categoria, ele pode ser buscado individualmente via `/api/product/:id`.
- Se o frontend exibir o ID da categoria no lugar do nome, isso é **comportamento esperado**.
- A API `/categories/:id` do Mercado Livre existe, mas **não é garantida** em todos os domínios e pode retornar vazio.  
  Por isso, optou-se por não usá-la no backend principal.

---

## 🔗 Referências

- [📘 Documentação oficial da API Mercado Livre](https://developers.mercadolibre.com.ar/pt_br/)

---

## 🧩 Futuras melhorias

- Criar **cache local** para reduzir requisições repetidas à API.  
- Adicionar **paginação e filtros avançados** na rota de produtos.  
- Criar **documentação automatizada** via Swagger ou Postman Collection.  

---

EOF
