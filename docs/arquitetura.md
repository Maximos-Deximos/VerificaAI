## Python 
Backend e processamento de IA, linguagem principal do backend.

O Python é adequado porque possui um ecossistema amplo para integração com APIs, processamento de textos, análise de dados e desenvolvimento de aplicações web.

Ele poderá ser utilizado para:
- Receber solicitações dos usuários.
- Consultar as fontes de informação.
- Enviar textos e evidências ao modelo de IA.
- Validar os resultados produzidos pelo modelo.
- Calcular a pontuação de confiabilidade.
- Gerar resumos.
- Salvar notícias, fontes e análises no banco de dados.
- Agendar pesquisas e atualizações.

Outra vantagem é a facilidade de separar o projeto em módulos, permitindo que cada parte seja testada individualmente.

Bibliotecas a serem utilizadas:
- httpx: realizar requisições HTTP para APIs e serviços externos.
- Pydantic: validar dados e estruturar as respostas.
- SQLAlchemy: interagir com o PostgreSQL por meio de um ORM.
- Alembic: gerenciar alterações no esquema do banco de dados.
- pytest: executar testes automatizados.
- BeautifulSoup: extrair informações de páginas HTML quando isso for permitido.

A extração de conteúdo deve respeitar os termos de uso, as políticas de acesso e as restrições técnicas dos sites consultados. Quando disponível, utilizando quando possível as APIs oficiais, feeds RSS e mecanismos autorizados de acesso ao conteúdo.

SQL — Banco de dados (Essa função não estará presente na PCD)
O SQL será utilizado para armazenar e consultar as informações estruturadas da aplicação.

O PostgreSQL oferece transações, restrições de integridade, índices, consultas relacionais e recursos para armazenar dados em formatos como JSONB.

Entre os dados que o banco poderá guardar estão:
- Usuários e suas preferências.
- Fontes monitoradas.
- Notícias e alegações identificadas.
- Referências utilizadas nas análises.
- Resultados de verificações anteriores.
- Pontuações, justificativas e datas das avaliações.
- Resumos gerados.
- Histórico de alterações e reavaliações.

Uma distinção importante: o banco de dados deve guardar os resultados e as evidências que permitem reconstruir uma avaliação. A IA não deve ser responsável por inventar ou calcular livremente todos os valores.

A aplicação deverá aplicar regras explícitas para produzir uma pontuação consistente, registrar como ela foi calculada e permitir sua revisão.

Ferramentas para pesquisar e verificar notícias
O modelo de IA, sozinho, não é suficiente. O projeto precisa de fontes de dados e mecanismos que permitam verificar alegações.

Será feito o uso das seguintes ferramentas:

1. Google Fact Check Tools API
Documentação oficial: Google Fact Check Tools API

Essa API permite pesquisar alegações que já foram verificadas por organizações de checagem de fatos.

Ela pode ajudar a responder perguntas como:
- Essa afirmação já foi investigada?
- Qual organização realizou a verificação?
- Qual foi a conclusão publicada?
- Quando a verificação foi realizada?
- Onde está o artigo original da checagem?
A API disponibiliza informações como o título da verificação, o endereço da publicação, a data e a classificação textual. Google for Developers

Por que utilizá-la?

Porque permite aproveitar o trabalho de organizações especializadas em vez de depender exclusivamente de uma IA para avaliar cada alegação.

É importante observar que ela não garante que toda alegação tenha uma verificação anterior disponível.

2. RSS e APIs oficiais de notícias
Muitos veículos de comunicação disponibilizam feeds RSS ou APIs para distribuição de conteúdo.

O RSS pode ser utilizado para descobrir novas publicações sem precisar consultar repetidamente todas as páginas de um site.

Para trabalhar com RSS em Python, pode se utilizar a biblioteca feedparser. Ela permite processar feeds RSS e Atom e extrair informações como títulos, datas, links e descrições. Feedparser

O usuário seleciona os assuntos de interesse, o sistema consulta os feeds das fontes cadastradas e identifica novas publicações. Depois, o agente analisa o conteúdo disponível e seleciona as notícias relevantes.

