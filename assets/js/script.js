// Configuração de horários de funcionamento
const storeHours = {
    0: { open: null, close: null }, // Domingo - Fechado
    1: { open: 8, close: 18 },      // Segunda - 8h às 18h
    2: { open: 8, close: 18 },      // Terça - 8h às 18h
    3: { open: 8, close: 18 },      // Quarta - 8h às 18h
    4: { open: 8, close: 18 },      // Quinta - 8h às 18h
    5: { open: 8, close: 18 },      // Sexta - 8h às 18h
    6: { open: 9, close: 13 }       // Sábado - 9h às 13h
};

// Variáveis globais
let currentProduct = null;
let currentQuantityType = 'kg';
let currentQuantity = 0;

// Função para verificar se a loja está aberta
function checkStoreStatus() {
    const now = new Date();
    const currentDay = now.getDay(); // 0 = Domingo, 1 = Segunda, etc.
    const currentHour = now.getHours();
    const currentMinutes = now.getMinutes();
    
    const todayHours = storeHours[currentDay];
    
    // Se não há horário definido para hoje, a loja está fechada
    if (!todayHours || !todayHours.open) {
        return { isOpen: false, nextOpening: getNextOpening(now) };
    }
    
    // Converte hora atual para minutos totais para facilitar comparação
    const currentTimeInMinutes = currentHour * 60 + currentMinutes;
    const openTimeInMinutes = todayHours.open * 60;
    const closeTimeInMinutes = todayHours.close * 60;
    
    // Verifica se está dentro do horário de funcionamento
    const isOpen = currentTimeInMinutes >= openTimeInMinutes && 
                  currentTimeInMinutes < closeTimeInMinutes;
    
    return { 
        isOpen, 
        nextOpening: isOpen ? null : getNextOpening(now)
    };
}

// Função para obter o próximo horário de abertura
function getNextOpening(currentDate) {
    let checkDate = new Date(currentDate);
    let daysChecked = 0;
    
    // Procura pelos próximos 7 dias
    while (daysChecked < 7) {
        checkDate.setDate(checkDate.getDate() + 1);
        const checkDay = checkDate.getDay();
        const dayHours = storeHours[checkDay];
        
        if (dayHours && dayHours.open) {
            const nextOpen = new Date(checkDate);
            nextOpen.setHours(dayHours.open, 0, 0, 0);
            return nextOpen;
        }
        
        daysChecked++;
    }
    
    return null;
}

// Função para atualizar o status na interface
function updateStoreStatus() {
    const status = checkStoreStatus();
    const statusIndicator = document.getElementById('status-indicator');
    const statusText = document.getElementById('status-text');
    const storeHoursElement = document.getElementById('store-hours');
    const headerStatus = document.getElementById('header-status');
    
    if (status.isOpen) {
        statusIndicator.className = 'status-indicator';
        statusText.textContent = 'Aberto Agora';
        storeHoursElement.textContent = 'Seg-Sex: 8h-18h | Sáb: 9h-13h';
        
        // Atualiza o status no header
        headerStatus.className = 'status-display open';
        headerStatus.innerHTML = '<i class="fas fa-store"></i><span>Aberto Agora</span>';
    } else {
        statusIndicator.className = 'status-indicator closed';
        statusText.textContent = 'Fechado';
        
        // Atualiza o status no header
        headerStatus.className = 'status-display closed';
        
        if (status.nextOpening) {
            const options = { hour: '2-digit', minute: '2-digit' };
            const nextOpenStr = status.nextOpening.toLocaleTimeString('pt-BR', options);
            storeHoursElement.textContent = `Abre ${nextOpenStr}`;
            headerStatus.innerHTML = `<i class="fas fa-store"></i><span>Abre ${nextOpenStr}</span>`;
        } else {
            storeHoursElement.textContent = 'Seg-Sex: 8h-18h | Sáb: 9h-13h';
            headerStatus.innerHTML = '<i class="fas fa-store"></i><span>Fechado</span>';
        }
    }
}

