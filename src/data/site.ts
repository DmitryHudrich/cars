// Контакты и реквизиты. Позже эти данные будут редактироваться из админки.
export const site = {
  name: "Ранг Авто",
  legalName: "ООО «Ранг Авто»",
  inn: "3000026854",
  ogrn: "1263000003573",
  phones: ["+7 (937) 505-55-88", "+7 (909) 452-77-57"],
  phoneShort: "8 (937) 505-55-88",
  email: "rangauto@mail.ru",
  // coords: [широта, долгота] — для карты в блоке контактов
  offices: [
    { city: "Краснодар", address: "Краснодар, ул. Западный Обход, 29", phone: "+7 (937) 505-55-88", coords: [45.080338, 38.893745] },
    { city: "Астрахань", address: "Астрахань, Славянская 1л", phone: "+7 (909) 452-77-57", coords: [46.359931, 48.096326] },
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

export const nav = [
  {
    label: "Каталог",
    href: "#catalog",
    children: [
      { label: "Авто из Китая", href: "#catalog" },
      { label: "Авто из Кореи", href: "#catalog" },
      { label: "Авто из Японии", href: "#catalog" },
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
