import { CommonModule, NgClass } from '@angular/common';
import { Component, Input, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IdsIconModule } from '@ids/angular';

@Component({
  selector: 'card-base-component',
  imports: [NgClass, CommonModule, IdsIconModule],
  templateUrl: './card_base.component.html',
  styleUrls: ['./card_base.component.scss'],
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class CardBaseComponent {
  /** Título do card (ex.: "Vendas do Mês") */
  @Input() title = '';

  /** Valor principal (ex.: "R$ 12.340,00" ou "1.234") */
  @Input() value: string = '';

  /** Nome do ícone (Material Symbols) ou 'none' para ocultar */
  @Input() icon: string = 'warning_base'; // default conforme a imagem

  /** Cor de acento (borda/ícone). Ex.: '#f4b400' (amarelo) */
  @Input() accentColor: string = '#f4b400';

  /** Torna o card clicável (troca cursor/efeito hover e emite eventos, se desejar expandir) */
  @Input() clickable = false;

  @Input() roundIcon = false;

  constructor() {
    // iDSConfig({
    //   theme: 'varejo',
    //   elementTheme: document
    //     .getElementsByTagName('tag-name-element-root')
    //     .item(0) as HTMLElement,
    // });
  }
}
