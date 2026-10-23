// Контакты и реквизиты. Позже эти данные будут редактироваться из админки.
export const site = {
  name: "Ранг Авто",
  legalName: "ООО «Ранг Авто»",
  inn: "3000026854",
  ogrn: "1263000003573",
  // один многоканальный номер на оба офиса
  phone: "+7 (937) 505-55-88",
  phoneNote: "Многоканальный номер — Краснодар и Астрахань",
  phoneShort: "8 (937) 505-55-88",
  email: "rangauto@mail.ru",
  // coords: [широта, долгота] — для карты в блоке контактов
  offices: [
    { city: "Краснодар", address: "Краснодар, ул. Западный Обход, 29", coords: [45.080338, 38.893745] },
    { city: "Астрахань", address: "Астрахань, Славянская 1л", coords: [46.359931, 48.096326] },
  ],
  schedule: ["Пн - Пт - с 8:00 до 19:00", "Сб - Вс - с 8:00 до 17:00"],
  socials: {
    telegram: "https://t.me/rangauto",
    // TODO: ссылка на канал в MAX — от заказчика
    max: "https://max.ru/",
    vk: "https://vk.ru/rangauto",
  },
};

export function telHref(phone: string) {
  const digits = phone.replace(/\D/g, "").replace(/^8/, "7");
  return `tel:+${digits}`;
}

export const catalogUrls = {
  cn: "https://catalog.rangauto.ru/china-used/",
  kr: "https://catalog.rangauto.ru/korea/",
  jp: "https://catalog.rangauto.ru/statistika/",
};

export const nav = [
  {
    label: "Каталог",
    href: "#catalog",
    children: [
      { label: "Авто из Китая", href: catalogUrls.cn },
      { label: "Авто из Кореи", href: catalogUrls.kr },
      { label: "Авто из Японии", href: catalogUrls.jp },
    ],
  },
  { label: "Калькулятор", href: "#lead" },
  {
    label: "О компании",
    href: "#how",
    children: [
      { label: "Как мы работаем", href: "#how" },
      { label: "Отзывы", href: "#reviews" },
      { label: "Вопросы и ответы", href: "#faq" },
      { label: "Блог", href: "#news" },
    ],
  },
  { label: "Контакты", href: "#contacts" },
];