// Carregar produtos do localStorage (se existir) ou usar padrão
function loadProducts() {
    const stored = localStorage.getItem('petweb_products');
    if (stored) {
        try {
            return JSON.parse(stored);
        } catch (e) {
            console.error('Erro ao carregar produtos do localStorage:', e);
        }
    }
    // Retornar produtos padrão se não houver no localStorage
    return [
    // RAÇÕES
    {
        id: 1,
        name: "Ração Premium para Cães Adultos",
        price: 99.04,
        pricePerKg: 9.80,
        image: "https://www.petlove.com.br/images/products/262033/product/Ra%C3%A7%C3%A3o_Seca_Bomguy_Frango_para_C%C3%A3es_Adultos_31027516826_%281%29.jpg?1662979111",
        category: "cachorro",
        productType: "racao",
        badge: "Mais Vendido",
        unit: "kg",
        packageSize: 10
    },
    {
        id: 2,
        name: "Ração para Gatos Castrados",
        price: 149.99,
        pricePerKg: 14.85,
        image: "https://m.media-amazon.com/images/I/81IuLVVQq5L._AC_SY879_.jpg",
        category: "gato",
        productType: "racao",
        badge: "Novo",
        unit: "kg",
        packageSize: 10.1
    },
    {
        id: 3,
        name: "Alpiste para Pássaros",
        price: 69.90,
        pricePerKg: 6.99,
        image: "https://m.media-amazon.com/images/I/51kd523UZdL._AC_SX679_.jpg",
        category: "passaro",
        productType: "racao",
        unit: "kg",
        packageSize: 10
    },
    {
        id: 4,
        name: "Ração para Peixes Tropicais",
        price: 295.00,
        pricePerKg: 100.00,
        image: "https://m.media-amazon.com/images/I/71x+E7UPfXL._AC_SX679_.jpg",
        category: "peixe",
        productType: "racao",
        unit: "kg",
        packageSize: 1.6
    },
    {
        id: 5,
        name: "Ração para Cães Filhotes",
        price: 149.90,
        pricePerKg: 9.99,
        image: "https://m.media-amazon.com/images/I/812lu-ciS-L._AC_SY879_.jpg",
        category: "cachorro",
        productType: "racao",
        badge: "Oferta",
        unit: "kg",
        packageSize: 15
    },
    {
        id: 6,
        name: "Ração Úmida para Gatos",
        price: 8.50,
        pricePerKg: 34.00,
        image: "https://agropecuariataboao.cdn.magazord.com.br/img/2023/12/produto/2351/design-sem-nome-2023-12-29t141932-039.png?ims=290x290",
        category: "gato",
        productType: "racao",
        unit: "kg",
        packageSize: 0.25
    },
    {
        id: 7,
        name: "Ração para Calopsitas",
        price: 18.90,
        pricePerKg: 37.80,
        image: "https://www.petlove.com.br/images/products/156088/product/Ra%C3%A7%C3%A3o_Zootekna_Mistura_Balanceada_de_Sementes_para_Agap%C3%B3rnis_e_Calopsita_-_500_g_3101096.jpg?1627543629",
        category: "passaro",
        productType: "racao",
        unit: "kg",
        packageSize: 0.5
    },
    {
        id: 8,
        name: "Ração para Peixes Dourados",
        price: 15.75,
        pricePerKg: 63.00,
        image: "https://images.tcdn.com.br/img/img_prod/724553/racao_para_peixe_alcon_gold_fish_colours_100gr_253_1_20191007213323.jpg",
        category: "peixe",
        productType: "racao",
        unit: "kg",
        packageSize: 0.25
    },
    // HIGIENE - SHAMPOO E SABONETE
    {
        id: 9,
        name: "Shampoo Antipulgas para Cães",
        price: 24.90,
        pricePerKg: null,
        image: "https://cobasi.vteximg.com.br/arquivos/ids/1052193/Embalagem-Shampoo-Duprat.png?v=638357473419330000",
        category: "cachorro",
        productType: "higiene",
        unit: "un",
        packageSize: 1
    },
    {
        id: 10,
        name: "Shampoo para Gatos de Pelo Longo",
        price: 22.50,
        pricePerKg: null,
        image: "https://www.petlove.com.br/images/products/224894/product/Shampoo_Sanol_Cat_para_Gatos_-_500_mL_31077040.jpg?1627721179",
        category: "gato",
        productType: "higiene",
        unit: "un",
        packageSize: 1
    },
    {
        id: 11,
        name: "Sabonete Antisséptico para Pets",
        price: 12.90,
        pricePerKg: null,
        image: "https://www.petlove.com.br/images/products/233199/product/Sabonete_Matacura_Antiss%C3%A9ptico_e_Bactericida_para_C%C3%A3es_2345074.jpg?1627747880",
        category: "cachorro",
        productType: "higiene",
        unit: "un",
        packageSize: 1
    },
    {
        id: 12,
        name: "Shampoo Hidratante Premium",
        price: 28.90,
        pricePerKg: null,
        image: "https://www.petlove.com.br/images/products/252668/product/Padr%C3%A3o_%281%29_0004_7898574024200_BEEPS_ESTOPINHA_SHAMPOO_HIDRATANTE_AMEIXA_500ML.jpg?1646318473",
        category: "cachorro",
        productType: "higiene",
        badge: "Novo",
        unit: "un",
        packageSize: 1
    },
    // MEDICAMENTOS
    {
        id: 13,
        name: "Vermífugo para Cães",
        price: 35.90,
        pricePerKg: null,
        image: "https://http2.mlstatic.com/D_NQ_NP_2X_952930-MLB89748290637_082025-F-4-compr-anti-pulgas-carrapatos-vermes-sarnas-p-filhotes.webp",
        category: "cachorro",
        productType: "medicamento",
        unit: "un",
        packageSize: 1
    },
    {
        id: 14,
        name: "Antipulgas e Carrapatos",
        price: 45.00,
        pricePerKg: null,
        image: "https://www.petlove.com.br/images/products/238732/product/Antipulgas_e_Carrapatos_NexGard_Spectra_para_C%C3%A3es_de_7_6_a_15_Kg_2659015.jpg?1627772735",
        category: "cachorro",
        productType: "medicamento",
        badge: "Mais Vendido",
        unit: "un",
        packageSize: 1
    },
    {
        id: 15,
        name: "Vermífugo para Gatos",
        price: 32.50,
        pricePerKg: null,
        image: "https://m.media-amazon.com/images/I/71uxrTnU0-L._AC_SY300_SX300_QL70_ML2_.jpg",
        category: "gato",
        productType: "medicamento",
        unit: "un",
        packageSize: 1
    },
    {
        id: 16,
        name: "Suplemento Vitamínico",
        price: 28.90,
        pricePerKg: null,
        image: "https://m.media-amazon.com/images/I/51flW2lWKsL._AC_SX679_.jpg",
        category: "cachorro",
        productType: "medicamento",
        unit: "un",
        packageSize: 1
    },
    // ACESSÓRIOS
    {
        id: 17,
        name: "Coleira Antipulgas para Cães",
        price: 18.90,
        pricePerKg: null,
        image: "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcTwOD_0yKZQdXmTXxBMUfLdqUhJfsnWbcQXftsaevOkAUjBl6RJ_6UhjG44RhX-eJuzaEpxWKeWtPIafVfnT70JcHT0EframTi_XVENhn_uzRWXQ0u84RP_XFKf",
        category: "cachorro",
        productType: "acessorio",
        unit: "un",
        packageSize: 1
    },
    {
        id: 18,
        name: "Brinquedo Interativo para Gatos",
        price: 15.50,
        pricePerKg: null,
        image: "https://m.media-amazon.com/images/I/51vHdQlOdAL._AC_SX679_.jpg",
        category: "gato",
        productType: "acessorio",
        unit: "un",
        packageSize: 1
    },
    {
        id: 19,
        name: "Guia Retrátil para Cães",
        price: 42.90,
        pricePerKg: null,
        image: "https://m.media-amazon.com/images/I/41GymtzPsCL._AC_SY300_SX300_QL70_ML2_.jpg",
        category: "cachorro",
        productType: "acessorio",
        badge: "Oferta",
        unit: "un",
        packageSize: 1
    },
    {
        id: 20,
        name: "Comedouro Automático",
        price: 89.90,
        pricePerKg: null,
        image: "https://s2-oglobo.glbimg.com/8Zk-vjZnQUMmbNjQ13239-oJmfA=/0x0:1920x1080/888x0/smart/filters:strip_icc()/i.s3.glbimg.com/v1/AUTH_da025474c0c44edd99332dddb09cabe8/internal_photos/bs/2025/g/B/S0I8o9S96yeshMCQjBWQ/d-nq-np-2x-775428-mlu79085357897-092024-f.webp",
        category: "cachorro",
        productType: "acessorio",
        unit: "un",
        packageSize: 1
    },
    {
        id: 21,
        name: "Arranhador para Gatos",
        price: 65.00,
        pricePerKg: null,
        image: "https://img.elo7.com.br/product/zoom/4E8352D/arranhador-parede-gatificacao-gato-madeira-grande-sisal-brinquedo-de-gato.jpg",
        category: "gato",
        productType: "acessorio",
        unit: "un",
        packageSize: 1
    },
    // GAIOLAS
    {
        id: 22,
        name: "Gaiola para Pássaros Pequenos",
        price: 85.00,
        pricePerKg: null,
        image: "https://m.media-amazon.com/images/I/71RAgSlwrAL._AC_SY300_SX300_QL70_ML2_.jpg",
        category: "passaro",
        productType: "gaiola",
        unit: "un",
        packageSize: 1
    },
    {
        id: 23,
        name: "Gaiola para Calopsitas",
        price: 120.00,
        pricePerKg: null,
        image: "https://images.tcdn.com.br/img/img_prod/1037527/gaiola_grande_para_calopsita_aves_mansas_com_acessorios_861_1_e17b95da6386f4a9c263d8102df0f70a.jpg",
        category: "passaro",
        productType: "gaiola",
        badge: "Novo",
        unit: "un",
        packageSize: 1
    },
    {
        id: 24,
        name: "Aquário 50 Litros",
        price: 180.00,
        pricePerKg: null,
        image: "https://m.media-amazon.com/images/I/41i-orehbLL._AC_SX679_.jpg",
        category: "peixe",
        productType: "gaiola",
        unit: "un",
        packageSize: 1
    },
    {
        id: 25,
        name: "Aquário 100 Litros Completo",
        price: 350.00,
        pricePerKg: null,
        image: "https://amantesdoaquarismo.cdn.magazord.com.br/img/2022/11/produto/1144/aquario-50-x-40-x-40-intermediario-png.png?ims=fit-in/475x650/filters:fill(white)",
        category: "peixe",
        productType: "gaiola",
        badge: "Oferta",
        unit: "un",
        packageSize: 1
    },
    // ANIMAIS
    {
        id: 26,
        name: "Calopsita Filhote",
        price: 150.00,
        pricePerKg: null,
        image: "https://img.freepik.com/fotos-gratis/fotografia-vertical-de-uma-adoravel-gaivota_181624-42514.jpg?semt=ais_hybrid&w=740&q=80",
        category: "passaro",
        productType: "animal",
        unit: "un",
        packageSize: 1
    },
    {
        id: 27,
        name: "Peixe Beta",
        price: 12.90,
        pricePerKg: null,
        image: "https://recreio.com.br/wp-content/uploads/feedsync/5-duvidas-sobre-cuidados-com-o-peixe-betta-99.jpg",
        category: "peixe",
        productType: "animal",
        unit: "un",
        packageSize: 1
    },
    {
        id: 28,
        name: "Peixe Dourado",
        price: 8.50,
        pricePerKg: null,
        image: "https://blog.ferplast.com/wp-content/uploads/2016/07/pesce-rosso-giapponese-caratteristiche-storia-curiosita.jpg",
        category: "peixe",
        productType: "animal",
        unit: "un",
        packageSize: 1
    },
    // COMPLEMENTOS
    {
        id: 29,
        name: "Biscoito para Cães",
        price: 15.90,
        pricePerKg: null,
        image: "https://images.tcdn.com.br/img/img_prod/587393/biscoito_biscrok_adulto_racas_pequenas_500g_794_1_20180309103535.jpg",
        category: "cachorro",
        productType: "complemento",
        unit: "un",
        packageSize: 1
    },
    {
        id: 30,
        name: "Petisco para Gatos",
        price: 12.50,
        pricePerKg: null,
        image: "https://images.tcdn.com.br/img/img_prod/1254270/petisco_para_gato_truly_delight_palitos_de_pato_50g_988_1_a1611d8bf5b78e750038a9353fdbc573.jpg",
        category: "gato",
        productType: "complemento",
        unit: "un",
        packageSize: 1
    },
    {
        id: 31,
        name: "Osso para Cães",
        price: 8.90,
        pricePerKg: null,
        image: "https://http2.mlstatic.com/D_NQ_NP_771225-MLA93509821957_092025-O.webp",
        category: "cachorro",
        productType: "complemento",
        unit: "un",
        packageSize: 1
    },
    {
        id: 32,
        name: "Ração Úmida Sache para Gatos",
        price: 3.50,
        pricePerKg: null,
        image: "https://www.petlove.com.br/images/products/289291/product/7896029018231_0005_7896029018231_0_Hero.jpg?1726578697",
        category: "gato",
        productType: "complemento",
        unit: "un",
        packageSize: 1
    },
    // MAIS PRODUTOS DE HIGIENE
    {
        id: 33,
        name: "Shampoo para Pássaros",
        price: 18.90,
        pricePerKg: null,
        image: "https://tudodebicho.vtexassets.com/arquivos/ids/161920/Banho-Para-Aves-Ornamentais-Labcon-Club-.jpg?v=638410160868270000",
        category: "passaro",
        productType: "higiene",
        unit: "un",
        packageSize: 1
    },
    {
        id: 34,
        name: "Sabonete para Peixes (Limpeza de Aquário)",
        price: 15.50,
        pricePerKg: null,
        image: "https://m.media-amazon.com/images/I/61zmdhzu8fL._AC_SX679_.jpg",
        category: "peixe",
        productType: "higiene",
        unit: "un",
        packageSize: 1
    },
    {
        id: 35,
        name: "Condicionador para Cães de Pelo Longo",
        price: 26.90,
        pricePerKg: null,
        image: "https://b2b.granado.com.br/media/catalog/product/e/a/ean7896512949677__2.jpg?optimize=high&fit=bounds&height=895&width=696&canvas=696:895",
        category: "cachorro",
        productType: "higiene",
        badge: "Novo",
        unit: "un",
        packageSize: 1
    },
    // MAIS MEDICAMENTOS
    {
        id: 36,
        name: "Antipulgas para Gatos",
        price: 38.50,
        pricePerKg: null,
        image: "https://images.petz.com.br/fotos/1669063512033.jpg",
        category: "gato",
        productType: "medicamento",
        unit: "un",
        packageSize: 1
    },
    {
        id: 37,
        name: "Remédio para Doenças de Pele",
        price: 42.90,
        pricePerKg: null,
        image: "https://http2.mlstatic.com/D_NQ_NP_995793-MLB83970726149_042025-O.webp",
        category: "cachorro",
        productType: "medicamento",
        unit: "un",
        packageSize: 1
    },
    {
        id: 38,
        name: "Vitamina para Pássaros",
        price: 19.90,
        pricePerKg: null,
        image: "https://www.terradospassaros.com/loja/images/112_gg.jpg?v=20210330120850",
        category: "passaro",
        productType: "medicamento",
        unit: "un",
        packageSize: 1
    },
    {
        id: 39,
        name: "Remédio para Fungos em Peixes",
        price: 22.50,
        pricePerKg: null,
        image: "https://images.tcdn.com.br/img/img_prod/699275/medicamento_labcon_aqualife_15ml_2207_1_84d7f6ff82feccdb9876cb1614c110c1.jpg",
        category: "peixe",
        productType: "medicamento",
        unit: "un",
        packageSize: 1
    },
    // MAIS ACESSÓRIOS
    {
        id: 40,
        name: "Cama para Cães Grande",
        price: 125.00,
        pricePerKg: null,
        image: "https://m.media-amazon.com/images/I/71jmMLdAPhL._AC_SX679_.jpg",
        category: "cachorro",
        productType: "acessorio",
        badge: "Oferta",
        unit: "un",
        packageSize: 1
    },
    {
        id: 41,
        name: "Cama para Gatos com Túnel",
        price: 95.00,
        pricePerKg: null,
        image: "https://m.media-amazon.com/images/I/71mnzbSXhAL.jpg",
        category: "gato",
        productType: "acessorio",
        unit: "un",
        packageSize: 1
    },
    {
        id: 42,
        name: "Bebedouro Automático para Gatos",
        price: 68.90,
        pricePerKg: null,
        image: "https://m.media-amazon.com/images/I/515is1QuwRL._AC_SX679_.jpg",
        category: "gato",
        productType: "acessorio",
        unit: "un",
        packageSize: 1
    },
    {
        id: 43,
        name: "Brinquedo para Pássaros com Espelho",
        price: 12.90,
        pricePerKg: null,
        image: "https://cdn.awsli.com.br/2500x2500/2518/2518821/produto/260892532/kit-brinquedos-para-calopsita-agapornis-periquito-balan-o-multi-play-toco-tucann-4d8rpm3vpn.jpg",
        category: "passaro",
        productType: "acessorio",
        unit: "un",
        packageSize: 1
    },
    {
        id: 44,
        name: "Decoração para Aquário (Castelo)",
        price: 35.00,
        pricePerKg: null,
        image: "https://storage.googleapis.com/propcart-br.appspot.com/images/items/HFQK6kkxg6xqFq1SdgF7_1691429469905.jpeg",
        category: "peixe",
        productType: "acessorio",
        unit: "un",
        packageSize: 1
    },
    {
        id: 45,
        name: "Brinquedo Interativo para Cães",
        price: 38.50,
        pricePerKg: null,
        image: "https://images.tcdn.com.br/img/img_prod/686927/brinquedo_interativo_dispenser_de_petiscos_racao_treat_maze_nina_ottosson_nivel_intermediario_1013_2_20201117002148.jpg",
        category: "cachorro",
        productType: "acessorio",
        unit: "un",
        packageSize: 1
    },
    {
        id: 46,
        name: "Roupinha para Cães Pequenos",
        price: 45.00,
        pricePerKg: null,
        image: "https://cdn.awsli.com.br/600x700/538/538026/produto/220461624/roupa-cachorro-p-u4gshu5qoj.png",
        category: "cachorro",
        productType: "acessorio",
        unit: "un",
        packageSize: 1
    },
    // MAIS GAIOLAS E AQUÁRIOS
    {
        id: 47,
        name: "Gaiola para Canários",
        price: 75.00,
        pricePerKg: null,
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRu2zaWLOb1yrcHL3EZdTx_cC--5Q9qibWihQ&s",
        category: "passaro",
        productType: "gaiola",
        unit: "un",
        packageSize: 1
    },
    {
        id: 48,
        name: "Aquário 200 Litros Premium",
        price: 580.00,
        pricePerKg: null,
        image: "https://images.petz.com.br/fotos/1652967145473_mini.jpg",
        category: "peixe",
        productType: "gaiola",
        badge: "Novo",
        unit: "un",
        packageSize: 1
    },
    {
        id: 49,
        name: "Gaiola para Papagaios",
        price: 250.00,
        pricePerKg: null,
        image: "https://http2.mlstatic.com/D_Q_NP_959035-MLA88405622669_072025-O.webp",
        category: "passaro",
        productType: "gaiola",
        unit: "un",
        packageSize: 1
    },
    {
        id: 50,
        name: "Aquário 30 Litros Iniciante",
        price: 120.00,
        pricePerKg: null,
        image: "https://http2.mlstatic.com/D_NQ_NP_2X_753748-MLB93426388299_092025-F-aquario-cubo-30x30x30-26litros-p-peixes-e-plantas-aquaticas.webp",
        category: "peixe",
        productType: "gaiola",
        unit: "un",
        packageSize: 1
    },
    // CIMENTO E MATERIAIS
    {
        id: 51,
        name: "Cimento para Construção de Gaiolas",
        price: 15.90,
        pricePerKg: 3.18,
        image: "https://www.itapi.com.br/24-large_default/cimento-a-25kg-votoranzinho.jpg",
        category: "passaro",
        productType: "material",
        unit: "kg",
        packageSize: 5
    },
    {
        id: 52,
        name: "Cimento para Aquários",
        price: 18.50,
        pricePerKg: 3.70,
        image: "https://www.aquaricamp.com.br/media/catalog/product/s/t/stone_fix.png",
        category: "peixe",
        productType: "material",
        unit: "kg",
        packageSize: 5
    },
    {
        id: 53,
        name: "Cimento Especial para Pet Shops",
        price: 22.90,
        pricePerKg: 4.58,
        image: "https://escutaoveio.fbitsstatic.net/img/p/aditivo-para-concreto-tech-concreto-150g-pulo-do-gato-82184/268739-1.jpg?w=500&h=500&v=202509051132",
        category: "passaro",
        productType: "material",
        badge: "Novo",
        unit: "kg",
        packageSize: 5
    },
    // MAIS ANIMAIS
    {
        id: 54,
        name: "Canário Belga",
        price: 85.00,
        pricePerKg: null,
        image: "https://www.petz.com.br/blog/wp-content/uploads/2024/05/tipos-de-canario-interna2.jpg",
        category: "passaro",
        productType: "animal",
        unit: "un",
        packageSize: 1
    },
    {
        id: 55,
        name: "Peixe Tetra Neon",
        price: 4.50,
        pricePerKg: null,
        image: "https://images.tcdn.com.br/img/img_prod/749804/tetra_neon_cardinal_1_a_3_cm_paracheirodon_axelrodi_913_1_fdf95d55f3a9e2695812dc4331475fef.jpg",
        category: "peixe",
        productType: "animal",
        unit: "un",
        packageSize: 1
    },
    {
        id: 56,
        name: "Peixe Guppy",
        price: 3.90,
        pricePerKg: null,
        image: "https://meusanimais.com.br/wp-content/uploads/2021/07/peixe-guppy-fundo.jpg",
        category: "peixe",
        productType: "animal",
        unit: "un",
        packageSize: 1
    },
    // MAIS COMPLEMENTOS
    {
        id: 57,
        name: "Petisco para Pássaros",
        price: 8.90,
        pricePerKg: null,
        image: "https://images.tcdn.com.br/img/img_prod/815630/snack_com_pimenta_little_foragers_125g_9527_1_420cbf7833081073ba907f69392f7ce5.jpg",
        category: "passaro",
        productType: "complemento",
        unit: "un",
        packageSize: 1
    },
    {
        id: 58,
        name: "Ração Úmida para Cães",
        price: 4.90,
        pricePerKg: null,
        image: "https://www.petlove.com.br/images/products/268450/product/31027524432_Ra%C3%A7%C3%A3o_%C3%9Amida_Champ_Sach%C3%AA_Sabor_Caseiro_Carne_para_C%C3%A3es_Adultos.jpg?1683634883",
        category: "cachorro",
        productType: "complemento",
        unit: "un",
        packageSize: 1
    },
    {
        id: 59,
        name: "Biscoito para Gatos",
        price: 11.50,
        pricePerKg: null,
        image: "https://b2b.padariapet.com.br/wp-content/uploads/2021/01/WhatsApp-Image-2021-09-21-at-08.33.49-2.jpeg",
        category: "gato",
        productType: "complemento",
        unit: "un",
        packageSize: 1
    }
    ];
}

