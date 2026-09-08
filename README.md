

### Example Inputs:
- Resource: 
- Method:

  Hello World

Nome Contrato
Data Vigencia
Tipo do Contrato
Moeda
Base de Cobertura
Companhia

Ramos

Garantias

[GET] /plataforma-resseguro/v1/contratos

  content: {
    nome_contrato: string;
    status: string;
    vigencia: string;
    tipo_contrato: string;
    modalidade_contrato: number;
    base_cobertura: string;
    submodalidade: string;
    companhia: [ // OU objeto
       {
          nome: string
       }
    ],
    broker: {
    	nome: string
    },
    resseguradores: [ // Ou Objeto
      {
        nome: string
      }
    ]
  }[];
  page: {
    size: number;
    number: number;
    totalElements: number;
    totalPages: number;
  };


======================================================


[GET/PATCH/POST] /plataforma-resseguro/v1/contratos/{id}


{
	informacoes_basicas: {
		nome contrato: string,
		vigência: string,
		moedas:[
		    "BRL",
		    "USD"
		],
		abrangencia_territorial: string,
		tipo_contrato: string,
		modalidade_contrato: string,
		submodalidade: [
		],
		base cobertura: string,
		companhias: [
			{
				nome: string;
			}
		],
		grupos: [],
	},
	clausulas: [
		arbitragem: false,
		seguir_a_sorte: false,
		exclusão: false,
		intermediação: false,
	],
	// OU
	clausulas: 'INTERMEDIACAO',
	limite_automatico_subscricao:{
		vida_cpf: string,
		previdencia_pessoa_fisica: string,
		previdencia_pessoa_juridica: string,
		[none]: string,
	},
	limite adiantamento:{
		por_risco: string,
		por evento: string,
	},
	ramos: {
		por_risco: {
			ramo_real: ["91 - Vida Individual" // OU {codigo: 91, nome: "Vida Individual"}]
			ramo_regedor: IDEM,
		},
		por_evento:{
			ramo_real: ["91 - Vida Individual" // OU {codigo: 91, nome: "Vida Individual"}]
			ramo_regedor: IDEM,
		},
	},
	garantias: [
		"MIP", "Morte Acidental" // OU {codigo: xx, nome: "MIP"}
	],
	epi: [
		por_risco: {
		
		},
		por evento: {
		
		}
		//OU
		por_risco: "xx,xxx",
		por evento: "xx,xxx"
	],
	limites: {
		por_risco: [{
			prioridade: "XX,XX",
			limite resseguro: "XX,XX"
			quantidade reintegrações: 2
			custo_adicional: 0.54 //number?,
		}],
		por_evento: [
		{
			prioridade: "XX,XX",
			limite resseguro: "XX,XX"
			quantidade reintegrações: 2
			custo_adicional: 0.54 //number?,
		}
		]
	},
	informacoes_adicionais: {
		data_max_cancelamento: date
	},

	personas:{
		brokers: [
		
		], // ou OBJETO
		resseguradores: [
			{
				nome: string,
				participacao: 0.20, //number
				pmd: 0.80 //number
				taxa_corretagem_broker: 0.20,
				rebate: 0.80
				acordo_bitributacao: boolean,
				is_lider: true, //boolean
				is_colider: false, //boolean
				condicoes: {
					por_risco: [
						faixa_1: { //Quantidade fixa obrigatória de faixas?
							valor_pmd: number,
							taxa_ajuste: 0.5704
						},
						faixa_2: {
							valor_pmd: number,
							taxa_ajuste: 0.5704
						}
					],
					por_evento: [
						faixa_1: { //Quantidade fixa obrigatória de faixas?
							valor_pmd: number,
							taxa_ajuste: 0.5704
						},
					
					]
				}
			}
		]
	}
	????historico: [
		{
			acao: CREATED, APROVED, EDITED
			nome: string,
			email: string,
			date: DATE (data&hora) 	
		}
	]

}



##########################################################

[POST] /plataforma-resseguro/v1/contratos/{id}

{
	aprovado: false, //OU status: "APROVADO"
	justificativa: string
}
