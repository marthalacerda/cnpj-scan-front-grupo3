// Mapeia o nome das chaves JSON para os títulos das colunas (nome amigável que aparece na tela)

export const AVAILABLE_FIELDS = {
    numero_de_inscricao: "CNPJ",
    nome_empresarial: "Nome Empresarial",
    nome_de_fantasia: "Nome de Fantasia",
    data_de_abertura: "Data de Abertura",
    porte: "Porte",
    atividade_principal: "Atividade Principal",
    atividades_secundarias: "Atividades Secundárias",
    natureza_juridica: "Natureza Jurídica",
    logradouro: "Logradouro",
    numero: "Número",
    complemento: "Complemento",
    cep: "CEP",
    bairro: "Bairro",
    municipio: "Município",
    uf: "UF",
    email: "Email",
    telefone: "Telefone",
    efr: "EFR",
    situacao_cadastral: "Situação Cadastral",
    data_situacao_cadastral: "Data Sit. Cadastral",
    motivo_situacao_cadastral: "Motivo Sit. Cadastral",
    situacao_especial: "Situação Especial",
    data_situacao_especial: "Data Sit. Especial",
};

// Array das chaves
export const FIELD_KEYS = Object.keys(AVAILABLE_FIELDS);