// Dados dos produtos
const products = loadProducts();

// Função para carregar carrinho do localStorage
function loadCart() {
    const stored = localStorage.getItem('petweb_cart');
    if (stored) {
        try {
            return JSON.parse(stored);
        } catch (e) {
            console.error('Erro ao carregar carrinho do localStorage:', e);
            return [];
        }
    }
    return [];
}

// Função para salvar carrinho no localStorage
function saveCart() {
    try {
        localStorage.setItem('petweb_cart', JSON.stringify(cart));
    } catch (e) {
        console.error('Erro ao salvar carrinho no localStorage:', e);
    }
}

// Estado do carrinho - carrega do localStorage
let cart = loadCart();
let currentProductType = "all";
let currentAnimalType = "all";
let currentSearch = "";

// Elementos DOM
const productsGrid = document.getElementById('products-grid');
const cartSidebar = document.getElementById('cart-sidebar');
const closeCart = document.getElementById('close-cart');
const overlay = document.getElementById('overlay');
const cartItems = document.getElementById('cart-items');
const cartTotal = document.getElementById('cart-total');
const cartCountMobile = document.getElementById('cart-count-mobile');
const headerCartBtn = document.getElementById('header-cart-btn');
const headerCartCount = document.getElementById('header-cart-count');
const filterButtons = document.querySelectorAll('.filter-btn');
const notification = document.getElementById('notification');
const mobileCart = document.getElementById('mobile-cart');
const mobileMenuItems = document.querySelectorAll('.mobile-menu-item');
const searchInput = document.getElementById('search-input');
const searchResultsCount = document.getElementById('search-results-count');
const noResults = document.getElementById('no-results');
const checkoutBtn = document.getElementById('checkout-btn');
const checkoutModal = document.getElementById('checkout-modal');
const closeCheckout = document.getElementById('close-checkout');
const cancelCheckout = document.getElementById('cancel-checkout');
const checkoutForm = document.getElementById('checkout-form');
const checkoutSummary = document.getElementById('checkout-summary');
const addressSection = document.getElementById('address-section');
const deliveryTypeInputs = document.querySelectorAll('input[name="delivery-type"]');

