// Контакты и реквизиты. Позже эти данные будут редактироваться из админки.
export const site = {
  name: "Ранг Авто",
  legalName: "ООО «Ранг Авто»",
  inn: "3000026854",
  ogrn: "1263000003573",
  phones: ["+7 (937) 505-55-88", "+7 (937) 505-55-88"],
  phoneShort: "8 (937) 505-55-88",
  email: "rangauto@mail.ru",
  offices: [
    { city: "Краснодар", address: "Краснодар, ул. Западный Обход, 29", main: true },
    { city: "Астрахань", address: "Астрахань, Славянская 1л", main: false },
  ],
  schedule: ["Пн - Пт - с 8:00 до 19:00", "Сб - Вс - с 8:00 до 17:00"],
  // TODO: реальные ссылки на каналы
  socials: {
    telegram: "https://t.me/",
    max: "https://max.ru/",
    vk: "https://vk.com/",
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