É preferível utilizar mecanismos de distribuição autorizados pelo veículo. A disponibilidade de RSS ou de uma API deve ser verificada individualmente para cada fonte.

3. Fontes jornalísticas, científicas e institucionais
O sistema não deve depender apenas de veículos de comunicação.
(g1, pubMed, IBGE...)

## Como serpa implementado o julgamento do agente de I.A

O julgamento será divido em 4 etapas

### Etapa 1 — Extração das alegações
O modelo identifica afirmações que podem ser verificadas.

Por exemplo:
- "A inflação aumentou no último trimestre."
- "O estudo foi publicado em uma revista científica."
- "O pesquisador declarou que o tratamento reduz o risco pela metade."

Cada alegação deve ser analisada individualmente, pois uma notícia pode conter afirmações 
verdadeiras, falsas e inconclusivas ao mesmo tempo.

### Etapa 2 — Recuperação das evidências
O sistema procura documentos relacionados a cada alegação.

Cada documento recuperado deverá ter, sempre que possível:
- URL original.
- Título.
- Autor ou instituição responsável.
- Data de publicação.
- Data de consulta.
- Tipo de fonte.
- Trecho relevante.
- Relação com a alegação analisada.

Também será necessário identificar quando duas publicações apenas reproduzem a mesma fonte original.

### Etapa 3 — Análise das evidências
O modelo organiza os resultados em três grupos:
- Favoráveis: evidências que sustentam a alegação.
- Contrárias: evidências que contradizem a alegação.
- Inconclusivas: documentos insuficientes, ambíguos ou que não permitem estabelecer uma conclusão.

A justificativa apresentada ao usuário deverá estar vinculada aos documentos que sustentam cada conclusão.

### Etapa 4 — Cálculo e apresentação da pontuação
O backend aplica uma regra de pontuação documentada.

Durante o desenvolvimento, você poderá experimentar diferentes pesos para os fatores de avaliação. No entanto, não recomendo definir pesos arbitrários e apresentar o resultado como uma probabilidade estatística.

Para afirmar que uma pontuação de 90% corresponde a uma probabilidade de 90% de a alegação ser verdadeira, seria necessário testar e calibrar o sistema com um conjunto representativo de alegações cujo resultado já fosse conhecido.

Até isso ser realizado, o valor deve ser apresentado como um índice de sustentação pelas evidências, e não como uma probabilidade comprovada.