// Elementos do modal
const quantityModal = document.getElementById('quantity-modal');
const closeModal = document.getElementById('close-modal');
const modalProductName = document.getElementById('modal-product-name');
const optionKg = document.getElementById('option-kg');
const optionValue = document.getElementById('option-value');
const quantityInput = document.getElementById('quantity-input');
const quantityUnit = document.getElementById('quantity-unit');
const modalTotalPrice = document.getElementById('modal-total-price');
const addToCartModal = document.getElementById('add-to-cart-modal');

// Elementos do modal de busca
const searchModal = document.getElementById('search-modal');
const closeSearchModal = document.getElementById('close-search-modal');
const searchModalInput = document.getElementById('search-modal-input');
const searchModalResults = document.getElementById('search-modal-results');

// Função para formatar número com casas decimais (comportamento monetário)
function formatDecimal(value) {
    // Remove tudo que não é número
    let cleaned = value.replace(/\D/g, '');
    
    // Se não há números, retorna string vazia
    if (cleaned === '') {
        return '';
    }
    
    // Converte para número inteiro (trata como centavos/centésimos)
    let number = parseInt(cleaned, 10);
    
    // Divide por 100 para obter o valor real com 2 casas decimais
    let decimalValue = number / 100;
    
    // Formata com 2 casas decimais e vírgula como separador
    return decimalValue.toFixed(2).replace('.', ',');
}

// Função para converter string formatada para número
function parseFormattedDecimal(value) {
    if (!value || value === '') return 0;
    
    // Substitui vírgula por ponto
    let numericString = value.replace(',', '.');
    
    // Converte para número
    return parseFloat(numericString) || 0;
}

// Inicializar a vitrine
function initStore() {
    updateStoreStatus(); // Atualiza status de funcionamento
    renderProducts();
    setupEventListeners();
    // Carrega o carrinho do localStorage e atualiza a interface
    cart = loadCart();
    updateCart();
    setupScrollObserver();
    
    // Atualiza o status a cada minuto
    setInterval(updateStoreStatus, 60000);
}

// Observador de scroll para menu ativo
function setupScrollObserver() {
    const sections = document.querySelectorAll('section, .container, footer');
    const menuItems = document.querySelectorAll('.mobile-menu-item');
    
    const observerOptions = {
        root: null,
        rootMargin: '-50% 0px -50% 0px',
        threshold: 0
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const sectionId = entry.target.id;
                
                // Remove classe active de todos os itens
                menuItems.forEach(item => {
                    item.classList.remove('active');
                });
                
                // Adiciona classe active ao item correspondente
                const activeItem = document.querySelector(`.mobile-menu-item[data-section="${sectionId}"]`);
                if (activeItem) {
                    activeItem.classList.add('active');
                }
            }
        });
    }, observerOptions);
    
    sections.forEach(section => {
        if (section.id) {
            observer.observe(section);
        }
    });
}

// Função para abrir modal de quantidade
function openQuantityModal(product) {
    currentProduct = product;
    
    // Se o produto não tem pricePerKg, usa quantidade unitária
    if (product.pricePerKg === null || product.pricePerKg === undefined) {
        currentQuantityType = 'un';
        currentQuantity = 1;
        
        // Esconde opções de kg e valor, mostra apenas quantidade
        optionKg.style.display = 'none';
        optionValue.style.display = 'none';
        quantityInput.value = '1';
        quantityInput.placeholder = '1';
        quantityUnit.textContent = 'unidade(s)';
    } else {
        // Mostra opções de kg e valor
        optionKg.style.display = 'flex';
        optionValue.style.display = 'flex';
        currentQuantityType = 'kg';
        currentQuantity = 0;
        quantityInput.value = '';
        quantityInput.placeholder = '0,00';
        quantityUnit.textContent = 'kg';
        
        // Seleciona opção por kg
        optionKg.classList.add('selected');
        optionValue.classList.remove('selected');
    }
    
    // Atualiza informações do modal
    modalProductName.textContent = product.name;
    
    // Atualiza preço total
    updateModalTotalPrice();
    
    // Habilita/desabilita o botão baseado na quantidade
    addToCartModal.disabled = currentQuantity <= 0;
    
    // Abre o modal
    quantityModal.classList.add('active');
    
    // Foca no input
    setTimeout(() => {
        quantityInput.focus();
    }, 300);
}

