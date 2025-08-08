# Teste das Funções de Aceitar/Recusar Candidaturas

## 🔧 Correções Implementadas:

### 1. **ID Correto**
- ❌ Antes: `candidatura.id` (undefined)
- ✅ Agora: `candidatura._id` (correto para MongoDB)

### 2. **Método HTTP Correto**
- ❌ Antes: `POST`
- ✅ Agora: `PUT`

### 3. **Tratamento de Resposta Melhorado**
- ✅ Verificação de `res.ok` antes de processar dados
- ✅ Atualização do estado da candidatura
- ✅ Feedback adequado ao usuário

## 🧪 Como testar:

### 1. **Aceitar Candidatura**
```javascript
// A função agora:
// 1. Usa PUT em vez de POST
// 2. Usa candidatura._id em vez de candidatura.id
// 3. Atualiza o estado para "Aceite"
// 4. Mostra mensagem de sucesso

handleAccept(candidatura._id)
```

### 2. **Recusar Candidatura**
```javascript
// A função agora:
// 1. Usa PUT em vez de POST
// 2. Usa candidatura._id em vez de candidatura.id
// 3. Envia motivo da recusa
// 4. Atualiza o estado para "Recusada"
// 5. Mostra mensagem de sucesso

handleReject(candidatura._id)
```

## 📋 Fluxo de Teste:

1. **Faça login como empresa**
2. **Navegue para uma candidatura pendente**
3. **Teste aceitar candidatura**:
   - Clique em "Aceitar Candidatura"
   - Verifique se o status muda para "Aceite"
   - Verifique se a mensagem de sucesso aparece

4. **Teste recusar candidatura** (em outra candidatura):
   - Clique em "Recusar Candidatura"
   - Verifique se o status muda para "Recusada"
   - Verifique se a mensagem de sucesso aparece

## 🚀 URLs de Teste:

- **Debug**: `GET /api/candidaturas/:id/debug`
- **Aceitar**: `PUT /api/candidaturas/:id/aceitar`
- **Recusar**: `PUT /api/candidaturas/:id/recusar`

## ✅ Resultado Esperado:

Agora as requisições devem ser feitas corretamente:
```
PUT http://localhost:5000/api/candidaturas/[ID_REAL]/aceitar
PUT http://localhost:5000/api/candidaturas/[ID_REAL]/recusar
```

Em vez de:
```
POST http://localhost:5000/api/candidaturas/undefined/aceitar (❌ ERRO)
```