ARQUITETURA GERAL
```text
+--------------------------------------------------+
|                    USUARIO                       |
+------------------------+-------------------------+
                         |
                         v
+--------------------------------------------------+
|                    FRONTEND                      |
|                                                  |
|  JS + HTML + CSS                 |
|                                                  |
|  - Interface acessivel                           |
|  - Preferencias do usuario                       |
|  - Noticias e resumos                            |
|  - Pontuacao e justificativas                    |
+------------------------+-------------------------+
                         |
                         | Requisicoes HTTP/HTTPS
                         v
+--------------------------------------------------+
|                     BACKEND                      |
|                                                  |
|                    FastAPI                       |
|                                                  |
|  +--------------------------------------------+  |
|  |              API / ROUTERS                 |  |
|  |                                            |  |
|  |  - Autenticacao                            |  |
|  |  - Usuarios e preferencias                 |  |
|  |  - Noticias                                |  |
|  |  - Analises e resultados                   |  |
|  +----------------------+---------------------+  |
|                         |                        |
|          +--------------+--------------+         |
|          |                             |         |
|          v                             v         |
|  +-------------------+       +----------------+  |
|  | COLETOR DE NOTICIAS|      | SERVICO DE IA  |  |
|  |                   |       |                |  |
|  | - RSS / Atom      |       | - Extracao     |  |
|  | - APIs oficiais   |       |   de alegacoes |  |
|  | - Fontes confiaveis|      | - Comparacao   |  |
|  | - Metadados       |       |   de evidencias|  |
|  +---------+---------+       | - Resumos      |  |
|            |                 | - Justificativas| |
|            |                 +--------+-------+  |
|            |                          |          |
|            +-------------+------------+          |
|                          |                       |
|                          v                       |
|               +----------------------+           |
|               | VALIDACAO E RANKING  |           |
|               |                      |           |
|               | - Verificar fontes   |           |
|               | - Calcular pontuacao |           |
|               | - Registrar incerteza|           |
|               +----------+-----------+           |
+--------------------------|-----------------------+
                           |
                           | SQLAlchemy
                           v
+--------------------------------------------------+
|                  BANCO DE DADOS                  |
|                                                  |
|                    PostgreSQL                    |
|                                                  |
|  - Usuarios                                      |
|  - Preferencias                                  |
|  - Noticias e alegacoes                          |
|  - Resumos                                       |
|  - Pontuacoes e justificativas                   |
|  - Historico de analises                         |
+--------------------------------------------------+

             FONTES EXTERNAS DE INFORMACAO
                           |
             +-------------+-------------+
             |             |             |
             v             v             v
       +-----------+ +-----------+ +-----------+
       | Jornalismo| | Pesquisa  | | Checagem  |
       |           | | cientifica| | de fatos  |
       +-----------+ +-----------+ +-----------+
             |             |             |
             +-------------+-------------+
                           |
                           v
                 COLETOR / PESQUISA DE IA
```        
                 
                 
RAG (Retrieval-Augmented Generation)
text```
+------------------------------------------+
|          NOTICIA OU ALEGACAO             |
|                                          |
| "Uma nova pesquisa comprovou que..."     |
+--------------------+---------------------+
                     |
                     v
+------------------------------------------+
|          1. EXTRACAO DE ALEGACOES        |
|                                          |
| Identificar afirmacoes verificaveis      |
| Separar alegacoes distintas              |
| Identificar datas, autores e entidades   |
+--------------------+---------------------+
                     |
                     v
+------------------------------------------+
|          2. RECUPERACAO DE DADOS         |
|                                          |
| Pesquisar documentos relevantes          |
|                                          |
| - Artigos cientificos                    |
| - Noticias de outras fontes              |
| - Documentos oficiais                    |
| - Verificacoes de fatos anteriores       |
+--------------------+---------------------+
                     |
                     v
+------------------------------------------+
|          3. FILTRAGEM DE DOCUMENTOS      |
|                                          |
| - Relevancia para a alegacao             |
| - Data e contexto                        |
| - Credibilidade da fonte                 |
| - Identificacao de fontes independentes  |
| - Deteccao de duplicatas                 |
+--------------------+---------------------+
                     |
                     v
+------------------------------------------+
|          4. ANALISE PELO MODELO DE IA    |
|                                          |
| Comparar alegacoes e evidencias          |
|                                          |
| +--------------------------------------+ |
| | Evidencias favoraveis                | |
| | Evidencias contrarias                | |
| | Evidencias inconclusivas             | |
| +--------------------------------------+ |
+--------------------+---------------------+
                     |
                     v
+------------------------------------------+
|          5. VALIDACAO DOS RESULTADOS     |
|                                          |
| - Conferir referencias                   |
| - Verificar se as fontes sustentam       |
|   as afirmacoes apresentadas             |
| - Identificar contradicoes               |
| - Avaliar insuficiencia de evidencias    |
+--------------------+---------------------+
                     |
                     v
+------------------------------------------+
|          6. CALCULO DA PONTUACAO         |
|                                          |
| Aplicar regras documentadas de ranking   |
| Registrar fatores e justificativas       |
| Indicar o grau de incerteza              |
+--------------------+---------------------+
                     |
                     v
+------------------------------------------+
|          7. GERACAO DO RESULTADO         |
|                                          |
| - Resumo da noticia                      |
| - Classificacao da alegacao              |
| - Pontuacao de sustentacao               |
| - Justificativas                         |
| - Fontes consultadas                     |
| - Limitacoes da analise                  |
+--------------------+---------------------+
                     |
                     v
+------------------------------------------+
|          8. ARMAZENAMENTO                |
|                                          |
| Salvar analise e referencias no banco    |
| Permitir consultas e reavaliacoes        |
+--------------------+---------------------+
                     |
                     v
+------------------------------------------+
|          9. APRESENTACAO AO USUARIO      |
|                                          |
| Exibir resultado em interface acessivel  |
| Permitir abrir as fontes originais       |
+------------------------------------------+
```