// Função para atualizar preço total no modal
function updateModalTotalPrice() {
    if (!currentProduct) return;
    
    let totalPrice = 0;
    
    if (currentQuantityType === 'un') {
        // Calcula por unidade (produtos sem pricePerKg)
        totalPrice = currentProduct.price * currentQuantity;
    } else if (currentQuantityType === 'kg') {
        // Calcula pelo peso
        totalPrice = currentProduct.pricePerKg * currentQuantity;
    } else {
        // Calcula pelo valor
        totalPrice = currentQuantity;
    }
    
    modalTotalPrice.textContent = `R$ ${totalPrice.toFixed(2).replace('.', ',')}`;
    
    // Habilita/desabilita o botão baseado na quantidade
    addToCartModal.disabled = currentQuantity <= 0;
}

// Função para adicionar produto diretamente ao carrinho (sem modal)
function addProductDirectlyToCart(product) {
    if (!product) return;
    
    // Para produtos que não são ração, adiciona com quantidade 1
    const quantity = 1;
    const quantityType = 'un';
    const price = product.price;
    
    const existingItemIndex = cart.findIndex(item => 
        item.id === product.id && 
        item.quantityType === quantityType &&
        item.customQuantity === quantity
    );
    
    if (existingItemIndex !== -1) {
        // Atualiza quantidade se o item já existe
        cart[existingItemIndex].quantity += quantity;
    } else {
        // Adiciona novo item
        cart.push({
            id: product.id,
            name: product.name,
            price: price,
            originalPrice: product.price,
            image: product.image,
            quantity: quantity,
            quantityType: quantityType,
            customQuantity: quantity,
            unit: 'un'
        });
    }
    
    updateCart();
    showNotification();
}

// Função para adicionar produto ao carrinho com quantidade
function addToCartWithQuantity() {
    if (!currentProduct) return;
    
    // Verifica se a quantidade é válida
    if (currentQuantity <= 0) {
        alert("Por favor, insira uma quantidade válida maior que zero.");
        return;
    }
    
    let unit = currentQuantityType;
    let price = 0;
    let quantity = 1; // Sempre adiciona 1 unidade/seleção ao carrinho
    
    if (currentQuantityType === 'un') {
        // Calcula preço por unidade (produtos sem pricePerKg)
        quantity = currentQuantity; // Para produtos por unidade, quantity é a quantidade real
        price = currentProduct.price * quantity;
    } else if (currentQuantityType === 'kg') {
        // Calcula preço baseado no peso × quantidade de seleções
        // quantity sempre é 1 (uma seleção), customQuantity é o peso em kg
        price = currentProduct.pricePerKg * currentQuantity * quantity;
    } else {
        // Usa o valor diretamente × quantidade de seleções
        unit = 'valor';
        // quantity sempre é 1 (uma seleção), customQuantity é o valor em R$
        price = currentQuantity * quantity;
    }
    
    const existingItemIndex = cart.findIndex(item => 
        item.id === currentProduct.id && 
        item.quantityType === currentQuantityType &&
        item.customQuantity === currentQuantity
    );
    
    if (existingItemIndex !== -1) {
        // Atualiza quantidade de seleções se o item já existe (sempre incrementa em 1)
        cart[existingItemIndex].quantity += 1;
        // Recalcula o preço total
        if (currentQuantityType === 'un') {
            cart[existingItemIndex].price = currentProduct.price * cart[existingItemIndex].quantity;
        } else if (currentQuantityType === 'kg') {
            cart[existingItemIndex].price = currentProduct.pricePerKg * cart[existingItemIndex].customQuantity * cart[existingItemIndex].quantity;
        } else {
            cart[existingItemIndex].price = cart[existingItemIndex].customQuantity * cart[existingItemIndex].quantity;
        }
    } else {
        // Adiciona novo item
        cart.push({
            id: currentProduct.id,
            name: currentProduct.name,
            price: price,
            originalPrice: currentProduct.price,
            image: currentProduct.image,
            quantity: quantity, // Quantidade de seleções/unidades
            quantityType: currentQuantityType,
            customQuantity: currentQuantity, // Peso em kg ou valor em R$ ou quantidade para produtos por unidade
            unit: unit
        });
    }
    
    updateCart();
    showNotification();
    closeQuantityModal();
}

// Função para fechar modal de quantidade
function closeQuantityModal() {
    quantityModal.classList.remove('active');
    currentProduct = null;
}

// Função para filtrar e buscar produtos
function getFilteredProducts() {
    let filteredProducts = products;
    
    // Filtra por tipo de produto
    if (currentProductType !== 'all') {
        filteredProducts = filteredProducts.filter(product => 
            product.productType === currentProductType
        );
    }
    
    // Filtra por tipo de animal
    if (currentAnimalType !== 'all') {
        filteredProducts = filteredProducts.filter(product => 
            product.category === currentAnimalType
        );
    }
    
    // Aplica a busca se houver texto de pesquisa
    if (currentSearch.trim() !== '') {
        const searchTerm = currentSearch.toLowerCase().trim();
        filteredProducts = filteredProducts.filter(product => 
            product.name.toLowerCase().includes(searchTerm) ||
            product.category.toLowerCase().includes(searchTerm) ||
            (product.productType && product.productType.toLowerCase().includes(searchTerm))
        );
    }
    
    return filteredProducts;
}

// Renderizar produtos
function renderProducts() {
    productsGrid.innerHTML = '';
    
    const filteredProducts = getFilteredProducts();
    
    // Atualiza contador de resultados
    updateResultsCount(filteredProducts.length);
    
    // Mostra mensagem se não houver resultados
    if (filteredProducts.length === 0) {
        noResults.style.display = 'block';
        return;
    } else {
        noResults.style.display = 'none';
    }
    
    filteredProducts.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.setAttribute('data-id', product.id);
        
        let badgeHTML = '';
        if (product.badge) {
            badgeHTML = `<div class="product-badge">${product.badge}</div>`;
        }
        
        productCard.innerHTML = `
            ${badgeHTML}
            <div class="add-indicator">
                <i class="fas fa-plus"></i>
            </div>
            <div class="product-image-container">
                <img src="${product.image}" alt="${product.name}" class="product-image" onerror="this.src='data:image/svg+xml;charset=UTF-8,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22200%22 height=%22200%22 viewBox=%220 0 200 200%22%3E%3Crect fill=%22%23f8f9fa%22 width=%22200%22 height=%22200%22/%3E%3Ctext fill=%22%236c757d%22 font-family=%22Arial%22 font-size=%2218%22 text-anchor=%22middle%22 x=%22100%22 y=%22110%22%3EImagem não disponível%3C/text%3E%3C/svg%3E'">
            </div>
            <div class="product-info">
                <div class="product-category">${product.category}</div>
                <div class="product-name">${product.name}</div>
                <div class="product-unit">${product.pricePerKg ? `Pacote ${product.packageSize} ${product.unit} • R$ ${product.pricePerKg.toFixed(2).replace('.', ',')}/${product.unit}` : `${product.unit === 'un' ? 'Unidade' : `${product.packageSize} ${product.unit}`}`}</div>
                <div class="product-price">R$ ${product.price.toFixed(2).replace('.', ',')}</div>
            </div>
        `;
        productsGrid.appendChild(productCard);
    });
    
    // Adicionar eventos aos cards de produto
    document.querySelectorAll('.product-card').forEach(card => {
        card.addEventListener('click', (e) => {
            // Evitar que o clique no carrinho abra o produto
            if (e.target.closest('.add-indicator')) return;
            
            const productId = parseInt(card.getAttribute('data-id'));
            const product = products.find(p => p.id === productId);
            
            // Se for ração, abre o modal. Caso contrário, adiciona diretamente ao carrinho
            if (product.productType === 'racao') {
                openQuantityModal(product);
            } else {
                addProductDirectlyToCart(product);
            }
        });
    });
}

