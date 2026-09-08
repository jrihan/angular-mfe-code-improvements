const formatTypes = (array) => {
  const tabSize = (value) => ' '.repeat(
    (array.reduce((acc, current) => Math.max(acc, current.value.length), 0) - value.length) + 4
  );

  return array.map(({ value, name }) => ({
    value,
    name: `${value}:${tabSize(value)}${name}`
  }));
};

const types = formatTypes(
  [
    { value: "build", name: "alterações relacionadas ao sistema ou ferramental de build do projeto" },
    { value: "ci", name: "mudanças nas configurações ou scripts de CI" },
    { value: "chore", name: "caso as alterações não se encaixem em nenhuma categoria acima" },
    { value: "docs", name: "mudanças nas documentações do projeto" },
    { value: "feat", name: "inclusão de uma nova feature" },
    { value: "fix", name: "correção ou melhoria de uma feature existente" },
    { value: "perf", name: "melhorias na performance que não alteram nenhuma funcionalidade ou API" },
    { value: "refactor", name: "refatoração de código que não afete nenhuma funcionalidade" },
    { value: "revert", name: "reversão para um commit anterior" },
    { value: "style", name: "melhorias cosméticas do código que não altere nenhuma funcionalidade" },
    { value: "test", name: "alterações apenas relacionadas às suítes de teste" },
  ]
)

module.exports = {
  types,
  scopes: [],
  skipQuestions: ['scope'],
  messages: {
    type: 
      "Selecione o tipo de mudança que você está enviando:",
    subject:
      "Descreva resumidamente o que foi feito usando a terceira pessoa do presente do indicativo (exemplo: adiciona novo item... - em letras minúsculas):\n",
    body:
      'Agora uma descrição mais longa da mudança (opcional). Use "|" para quebrar linhas:\n',
    breaking:
      "Liste quaisquer alterações que resultem em BREAKING CHANGES (opcional):\n",
    footer:
      "Para chamados abertos no Service Now, escreva a respeito aqui. Para issues encerradas, use #. (exemplo: #31):\n",
    confirmCommit: 
      "Tem certeza que deseja prosseguir com o commit acima?",
  },
};