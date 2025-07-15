;(function(){
  'use strict';

  // ---------------------------------------------------
  // 1) “ESTÁTICAS” FORA DA “CLASSE”
  // ---------------------------------------------------
  var VERSION = '1.4.50@leonardoscapinello.com';

  // CSS padrão a injetar
  var defaultCSS = `
    .form-navigation { display: flex; gap: 8px; }
    .button-wrapper { flex: 1; }
    .fc-loading-overlay {
      position: absolute; inset: 0;
      display: none; justify-content: center; align-items: center;
      background-color: rgba(255,255,255,0.5);
    }
    .field-group { margin-bottom: 16px; }
    .field-group label {
      display: block; margin-bottom: 6px;
      font-weight: normal; font-size: 16px;
    }
    .fc-ddi-select {
      width: 180px; height: 52px; line-height: 52px;
      padding: 8px; border: 1px solid #ccc; border-radius: 4px;
      background: #fff;
    }
    .btn-enviar {
      background: rgb(1,113,228); border-radius: 8px;
      width: 100%; display: flex; justify-content: center; align-items: center;
      gap: 10px; padding: 16px 24px; border: none;
      color: #fff; font-size: 16px; cursor: pointer;
    }
    .fc-field {
      box-sizing: border-box; width: 100%;
      padding: 0 16px; border: 1px solid #ccc; border-radius: 4px;
      line-height: 52px; font-size: 16px; display: block;
    }
    .fc-phone-wrapper {
      display: flex; gap: 8px; align-items: center;
      width: 100%; margin-bottom: 16px;
    }
    .fc-phone-wrapper .fc-field { flex: 1 1 auto; }
    .fc-label { display: none !important; }
  `;

  // JSON completo de máscaras
  var defaultPhoneMasks = [
    { "code": "+7",   "country": "Rússia",                   "flag": "🇷🇺", "mask": "(000) 000-00-00" },
    { "code": "+7",   "country": "Cazaquistão",             "flag": "🇰🇿", "mask": "(000) 000-00-00" },
    { "code": "+60",  "country": "Malásia",                  "flag": "🇲🇾", "mask": "000-00000000" },
    { "code": "+61",  "country": "Austrália",                "flag": "🇦🇺", "mask": "(00) 0000 0000" },
    { "code": "+62",  "country": "Indonésia",                "flag": "🇮🇩", "mask": "0000-000-0000" },
    { "code": "+63",  "country": "Filipinas",                "flag": "🇵🇭", "mask": "000-000-0000" },
    { "code": "+64",  "country": "Nova Zelândia",            "flag": "🇳🇿", "mask": "00 0000 0000" },
    { "code": "+65",  "country": "Singapura",                "flag": "🇸🇬", "mask": "0000 0000" },
    { "code": "+66",  "country": "Tailândia",                "flag": "🇹🇭", "mask": "00-000-0000" },
    { "code": "+670", "country": "Timor-Leste",              "flag": "🇹🇱", "mask": "0000 0000" },
    { "code": "+672", "country": "Christmas Island",         "flag": "🇨🇽", "mask": "000 0000" },
    { "code": "+672", "country": "Cocos (Keeling) Islands",  "flag": "🇨🇨", "mask": "000 0000" },
    { "code": "+672", "country": "Norfolk Island",           "flag": "🇳🇫", "mask": "000 0000" },
    { "code": "+673", "country": "Brunei",                   "flag": "🇧🇳", "mask": "000-0000" },
    { "code": "+674", "country": "Nauru",                    "flag": "🇳🇷", "mask": "000-0000" },
    { "code": "+675", "country": "Papua-Nova Guiné",         "flag": "🇵🇬", "mask": "000 0000" },
    { "code": "+676", "country": "Tonga",                    "flag": "🇹🇴", "mask": "000 0000" },
    { "code": "+677", "country": "Ilhas Salomão",            "flag": "🇸🇧", "mask": "000 0000" },
    { "code": "+678", "country": "Vanuatu",                  "flag": "🇻🇺", "mask": "000 0000" },
    { "code": "+679", "country": "Fiji",                     "flag": "🇫🇯", "mask": "000 0000" },
    { "code": "+680", "country": "Palau",                    "flag": "🇵🇼", "mask": "000 0000" },
    { "code": "+681", "country": "Wallis e Futuna",          "flag": "🇼🇫", "mask": "0000 000" },
    { "code": "+682", "country": "Ilhas Cook",               "flag": "🇨🇰", "mask": "000 000" },
    { "code": "+683", "country": "Niue",                     "flag": "🇳🇺", "mask": "000 000" },
    { "code": "+685", "country": "Samoa",                    "flag": "🇼🇸", "mask": "0000 000" },
    { "code": "+686", "country": "Kiribati",                 "flag": "🇰🇮", "mask": "0000 000" },
    { "code": "+687", "country": "Nova Caledônia",           "flag": "🇳🇨", "mask": "0000 0000" },
    { "code": "+688", "country": "Tuvalu",                   "flag": "🇹🇻", "mask": "0000 000" },
    { "code": "+689", "country": "Polinésia Francesa",       "flag": "🇵🇫", "mask": "0000 0000" },
    { "code": "+690", "country": "Tokelau",                  "flag": "🇹🇰", "mask": "000 000" },
    { "code": "+691", "country": "Micronésia",               "flag": "🇫🇲", "mask": "000 000" },
    { "code": "+692", "country": "Ilhas Marshall",           "flag": "🇲🇭", "mask": "000 000" },
    { "code": "+81",  "country": "Japão",                    "flag": "🇯🇵", "mask": "00-0000-0000" },
    { "code": "+82",  "country": "Coreia do Sul",            "flag": "🇰🇷", "mask": "00-000-0000" },
    { "code": "+84",  "country": "Vietnã",                   "flag": "🇻🇳", "mask": "000 000 0000" },
    { "code": "+86",  "country": "China",                    "flag": "🇨🇳", "mask": "0000 0000 000" },
    { "code": "+850", "country": "Coreia do Norte",          "flag": "🇰🇵", "mask": "000 000 0000" },
    { "code": "+852", "country": "Hong Kong",                "flag": "🇭🇰", "mask": "0000 0000" },
    { "code": "+853", "country": "Macau",                    "flag": "🇲🇴", "mask": "0000 0000" },
    { "code": "+855", "country": "Camboja",                  "flag": "🇰🇭", "mask": "00 000 0000" },
    { "code": "+856", "country": "Laos",                     "flag": "🇱🇦", "mask": "0000 0000" },
    { "code": "+880", "country": "Bangladesh",               "flag": "🇧🇩", "mask": "000 000 0000" },
    { "code": "+886", "country": "Taiwan",                   "flag": "🇹🇼", "mask": "0000-000-000" },
    { "code": "+90",  "country": "Turquia",                  "flag": "🇹🇷", "mask": "000 000 0000" },
    { "code": "+91",  "country": "Índia",                    "flag": "🇮🇳", "mask": "00000 00000" },
    { "code": "+92",  "country": "Paquistão",                "flag": "🇵🇰", "mask": "0000-0000000" },
    { "code": "+93",  "country": "Afeganistão",              "flag": "🇦🇫", "mask": "00 000 0000" },
    { "code": "+94",  "country": "Sri Lanka",                "flag": "🇱🇰", "mask": "00 000 0000" },
    { "code": "+95",  "country": "Mianmar",                  "flag": "🇲🇲", "mask": "000 000 0000" },
    { "code": "+98",  "country": "Irã",                      "flag": "🇮🇷", "mask": "000 0000 0000" },
    { "code": "+970", "country": "Palestina",                "flag": "🇵🇸", "mask": "000 000 0000" },
    { "code": "+971", "country": "Emirados Árabes Unidos",   "flag": "🇦🇪", "mask": "000 000 0000" },
    { "code": "+972", "country": "Israel",                   "flag": "🇮🇱", "mask": "00-000-0000" },
    { "code": "+973", "country": "Bahrein",                  "flag": "🇧🇭", "mask": "0000 0000" },
    { "code": "+974", "country": "Qatar",                    "flag": "🇶🇦", "mask": "0000 0000" },
    { "code": "+975", "country": "Butão",                    "flag": "🇧🇹", "mask": "0000 0000" },
    { "code": "+976", "country": "Mongólia",                 "flag": "🇲🇳", "mask": "0000 0000" },
    { "code": "+977", "country": "Nepal",                    "flag": "🇳🇵", "mask": "000 0000000" },
    { "code": "+992", "country": "Tajiquistão",              "flag": "🇹🇯", "mask": "000 000 0000" },
    { "code": "+993", "country": "Turcomenistão",            "flag": "🇹🇲", "mask": "0000 000000" },
    { "code": "+994", "country": "Azerbaijão",               "flag": "🇦🇿", "mask": "00 000 0000" },
    { "code": "+995", "country": "Geórgia",                  "flag": "🇬🇪", "mask": "000 000 000" },
    { "code": "+996", "country": "Quirguistão",              "flag": "🇰🇬", "mask": "000 000 000" },
    { "code": "+998", "country": "Uzbequistão",              "flag": "🇺🇿", "mask": "000 000 000" },
    { "code": "+1", "country": "Estados Unidos", "flag": "🇺🇸", "mask": "(000) 000-0000" },
    { "code": "+1", "country": "Canadá", "flag": "🇨🇦", "mask": "(000) 000-0000" },
    { "code": "+1", "country": "Anguila", "flag": "🇦🇮", "mask": "(000) 000-0000" },
    { "code": "+1", "country": "Antígua e Barbuda", "flag": "🇦🇬", "mask": "(000) 000-0000" },
    { "code": "+1", "country": "Bahamas", "flag": "🇧🇸", "mask": "(000) 000-0000" },
    { "code": "+1", "country": "Barbados", "flag": "🇧🇧", "mask": "(000) 000-0000" },
    { "code": "+1", "country": "Bermudas", "flag": "🇧🇲", "mask": "(000) 000-0000" },
    { "code": "+1", "country": "Dominica", "flag": "🇩🇲", "mask": "(000) 000-0000" },
    { "code": "+1", "country": "Granada", "flag": "🇬🇩", "mask": "(000) 000-0000" },
    { "code": "+1", "country": "Guam", "flag": "🇬🇺", "mask": "(000) 000-0000" },
    { "code": "+1", "country": "Ilhas Caimã", "flag": "🇰🇾", "mask": "(000) 000-0000" },
    { "code": "+1", "country": "Ilhas Marianas do Norte", "flag": "🇲🇵", "mask": "(000) 000-0000" },
    { "code": "+1", "country": "Ilhas Virgens Americanas", "flag": "🇻🇮", "mask": "(000) 000-0000" },
    { "code": "+1", "country": "Ilhas Virgens Britânicas", "flag": "🇻🇬", "mask": "(000) 000-0000" },
    { "code": "+1", "country": "Jamaica", "flag": "🇯🇲", "mask": "(000) 000-0000" },
    { "code": "+1", "country": "Monserrate", "flag": "🇲🇸", "mask": "(000) 000-0000" },
    { "code": "+1", "country": "Porto Rico", "flag": "🇵🇷", "mask": "(000) 000-0000" },
    { "code": "+1", "country": "República Dominicana", "flag": "🇩🇴", "mask": "(000) 000-0000" },
    { "code": "+1", "country": "Samoa Americana", "flag": "🇦🇸", "mask": "(000) 000-0000" },
    { "code": "+1", "country": "Santa Lúcia", "flag": "🇱🇨", "mask": "(000) 000-0000" },
    { "code": "+1", "country": "São Cristóvão e Neves", "flag": "🇰🇳", "mask": "(000) 000-0000" },
    { "code": "+1", "country": "São Martinho", "flag": "SM", "mask": "(000) 000-0000" },
    { "code": "+1", "country": "São Vicente e Granadinas", "flag": "🇻🇨", "mask": "(000) 000-0000" },
    { "code": "+1", "country": "Trindade e Tobago", "flag": "🇹🇹", "mask": "(000) 000-0000" },
    { "code": "+1", "country": "Turcas e Caicos", "flag": "🇹🇨", "mask": "(000) 000-0000" },
    { "code": "+20", "country": "Egito", "flag": "🇪🇬", "mask": "0000 000 000" },
    { "code": "+211", "country": "Sudão do Sul", "flag": "🇸🇸", "mask": "000 000 000" },
    { "code": "+212", "country": "Marrocos", "flag": "🇲🇦", "mask": "0000-000000" },
    { "code": "+212", "country": "Saara Ocidental", "flag": "EH", "mask": "0000-000000" },
    { "code": "+213", "country": "Argélia", "flag": "🇩🇿", "mask": "000 00 00 00" },
    { "code": "+216", "country": "Tunísia", "flag": "🇹🇳", "mask": "00 000 000" },
    { "code": "+218", "country": "Líbia", "flag": "🇱🇾", "mask": "000 000 0000" },
    { "code": "+220", "country": "Gâmbia", "flag": "🇬🇲", "mask": "000 000 000" },
    { "code": "+221", "country": "Senegal", "flag": "🇸🇳", "mask": "000 000 000" },
    { "code": "+222", "country": "Mauritânia", "flag": "🇲🇷", "mask": "000 000 000" },
    { "code": "+223", "country": "Mali", "flag": "🇲🇱", "mask": "00 00 00 00" },
    { "code": "+224", "country": "Guiné", "flag": "🇬🇳", "mask": "000 000 000" },
    { "code": "+225", "country": "Costa do Marfim", "flag": "🇨🇮", "mask": "000 000 000" },
    { "code": "+226", "country": "Burquina Faso", "flag": "🇧🇫", "mask": "00 00 00 00" },
    { "code": "+227", "country": "Níger", "flag": "🇳🇪", "mask": "00 00 00 00" },
    { "code": "+228", "country": "Togo", "flag": "🇹🇬", "mask": "00 00 00 00" },
    { "code": "+229", "country": "Benim", "flag": "🇧🇯", "mask": "00 00 00 00" },
    { "code": "+230", "country": "Maurícia", "flag": "🇲🇺", "mask": "000 0000" },
    { "code": "+231", "country": "Libéria", "flag": "🇱🇷", "mask": "000 000 000" },
    { "code": "+232", "country": "Serra Leoa", "flag": "🇸🇱", "mask": "000 000 000" },
    { "code": "+233", "country": "Gana", "flag": "🇬🇭", "mask": "000 000 000" },
    { "code": "+234", "country": "Nigéria", "flag": "🇳🇬", "mask": "000 000 0000" },
    { "code": "+235", "country": "Chade", "flag": "🇹🇩", "mask": "00 00 00 00" },
    { "code": "+236", "country": "República Centro-Africana", "flag": "🇨🇫", "mask": "00 00 00 00" },
    { "code": "+237", "country": "Camarões", "flag": "🇨🇲", "mask": "000 000 000" },
    { "code": "+238", "country": "Cabo Verde", "flag": "🇨🇻", "mask": "000 0000" },
    { "code": "+239", "country": "São Tomé e Príncipe", "flag": "🇸🇹", "mask": "000 0000" },
    { "code": "+240", "country": "Guiné Equatorial", "flag": "🇬🇶", "mask": "000 000 000" },
    { "code": "+241", "country": "Gabão", "flag": "🇬🇦", "mask": "000 000 000" },
    { "code": "+242", "country": "Congo-Brazavile", "flag": "🇨🇬", "mask": "00 000 000" },
    { "code": "+243", "country": "Congo-Quinxassa", "flag": "🇨🇩", "mask": "000 000 000" },
    { "code": "+244", "country": "Angola", "flag": "🇦🇴", "mask": "000 000 000" },
    { "code": "+245", "country": "Guiné-Bissau", "flag": "🇬🇼", "mask": "000 000 000" },
    { "code": "+246", "country": "Território Britânico do Oceano Índico", "flag": "IO", "mask": "000000000" },
    { "code": "+247", "country": "Ascensão", "flag": "AC", "mask": "000000" },
    { "code": "+248", "country": "Seicheles", "flag": "🇸🇨", "mask": "000 0000" },
    { "code": "+249", "country": "Sudão", "flag": "🇸🇩", "mask": "000 000 0000" },
    { "code": "+250", "country": "Ruanda", "flag": "🇷🇼", "mask": "0000 000 000" },
    { "code": "+251", "country": "Etiópia", "flag": "🇪🇹", "mask": "000 000 000" },
    { "code": "+252", "country": "Somália", "flag": "🇸🇴", "mask": "000 000 000" },
    { "code": "+253", "country": "Djibuti", "flag": "🇩🇯", "mask": "00 00 00 00" },
    { "code": "+254", "country": "Quênia", "flag": "🇰🇪", "mask": "000 000 000" },
    { "code": "+255", "country": "Tanzânia", "flag": "🇹🇿", "mask": "000 000 000" },
    { "code": "+256", "country": "Uganda", "flag": "🇺🇬", "mask": "000 000 000" },
    { "code": "+257", "country": "Burundi", "flag": "🇧🇮", "mask": "00 00 00 00" },
    { "code": "+258", "country": "Moçambique", "flag": "🇲🇿", "mask": "000 000 000" },
    { "code": "+260", "country": "Zâmbia", "flag": "🇿🇲", "mask": "000 000 000" },
    { "code": "+261", "country": "Madagascar", "flag": "🇲🇬", "mask": "00 000 000" },
    { "code": "+262", "country": "Maiote", "flag": "🇾🇹", "mask": "000 000 000" },
    { "code": "+262", "country": "Reunião", "flag": "🇷🇪", "mask": "000 000 000" },
    { "code": "+263", "country": "Zimbábue", "flag": "🇿🇼", "mask": "000 000 000" },
    { "code": "+264", "country": "Namíbia", "flag": "🇳🇦", "mask": "000 000 000" },
    { "code": "+265", "country": "Maláui", "flag": "🇲🇼", "mask": "000 000 000" },
    { "code": "+266", "country": "Lesoto", "flag": "🇱🇸", "mask": "000 0000" },
    { "code": "+267", "country": "Botsuana", "flag": "🇧🇼", "mask": "000 0000" },
    { "code": "+268", "country": "Essuatíni", "flag": "🇸🇿", "mask": "000 0000" },
    { "code": "+269", "country": "Comores", "flag": "🇰🇲", "mask": "000 0000" },
    { "code": "+27", "country": "África do Sul", "flag": "🇿🇦", "mask": "000 000 0000" },
    { "code": "+290", "country": "Santa Helena", "flag": "SH", "mask": "0000000" },
    { "code": "+290", "country": "Tristão da Cunha", "flag": "TC", "mask": "0000000" },
    { "code": "+291", "country": "Eritreia", "flag": "🇪🇷", "mask": "000 000 000" },
    { "code": "+297", "country": "Aruba", "flag": "🇦🇼", "mask": "000 0000" },
    { "code": "+298", "country": "Ilhas Féroe", "flag": "🇫🇴", "mask": "000 000" },
    { "code": "+299", "country": "Groenlândia", "flag": "🇬🇱", "mask": "000 000" },
    { "code": "+30", "country": "Grécia", "flag": "🇬🇷", "mask": "000 000 0000" },
    { "code": "+31", "country": "Países Baixos", "flag": "🇳🇱", "mask": "00 000 0000" },
    { "code": "+32", "country": "Bélgica", "flag": "🇧🇪", "mask": "000 00 00 00" },
    { "code": "+33", "country": "França", "flag": "🇫🇷", "mask": "00 00 00 00 00" },
    { "code": "+34", "country": "Espanha", "flag": "🇪🇸", "mask": "000 000 000" },
    { "code": "+350", "country": "Gibraltar", "flag": "GI", "mask": "000 000" },
    { "code": "+351", "country": "Portugal", "flag": "🇵🇹", "mask": "000 000 000" },
    { "code": "+352", "country": "Luxemburgo", "flag": "🇱🇺", "mask": "000 00 00 00" },
    { "code": "+353", "country": "Irlanda", "flag": "🇮🇪", "mask": "000 000 0000" },
    { "code": "+354", "country": "Islândia", "flag": "🇮🇸", "mask": "000 0000" },
    { "code": "+355", "country": "Albânia", "flag": "🇦🇱", "mask": "000 000 000" },
    { "code": "+356", "country": "Malta", "flag": "🇲🇹", "mask": "0000 0000" },
    { "code": "+357", "country": "Chipre", "flag": "🇨🇾", "mask": "00 000 000" },
    { "code": "+358", "country": "Finlândia", "flag": "🇫🇮", "mask": "000 000 0000" },
    { "code": "+359", "country": "Bulgária", "flag": "🇧🇬", "mask": "000 000 000" },
    { "code": "+36", "country": "Hungria", "flag": "🇭🇺", "mask": "00 000 0000" },
    { "code": "+370", "country": "Lituânia", "flag": "🇱🇹", "mask": "000 000 000" },
    { "code": "+371", "country": "Letônia", "flag": "🇱🇻", "mask": "000 000 000" },
    { "code": "+372", "country": "Estónia", "flag": "🇪🇪", "mask": "0000 0000" },
    { "code": "+373", "country": "Moldávia", "flag": "🇲🇩", "mask": "000 000 000" },
    { "code": "+374", "country": "Armênia", "flag": "🇦🇲", "mask": "00 000 000" },
    { "code": "+375", "country": "Bielorrússia", "flag": "🇧🇾", "mask": "(000) 000-00-00" },
    { "code": "+376", "country": "Andorra", "flag": "AD", "mask": "000 000" },
    { "code": "+377", "country": "Mônaco", "flag": "🇲🇨", "mask": "00 000 000" },
    { "code": "+378", "country": "São Marinho", "flag": "🇸🇲", "mask": "000 000 000" },
    { "code": "+379", "country": "Vaticano", "flag": "🇻🇦", "mask": "000 000" },
    { "code": "+380", "country": "Ucrânia", "flag": "🇺🇦", "mask": "00 000 0000" },
    { "code": "+381", "country": "Sérvia", "flag": "🇷🇸", "mask": "00 000 000" },
    { "code": "+382", "country": "Montenegro", "flag": "🇲🇪", "mask": "00 000 000" },
    { "code": "+383", "country": "Kosovo", "flag": "🇽🇰", "mask": "000 000 000" },
    { "code": "+385", "country": "Croácia", "flag": "🇭🇷", "mask": "00 000 000" },
    { "code": "+386", "country": "Eslovénia", "flag": "🇸🇮", "mask": "000 000 000" },
    { "code": "+387", "country": "Bósnia e Herzegovina", "flag": "🇧🇦", "mask": "00 000 000" },
    { "code": "+389", "country": "Macedônia do Norte", "flag": "🇲🇰", "mask": "00 000 000" },
    { "code": "+39", "country": "Itália", "flag": "🇮🇹", "mask": "000 000 0000" },
    { "code": "+40", "country": "Romênia", "flag": "🇷🇴", "mask": "000 000 000" },
    { "code": "+41", "country": "Suíça", "flag": "🇨🇭", "mask": "00 000 00 00" },
    { "code": "+420", "country": "Tchéquia", "flag": "🇨🇿", "mask": "000 000 000" },
    { "code": "+421", "country": "Eslováquia", "flag": "🇸🇰", "mask": "000 000 000" },
    { "code": "+423", "country": "Liechtenstein", "flag": "LI", "mask": "00 000 00 00" },
    { "code": "+43", "country": "Áustria", "flag": "🇦🇹", "mask": "000 0000000" },
    { "code": "+44", "country": "Reino Unido", "flag": "🇬🇧", "mask": "0000 000 0000" },
    { "code": "+45", "country": "Dinamarca", "flag": "🇩🇰", "mask": "00 00 00 00" },
    { "code": "+46", "country": "Suécia", "flag": "🇸🇪", "mask": "00 000 0000" },
    { "code": "+47", "country": "Noruega", "flag": "🇳🇴", "mask": "000 00 000" },
    { "code": "+48", "country": "Polônia", "flag": "🇵🇱", "mask": "000 000 000" },
    { "code": "+49", "country": "Alemanha", "flag": "🇩🇪", "mask": "0000 000000" },
    { "code": "+500", "country": "Ilhas Malvinas, Geórgia do Sul e Sandwich do Sul", "flag": "FK", "mask": "000 0000" },
    { "code": "+501", "country": "Belize", "flag": "🇧🇿", "mask": "000-0000" },
    { "code": "+502", "country": "Guatemala", "flag": "🇬🇹", "mask": "0000 0000" },
    { "code": "+503", "country": "El Salvador", "flag": "🇸🇻", "mask": "0000 0000" },
    { "code": "+504", "country": "Honduras", "flag": "🇭🇳", "mask": "0000 0000" },
    { "code": "+505", "country": "Nicarágua", "flag": "🇳🇮", "mask": "0000 0000" },
    { "code": "+506", "country": "Costa Rica", "flag": "🇨🇷", "mask": "0000 0000" },
    { "code": "+507", "country": "Panamá", "flag": "🇵🇦", "mask": "0000 0000" },
    { "code": "+508", "country": "São Pedro e Miquelão", "flag": "PM", "mask": "0000 0000" },
    { "code": "+509", "country": "Haiti", "flag": "🇭🇹", "mask": "000 000 0000" },
    { "code": "+51", "country": "Peru", "flag": "🇵🇪", "mask": "000 000 000" },
    { "code": "+52", "country": "México", "flag": "🇲🇽", "mask": "000 000 0000" },
    { "code": "+53", "country": "Cuba", "flag": "🇨🇺", "mask": "000 0000000" },
    { "code": "+54", "country": "Argentina", "flag": "🇦🇷", "mask": "000 0000-0000" },
    { "code": "+55", "country": "Brasil", "flag": "🇧🇷", "mask": "(00) 00000-0000", "selected": true },
    { "code": "+56", "country": "Chile", "flag": "🇨🇱", "mask": "000 000 000" },
    { "code": "+57", "country": "Colômbia", "flag": "🇨🇴", "mask": "000 000 0000" },
    { "code": "+58", "country": "Venezuela", "flag": "🇻🇪", "mask": "000-0000000" },
    { "code": "+590", "country": "Guadalupe", "flag": "🇬🇵", "mask": "000 000 000" },
    { "code": "+590", "country": "São Bartolomeu", "flag": "🇧🇱", "mask": "000 000 000" },
    { "code": "+590", "country": "São Martinho", "flag": "🇲🇫", "mask": "000 000 000" },
    { "code": "+591", "country": "Bolívia", "flag": "🇧🇴", "mask": "000 0000" },
    { "code": "+592", "country": "Guiana", "flag": "🇬🇾", "mask": "000 000 000" },
    { "code": "+593", "country": "Equador", "flag": "🇪🇨", "mask": "000 000 000" },
    { "code": "+594", "country": "Guiana Francesa", "flag": "🇬🇫", "mask": "000 000 000" },
    { "code": "+595", "country": "Paraguai", "flag": "🇵🇾", "mask": "000 000 000" },
    { "code": "+596", "country": "Martinica", "flag": "🇲🇶", "mask": "000 000 000" },
    { "code": "+597", "country": "Suriname", "flag": "🇸🇷", "mask": "000 000 000" },
    { "code": "+598", "country": "Uruguai", "flag": "🇺🇾", "mask": "000 000 000" },
    { "code": "+599", "country": "Bonaire", "flag": "BQ", "mask": "000 000 000" },
    { "code": "+599", "country": "Curaçao", "flag": "🇨🇼", "mask": "000 000 000" },
    { "code": "+599", "country": "Saba", "flag": "SA", "mask": "000 000 000" },
    { "code": "+599", "country": "Santo Eustáquio", "flag": "SE", "mask": "000 000 000" }
  ];

  function injectCSS(){
    if (!document.getElementById('fc-default-css')){
      var s = document.createElement('style');
      s.id = 'fc-default-css';
      s.textContent = defaultCSS;
      document.head.appendChild(s);
      console.debug('[FormCreator v'+VERSION+'] CSS injected');
    }
  }

  // ---------------------------------------------------
  // 2) “CLASSE” E MÉTODOS
  // ---------------------------------------------------
  function FormCreator(config){
    injectCSS();
    this.config = config;
    this.pages = [];
    this.currentPage = 0;
    this.landingTime = new Date().toISOString();
    this.fillTime = null;
    this.submitTime = null;
    this.trackingParams = this._extractTrackingParams();
    this.maskList = defaultPhoneMasks;
    console.debug('[FormCreator v'+VERSION+'] instance created');
  }

  FormCreator.prototype.init = function(){
    try{
      this._preparePages();
      this._initialRender();
      this._observeContainers();
      console.info('[FormCreator v'+VERSION+'] initialized');
    } catch(err){
      console.error('[FormCreator v'+VERSION+'] init error', err);
      throw err;
    }
  };

  FormCreator.prototype._preparePages = function(){
    if (Array.isArray(this.config.pages)){
      this.pages = this.config.pages;
    } else if (Array.isArray(this.config.fields)){
      var per = (this.config.pagination && this.config.pagination.perPage) || this.config.fields.length;
      for (var i=0; i<this.config.fields.length; i+=per){
        this.pages.push(this.config.fields.slice(i, i+per));
      }
    } else {
      throw new Error('FormCreator: config.pages ou config.fields obrigatório');
    }
    console.debug('[FormCreator v'+VERSION+'] pages prepared ('+this.pages.length+')');
  };

  FormCreator.prototype._initialRender = function(){
    var els = document.querySelectorAll('[data-framer-name="FormCreator"]');
    for (var i=0; i<els.length; i++){
      this._maybeRender(els[i]);
    }
  };

  FormCreator.prototype._observeContainers = function(){
    var self = this;
    var mo = new MutationObserver(function(muts){
      muts.forEach(function(m){
        m.addedNodes.forEach(function(n){
          if (n.nodeType===1){
            if (n.matches('[data-framer-name="FormCreator"]')) self._maybeRender(n);
            var inner = n.querySelectorAll('[data-framer-name="FormCreator"]');
            for (var j=0; j<inner.length; j++) self._maybeRender(inner[j]);
          }
        });
      });
    });
    mo.observe(document.body, { childList:true, subtree:true });
    console.debug('[FormCreator v'+VERSION+'] MutationObserver set');
  };

  FormCreator.prototype._maybeRender = function(container){
    if (!container.dataset.fcInitialized){
      try {
        this._renderForm(container);
        container.dataset.fcInitialized = '1';
        console.debug('[FormCreator v'+VERSION+'] rendered container');
      } catch(err){
        console.error('[FormCreator v'+VERSION+'] render error', err);
      }
    }
  };

  FormCreator.prototype._renderForm = function(container){
    container.innerHTML = '';
    var wrap = document.createElement('div');
    wrap.className = (this.config.styles && this.config.styles.wrapperClass) || 'form-wrapper';
    wrap.style.position = 'relative';
    container.appendChild(wrap);

    this._createOverlay(wrap);

    this.form = document.createElement('form');
    this.form.className = (this.config.styles && this.config.styles.formClass) || '';
    this._applyStyles(this.form, (this.config.styles && this.config.styles.form) || {});
    wrap.appendChild(this.form);

    this._addHiddenFields();
    this._renderPage(0);
  };

  FormCreator.prototype._createOverlay = function(parent){
    this.overlay = document.createElement('div');
    this.overlay.className = (this.config.overlay && this.config.overlay.className) || 'fc-loading-overlay';
    var os = (this.config.overlay && this.config.overlay.styles) || {};
    for (var k in os) this.overlay.style[k] = os[k];
    parent.appendChild(this.overlay);
  };

  FormCreator.prototype.showOverlay = function(){
    this.overlay.style.display = (this.config.overlay && this.config.overlay.displayStyle) || 'flex';
  };
  FormCreator.prototype.hideOverlay = function(){
    this.overlay.style.display = 'none';
  };

  FormCreator.prototype._renderPage = function(idx){
    this.currentPage = idx;
    // remove tudo menos hidden inputs
    var ch = Array.prototype.slice.call(this.form.children);
    ch.forEach(function(el){
      if (!(el.tagName==='INPUT' && el.type==='hidden')){
        el.parentNode.removeChild(el);
      }
    });
    // cria campos
    var pw = document.createElement('div');
    pw.className = (this.config.styles && this.config.styles.pageWrapperClass) || 'form-page';
    this.pages[idx].forEach(function(cfg){
      this._createField(cfg, pw);
    }.bind(this));
    this.form.appendChild(pw);

    // navegação
    var nav = document.createElement('div');
    nav.className = (this.config.styles && this.config.styles.navWrapperClass) || 'form-navigation';
    var bt = this.config.buttonText || {};

    if (idx>0){
      var prev = this._button(bt.prev||'Voltar','button',(this.config.styles&&this.config.styles.prevButtonClass));
      prev.addEventListener('click', function(e){
        e.preventDefault(); this._renderPage(idx-1);
      }.bind(this));
      nav.appendChild(prev);
    }
    if (idx<this.pages.length-1){
      var next = this._button(bt.next||'Próximo','button',(this.config.styles&&this.config.styles.nextButtonClass));
      next.addEventListener('click', function(e){
        e.preventDefault(); this._renderPage(idx+1);
      }.bind(this));
      nav.appendChild(next);
    } else {
      var sub = this._button(bt.submit||'Enviar','submit',(this.config.styles&&this.config.styles.submitButtonClass));
      this.form.addEventListener('submit', this._handleSubmit.bind(this));
      nav.appendChild(sub);
    }
    this.form.appendChild(nav);
  };

  FormCreator.prototype._createField = function(cfg, container){
    var styles = this.config.styles||{};
    var grp = document.createElement('div');
    grp.className = styles.fieldGroupClass||'field-group';

    var lbl = document.createElement('label');
    lbl.htmlFor = cfg.id;
    lbl.textContent = cfg.label;
    lbl.className = styles.labelClass||'';
    grp.appendChild(lbl);

    if (cfg.type==='phone'){
      var pw = document.createElement('div');
      pw.className = styles.phoneWrapperClass||'fc-phone-wrapper';

      var sel = document.createElement('select');
      sel.id = cfg.id+'_ddi';
      sel.name = cfg.id+'_ddi';
      sel.className = styles.selectClass||'fc-ddi-select';
      if (!cfg.default){
        var opt0 = document.createElement('option');
        opt0.value=''; opt0.textContent=''; opt0.selected=true;
        sel.appendChild(opt0);
      }
      this.maskList.forEach(function(it){
        var o = document.createElement('option');
        o.value = it.code.replace('+','');
        o.textContent = it.flag+' '+it.country;
        o.dataset.mask = it.mask;
        sel.appendChild(o);
      });
      if (cfg.default) sel.value = cfg.default.replace('+','');
      if (sel.selectedIndex<0) sel.selectedIndex=0;
      pw.appendChild(sel);

      var inp = document.createElement('input');
      inp.type='tel';
      inp.id=cfg.id;
      inp.name=cfg.id;
      inp.className=styles.fieldClass||'fc-field';
      var init = sel.selectedOptions[0]||sel.options[sel.selectedIndex];
      var m = init.dataset.mask||'';
      inp.dataset.mask = m;
      inp.placeholder = m;
      if (cfg.default){
        var raw = cfg.default.replace('+','').slice((m.match(/0/g)||[]).length);
        inp.value = raw;
      }
      inp.addEventListener('input', function(e){
        if (['deleteContentBackward','deleteContentForward'].indexOf(e.inputType)<0){
          this._applyPhoneMask(inp);
        }
      }.bind(this));
      inp.addEventListener('blur', function(){
        var r = inp.value.replace(/\D/g,'');
        var exp = (inp.dataset.mask.match(/0/g)||[]).length;
        if (r.length!==exp) inp.value='';
      });
      sel.addEventListener('change', function(){
        var selop = sel.selectedOptions[0]||sel.options[sel.selectedIndex];
        var nm = selop.dataset.mask||'';
        inp.dataset.mask = nm;
        inp.placeholder = nm;
        inp.value='';
      });
      pw.appendChild(inp);
      grp.appendChild(pw);

    } else if (cfg.type==='option'){
      var s2 = document.createElement('select');
      s2.id=cfg.id; s2.name=cfg.id; s2.required=!!cfg.required;
      s2.className=styles.fieldClass||'fc-field';
      if (!cfg.default){
        var ph2 = document.createElement('option');
        ph2.value=''; ph2.textContent=''; ph2.selected=true;
        s2.appendChild(ph2);
      }
      cfg.options.forEach(function(o2){
        var o3 = document.createElement('option');
        o3.value=o2.value; o3.textContent=o2.label;
        s2.appendChild(o3);
      });
      if (cfg.default) s2.value=cfg.default;
      grp.appendChild(s2);

    } else {
      var i2 = document.createElement('input');
      i2.type=cfg.type||'text';
      i2.id=cfg.id; i2.name=cfg.id;
      i2.placeholder=cfg.placeholder||'';
      i2.required=!!cfg.required;
      i2.className=styles.fieldClass||'fc-field';
      if (cfg.default!=null) i2.value=cfg.default;
      i2.addEventListener('focus', function(){
        if (!this.fillTime){
          this.fillTime = new Date().toISOString();
          this._fillTimeField.value = this.fillTime;
        }
      }.bind(this), { once:true });
      grp.appendChild(i2);
    }

    container.appendChild(grp);
  };

  FormCreator.prototype._applyPhoneMask = function(inp){
    var raw = inp.value.replace(/\D/g,'');
    var mask = inp.dataset.mask||'';
    var out = '';
    var idx = 0;
    for (var i=0;i<mask.length;i++){
      out += (mask.charAt(i)==='0'? (raw.charAt(idx++)||'') : mask.charAt(i));
    }
    inp.value = out;
  };

  FormCreator.prototype._addHiddenFields = function(){
    var keys = ['utm_source','utm_medium','utm_content','utm_term','utm_campaign','fbclid','gclid','ttclid','src','sck'];
    keys.forEach(function(k){
      var h = document.createElement('input');
      h.type='hidden'; h.name=k; h.value=this.trackingParams[k]||'';
      this.form.appendChild(h);
    }.bind(this));

    [['page_url',window.top.location.href],['landing_time',this.landingTime]].forEach(function(p){
      var h2 = document.createElement('input');
      h2.type='hidden'; h2.name=p[0]; h2.value=p[1];
      this.form.appendChild(h2);
    }.bind(this));

    var ft = document.createElement('input');
    ft.type='hidden';
    ft.name=this.config.timeParamName||'fill_start_time';
    ft.value='';
    this._fillTimeField = ft;
    this.form.appendChild(ft);

    var st = document.createElement('input');
    st.type='hidden'; st.name='submit_time'; st.value='';
    this._submitTimeField = st;
    this.form.appendChild(st);
  };

  FormCreator.prototype._extractTrackingParams = function(){
    var ps = new URLSearchParams(window.location.search);
    var out = {};
    ['utm_source','utm_medium','utm_content','utm_term','utm_campaign','fbclid','gclid','ttclid','src','sck']
      .forEach(function(k){ out[k]=ps.get(k)||''; });
    return out;
  };

  // ---------------------------------------------------
  // 3) _handleSubmit COM DUPLICAÇÃO E FIXES
  // ---------------------------------------------------
  FormCreator.prototype._handleSubmit = async function(e){
    e.preventDefault();
    this.submitTime = new Date().toISOString();
    this._submitTimeField.value = this.submitTime;

    // validações de telefone
    var phoneFields = [];
    this.pages.forEach(function(pg){
      pg.forEach(function(f){
        if (f.type==='phone') phoneFields.push(f);
      });
    });
    var valid = true;
    phoneFields.forEach(function(f){
      var inp0 = this.form.querySelector('[name="'+f.id+'"]');
      var raw0 = inp0.value.replace(/\D/g,''), exp0 = (inp0.dataset.mask.match(/0/g)||[]).length;
      if (raw0.length!==exp0){ inp0.value=''; if (f.required) valid=false; }
    }.bind(this));
    if (!valid) return;

    this.showOverlay();

    // monta rawData
    var fd = new FormData(this.form), rawData = {};
    for (var pair of fd.entries()) rawData[pair[0]] = pair[1]||'';

    // processa phoneFields
    phoneFields.forEach(function(f){
      var ddi = rawData[f.id+'_ddi']||'';
      var val = rawData[f.id]||'';
      var digits = val.replace(/\D/g,'');
      if (!digits.startsWith(ddi)) digits = ddi + digits;
      var full = '+' + digits;
      // 1) phone: +DDI+DDD+número
      rawData[f.id] = full;
      // 2) phoneac: só o DDD
      var inpEl = this.form.querySelector('[name="'+f.id+'"]');
      var maskPat = inpEl.dataset.mask||'';
      var acLen = (maskPat.match(/0+/)||[''])[0].length;
      var local = digits.slice(ddi.length);       // DDD + número
      rawData.phoneac = local.slice(0, acLen);   // só DDD
      // 3) phonenumber: só o número (sem DDI e sem DDD)
      rawData.phonenumber = local.slice(acLen);
      delete rawData[f.id+'_ddi'];
    }.bind(this));

    // monta queryData (URL)
    var queryData = {};
    Object.keys(rawData).forEach(function(k){ queryData[k] = rawData[k]; });
    Object.keys(this.trackingParams).forEach(function(k){ queryData[k] = this.trackingParams[k]; }.bind(this));
    queryData.page_url = window.top.location.href;
    queryData[this.config.timeParamName||'fill_start_time'] = this.fillTime;
    queryData.submit_time = this.submitTime;

    // utilitário “?” vs “&”
    function withParams(url, qs){
      return url + (url.indexOf('?') >= 0 ? '&' : '?') + qs;
    }

    var qs = new URLSearchParams(queryData).toString(),
        formUrl = this.config.form.success_url,
        errUrl  = this.config.form.error_url;

    // monta payload do webhook
    var time = { landing_time: this.landingTime };
    time[this.config.timeParamName||'fill_start_time'] = this.fillTime;
    time.submit_time = this.submitTime;

    var payload = {
      data: rawData,
      time: time,
      tracking: Object.assign({}, this.trackingParams, { page_url: window.top.location.href })
    };

    // envia
    try{
      var resp = await fetch(this.config.form.action_url, {
        method:'POST',
        headers:{ 'Content-Type':'application/json' },
        body: JSON.stringify(payload)
      });
      window.location.href = withParams(resp.ok ? formUrl : errUrl, qs);
    } catch(_){
      window.location.href = withParams(errUrl, qs);
    }
  };

  FormCreator.prototype._button = function(text, type, className){
    var b = document.createElement('button');
    b.type = type; b.textContent = text; b.className = className||'';
    return b;
  };

  FormCreator.prototype._applyStyles = function(el, styles){
    for (var k in styles) el.style[k] = styles[k];
  };

  // ---------------------------------------------------
  // 4) EXPÕE GLOBAL E AUTO-INIT COM RETRY
  // ---------------------------------------------------
  window.FormCreator = FormCreator;
  console.info('[FormCreator] loaded v'+VERSION);

  var MAX_RETRIES = 5, BASE_DELAY = 500, attempts = 0;
  function tryInit(){
    attempts++;
    if (window.FormCreator && window.FormCreatorConfig){
      console.info('[FormCreator v'+VERSION+'] init attempt '+attempts);
      try {
        new FormCreator(window.FormCreatorConfig).init();
        console.info('[FormCreator v'+VERSION+'] initialized successfully');
      } catch(err){
        console.error('[FormCreator v'+VERSION+'] init error', err);
        if (attempts < MAX_RETRIES) setTimeout(tryInit, BASE_DELAY * attempts);
        else console.error('[FormCreator v'+VERSION+'] giving up after '+attempts+' attempts');
      }
    } else {
      console.warn('[FormCreator v'+VERSION+'] config missing, retry #'+attempts);
      if (attempts < MAX_RETRIES) setTimeout(tryInit, BASE_DELAY * attempts);
      else console.error('[FormCreator v'+VERSION+'] config never found');
    }
  }

  if (document.readyState==='complete' || document.readyState==='interactive'){
    tryInit();
  } else {
    document.addEventListener('DOMContentLoaded', tryInit);
  }

})();