// Atualizar contador de resultados
function updateResultsCount(count) {
    const totalProducts = products.length;
    const hasProductFilter = currentProductType !== 'all';
    const hasAnimalFilter = currentAnimalType !== 'all';
    const hasSearch = currentSearch.trim() !== '';
    
    let filterText = '';
    if (hasProductFilter && hasAnimalFilter) {
        const productTypeNames = {
            'racao': 'Rações',
            'higiene': 'Higiene',
            'medicamento': 'Medicamentos',
            'acessorio': 'Acessórios',
            'gaiola': 'Gaiolas/Aquários',
            'animal': 'Animais',
            'complemento': 'Complementos',
            'material': 'Materiais'
        };
        const animalTypeNames = {
            'cachorro': 'Cachorro',
            'gato': 'Gato',
            'passaro': 'Pássaro',
            'peixe': 'Peixe'
        };
        filterText = ` (${productTypeNames[currentProductType]} + ${animalTypeNames[currentAnimalType]})`;
    } else if (hasProductFilter) {
        const productTypeNames = {
            'racao': 'Rações',
            'higiene': 'Higiene',
            'medicamento': 'Medicamentos',
            'acessorio': 'Acessórios',
            'gaiola': 'Gaiolas/Aquários',
            'animal': 'Animais',
            'complemento': 'Complementos',
            'material': 'Materiais'
        };
        filterText = ` (${productTypeNames[currentProductType]})`;
    } else if (hasAnimalFilter) {
        const animalTypeNames = {
            'cachorro': 'Cachorro',
            'gato': 'Gato',
            'passaro': 'Pássaro',
            'peixe': 'Peixe'
        };
        filterText = ` (${animalTypeNames[currentAnimalType]})`;
    }
    
    if (!hasSearch && !hasProductFilter && !hasAnimalFilter) {
        searchResultsCount.textContent = `${count} produtos disponíveis`;
    } else if (!hasSearch) {
        searchResultsCount.textContent = `${count} produtos encontrados${filterText}`;
    } else if (!hasProductFilter && !hasAnimalFilter) {
        searchResultsCount.textContent = `${count} produtos encontrados para "${currentSearch}"`;
    } else {
        searchResultsCount.textContent = `${count} produtos encontrados para "${currentSearch}"${filterText}`;
    }
}

// Configurar event listeners
function setupEventListeners() {
    // Abrir/fechar carrinho
    if (mobileCart) {
        mobileCart.addEventListener('click', openCart);
    }
    if (headerCartBtn) {
        headerCartBtn.addEventListener('click', openCart);
    }
    closeCart.addEventListener('click', closeCartSidebar);
    overlay.addEventListener('click', closeCartSidebar);
    
    // Checkout
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', openCheckout);
    }
    if (closeCheckout) {
        closeCheckout.addEventListener('click', closeCheckoutModal);
    }
    if (cancelCheckout) {
        cancelCheckout.addEventListener('click', closeCheckoutModal);
    }
    if (checkoutModal) {
        checkoutModal.addEventListener('click', (e) => {
            if (e.target === checkoutModal) {
                closeCheckoutModal();
            }
        });
    }
    
    // Toggle endereço baseado no tipo de entrega
    if (deliveryTypeInputs.length > 0) {
        deliveryTypeInputs.forEach(input => {
            input.addEventListener('change', toggleAddressSection);
        });
    }
    
    // Formatação de CEP
    const cepInput = document.getElementById('address-cep');
    if (cepInput) {
        cepInput.addEventListener('input', formatCEP);
    }
    
    // Submissão do formulário
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', handleCheckoutSubmit);
    }
    
    // Fechar modal
    closeModal.addEventListener('click', closeQuantityModal);
    quantityModal.addEventListener('click', (e) => {
        if (e.target === quantityModal) {
            closeQuantityModal();
        }
    });
    
    // Eventos do modal de quantidade
    optionKg.addEventListener('click', () => {
        currentQuantityType = 'kg';
        optionKg.classList.add('selected');
        optionValue.classList.remove('selected');
        quantityUnit.textContent = 'kg';
        quantityInput.value = '';
        quantityInput.placeholder = '0,00';
        currentQuantity = 0;
        updateModalTotalPrice();
    });
    
    optionValue.addEventListener('click', () => {
        currentQuantityType = 'value';
        optionValue.classList.add('selected');
        optionKg.classList.remove('selected');
        quantityUnit.textContent = 'R$';
        quantityInput.value = '';
        quantityInput.placeholder = '0,00';
        currentQuantity = 0;
        updateModalTotalPrice();
    });
    
    quantityInput.addEventListener('input', (e) => {
        let value = e.target.value;
        
        // Se for produto por unidade (sem pricePerKg), aceita apenas números inteiros
        if (currentQuantityType === 'un') {
            // Remove tudo que não é número
            value = value.replace(/\D/g, '');
            if (value === '') {
                value = '1'; // Mínimo 1 unidade
            }
            e.target.value = value;
            currentQuantity = parseInt(value, 10) || 1;
        } else {
            // Para produtos com pricePerKg, usa formatação decimal
            if (value !== '') {
                const formatted = formatDecimal(value);
                if (formatted !== '') {
                    e.target.value = formatted;
                    currentQuantity = parseFormattedDecimal(formatted);
                    
                    // Ajusta a posição do cursor após a formatação
                    const newCursorPosition = formatted.length;
                    e.target.setSelectionRange(newCursorPosition, newCursorPosition);
                } else {
                    e.target.value = '';
                    currentQuantity = 0;
                }
            } else {
                currentQuantity = 0;
            }
        }
        
        updateModalTotalPrice();
    });
    
    // Permite apenas números e teclas de controle
    quantityInput.addEventListener('keydown', (e) => {
        // Permite: backspace, delete, tab, escape, enter
        if ([46, 8, 9, 27, 13].includes(e.keyCode) ||
            // Permite: Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
            (e.keyCode === 65 && e.ctrlKey === true) ||
            (e.keyCode === 67 && e.ctrlKey === true) ||
            (e.keyCode === 86 && e.ctrlKey === true) ||
            (e.keyCode === 88 && e.ctrlKey === true) ||
            // Permite: home, end, left, right
            (e.keyCode >= 35 && e.keyCode <= 39)) {
            return;
        }
        
        // Impede que não seja um número (não permite vírgula ou ponto, pois a formatação é automática)
        if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
            e.preventDefault();
        }
    });
    
    addToCartModal.addEventListener('click', addToCartWithQuantity);
    
    // Botão de reset dos filtros
    const resetFiltersBtn = document.getElementById('reset-filters');
    if (resetFiltersBtn) {
        resetFiltersBtn.addEventListener('click', () => {
            // Reseta os filtros
            currentProductType = 'all';
            currentAnimalType = 'all';
            
            // Remove active de todos os botões
            document.querySelectorAll('.filter-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            
            // Renderizar produtos sem filtros
            renderProducts();
        });
    }
    
    // Filtros
    filterButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            // Verifica se o clique foi no ícone ou no span dentro do botão
            const buttonElement = e.target.closest('.filter-btn');
            if (!buttonElement) return;
            
            const filterType = buttonElement.getAttribute('data-filter-type');
            
            if (filterType === 'product') {
                // Filtro por tipo de produto
                const productType = buttonElement.getAttribute('data-product-type');
                
                // Remove active de todos os botões de tipo de produto
                document.querySelectorAll('[data-filter-type="product"]').forEach(btn => {
                    btn.classList.remove('active');
                });
                
                // Adiciona active ao botão clicado
                buttonElement.classList.add('active');
                
                // Atualiza filtro
                currentProductType = productType;
            } else if (filterType === 'animal') {
                // Filtro por tipo de animal
                const animalType = buttonElement.getAttribute('data-animal-type');
                
                // Remove active de todos os botões de tipo de animal
                document.querySelectorAll('[data-filter-type="animal"]').forEach(btn => {
                    btn.classList.remove('active');
                });
                
                // Adiciona active ao botão clicado
                buttonElement.classList.add('active');
                
                // Atualiza filtro
                currentAnimalType = animalType;
            }
            
            // Renderizar produtos com os novos filtros
            renderProducts();
        });
    });
    
    // Busca
    searchInput.addEventListener('input', (e) => {
        currentSearch = e.target.value;
        renderProducts();
    });
    
    // Menu mobile - navegação suave
    mobileMenuItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const targetSection = item.getAttribute('data-section');
            
            if (targetSection === 'cart') {
                openCart();
            } else if (targetSection === 'search') {
                openSearchModal();
            } else {
                const targetElement = document.getElementById(targetSection);
                if (targetElement) {
                    targetElement.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    });
    
    // Modal de busca
    if (closeSearchModal) {
        closeSearchModal.addEventListener('click', closeSearchModalFunc);
    }
    
    if (searchModal) {
        searchModal.addEventListener('click', (e) => {
            if (e.target === searchModal) {
                closeSearchModalFunc();
            }
        });
    }
    
    // Busca no modal
    if (searchModalInput) {
        searchModalInput.addEventListener('input', (e) => {
            performSearchModal(e.target.value);
        });
        
        // Focar no input quando o modal abrir
        searchModalInput.addEventListener('focus', () => {
            searchModalInput.select();
        });
    }
}

