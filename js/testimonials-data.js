const testimonialsData = [
  {
    "name": "Thiago Mendes",
    "service": "Dashboards Power BI",
    "text": "Excelente atendimento! O dashboard de vendas que desenvolveram superou todas as expectativas. Tomamos decisões muito mais rápidas agora.",
    "rating": 5,
    "date": "01/05/2025"
  },
  {
    "name": "Juliana Rocha",
    "service": "Monitoramento Zabbix & Grafana",
    "text": "Depois da implantação do Zabbix, nunca mais fomos pegos de surpresa com servidores fora do ar. Os alertas chegam direto no celular. Recomendado!",
    "rating": 5,
    "date": "11/05/2025"
  },
  {
    "name": "Roberto Silva",
    "service": "Manutenção e Upgrade de Hardware",
    "text": "Fiz o upgrade do SSD e memória RAM do meu notebook de trabalho e ele ficou mais rápido do que quando era novo. Excelente serviço!",
    "rating": 5,
    "date": "21/05/2025"
  },
  {
    "name": "Cláudia Souza",
    "service": "Central de Serviços GLPI",
    "text": "O GLPI organizou completamente a nossa TI. Acabou a bagunça de chamados perdidos por e-mail. A consultoria da Elyar foi impecável.",
    "rating": 5,
    "date": "31/05/2025"
  },
  {
    "name": "Felipe Almeida",
    "service": "Segurança Wazuh SIEM",
    "text": "Excelente trabalho na implementação do SIEM. Agora temos total visibilidade dos eventos de segurança em conformidade com a LGPD.",
    "rating": 5,
    "date": "10/06/2025"
  },
  {
    "name": "Marcos Oliveira",
    "service": "Consultoria de TI",
    "text": "A auditoria de infraestrutura que a Elyar realizou identificou gargalos cruciais. Economizamos muito em licenças desnecessárias.",
    "rating": 5,
    "date": "20/06/2025"
  },
  {
    "name": "Patricia Gomes",
    "service": "Dashboards Power BI",
    "text": "O design do dashboard é lindíssimo e as fórmulas em DAX calculam tudo em tempo real. Os gerentes adoraram a clareza dos KPIs.",
    "rating": 5,
    "date": "30/06/2025"
  },
  {
    "name": "Gabriel Santos",
    "service": "Monitoramento Zabbix & Grafana",
    "text": "A integração dos alertas de link de internet via WhatsApp salvou nossa operação de varejo várias vezes. Excelente custo-benefício.",
    "rating": 5,
    "date": "10/07/2025"
  },
  {
    "name": "Lucas Lima",
    "service": "Manutenção e Upgrade de Hardware",
    "text": "Montaram meu PC gamer do zero. O cable management ficou impecável e a refrigeração líquida mantém as temperaturas baixas em carga máxima.",
    "rating": 5,
    "date": "20/07/2025"
  },
  {
    "name": "Mariana Costa",
    "service": "Central de Serviços GLPI",
    "text": "Suporte muito prestativo e ágil. O catálogo de serviços no GLPI reduziu o tempo de atendimento de chamados internos.",
    "rating": 5,
    "date": "30/07/2025"
  },
  {
    "name": "Rodrigo Teixeira",
    "service": "Segurança Wazuh SIEM",
    "text": "Implementação rápida e eficiente. O painel de controle do Wazuh é muito completo. Sentimo-nos seguros contra invasões.",
    "rating": 5,
    "date": "09/08/2025"
  },
  {
    "name": "Daniela Ribeiro",
    "service": "Dashboards Power BI",
    "text": "Conectaram o Power BI com nossas planilhas locais e nosso banco SQL. Tudo atualiza automaticamente todo dia de manhã.",
    "rating": 5,
    "date": "19/08/2025"
  },
  {
    "name": "André Luiz",
    "service": "Monitoramento Zabbix & Grafana",
    "text": "Os painéis no Grafana colocados na nossa TV de monitoramento ajudam a equipe a acompanhar a rede inteira em tempo real.",
    "rating": 5,
    "date": "29/08/2025"
  },
  {
    "name": "Carla Pires",
    "service": "Manutenção e Upgrade de Hardware",
    "text": "Limpeza física completa do meu computador com troca de pasta térmica. A temperatura do processador caiu quase 20 graus!",
    "rating": 5,
    "date": "08/09/2025"
  },
  {
    "name": "Bruno Rezende",
    "service": "Consultoria de TI",
    "text": "Equipe altamente qualificada. O planejamento estratégico de hardware que fizeram para a nossa frota de notebooks economizou recursos.",
    "rating": 5,
    "date": "18/09/2025"
  },
  {
    "name": "Renata Martins",
    "service": "Dashboards Power BI",
    "text": "Visual moderno e dinâmico. O portfólio de BI deles é excelente, mas o dashboard customizado que fizeram para nós superou tudo.",
    "rating": 5,
    "date": "28/09/2025"
  },
  {
    "name": "Carlos Eduardo",
    "service": "Monitoramento Zabbix & Grafana",
    "text": "O suporte pós-implantação é excelente. Sempre que precisamos ajustar algum alerta, eles nos atendem com agilidade.",
    "rating": 5,
    "date": "08/10/2025"
  },
  {
    "name": "Fabiana Dias",
    "service": "Central de Serviços GLPI",
    "text": "Migramos nosso helpdesk antigo para o GLPI com a ajuda deles e foi a melhor decisão. O controle de SLAs funciona perfeitamente.",
    "rating": 5,
    "date": "18/10/2025"
  },
  {
    "name": "Gustavo Nogueira",
    "service": "Segurança Wazuh SIEM",
    "text": "A detecção proativa de acessos não autorizados do SIEM nos ajudou a bloquear ataques de força bruta no nosso servidor web.",
    "rating": 5,
    "date": "28/10/2025"
  },
  {
    "name": "Aline Cardoso",
    "service": "Dashboards Power BI",
    "text": "Maravilhoso! Os relatórios são intuitivos, qualquer funcionário consegue filtrar e analisar as vendas sem complicação.",
    "rating": 5,
    "date": "07/11/2025"
  },
  {
    "name": "Ricardo Fonseca",
    "service": "Monitoramento Zabbix & Grafana",
    "text": "Mapearam toda a nossa infraestrutura de servidores em nuvem. A tranquilidade de ter tudo monitorado não tem preço.",
    "rating": 5,
    "date": "17/11/2025"
  },
  {
    "name": "Leonardo Henrique",
    "service": "Manutenção e Upgrade de Hardware",
    "text": "Levei meu computador de trabalho lento e em poucas horas fizeram a substituição por um SSD. O atendimento foi muito ágil.",
    "rating": 5,
    "date": "27/11/2025"
  },
  {
    "name": "Sandra Barbosa",
    "service": "Central de Serviços GLPI",
    "text": "O catálogo de serviços integrado com a base de conhecimento ajudou muito no treinamento de novos operadores de suporte.",
    "rating": 5,
    "date": "07/12/2025"
  },
  {
    "name": "Vitor Hugo",
    "service": "Segurança Wazuh SIEM",
    "text": "Serviço profissional de alta qualidade. Agora temos relatórios completos para comprovar conformidade nas auditorias externas.",
    "rating": 5,
    "date": "17/12/2025"
  },
  {
    "name": "Fernanda Lima",
    "service": "Dashboards Power BI",
    "text": "Perfeito! Fizeram a limpeza completa das nossas bases de dados legadas e montaram relatórios gerenciais incríveis.",
    "rating": 5,
    "date": "27/12/2025"
  },
  {
    "name": "Eduardo Rocha",
    "service": "Monitoramento Zabbix & Grafana",
    "text": "A facilidade de visualizar a performance de memória e CPU do cluster através do Grafana otimizou muito o dia a dia da infra.",
    "rating": 5,
    "date": "06/01/2026"
  },
  {
    "name": "Beatriz Oliveira",
    "service": "Manutenção e Upgrade de Hardware",
    "text": "Notebook gamer estava superaquecendo e desligando sozinho. Fizeram a limpeza e desoxidação e agora está perfeito de novo.",
    "rating": 5,
    "date": "16/01/2026"
  },
  {
    "name": "Jefferson Ramos",
    "service": "Central de Serviços GLPI",
    "text": "Implantaram o GLPI integrado com nosso Active Directory. Os usuários entram com o mesmo login de rede, facilitou muito.",
    "rating": 5,
    "date": "26/01/2026"
  },
  {
    "name": "Sofia Albuquerque",
    "service": "Segurança Wazuh SIEM",
    "text": "Excelente monitoramento de conformidade. Centralizou todos os alertas de segurança dos servidores Windows e Linux.",
    "rating": 5,
    "date": "05/02/2026"
  },
  {
    "name": "Marcelo Diniz",
    "service": "Consultoria de TI",
    "text": "A consultoria ajudou a estruturar nossa TI corporativa. Profissionais éticos, transparentes e altamente técnicos.",
    "rating": 5,
    "date": "15/02/2026"
  },
  {
    "name": "Camila Rodrigues",
    "service": "Dashboards Power BI",
    "text": "Os dashboards são muito bons e nos ajudaram a identificar perdas financeiras. Apenas a integração inicial do banco demorou um pouco.",
    "rating": 4,
    "date": "25/02/2026"
  },
  {
    "name": "Renato Augusto",
    "service": "Monitoramento Zabbix & Grafana",
    "text": "Instalação rápida e suporte prestativo. Houve alguns alarmes falsos de link no início, mas ajustaram as triggers rapidamente.",
    "rating": 4,
    "date": "07/03/2026"
  },
  {
    "name": "Letícia Ramos",
    "service": "Manutenção e Upgrade de Hardware",
    "text": "O upgrade de memória e SSD ficou ótimo. O prazo de entrega atrasou um dia por conta da transportadora da peça, mas o serviço compensou.",
    "rating": 4,
    "date": "17/03/2026"
  },
  {
    "name": "Fábio Junior",
    "service": "Central de Serviços GLPI",
    "text": "O sistema de chamados é excelente. A equipe interna demorou um pouco para se adaptar às regras de SLA, mas a ferramenta atende 100%.",
    "rating": 4,
    "date": "27/03/2026"
  },
  {
    "name": "Karina Silveira",
    "service": "Segurança Wazuh SIEM",
    "text": "Monitoramento muito seguro. A interface do Wazuh exige um pouco de treinamento, mas as detecções funcionam perfeitamente.",
    "rating": 4,
    "date": "06/04/2026"
  },
  {
    "name": "Douglas Moreira",
    "service": "Consultoria de TI",
    "text": "Boa análise técnica e plano de ação claro. Nos deu uma excelente direção de quais equipamentos investir este ano.",
    "rating": 4,
    "date": "16/04/2026"
  },
  {
    "name": "Tatiana Neves",
    "service": "Dashboards Power BI",
    "text": "O dashboard simplificou nossa rotina. Houve necessidade de pequenos ajustes na formatação visual das tabelas, resolvidos rápido.",
    "rating": 4,
    "date": "26/04/2026"
  },
  {
    "name": "Maurício Vieira",
    "service": "Monitoramento Zabbix & Grafana",
    "text": "Muito bom serviço. Toda a nossa rede corporativa agora está monitorada e as telas do Grafana ajudam muito no NOC.",
    "rating": 4,
    "date": "06/05/2026"
  },
  {
    "name": "Vanessa Martins",
    "service": "Manutenção e Upgrade de Hardware",
    "text": "Limpeza de poeira e troca de pasta térmica feitas com qualidade. O barulho de turbina que o PC fazia sumiu completamente.",
    "rating": 4,
    "date": "16/05/2026"
  },
  {
    "name": "Lucas Faria",
    "service": "Central de Serviços GLPI",
    "text": "A estruturação dos chamados via formulários diminuiu os erros de triagem. Excelente consultoria e treinamento de equipe.",
    "rating": 4,
    "date": "26/05/2026"
  },
  {
    "name": "jorge Fernando",
    "service": "Monitoramento Zabbix & Grafana",
    "text": "O monitoramento funciona bem, mas a configuração inicial de alertas no Telegram exigiu alguns testes extras da equipe.",
    "rating": 3,
    "date": "05/06/2026"
  },
  {
    "name": "Eliane Souza",
    "service": "Dashboards Power BI",
    "text": "Os relatórios são dinâmicos e ajudam a gerência. Tivemos dificuldades de atualização automática devido a restrições do nosso firewall local.",
    "rating": 3,
    "date": "15/06/2026"
  },
  {
    "name": "Marcos Vinícius",
    "service": "Manutenção e Upgrade de Hardware",
    "text": "Fizeram um bom serviço de limpeza física, mas tive que reinstalar o driver de som do computador após a limpeza do sistema operacional.",
    "rating": 3,
    "date": "25/06/2026"
  }
];

if (typeof window !== 'undefined') {
  window.testimonialsData = testimonialsData;
}
if (typeof module !== 'undefined' && module.exports) {
  module.exports = testimonialsData;
}
