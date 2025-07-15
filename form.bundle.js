;(function(){
  'use strict';

  // ---------------------------------------------------
  // 1) â€œESTÃTICASâ€ FORA DA CLASSE
  // ---------------------------------------------------
  var VERSION = '1.4.50@leonardoscapinello.com';

  // CSS padrÃ£o a injetar
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

  // JSON completo de mÃ¡scaras
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
    { "code": "+1", "country": "Estados Unidos", "flag": "ðŸ‡ºðŸ‡¸", "mask": "(000) 000-0000" },
    { "code": "+1", "country": "CanadÃ¡", "flag": "ðŸ‡¨ðŸ‡¦", "mask": "(000) 000-0000" },
    { "code": "+1", "country": "Anguila", "flag": "ðŸ‡¦ðŸ‡®", "mask": "(000) 000-0000" },
    { "code": "+1", "country": "AntÃ­gua e Barbuda", "flag": "ðŸ‡¦ðŸ‡¬", "mask": "(000) 000-0000" },
    { "code": "+1", "country": "Bahamas", "flag": "ðŸ‡§ðŸ‡¸", "mask": "(000) 000-0000" },
    { "code": "+1", "country": "Barbados", "flag": "ðŸ‡§ðŸ‡§", "mask": "(000) 000-0000" },
    { "code": "+1", "country": "Bermudas", "flag": "ðŸ‡§ðŸ‡²", "mask": "(000) 000-0000" },
    { "code": "+1", "country": "Dominica", "flag": "ðŸ‡©ðŸ‡²", "mask": "(000) 000-0000" },
    { "code": "+1", "country": "Granada", "flag": "ðŸ‡¬ðŸ‡©", "mask": "(000) 000-0000" },
    { "code": "+1", "country": "Guam", "flag": "ðŸ‡¬ðŸ‡º", "mask": "(000) 000-0000" },
    { "code": "+1", "country": "Ilhas CaimÃ£", "flag": "ðŸ‡°ðŸ‡¾", "mask": "(000) 000-0000" },
    { "code": "+1", "country": "Ilhas Marianas do Norte", "flag": "ðŸ‡²ðŸ‡µ", "mask": "(000) 000-0000" },
    { "code": "+1", "country": "Ilhas Virgens Americanas", "flag": "ðŸ‡»ðŸ‡®", "mask": "(000) 000-0000" },
    { "code": "+1", "country": "Ilhas Virgens BritÃ¢nicas", "flag": "ðŸ‡»ðŸ‡¬", "mask": "(000) 000-0000" },
    { "code": "+1", "country": "Jamaica", "flag": "ðŸ‡¯ðŸ‡²", "mask": "(000) 000-0000" },
    { "code": "+1", "country": "Monserrate", "flag": "ðŸ‡²ðŸ‡¸", "mask": "(000) 000-0000" },
    { "code": "+1", "country": "Porto Rico", "flag": "ðŸ‡µðŸ‡·", "mask": "(000) 000-0000" },
    { "code": "+1", "country": "RepÃºblica Dominicana", "flag": "ðŸ‡©ðŸ‡´", "mask": "(000) 000-0000" },
    { "code": "+1", "country": "Samoa Americana", "flag": "ðŸ‡¦ðŸ‡¸", "mask": "(000) 000-0000" },
    { "code": "+1", "country": "Santa LÃºcia", "flag": "ðŸ‡±ðŸ‡¨", "mask": "(000) 000-0000" },
    { "code": "+1", "country": "SÃ£o CristÃ³vÃ£o e Neves", "flag": "ðŸ‡°ðŸ‡³", "mask": "(000) 000-0000" },
    { "code": "+1", "country": "SÃ£o Martinho", "flag": "SM", "mask": "(000) 000-0000" },
    { "code": "+1", "country": "SÃ£o Vicente e Granadinas", "flag": "ðŸ‡»ðŸ‡¨", "mask": "(000) 000-0000" },
    { "code": "+1", "country": "Trindade e Tobago", "flag": "ðŸ‡¹ðŸ‡¹", "mask": "(000) 000-0000" },
    { "code": "+1", "country": "Turcas e Caicos", "flag": "ðŸ‡¹ðŸ‡¨", "mask": "(000) 000-0000" },
    { "code": "+20", "country": "Egito", "flag": "ðŸ‡ªðŸ‡¬", "mask": "0000 000 000" },
    { "code": "+211", "country": "SudÃ£o do Sul", "flag": "ðŸ‡¸ðŸ‡¸", "mask": "000 000 000" },
    { "code": "+212", "country": "Marrocos", "flag": "ðŸ‡²ðŸ‡¦", "mask": "0000-000000" },
    { "code": "+212", "country": "Saara Ocidental", "flag": "EH", "mask": "0000-000000" },
    { "code": "+213", "country": "ArgÃ©lia", "flag": "ðŸ‡©ðŸ‡¿", "mask": "000 00 00 00" },
    { "code": "+216", "country": "TunÃ­sia", "flag": "ðŸ‡¹ðŸ‡³", "mask": "00 000 000" },
    { "code": "+218", "country": "LÃ­bia", "flag": "ðŸ‡±ðŸ‡¾", "mask": "000 000 0000" },
    { "code": "+220", "country": "GÃ¢mbia", "flag": "ðŸ‡¬ðŸ‡²", "mask": "000 000 000" },
    { "code": "+221", "country": "Senegal", "flag": "ðŸ‡¸ðŸ‡³", "mask": "000 000 000" },
    { "code": "+222", "country": "MauritÃ¢nia", "flag": "ðŸ‡²ðŸ‡·", "mask": "000 000 000" },
    { "code": "+223", "country": "Mali", "flag": "ðŸ‡²ðŸ‡±", "mask": "00 00 00 00" },
    { "code": "+224", "country": "GuinÃ©", "flag": "ðŸ‡¬ðŸ‡³", "mask": "000 000 000" },
    { "code": "+225", "country": "Costa do Marfim", "flag": "ðŸ‡¨ðŸ‡®", "mask": "000 000 000" },
    { "code": "+226", "country": "Burquina Faso", "flag": "ðŸ‡§ðŸ‡«", "mask": "00 00 00 00" },
    { "code": "+227", "country": "NÃ­ger", "flag": "ðŸ‡³ðŸ‡ª", "mask": "00 00 00 00" },
    { "code": "+228", "country": "Togo", "flag": "ðŸ‡¹ðŸ‡¬", "mask": "00 00 00 00" },
    { "code": "+229", "country": "Benim", "flag": "ðŸ‡§ðŸ‡¯", "mask": "00 00 00 00" },
    { "code": "+230", "country": "MaurÃ­cia", "flag": "ðŸ‡²ðŸ‡º", "mask": "000 0000" },
    { "code": "+231", "country": "LibÃ©ria", "flag": "ðŸ‡±ðŸ‡·", "mask": "000 000 000" },
    { "code": "+232", "country": "Serra Leoa", "flag": "ðŸ‡¸ðŸ‡±", "mask": "000 000 000" },
    { "code": "+233", "country": "Gana", "flag": "ðŸ‡¬ðŸ‡­", "mask": "000 000 000" },
    { "code": "+234", "country": "NigÃ©ria", "flag": "ðŸ‡³ðŸ‡¬", "mask": "000 000 0000" },
    { "code": "+235", "country": "Chade", "flag": "ðŸ‡¹ðŸ‡©", "mask": "00 00 00 00" },
    { "code": "+236", "country": "RepÃºblica Centro-Africana", "flag": "ðŸ‡¨ðŸ‡«", "mask": "00 00 00 00" },
    { "code": "+237", "country": "CamarÃµes", "flag": "ðŸ‡¨ðŸ‡²", "mask": "000 000 000" },
    { "code": "+238", "country": "Cabo Verde", "flag": "ðŸ‡¨ðŸ‡»", "mask": "000 0000" },
    { "code": "+239", "country": "SÃ£o TomÃ© e PrÃ­ncipe", "flag": "ðŸ‡¸ðŸ‡¹", "mask": "000 0000" },
    { "code": "+240", "country": "GuinÃ© Equatorial", "flag": "ðŸ‡¬ðŸ‡¶", "mask": "000 000 000" },
    { "code": "+241", "country": "GabÃ£o", "flag": "ðŸ‡¬ðŸ‡¦", "mask": "000 000 000" },
    { "code": "+242", "country": "Congo-Brazavile", "flag": "ðŸ‡¨ðŸ‡¬", "mask": "00 000 000" },
    { "code": "+243", "country": "Congo-Quinxassa", "flag": "ðŸ‡¨ðŸ‡©", "mask": "000 000 000" },
    { "code": "+244", "country": "Angola", "flag": "ðŸ‡¦ðŸ‡´", "mask": "000 000 000" },
    { "code": "+245", "country": "GuinÃ©-Bissau", "flag": "ðŸ‡¬ðŸ‡¼", "mask": "000 000 000" },
    { "code": "+246", "country": "TerritÃ³rio BritÃ¢nico do Oceano Ãndico", "flag": "IO", "mask": "000000000" },
    { "code": "+247", "country": "AscensÃ£o", "flag": "AC", "mask": "000000" },
    { "code": "+248", "country": "Seicheles", "flag": "ðŸ‡¸ðŸ‡¨", "mask": "000 0000" },
    { "code": "+249", "country": "SudÃ£o", "flag": "ðŸ‡¸ðŸ‡©", "mask": "000 000 0000" },
    { "code": "+250", "country": "Ruanda", "flag": "ðŸ‡·ðŸ‡¼", "mask": "0000 000 000" },
    { "code": "+251", "country": "EtiÃ³pia", "flag": "ðŸ‡ªðŸ‡¹", "mask": "000 000 000" },
    { "code": "+252", "country": "SomÃ¡lia", "flag": "ðŸ‡¸ðŸ‡´", "mask": "000 000 000" },
    { "code": "+253", "country": "Djibuti", "flag": "ðŸ‡©ðŸ‡¯", "mask": "00 00 00 00" },
    { "code": "+254", "country": "QuÃªnia", "flag": "ðŸ‡°ðŸ‡ª", "mask": "000 000 000" },
    { "code": "+255", "country": "TanzÃ¢nia", "flag": "ðŸ‡¹ðŸ‡¿", "mask": "000 000 000" },
    { "code": "+256", "country": "Uganda", "flag": "ðŸ‡ºðŸ‡¬", "mask": "000 000 000" },
    { "code": "+257", "country": "Burundi", "flag": "ðŸ‡§ðŸ‡®", "mask": "00 00 00 00" },
    { "code": "+258", "country": "MoÃ§ambique", "flag": "ðŸ‡²ðŸ‡¿", "mask": "000 000 000" },
    { "code": "+260", "country": "ZÃ¢mbia", "flag": "ðŸ‡¿ðŸ‡²", "mask": "000 000 000" },
    { "code": "+261", "country": "Madagascar", "flag": "ðŸ‡²ðŸ‡¬", "mask": "00 000 000" },
    { "code": "+262", "country": "Maiote", "flag": "ðŸ‡¾ðŸ‡¹", "mask": "000 000 000" },
    { "code": "+262", "country": "ReuniÃ£o", "flag": "ðŸ‡·ðŸ‡ª", "mask": "000 000 000" },
    { "code": "+263", "country": "ZimbÃ¡bue", "flag": "ðŸ‡¿ðŸ‡¼", "mask": "000 000 000" },
    { "code": "+264", "country": "NamÃ­bia", "flag": "ðŸ‡³ðŸ‡¦", "mask": "000 000 000" },
    { "code": "+265", "country": "MalÃ¡ui", "flag": "ðŸ‡²ðŸ‡¼", "mask": "000 000 000" },
    { "code": "+266", "country": "Lesoto", "flag": "ðŸ‡±ðŸ‡¸", "mask": "000 0000" },
    { "code": "+267", "country": "Botsuana", "flag": "ðŸ‡§ðŸ‡¼", "mask": "000 0000" },
    { "code": "+268", "country": "EssuatÃ­ni", "flag": "ðŸ‡¸ðŸ‡¿", "mask": "000 0000" },
    { "code": "+269", "country": "Comores", "flag": "ðŸ‡°ðŸ‡²", "mask": "000 0000" },
    { "code": "+27", "country": "Ãfrica do Sul", "flag": "ðŸ‡¿ðŸ‡¦", "mask": "000 000 0000" },
    { "code": "+290", "country": "Santa Helena", "flag": "SH", "mask": "0000000" },
    { "code": "+290", "country": "TristÃ£o da Cunha", "flag": "TC", "mask": "0000000" },
    { "code": "+291", "country": "Eritreia", "flag": "ðŸ‡ªðŸ‡·", "mask": "000 000 000" },
    { "code": "+297", "country": "Aruba", "flag": "ðŸ‡¦ðŸ‡¼", "mask": "000 0000" },
    { "code": "+298", "country": "Ilhas FÃ©roe", "flag": "ðŸ‡«ðŸ‡´", "mask": "000 000" },
    { "code": "+299", "country": "GroenlÃ¢ndia", "flag": "ðŸ‡¬ðŸ‡±", "mask": "000 000" },
    { "code": "+30", "country": "GrÃ©cia", "flag": "ðŸ‡¬ðŸ‡·", "mask": "000 000 0000" },
    { "code": "+31", "country": "PaÃ­ses Baixos", "flag": "ðŸ‡³ðŸ‡±", "mask": "00 000 0000" },
    { "code": "+32", "country": "BÃ©lgica", "flag": "ðŸ‡§ðŸ‡ª", "mask": "000 00 00 00" },
    { "code": "+33", "country": "FranÃ§a", "flag": "ðŸ‡«ðŸ‡·", "mask": "00 00 00 00 00" },
    { "code": "+34", "country": "Espanha", "flag": "ðŸ‡ªðŸ‡¸", "mask": "000 000 000" },
    { "code": "+350", "country": "Gibraltar", "flag": "GI", "mask": "000 000" },
    { "code": "+351", "country": "Portugal", "flag": "ðŸ‡µðŸ‡¹", "mask": "000 000 000" },
    { "code": "+352", "country": "Luxemburgo", "flag": "ðŸ‡±ðŸ‡º", "mask": "000 00 00 00" },
    { "code": "+353", "country": "Irlanda", "flag": "ðŸ‡®ðŸ‡ª", "mask": "000 000 0000" },
    { "code": "+354", "country": "IslÃ¢ndia", "flag": "ðŸ‡®ðŸ‡¸", "mask": "000 0000" },
    { "code": "+355", "country": "AlbÃ¢nia", "flag": "ðŸ‡¦ðŸ‡±", "mask": "000 000 000" },
    { "code": "+356", "country": "Malta", "flag": "ðŸ‡²ðŸ‡¹", "mask": "0000 0000" },
    { "code": "+357", "country": "Chipre", "flag": "ðŸ‡¨ðŸ‡¾", "mask": "00 000 000" },
    { "code": "+358", "country": "FinlÃ¢ndia", "flag": "ðŸ‡«ðŸ‡®", "mask": "000 000 0000" },
    { "code": "+359", "country": "BulgÃ¡ria", "flag": "ðŸ‡§ðŸ‡¬", "mask": "000 000 000" },
    { "code": "+36", "country": "Hungria", "flag": "ðŸ‡­ðŸ‡º", "mask": "00 000 0000" },
    { "code": "+370", "country": "LituÃ¢nia", "flag": "ðŸ‡±ðŸ‡¹", "mask": "000 000 000" },
    { "code": "+371", "country": "LetÃ´nia", "flag": "ðŸ‡±ðŸ‡»", "mask": "000 000 000" },
    { "code": "+372", "country": "EstÃ³nia", "flag": "ðŸ‡ªðŸ‡ª", "mask": "0000 0000" },
    { "code": "+373", "country": "MoldÃ¡via", "flag": "ðŸ‡²ðŸ‡©", "mask": "000 000 000" },
    { "code": "+374", "country": "ArmÃªnia", "flag": "ðŸ‡¦ðŸ‡²", "mask": "00 000 000" },
    { "code": "+375", "country": "BielorrÃºssia", "flag": "ðŸ‡§ðŸ‡¾", "mask": "(000) 000-00-00" },
    { "code": "+376", "country": "Andorra", "flag": "AD", "mask": "000 000" },
    { "code": "+377", "country": "MÃ´naco", "flag": "ðŸ‡²ðŸ‡¨", "mask": "00 000 000" },
    { "code": "+378", "country": "SÃ£o Marinho", "flag": "ðŸ‡¸ðŸ‡²", "mask": "000 000 000" },
    { "code": "+379", "country": "Vaticano", "flag": "ðŸ‡»ðŸ‡¦", "mask": "000 000" },
    { "code": "+380", "country": "UcrÃ¢nia", "flag": "ðŸ‡ºðŸ‡¦", "mask": "00 000 0000" },
    { "code": "+381", "country": "SÃ©rvia", "flag": "ðŸ‡·ðŸ‡¸", "mask": "00 000 000" },
    { "code": "+382", "country": "Montenegro", "flag": "ðŸ‡²ðŸ‡ª", "mask": "00 000 000" },
    { "code": "+383", "country": "Kosovo", "flag": "ðŸ‡½ðŸ‡°", "mask": "000 000 000" },
    { "code": "+385", "country": "CroÃ¡cia", "flag": "ðŸ‡­ðŸ‡·", "mask": "00 000 000" },
    { "code": "+386", "country": "EslovÃ©nia", "flag": "ðŸ‡¸ðŸ‡®", "mask": "000 000 000" },
    { "code": "+387", "country": "BÃ³snia e Herzegovina", "flag": "ðŸ‡§ðŸ‡¦", "mask": "00 000 000" },
    { "code": "+389", "country": "MacedÃ´nia do Norte", "flag": "ðŸ‡²ðŸ‡°", "mask": "00 000 000" },
    { "code": "+39", "country": "ItÃ¡lia", "flag": "ðŸ‡®ðŸ‡¹", "mask": "000 000 0000" },
    { "code": "+40", "country": "RomÃªnia", "flag": "ðŸ‡·ðŸ‡´", "mask": "000 000 000" },
    { "code": "+41", "country": "SuÃ­Ã§a", "flag": "ðŸ‡¨ðŸ‡­", "mask": "00 000 00 00" },
    { "code": "+420", "country": "TchÃ©quia", "flag": "ðŸ‡¨ðŸ‡¿", "mask": "000 000 000" },
    { "code": "+421", "country": "EslovÃ¡quia", "flag": "ðŸ‡¸ðŸ‡°", "mask": "000 000 000" },
    { "code": "+423", "country": "Liechtenstein", "flag": "LI", "mask": "00 000 00 00" },
    { "code": "+43", "country": "Ãustria", "flag": "ðŸ‡¦ðŸ‡¹", "mask": "000 0000000" },
    { "code": "+44", "country": "Reino Unido", "flag": "ðŸ‡¬ðŸ‡§", "mask": "0000 000 0000" },
    { "code": "+45", "country": "Dinamarca", "flag": "ðŸ‡©ðŸ‡°", "mask": "00 00 00 00" },
    { "code": "+46", "country": "SuÃ©cia", "flag": "ðŸ‡¸ðŸ‡ª", "mask": "00 000 0000" },
    { "code": "+47", "country": "Noruega", "flag": "ðŸ‡³ðŸ‡´", "mask": "000 00 000" },
    { "code": "+48", "country": "PolÃ´nia", "flag": "ðŸ‡µðŸ‡±", "mask": "000 000 000" },
    { "code": "+49", "country": "Alemanha", "flag": "ðŸ‡©ðŸ‡ª", "mask": "0000 000000" },
    { "code": "+500", "country": "Ilhas Malvinas, GeÃ³rgia do Sul e Sandwich do Sul", "flag": "FK", "mask": "000 0000" },
    { "code": "+501", "country": "Belize", "flag": "ðŸ‡§ðŸ‡¿", "mask": "000-0000" },
    { "code": "+502", "country": "Guatemala", "flag": "ðŸ‡¬ðŸ‡¹", "mask": "0000 0000" },
    { "code": "+503", "country": "El Salvador", "flag": "ðŸ‡¸ðŸ‡»", "mask": "0000 0000" },
    { "code": "+504", "country": "Honduras", "flag": "ðŸ‡­ðŸ‡³", "mask": "0000 0000" },
    { "code": "+505", "country": "NicarÃ¡gua", "flag": "ðŸ‡³ðŸ‡®", "mask": "0000 0000" },
    { "code": "+506", "country": "Costa Rica", "flag": "ðŸ‡¨ðŸ‡·", "mask": "0000 0000" },
    { "code": "+507", "country": "PanamÃ¡", "flag": "ðŸ‡µðŸ‡¦", "mask": "0000 0000" },
    { "code": "+508", "country": "SÃ£o Pedro e MiquelÃ£o", "flag": "PM", "mask": "0000 0000" },
    { "code": "+509", "country": "Haiti", "flag": "ðŸ‡­ðŸ‡¹", "mask": "000 000 0000" },
    { "code": "+51", "country": "Peru", "flag": "ðŸ‡µðŸ‡ª", "mask": "000 000 000" },
    { "code": "+52", "country": "MÃ©xico", "flag": "ðŸ‡²ðŸ‡½", "mask": "000 000 0000" },
    { "code": "+53", "country": "Cuba", "flag": "ðŸ‡¨ðŸ‡º", "mask": "000 0000000" },
    { "code": "+54", "country": "Argentina", "flag": "ðŸ‡¦ðŸ‡·", "mask": "000 0000-0000" },
    { "code": "+55", "country": "Brasil", "flag": "ðŸ‡§ðŸ‡·", "mask": "(00) 00000-0000", "selected": true },
    { "code": "+56", "country": "Chile", "flag": "ðŸ‡¨ðŸ‡±", "mask": "000 000 000" },
    { "code": "+57", "country": "ColÃ´mbia", "flag": "ðŸ‡¨ðŸ‡´", "mask": "000 000 0000" },
    { "code": "+58", "country": "Venezuela", "flag": "ðŸ‡»ðŸ‡ª", "mask": "000-0000000" },
    { "code": "+590", "country": "Guadalupe", "flag": "ðŸ‡¬ðŸ‡µ", "mask": "000 000 000" },
    { "code": "+590", "country": "SÃ£o Bartolomeu", "flag": "ðŸ‡§ðŸ‡±", "mask": "000 000 000" },
    { "code": "+590", "country": "SÃ£o Martinho", "flag": "ðŸ‡²ðŸ‡«", "mask": "000 000 000" },
    { "code": "+591", "country": "BolÃ­via", "flag": "ðŸ‡§ðŸ‡´", "mask": "000 0000" },
    { "code": "+592", "country": "Guiana", "flag": "ðŸ‡¬ðŸ‡¾", "mask": "000 000 000" },
    { "code": "+593", "country": "Equador", "flag": "ðŸ‡ªðŸ‡¨", "mask": "000 000 000" },
    { "code": "+594", "country": "Guiana Francesa", "flag": "ðŸ‡¬ðŸ‡«", "mask": "000 000 000" },
    { "code": "+595", "country": "Paraguai", "flag": "ðŸ‡µðŸ‡¾", "mask": "000 000 000" },
    { "code": "+596", "country": "Martinica", "flag": "ðŸ‡²ðŸ‡¶", "mask": "000 000 000" },
    { "code": "+597", "country": "Suriname", "flag": "ðŸ‡¸ðŸ‡·", "mask": "000 000 000" },
    { "code": "+598", "country": "Uruguai", "flag": "ðŸ‡ºðŸ‡¾", "mask": "000 000 000" },
    { "code": "+599", "country": "Bonaire", "flag": "BQ", "mask": "000 000 000" },
    { "code": "+599", "country": "CuraÃ§ao", "flag": "ðŸ‡¨ðŸ‡¼", "mask": "000 000 000" },
    { "code": "+599", "country": "Saba", "flag": "SA", "mask": "000 000 000" },
    { "code": "+599", "country": "Santo EustÃ¡quio", "flag": "SE", "mask": "000 000 000" }
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
  // 2) CLASSE E MÃ‰TODOS
  // ---------------------------------------------------
  function FormCreator(config, container){
    injectCSS();
    this.config = config;
    this.container = container;
    this.pages = [];
    this.currentPage = 0;
    this.landingTime = new Date().toISOString();
    this.fillTime = null;
    this.submitTime = null;
    this.trackingParams = this._extractTrackingParams();
    this.maskList = defaultPhoneMasks;
    console.debug('[FormCreator v'+VERSION+'] instance for "'+ (container.dataset['framerName']||'<inline>') +'" created');
  }

  FormCreator.prototype.init = function(){
    try {
      this._preparePages();
      this._renderForm();
      console.info('[FormCreator v'+VERSION+'] initialized for container', this.container);
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
      throw new Error('FormCreator: config.pages ou config.fields obrigatÃ³rio');
    }
    console.debug('[FormCreator v'+VERSION+'] pages prepared ('+this.pages.length+')');
  };

  FormCreator.prototype._renderForm = function(){
    var container = this.container;
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
    for (var k in os) if (os.hasOwnProperty(k)) this.overlay.style[k] = os[k];
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

    // navegaÃ§Ã£o
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
      var next = this._button(bt.next||'PrÃ³ximo','button',(this.config.styles&&this.config.styles.nextButtonClass));
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
      // novo: clonamos e ordenamos por país em PT-BR
      var sortedList = this.maskList
        .slice() // evita mexer no original
        .sort(function(a, b){
          return a.country.localeCompare(b.country, 'pt');
        });

      sortedList.forEach(function(it){
        var o = document.createElement('option');
        o.value = it.code.replace('+','');
        o.textContent = it.country;      
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

  FormCreator.prototype._handleSubmit = async function(e){
    e.preventDefault();
    this.submitTime = new Date().toISOString();
    this._submitTimeField.value = this.submitTime;

    // validaÃ§Ãµes de telefone
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
      rawData[f.id] = full;
      var inpEl = this.form.querySelector('[name="'+f.id+'"]');
      var maskPat = inpEl.dataset.mask||'';
      var acLen = (maskPat.match(/0+/)||[''])[0].length;
      var local = digits.slice(ddi.length);
      rawData.phoneac = local.slice(0, acLen);
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
    for (var k in styles) if (styles.hasOwnProperty(k)) el.style[k] = styles[k];
  };

  // ---------------------------------------------------
  // 3) GLOBAL BOOTSTRAP PARA MÃšLTIPLAS INSTÃ‚NCIAS
  // ---------------------------------------------------
  window.FormCreator = FormCreator;

  var MAX_RETRIES = 5, BASE_DELAY = 500, attempts = 0;
  function initializeAllForms(){
    if (!window.FormCreatorConfig) return false;
    var cfgRoot = window.FormCreatorConfig;
    for (var name in cfgRoot){
      if (!cfgRoot.hasOwnProperty(name)) continue;
      var cfg = cfgRoot[name];
      var selector = '[data-framer-name="'+name+'"]';
      var els = document.querySelectorAll(selector);
      els.forEach(function(el){
        if (!el.dataset.fcInitialized){
          try {
            new FormCreator(cfg, el).init();
            el.dataset.fcInitialized = '1';
          } catch(err){
            console.error('[FormCreator] init error for "'+name+'"', err);
          }
        }
      });
    }
    return true;
  }

  function tryInit(){
    attempts++;
    if (initializeAllForms()){
      console.info('[FormCreator v'+VERSION+'] initialized all forms');
      // MutationObserver para novos containers dinÃ¢micos
      var mo = new MutationObserver(function(muts){
        muts.forEach(function(m){
          m.addedNodes.forEach(function(n){
            if (n.nodeType===1){
              initializeAllForms();
            }
          });
        });
      });
      mo.observe(document.body, { childList:true, subtree:true });
      console.debug('[FormCreator v'+VERSION+'] MutationObserver set');
    } else if (attempts < MAX_RETRIES){
      console.warn('[FormCreator v'+VERSION+'] config missing, retry #'+attempts);
      setTimeout(tryInit, BASE_DELAY * attempts);
    } else {
      console.error('[FormCreator v'+VERSION+'] giving up after '+attempts+' attempts');
    }
  }

  if (document.readyState==='complete' || document.readyState==='interactive'){
    tryInit();
  } else {
    document.addEventListener('DOMContentLoaded', tryInit);
  }

})();