// Abrir modal de busca
function openSearchModal() {
    if (searchModal) {
        searchModal.classList.add('active');
        document.body.style.overflow = 'hidden';
        // Foca no input após a animação
        setTimeout(() => {
            if (searchModalInput) {
                searchModalInput.focus();
            }
        }, 300);
    }
}

// Fechar modal de busca
function closeSearchModalFunc() {
    if (searchModal) {
        searchModal.classList.remove('active');
        document.body.style.overflow = 'auto';
        // Limpa o input e resultados
        if (searchModalInput) {
            searchModalInput.value = '';
        }
        if (searchModalResults) {
            searchModalResults.innerHTML = '';
        }
    }
}

// Realizar busca no modal
function performSearchModal(searchTerm) {
    if (!searchModalResults) return;
    
    const term = searchTerm.toLowerCase().trim();
    
    // Se não há termo de busca, limpa os resultados
    if (term === '') {
        searchModalResults.innerHTML = '';
        return;
    }
    
    // Filtra produtos pelo termo de busca
    const filteredProducts = products.filter(product => 
        product.name.toLowerCase().includes(term) ||
        product.category.toLowerCase().includes(term) ||
        (product.productType && product.productType.toLowerCase().includes(term))
    );
    
    // Limpa resultados anteriores
    searchModalResults.innerHTML = '';
    
    // Se não há resultados
    if (filteredProducts.length === 0) {
        searchModalResults.innerHTML = `
            <div class="search-result-empty">
                <i class="fas fa-search"></i>
                <h4>Nenhum produto encontrado</h4>
                <p>Tente buscar com outros termos</p>
            </div>
        `;
        return;
    }
    
    // Mostra resultados (limitado a 10 para performance)
    const resultsToShow = filteredProducts.slice(0, 10);
    
    resultsToShow.forEach(product => {
        const resultItem = document.createElement('div');
        resultItem.className = 'search-result-item';
        resultItem.innerHTML = `
            <img src="${product.image}" alt="${product.name}" class="search-result-item-image" onerror="this.src='data:image/svg+xml;charset=UTF-8,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22%3E%3Crect fill=%22%23f8f9fa%22 width=%2260%22 height=%2260%22/%3E%3Ctext fill=%22%236c757d%22 font-family=%22Arial%22 font-size=%2210%22 text-anchor=%22middle%22 x=%2230%22 y=%2235%22%3ESem imagem%3C/text%3E%3C/svg%3E'">
            <div class="search-result-item-info">
                <div class="search-result-item-name">${product.name}</div>
                <div class="search-result-item-price">R$ ${product.price.toFixed(2).replace('.', ',')}</div>
            </div>
        `;
        
        // Adiciona evento de clique para adicionar ao carrinho ou abrir modal
        resultItem.addEventListener('click', () => {
            if (product.productType === 'racao') {
                closeSearchModalFunc();
                openQuantityModal(product);
            } else {
                addProductDirectlyToCart(product);
                closeSearchModalFunc();
            }
        });
        
        searchModalResults.appendChild(resultItem);
    });
    
    // Se há mais resultados, mostra mensagem
    if (filteredProducts.length > 10) {
        const moreResults = document.createElement('div');
        moreResults.className = 'search-result-empty';
        moreResults.style.padding = '15px';
        moreResults.innerHTML = `<p style="color: var(--gray); font-size: 0.9rem;">E mais ${filteredProducts.length - 10} produtos encontrados. Use os filtros para refinar sua busca.</p>`;
        searchModalResults.appendChild(moreResults);
    }
}

