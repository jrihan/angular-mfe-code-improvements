import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { IdsIconModule, IdsTableModule } from '@ids/angular';
import { ContainerBaseComponent } from 'src/app/shared/components/container_base/container_base.component';

type TipoColuna = 'texto' | 'moeda' | 'percentual';

interface ColunaValores {
  key: string;
  label: string;
  tipo: TipoColuna;
}

interface LinhaValorPorRessegurador {
  ressegurador: string;
  premio: number | null;
  pmd: number | null;
  ordem: number | null;
  premioOrdem: number | null;
  pmdOrdem: number | null;
  imposto: number | null;
  corretagem: number | null;
  bsaCorretagem: number | null;
  valorTotalCedente: number | null;
}

interface FaixaValores {
  titulo: string;
  valorTotalCedente: number;
  linhas: LinhaValorPorRessegurador[];
  total: LinhaValorPorRessegurador;
  expanded: boolean;
}

interface HistoricoAprovacao {
  papel: string;
  nome: string | null;
  email: string | null;
  dataHora: string | null;
  status: 'preenchido' | 'aprovado' | 'pendente';
}

@Component({
  standalone: true,
  imports: [CommonModule, ContainerBaseComponent, IdsTableModule, IdsIconModule],
  selector: 'detalhe-contrato-resumo',
  templateUrl: 'detalhe_contrato_resumo.component.html',
  styleUrls: ['detalhe_contrato_resumo.component.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class DetalheContratoResumoComponent implements OnInit {
  colunas: ColunaValores[] = [
    { key: 'ressegurador', label: 'Ressegurador', tipo: 'texto' },
    { key: 'premio', label: 'Prêmio (100%)', tipo: 'moeda' },
    { key: 'pmd', label: 'PMD (80%)', tipo: 'moeda' },
    { key: 'ordem', label: 'Ordem (%)', tipo: 'percentual' },
    { key: 'premioOrdem', label: 'Prêmio Ordem (100%)', tipo: 'moeda' },
    { key: 'pmdOrdem', label: 'PMD Ordem (80%)', tipo: 'moeda' },
    { key: 'imposto', label: 'Imposto (2%)', tipo: 'moeda' },
    { key: 'corretagem', label: 'Corretagem (10%)', tipo: 'moeda' },
    { key: 'bsaCorretagem', label: 'BSA (40%) da Corretagem', tipo: 'moeda' },
    { key: 'valorTotalCedente', label: 'Valor Total Cedente', tipo: 'moeda' },
  ];

  colunaKeys = this.colunas.map((coluna) => coluna.key);

  faixas: FaixaValores[] = [
    {
      titulo: 'Faixa 1',
      valorTotalCedente: 24155075.16,
      expanded: true,
      linhas: [
        {
          ressegurador: 'Mapfre Re Brasil',
          premio: 33895438.0,
          pmd: 27116350.4,
          ordem: 45,
          premioOrdem: 15252947.1,
          pmdOrdem: 12202357.68,
          imposto: null,
          corretagem: 1220235.77,
          bsaCorretagem: 488094.31,
          valorTotalCedente: 11714263.37,
        },
        {
          ressegurador: 'IRB Brasil',
          premio: 30605201.0,
          pmd: 24484160.8,
          ordem: 20,
          premioOrdem: 6121040.2,
          pmdOrdem: 4896832.16,
          imposto: null,
          corretagem: 489683.22,
          bsaCorretagem: 195873.29,
          valorTotalCedente: 4700958.87,
        },
        {
          ressegurador: 'SiriusPoint',
          premio: 29406736.0,
          pmd: 23525388.8,
          ordem: 20,
          premioOrdem: 5881347.2,
          pmdOrdem: 4705077.76,
          imposto: 94101.56,
          corretagem: 470507.78,
          bsaCorretagem: 188203.11,
          valorTotalCedente: 4422773.09,
        },
        {
          ressegurador: 'Ms Amlin',
          premio: 29406736.0,
          pmd: 23525388.8,
          ordem: 15,
          premioOrdem: 1411010.4,
          pmdOrdem: 3528808.32,
          imposto: 70576.17,
          corretagem: 352880.83,
          bsaCorretagem: 141152.33,
          valorTotalCedente: 3317079.82,
        },
      ],
      total: {
        ressegurador: '',
        premio: null,
        pmd: null,
        ordem: null,
        premioOrdem: 28666344.9,
        pmdOrdem: 25333075.92,
        imposto: 164677.72,
        corretagem: 2533307.59,
        bsaCorretagem: 1013323.04,
        valorTotalCedente: 24155075.16,
      },
    },
    {
      titulo: 'Faixa 2',
      valorTotalCedente: 818141.8,
      expanded: true,
      linhas: [
        {
          ressegurador: 'Mapfre Re Brasil',
          premio: 941844.0,
          pmd: 753475.2,
          ordem: 45,
          premioOrdem: 423829.8,
          pmdOrdem: 339063.84,
          imposto: null,
          corretagem: 33906.38,
          bsaCorretagem: 13562.55,
          valorTotalCedente: 368163.81,
        },
        {
          ressegurador: 'IRB Brasil',
          premio: 1181959.0,
          pmd: 945567.2,
          ordem: 20,
          premioOrdem: 236391.8,
          pmdOrdem: 189113.44,
          imposto: null,
          corretagem: 18911.34,
          bsaCorretagem: 7564.54,
          valorTotalCedente: 163628.36,
        },
        {
          ressegurador: 'SiriusPoint',
          premio: 1181959.0,
          pmd: 945567.2,
          ordem: 20,
          premioOrdem: 236391.8,
          pmdOrdem: 189113.44,
          imposto: 3782.27,
          corretagem: 18911.34,
          bsaCorretagem: 7564.54,
          valorTotalCedente: 163628.36,
        },
        {
          ressegurador: 'Ms Amlin',
          premio: 1181959.0,
          pmd: 945567.2,
          ordem: 15,
          premioOrdem: 177293.85,
          pmdOrdem: 141835.08,
          imposto: 2836.7,
          corretagem: 14183.51,
          bsaCorretagem: 5673.4,
          valorTotalCedente: 122721.27,
        },
      ],
      total: {
        ressegurador: '',
        premio: null,
        pmd: null,
        ordem: null,
        premioOrdem: 1073907.25,
        pmdOrdem: 859125.8,
        imposto: 6618.97,
        corretagem: 85912.58,
        bsaCorretagem: 34365.03,
        valorTotalCedente: 818141.8,
      },
    },
    {
      titulo: 'CAT',
      valorTotalCedente: 1080759.85,
      expanded: true,
      linhas: [
        {
          ressegurador: 'Mapfre Re Brasil',
          premio: 1628679.91,
          pmd: 1302943.93,
          ordem: 45,
          premioOrdem: 732905.96,
          pmdOrdem: 586324.77,
          imposto: null,
          corretagem: 58632.48,
          bsaCorretagem: 23452.99,
          valorTotalCedente: 486341.93,
        },
        {
          ressegurador: 'IRB Brasil',
          premio: 1244933.0,
          pmd: 995946.4,
          ordem: 20,
          premioOrdem: 248986.6,
          pmdOrdem: 199189.28,
          imposto: null,
          corretagem: 19918.93,
          bsaCorretagem: 7967.57,
          valorTotalCedente: 216151.97,
        },
        {
          ressegurador: 'SiriusPoint',
          premio: 1244933.0,
          pmd: 995946.4,
          ordem: 20,
          premioOrdem: 248986.6,
          pmdOrdem: 199189.28,
          imposto: 3983.79,
          corretagem: 19918.93,
          bsaCorretagem: 7967.57,
          valorTotalCedente: 216151.97,
        },
        {
          ressegurador: 'Ms Amlin',
          premio: 1244933.0,
          pmd: 995946.4,
          ordem: 15,
          premioOrdem: 18673995.0,
          pmdOrdem: 149391.96,
          imposto: 2987.84,
          corretagem: 14939.2,
          bsaCorretagem: 5975.68,
          valorTotalCedente: 162113.98,
        },
      ],
      total: {
        ressegurador: '',
        premio: null,
        pmd: null,
        ordem: null,
        premioOrdem: 92462564.15,
        pmdOrdem: 1134095.29,
        imposto: 6971.62,
        corretagem: 113409.53,
        bsaCorretagem: 45363.81,
        valorTotalCedente: 1080759.85,
      },
    },
  ];

  historicoAprovacao: HistoricoAprovacao[] = [
    {
      papel: 'Criado por',
      nome: 'Mariana Martins',
      email: 'mariana@exemplo.com.br',
      dataHora: '11/12/2025 às 14:30h',
      status: 'preenchido',
    },
    {
      papel: 'Aprovado por',
      nome: 'Maria Veronesi',
      email: 'maria@exemplo.com.br',
      dataHora: '11/12/2025 às 14:30h',
      status: 'aprovado',
    },
    {
      papel: 'Editado por',
      nome: 'Maria Veronesi',
      email: 'maria@exemplo.com.br',
      dataHora: '16/12/2025 às 10:00h',
      status: 'preenchido',
    },
    {
      papel: 'Aguardando conferência',
      nome: null,
      email: null,
      dataHora: null,
      status: 'pendente',
    },
  ];

  expandedTotaisGerais = true;

  totalGeral: LinhaValorPorRessegurador;
  totaisGeraisDataSource: LinhaValorPorRessegurador[];
  totalGeralCedente: number;

  constructor() {
    const somar = (campo: keyof LinhaValorPorRessegurador) =>
      this.faixas.reduce(
        (acumulado, faixa) => acumulado + (Number(faixa.total[campo]) || 0),
        0
      );

    this.totalGeral = {
      ressegurador: 'Total Geral dos Valores',
      premio: null,
      pmd: null,
      ordem: null,
      premioOrdem: somar('premioOrdem'),
      pmdOrdem: somar('pmdOrdem'),
      imposto: somar('imposto'),
      corretagem: somar('corretagem'),
      bsaCorretagem: somar('bsaCorretagem'),
      valorTotalCedente: somar('valorTotalCedente'),
    };

    this.totaisGeraisDataSource = [this.totalGeral];

    this.totalGeralCedente = this.faixas.reduce(
      (acumulado, faixa) => acumulado + faixa.valorTotalCedente,
      0
    );
  }

  ngOnInit() {}

  toggleFaixa(faixa: FaixaValores) {
    faixa.expanded = !faixa.expanded;
  }

  toggleTotaisGerais() {
    this.expandedTotaisGerais = !this.expandedTotaisGerais;
  }

  formatarCelula(coluna: ColunaValores, linha: LinhaValorPorRessegurador): string {
    const valor = (linha as unknown as Record<string, number | string | null>)[
      coluna.key
    ];

    if (valor === null || valor === undefined || valor === '') {
      return coluna.key === 'imposto' ? '-' : '';
    }

    if (coluna.tipo === 'texto') {
      return String(valor);
    }

    if (coluna.tipo === 'percentual') {
      return `${Number(valor).toLocaleString('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}%`;
    }

    return Number(valor).toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  }

  formatarMoeda(valor: number): string {
    return valor.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  }

  iconePorStatus(status: HistoricoAprovacao['status']): string {
    switch (status) {
      case 'aprovado':
        return 'check_base';
      case 'pendente':
        return 'clock_base';
      default:
        return 'user_base';
    }
  }
}
