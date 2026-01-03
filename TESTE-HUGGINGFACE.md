# ? TESTE RÁPIDO - Sistema HuggingFace

Execute esses passos para testar:

## 1. Compile o Frontend (OBRIGATÓRIO)
```powershell
cd src/AgentDock.UI
npm run build
```

## 2. Inicie o Backend
```powershell
cd src/AgentDock.Backend
dotnet run
```

## 3. Abra o Navegador
```
http://localhost:5000
```

## 4. Teste o Sistema HuggingFace

### Navegue para Models:
1. Clique em "Models" na sidebar
2. Clique no botão "Browse HuggingFace"
3. Você verá 2 TABS:
   - **Recomendados** (tab padrão)
   - **Buscar**

### Tab "Recomendados":
- Ver seu hardware detectado
- Top 5 modelos sugeridos para você
- Score de compatibilidade visual
- Botão "Baixar" em cada modelo

### Tab "Buscar":
- Buscar qualquer modelo (ex: "llama")
- Clicar em um modelo para ver arquivos
- Ver compatibilidade de cada arquivo
- Baixar se compatível

## 5. Teste o Download

1. Na tab "Recomendados", clique em "Baixar" no primeiro modelo
2. Observe:
   - Notificação: "Download iniciado"
   - Barra de progresso aparece
   - Quando completar: "? Modelo pronto para usar"

3. Vá em "Downloaded Models" (sidebar)
4. Veja o modelo baixado listado

## ? Endpoints que devem funcionar:

```bash
# Testar sugestões
curl http://localhost:5000/api/models/suggestions

# Testar hardware info
curl http://localhost:5000/api/models/hardware-info

# Testar busca HF
curl "http://localhost:5000/api/models/search?query=llama&limit=5"

# Testar modelos baixados
curl http://localhost:5000/api/models/downloaded
```

## ?? DARK MODE
A aplicação agora inicia SEMPRE em dark mode!

## ?? Se algo não funcionar:

1. **Certifique-se de ter compilado o frontend:**
   ```powershell
   cd src/AgentDock.UI
   npm run build
   ```

2. **Limpe e recompile tudo:**
   ```powershell
   # Frontend
   cd src/AgentDock.UI
   rm -rf dist node_modules
   npm install
   npm run build

   # Backend
   cd ../AgentDock.Backend
   dotnet clean
   dotnet build
   ```

3. **Verifique se o backend está rodando:**
   - Deve aparecer: "AgentDock Backend ready on http://localhost:5000"

4. **Acesse pelo navegador:**
   - http://localhost:5000 (não 5173!)

## ?? Checklist de Teste:

- [ ] Aplicação abre em DARK MODE
- [ ] Sidebar tem "Models" e "Downloaded Models"
- [ ] Botão "Browse HuggingFace" abre modal
- [ ] Tab "Recomendados" mostra hardware detectado
- [ ] Tab "Recomendados" mostra 5 sugestões
- [ ] Cada sugestão tem score e botão "Baixar"
- [ ] Tab "Buscar" permite buscar modelos
- [ ] Download mostra progresso em tempo real
- [ ] Notificação aparece quando completa
- [ ] "Downloaded Models" lista modelos baixados
