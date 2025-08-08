# API de Candidaturas - Aceitar e Recusar

## 🐛 Troubleshooting

### Rota de Debug
```
GET /api/candidaturas/:candidaturaId/debug
```

Esta rota ajuda a diagnosticar problemas com candidaturas, mostrando:
- Dados da candidatura
- Informações do estágio e empresa
- Comparação de IDs
- Dados do usuário logado

**Exemplo de uso:**
```javascript
const debugCandidatura = async (candidaturaId) => {
    const response = await fetch(`http://localhost:5000/api/candidaturas/${candidaturaId}/debug`, {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    });
    
    const data = await response.json();
    console.log('Debug info:', data.debug);
};
```

### Problemas Comuns:

1. **Erro de permissão**: Verifique se a empresa logada é dona do estágio
2. **Candidatura não encontrada**: Verifique se o ID está correto
3. **Status inválido**: Candidatura deve estar "pendente"
4. **Erro de populate**: Verifique se os relacionamentos estão corretos

### Correções Implementadas:

✅ **Validação melhorada**: Verificação de existência de estágio e empresa
✅ **Comparação de IDs robusta**: toString() em ambos os IDs para evitar problemas de tipo
✅ **Logs de debug**: Informações detalhadas para troubleshooting
✅ **Tratamento de erros**: Stack trace completo para debugging

## Endpoints implementados:

### 1. Aceitar Candidatura
```
PUT /api/candidaturas/:candidaturaId/aceitar
```

**Headers:**
```
Authorization: Bearer <token_da_empresa>
Content-Type: application/json
```

**Exemplo de uso:**
```javascript
// Frontend - função para aceitar candidatura
const aceitarCandidatura = async (candidaturaId) => {
    try {
        const response = await fetch(`http://localhost:5000/api/candidaturas/${candidaturaId}/aceitar`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json'
            }
        });

        const data = await response.json();
        
        if (response.ok) {
            alert('Candidatura aceite com sucesso!');
            return data;
        } else {
            alert(data.message || 'Erro ao aceitar candidatura');
        }
    } catch (error) {
        alert('Erro de conexão');
    }
};
```

### 2. Recusar Candidatura
```
PUT /api/candidaturas/:candidaturaId/recusar
```

**Headers:**
```
Authorization: Bearer <token_da_empresa>
Content-Type: application/json
```

**Body (opcional):**
```json
{
    "motivo": "Perfil não adequado aos requisitos da vaga"
}
```

**Exemplo de uso:**
```javascript
// Frontend - função para recusar candidatura
const recusarCandidatura = async (candidaturaId, motivo = '') => {
    try {
        const response = await fetch(`http://localhost:5000/api/candidaturas/${candidaturaId}/recusar`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ motivo })
        });

        const data = await response.json();
        
        if (response.ok) {
            alert('Candidatura recusada com sucesso!');
            return data;
        } else {
            alert(data.message || 'Erro ao recusar candidatura');
        }
    } catch (error) {
        alert('Erro de conexão');
    }
};
```

## Validações implementadas:

### Permissões:
- ✅ Apenas empresas podem aceitar/recusar candidaturas
- ✅ Empresa só pode processar candidaturas dos seus próprios estágios
- ✅ Candidatura deve estar no status "pendente"

### Dados:
- ✅ Motivo de recusa opcional (máximo 500 caracteres)
- ✅ Data de resposta é automaticamente registrada
- ✅ Status é atualizado automaticamente

## Estrutura da resposta:

### Sucesso:
```json
{
    "success": true,
    "message": "Candidatura aceite com sucesso!",
    "candidatura": {
        "_id": "...",
        "user": { "name": "...", "email": "..." },
        "estagio": { "title": "...", "company": { "name": "..." } },
        "status": "aceite",
        "dataCandidatura": "2025-08-08T...",
        "dataResposta": "2025-08-08T..."
    }
}
```

### Erro:
```json
{
    "message": "Apenas empresas podem aceitar candidaturas."
}
```

## Estados da candidatura:
- `pendente` - Candidatura enviada, aguardando resposta
- `aceite` - Candidatura aprovada pela empresa
- `recusada` - Candidatura rejeitada pela empresa
