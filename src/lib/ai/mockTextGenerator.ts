export function generateMockContent(contentType: string, productName: string): string {
  const name = productName || 'Dispositivo Tech';
  
  switch (contentType.toLowerCase()) {
    case 'review':
      return `### Análise Completa: ${name}\n\nO ${name} se destaca imediatamente como uma das principais referências em sua categoria. Em nossos testes técnicos práticos, avaliamos o desempenho sob estresse de processamento, a qualidade física dos materiais e o consumo médio de bateria.\n\n#### Prós:\n* Desempenho excelente e consistente sob cargas pesadas.\n* Eficiência de bateria acima da média da concorrência.\n* Design refinado, compacto e ergonômico.\n\n#### Contras:\n* Preço inicial de comercialização elevado no Brasil.\n* Falta de conexões físicas extras.\n\n#### Veredito:\nSe você busca durabilidade e performance sem concessões, o ${name} é uma das melhores aquisições possíveis este ano.`;

    case 'guia':
      return `### Guia de Compra: Como escolher produtos como o ${name}\n\nAo procurar um dispositivo na categoria de ${name}, você deve focar em três fatores críticos:\n\n1. **Desempenho e Velocidade de Processamento:** Busque chips com NPUs integradas para otimização de IA local.\n2. **Construção e Ergonomia:** Dê preferência a acabamentos metálicos (como titânio ou alumínio) e formatos ergonômicos.\n3. **Custo-Benefício:** Pese o preço contra a promessa de atualizações a longo prazo.\n\nNossa recomendação é analisar o preço do ${name} em múltiplas lojas para obter a melhor comissão afiliada.`;

    case 'faq':
      return `### FAQ: Dúvidas Frequentes sobre o ${name}\n\n**1. O ${name} é compatível com outros sistemas?**\nSim, ele possui ampla compatibilidade, embora funcione de forma ideal dentro de seu próprio ecossistema.\n\n**2. Qual é a duração real da bateria do ${name}?**\nEm nossos testes de uso misto (navegação web, planilhas e reprodução de mídia), ele atingiu aproximadamente 14 horas de autonomia.\n\n**3. Onde posso encontrar o melhor preço para compra?**\nVocê pode verificar os botões oficiais de Amazon e KaBuM no nosso portal InfoRadar.\n\n**4. A garantia oficial cobre danos acidentais?**\nA garantia padrão de 12 meses cobre apenas defeitos de fabricação de hardware.\n\n**5. Vale a pena fazer o upgrade para este modelo?**\nSe você possui a versão de duas gerações anteriores, a diferença em velocidade de processamento e tela será consideravelmente perceptível.`;

    case 'seo':
      return `**Meta Title:** ${name} Vale a Pena? | Análise Completa e Menores Preços\n**Meta Description:** Quer saber tudo sobre o ${name}? Confira nossa ficha técnica detalhada, prós, contras, veredito de compra e onde garantir o menor preço.\n**Open Graph Title:** Review Detalhado: ${name}\n**Twitter Card Summary:** Ficha técnica e comparativos do novo ${name}. Saiba antes de comprar!`;

    case 'linkedin':
      return `🚀 Acabamos de subir nossa análise completa do novo **${name}** no InfoRadar!\n\nSe você está pensando em fazer um upgrade no seu setup de trabalho ou estudos este ano, este dispositivo merece sua atenção. Identificamos velocidades de processamento excelentes, mas o preço de lançamento no Brasil ainda é o principal ponto de atenção.\n\nConfira os prós, contras e onde encontrar as melhores ofertas de afiliados no link do primeiro comentário! 👇\n\n#tecnologia #reviews #produtividade #infoRadar`;

    case 'shorts':
      return `[ROTEIRO SHORTS - 60 SEGUNDOS]\n\n**[00:00 - 00:10]** (Close rápido na imagem do produto)\n*Locução:* Esse aqui é o novo ${name}. Mas será que vale a pena pagar tudo isso nele?\n\n**[00:10 - 00:30]** (Imagens de uso real)\n*Locução:* O ponto mais forte é o desempenho. Ele não engasga em nenhuma tarefa pesada e a bateria dura o dia todo com folga.\n\n**[00:30 - 00:50]** (Foco nos pontos negativos)\n*Locução:* Por outro lado, ele é bem caro e você vai precisar de adaptadores por causa das poucas portas.\n\n**[00:50 - 01:00]** (Texto CTA na tela)\n*Locução:* Quer ver o veredito completo e onde comprar mais barato? Clica no link da bio e corre pro InfoRadar!`;

    default:
      return `### Conteúdo Gerado Automaticamente para o ${name}\n\nEste é um rascunho de conteúdo gerado por inteligência artificial para o produto ${name}. Revise, modifique e salve antes de publicar.`;
  }
}