// Abrir carrinho
function openCart() {
    cartSidebar.classList.add('active');
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Fechar carrinho
function closeCartSidebar() {
    cartSidebar.classList.remove('active');
    overlay.classList.remove('active');
    document.body.style.overflow = 'auto';
}

// Mostrar notificação
function showNotification() {
    notification.classList.add('show');
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

// REMOVER ITEM DO CARRINHO - FUNÇÃO CORRIGIDA
function removeFromCart(productId, quantityType, customQuantity) {
    cart = cart.filter(item => 
        !(item.id === productId && 
          item.quantityType === quantityType &&
          item.customQuantity === customQuantity)
    );
    updateCart();
}

// ATUALIZAR QUANTIDADE - FUNÇÃO CORRIGIDA
function updateQuantity(productId, quantityType, customQuantity, newQuantity) {
    if (newQuantity < 1) {
        removeFromCart(productId, quantityType, customQuantity);
        return;
    }
    
    const item = cart.find(item => 
        item.id === productId && 
        item.quantityType === quantityType &&
        item.customQuantity === customQuantity
    );
    
    if (item) {
        item.quantity = newQuantity;
        // Recalcular preço baseado no tipo
        const product = products.find(p => p.id === productId);
        if (quantityType === 'un') {
            item.price = product.price * newQuantity;
        } else if (quantityType === 'kg') {
            item.price = product.pricePerKg * item.customQuantity * newQuantity;
        } else {
            // Por valor
            item.price = item.customQuantity * newQuantity;
        }
        updateCart();
    }
}

// Atualizar carrinho
function updateCart() {
    // Salva o carrinho no localStorage sempre que for atualizado
    saveCart();
    // Atualizar contador do carrinho mobile
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    if (cartCountMobile) {
        cartCountMobile.textContent = totalItems;
    }
    
    // Atualizar contador do carrinho do header (desktop)
    if (headerCartCount) {
        headerCartCount.textContent = totalItems;
        if (totalItems > 0) {
            headerCartCount.style.display = 'flex';
        } else {
            headerCartCount.style.display = 'none';
        }
    }
    
    // Atualizar cor do ícone do carrinho mobile
    if (mobileCart) {
        if (totalItems > 0) {
            mobileCart.classList.add('has-items');
        } else {
            mobileCart.classList.remove('has-items');
        }
    }
    
    // Atualizar itens do carrinho
    cartItems.innerHTML = '';
    
    if (cart.length === 0) {
        cartItems.innerHTML = `
            <div style="text-align: center; padding: 40px 20px;">
                <i class="fas fa-shopping-cart" style="font-size: 3rem; color: var(--gray-light); margin-bottom: 15px;"></i>
                <p style="color: var(--gray);">Seu carrinho está vazio</p>
            </div>
        `;
        cartTotal.textContent = 'R$ 0,00';
        return;
    }
    
    let total = 0;
    
    cart.forEach(item => {
        // O item.price já contém o preço total (peso × quantidade de seleções ou valor × quantidade)
        total += item.price;
        
        // Formata a exibição da quantidade/peso/valor
        let quantityDisplay = '';
        if (item.quantityType === 'kg') {
            quantityDisplay = `${item.customQuantity.toFixed(2).replace('.', ',')} kg`;
        } else if (item.quantityType === 'value') {
            quantityDisplay = `R$ ${item.customQuantity.toFixed(2).replace('.', ',')}`;
        } else {
            // Produtos por unidade
            quantityDisplay = `${item.customQuantity} un`;
        }
        
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <img src="${item.image}" alt="${item.name}" class="cart-item-image" onerror="this.src='data:image/svg+xml;charset=UTF-8,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%2280%22 height=%2280%22 viewBox=%220 0 80 80%22%3E%3Crect fill=%22%23f8f9fa%22 width=%2280%22 height=%2280%22/%3E%3Ctext fill=%22%236c757d%22 font-family=%22Arial%22 font-size=%2212%22 text-anchor=%22middle%22 x=%2240%22 y=%2245%22%3ESem imagem%3C/text%3E%3C/svg%3E'">
            <div class="cart-item-details">
                <div class="cart-item-info">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-quantity-display">${quantityDisplay} × ${item.quantity}</div>
                    <div class="cart-item-price">R$ ${item.price.toFixed(2).replace('.', ',')}</div>
                    <div class="cart-item-quantity">
                        <button class="quantity-btn decrease" data-id="${item.id}" data-type="${item.quantityType}" data-custom="${item.customQuantity}">-</button>
                        <span class="quantity">${item.quantity}</span>
                        <button class="quantity-btn increase" data-id="${item.id}" data-type="${item.quantityType}" data-custom="${item.customQuantity}">+</button>
                    </div>
                </div>
                <button class="remove-item" data-id="${item.id}" data-type="${item.quantityType}" data-custom="${item.customQuantity}" title="Remover">
                    <i class="bi bi-trash"></i>
                </button>
            </div>
        `;
        cartItems.appendChild(cartItem);
    });
    
    // Atualizar total
    cartTotal.textContent = `R$ ${total.toFixed(2).replace('.', ',')}`;
    
    // Adicionar eventos aos botões de quantidade e remover - VERSÃO CORRIGIDA
    document.querySelectorAll('.decrease').forEach(button => {
        button.addEventListener('click', (e) => {
            const productId = parseInt(button.getAttribute('data-id'));
            const quantityType = button.getAttribute('data-type');
            const customQuantity = parseFloat(button.getAttribute('data-custom'));
            const item = cart.find(item => 
                item.id === productId && 
                item.quantityType === quantityType &&
                item.customQuantity === customQuantity
            );
            if (item) {
                updateQuantity(productId, quantityType, customQuantity, item.quantity - 1);
            }
        });
    });
    
    document.querySelectorAll('.increase').forEach(button => {
        button.addEventListener('click', (e) => {
            const productId = parseInt(button.getAttribute('data-id'));
            const quantityType = button.getAttribute('data-type');
            const customQuantity = parseFloat(button.getAttribute('data-custom'));
            const item = cart.find(item => 
                item.id === productId && 
                item.quantityType === quantityType &&
                item.customQuantity === customQuantity
            );
            if (item) {
                updateQuantity(productId, quantityType, customQuantity, item.quantity + 1);
            }
        });
    });
    
    // EVENTOS DO BOTÃO REMOVER - VERSÃO CORRIGIDA
    document.querySelectorAll('.remove-item').forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            const productId = parseInt(button.getAttribute('data-id'));
            const quantityType = button.getAttribute('data-type');
            const customQuantity = parseFloat(button.getAttribute('data-custom'));
            
            removeFromCart(productId, quantityType, customQuantity);
        });
    });
}

// Abrir checkout
function openCheckout() {
    if (cart.length === 0) {
        alert('Seu carrinho está vazio!');
        return;
    }
    
    closeCartSidebar();
    updateCheckoutSummary();
    if (checkoutModal) {
        checkoutModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

// Fechar checkout
function closeCheckoutModal() {
    if (checkoutModal) {
        checkoutModal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
}

// Toggle seção de endereço
function toggleAddressSection() {
    const selectedDelivery = document.querySelector('input[name="delivery-type"]:checked');
    if (!selectedDelivery || !addressSection) return;
    
    const deliveryType = selectedDelivery.value;
    if (deliveryType === 'delivery') {
        addressSection.style.display = 'block';
        // Tornar campos obrigatórios
        const requiredInputs = addressSection.querySelectorAll('#address-cep, #address-street, #address-number, #address-neighborhood, #address-city, #address-state');
        requiredInputs.forEach(input => input.required = true);
    } else {
        addressSection.style.display = 'none';
        // Remover obrigatoriedade
        const addressInputs = addressSection.querySelectorAll('input');
        addressInputs.forEach(input => input.required = false);
    }
}

// Formatar CEP
function formatCEP(e) {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 5) {
        value = value.substring(0, 5) + '-' + value.substring(5, 8);
    }
    e.target.value = value;
}

// Atualizar resumo do checkout
function updateCheckoutSummary() {
    if (!checkoutSummary) return;
    
    let total = 0;
    let summaryHTML = '';
    
    cart.forEach(item => {
        const itemTotal = item.price;
        total += itemTotal;
        
        let quantityDisplay = '';
        if (item.quantityType === 'kg') {
            quantityDisplay = `${item.customQuantity.toFixed(2).replace('.', ',')} kg`;
        } else if (item.quantityType === 'value') {
            quantityDisplay = `R$ ${item.customQuantity.toFixed(2).replace('.', ',')}`;
        } else {
            quantityDisplay = `${item.customQuantity} un`;
        }
        
        summaryHTML += `
            <div class="checkout-summary-item">
                <div>
                    <div class="checkout-summary-item-name">${item.name}</div>
                    <div style="font-size: 0.85rem; color: var(--gray);">${quantityDisplay} × ${item.quantity}</div>
                </div>
                <div class="checkout-summary-item-value">R$ ${itemTotal.toFixed(2).replace('.', ',')}</div>
            </div>
        `;
    });
    
    summaryHTML += `
        <div class="checkout-summary-total">
            <span>Total:</span>
            <span>R$ ${total.toFixed(2).replace('.', ',')}</span>
        </div>
    `;
    
    checkoutSummary.innerHTML = summaryHTML;
}

// Processar envio do checkout
function handleCheckoutSubmit(e) {
    e.preventDefault();
    
    if (cart.length === 0) {
        alert('Seu carrinho está vazio!');
        return;
    }
    
    // Coletar dados do formulário
    const formData = new FormData(checkoutForm);
    const deliveryType = formData.get('delivery-type');
    const paymentMethod = formData.get('payment-method');
    
    // Construir mensagem para WhatsApp
    let message = '*🛒 NOVO PEDIDO - PetDeluxe*\n\n';
    
    // Dados do cliente
    message += '*👤 DADOS DO CLIENTE*\n';
    message += `Nome: ${formData.get('customer-name')}\n`;
    message += `Telefone: ${formData.get('customer-phone')}\n`;
    if (formData.get('customer-email')) {
        message += `E-mail: ${formData.get('customer-email')}\n`;
    }
    message += '\n';
    
    // Tipo de entrega
    message += '*🚚 ENTREGA*\n';
    if (deliveryType === 'pickup') {
        message += 'Retirada no Local\n';
    } else {
        message += 'Entrega\n';
        message += `CEP: ${formData.get('address-cep')}\n`;
        message += `Endereço: ${formData.get('address-street')}, ${formData.get('address-number')}\n`;
        if (formData.get('address-complement')) {
            message += `Complemento: ${formData.get('address-complement')}\n`;
        }
        message += `Bairro: ${formData.get('address-neighborhood')}\n`;
        message += `Cidade: ${formData.get('address-city')} - ${formData.get('address-state')}\n`;
    }
    message += '\n';
    
    // Forma de pagamento
    message += '*💳 FORMA DE PAGAMENTO*\n';
    const paymentMethods = {
        'pix': 'PIX',
        'cash': 'Dinheiro',
        'card': 'Cartão'
    };
    message += `${paymentMethods[paymentMethod]}\n\n`;
    
    // Itens do pedido
    message += '*📦 ITENS DO PEDIDO*\n';
    let total = 0;
    cart.forEach((item, index) => {
        const itemTotal = item.price;
        total += itemTotal;
        
        let quantityDisplay = '';
        if (item.quantityType === 'kg') {
            quantityDisplay = `${item.customQuantity.toFixed(2).replace('.', ',')} kg`;
        } else if (item.quantityType === 'value') {
            quantityDisplay = `R$ ${item.customQuantity.toFixed(2).replace('.', ',')}`;
        } else {
            quantityDisplay = `${item.customQuantity} un`;
        }
        
        message += `${index + 1}. ${item.name}\n`;
        message += `   ${quantityDisplay} × ${item.quantity} = R$ ${itemTotal.toFixed(2).replace('.', ',')}\n`;
    });
    message += '\n';
    
    // Total
    message += `*💰 TOTAL: R$ ${total.toFixed(2).replace('.', ',')}*\n\n`;
    
    // Observações
    if (formData.get('order-notes')) {
        message += '*📝 OBSERVAÇÕES*\n';
        message += `${formData.get('order-notes')}\n\n`;
    }
    
    message += '---\n';
    message += `Data: ${new Date().toLocaleString('pt-BR')}\n`;
    
    // Codificar mensagem para URL
    const encodedMessage = encodeURIComponent(message);
    
    // Número do WhatsApp (extraído do link do hero ou usar padrão)
    // Formato: código do país + DDD + número (sem espaços ou caracteres especiais)
    let whatsappNumber = '5511999999999'; // Número padrão
    const whatsappLink = document.querySelector('a[href*="wa.me"]');
    if (whatsappLink) {
        const href = whatsappLink.getAttribute('href');
        const match = href.match(/wa\.me\/(\d+)/);
        if (match) {
            whatsappNumber = match[1];
        }
    }
    
    // Abrir WhatsApp
    const whatsappURL = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
    window.open(whatsappURL, '_blank');
    
    // Limpar carrinho
    cart = [];
    saveCart();
    
    // Fechar modal
    closeCheckoutModal();
    
    // Resetar formulário
    checkoutForm.reset();
    toggleAddressSection();
    
    // Atualizar a página após um pequeno delay para garantir que o WhatsApp abriu
    setTimeout(() => {
        window.location.reload();
    }, 500);
}

// Inicializar a loja quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', initStore);
