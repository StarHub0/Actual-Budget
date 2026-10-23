# Actual + Tweaks em um único serviço

Este fork reúne o servidor oficial Actual Budget (26.10.0) e o Actual Budget Tweaks compilado deste repositório. O Actual mantém os dados e a autenticação; o Tweaks acrescenta a interface. Os dois processos usam HTTP local, sem domínio privado entre serviços.

## Opção 1: imagem pronta

Depois que o workflow **Publish Actual + Tweaks** terminar com sucesso, use:

```text
ghcr.io/starhub0/actual-budget:latest
```

No GitHub, verifique em **Packages → actual-budget → Package settings** se a visibilidade está **Public**. Pacotes novos podem começar privados, mesmo em repositórios públicos. Só um pacote público permite baixar sem credenciais.

No Railway:

1. Crie um projeto e um serviço usando essa Docker Image.
2. Adicione um **volume persistente** montado em `/data`.
3. Configure apenas `PORT=3005`.
4. Gere um domínio público com porta de destino `3005`.
5. Faça deploy e abra o domínio HTTPS. Defina a senha inicial e crie ou importe seu orçamento.

Não configure `ACTUAL_ORIGIN`: a imagem conecta o Tweaks a `http://127.0.0.1:5006` automaticamente. A porta 5006 é interna; o domínio público deve usar 3005.

## Opção 2: deploy pelo GitHub

Conecte este repositório ao Railway e mantenha Root Directory como `/`. O Dockerfile da raiz monta a mesma aplicação. Adicione o volume `/data`, defina `PORT=3005` e gere o domínio na porta 3005. Essa opção funciona mesmo se a imagem GHCR ainda estiver privada.

## Seus dados

Um projeto novo começa vazio. Exporte o orçamento no Actual antigo e importe no novo antes de remover o serviço antigo. Não exclua o volume antigo antes de confirmar a importação. Os caminhos padrão desta imagem são `/data/server-files` e `/data/user-files`.

## Atualizações e diagnóstico

Pushes na main executam testes e publicam as tags `latest` e `sha-<commit>`. Um serviço Railway baseado em imagem precisa de novo deploy para baixar a imagem atualizada. A versão do Actual fica fixada no Dockerfile; atualize-a conscientemente, com backup.

O log esperado é `[actual-tweaks] Public port 3005; Actual is internal at 127.0.0.1:5006.`. Verifique `/abt/browser-shim.js` no domínio público para confirmar os arquivos Tweaks. Os dois processos encerram juntos se um falhar.

Esta é uma distribuição pessoal, não oficial. O Tweaks mantém sua licença MIT e os créditos originais; o servidor Actual é fornecido pela imagem oficial.

Fontes: https://github.com/aelxxs/actual-budget-tweaks e https://github.com/actualbudget/actual
