import { asset } from "@/lib/asset";
// Контент лендинга. Всё, что помечено TODO, — заглушки до получения материалов от заказчика.
// Структура данных повторяет будущие сущности админки.

export type CountryId = "cn" | "kr" | "jp";

export const countries: { id: CountryId; name: string; genitive: string; flag: string }[] = [
  { id: "cn", name: "Китай", genitive: "Китая", flag: asset("/img/flags/cn.webp") },
  { id: "kr", name: "Корея", genitive: "Кореи", flag: asset("/img/flags/kr.webp") },
  { id: "jp", name: "Япония", genitive: "Японии", flag: asset("/img/flags/jp.webp") },
];

export const heroStats = [
  { icon: "clock", value: "8+ лет", label: "на рынке импорта" },
  { icon: "car", value: "3 400+", label: "авто привезли", accent: true },
  { icon: "pin", value: "2", label: "филиала в РФ" },
  { icon: "shield", value: "Гарантия", label: "на ДВС и КПП" },
] as const;

export const clientPhotos = [1, 2, 3, 4, 5, 6].map((n) => ({
  src: asset(`/img/clients/client-${n}.webp`),
  alt: "Клиент Ранг Авто со своим автомобилем",
}));

export type Car = {
  id: string;
  country: CountryId;
  title: string;
  price: number;
  specs: string;
  img: string;
  market: { min: number; max: number; position: number; label: string; tone: "up" | "down" };
  priceDrop?: string;
};

// TODO: каталог будет приходить из БД/API. Сейчас — 4 карточки из макета.
export const cars: Car[] = [
  {
    id: "vw-passat-2020",
    country: "cn",
    title: "Volkswagen Passat, мар 2020",
    price: 4176959,
    specs: "2.0 л · 186 л.с. · Автомат · Передний · 31 000 км · Бензин · Седан · Черный",
    img: asset("/img/cars/car-1.jpg"),
    market: { min: 3283087, max: 4138722, position: 0.97, label: "Дороже 95 % похожих", tone: "up" },
  },
  {
    id: "geely-panda-2025",
    country: "cn",
    title: "Geely Panda, окт 2025",
    price: 1136435,
    specs: "41 л.с. · Автомат · Задний · 9 000 км · Электромобиль · Хэтчбек · Зеленый",
    img: asset("/img/cars/car-2.jpg"),
    market: { min: 785160, max: 1206210, position: 0.82, label: "Дороже 82 % похожих", tone: "up" },
  },
  {
    id: "honda-accord-2023",
    country: "cn",
    title: "Honda Accord, июн 2023",
    price: 3504177,
    specs: "1.5 л · 194 л.с. · Автомат · Передний · 90 000 км · Бензин · Седан · Белый",
    img: asset("/img/cars/car-3.jpg"),
    market: { min: 3236156, max: 3906065, position: 0.18, label: "Дешевле 82 % похожих", tone: "down" },
  },
  {
    id: "nissan-sylphy-2024",
    country: "cn",
    title: "Nissan Sylphy, мар 2024",
    price: 1658530,
    specs: "1.6 л · 135 л.с. · Автомат · Передний · 75 000 км · Бензин · Седан · Белый",
    img: asset("/img/cars/car-4.jpg"),
    market: { min: 1224772, max: 2024110, position: 0.58, label: "Дороже 58 % похожих", tone: "up" },
    priceDrop: "дешевле на 41 тыс ₽ через 5 мес.",
  },
];

export const workSteps = [
  {
    icon: "search",
    title: "Заявка и подбор",
    text: "Озвучиваете бюджет и задачи - присылаем подборку реальных лотов с аукционов с расчетом под ключ.",
  },
  {
    icon: "doc",
    title: "Договор",
    text: "Заключаем договор с ООО «РАНГ АВТО»: фиксируем сроки, стоимость услуг и гарантии.",
  },
  {
    icon: "check",
    title: "Проверка и выкуп",
    text: "Наш эксперт осматривает авто на площадке, читает аукционный лист и торгуется за вас.",
  },
  {
    icon: "ship",
    title: "Доставка в порт",
    text: "Экспортные документы, погрузка, фрахт. Отгрузки из Кореи - 2 раза в неделю, из Китая - еженедельно.",
  },
  {
    icon: "badge",
    title: "Таможня",
    text: "Оформляем пошлину, утильсбор, СБКТС и ЭПТС. По каждому платежу - квитанция.",
  },
  {
    icon: "car",
    title: "Выдача с гарантией",
    text: "Выдаем авто с полным пакетом документов и гарантией на двигатель и КПП.",
  },
] as const;

export const promos = [
  {
    title: "Детейлинг за наш счёт",
    text: "При заказе автомобиля делаем профессиональный детейлинг перед выдачей. Подготовим кузов и салон, чтобы первая встреча с вашим автомобилем была особенной.",
    img: asset("/img/promo/detailing.webp"),
  },
  {
    title: "Комплект для ТО",
    text: "При покупке автомобиля в РАНГ АВТО комплект для первого технического обслуживания — за наш счёт!",
    img: asset("/img/promo/to-kit.webp"),
  },
  {
    title: "Русификация без доплат",
    text: "Закажите автомобиль из Китая и получите русификацию мультимедийной системы в подарок. Сделаем управление привычным и удобным с первых поездок.",
    // TODO: в макете нет фото для этой акции
    img: asset("/img/hero.webp"),
  },
];

export type CountryInfo = {
  id: CountryId;
  name: string;
  tabText: string;
  tabImg: string;
  map: string;
  description: string;
  features: string[];
  stats: { value: string; label: string }[];
  routes: { kind: "truck" | "ship"; title: string; note: string }[];
};

export const geography: CountryInfo[] = [
  {
    id: "cn",
    name: "Китай",
    tabText: "Новые и б/у авто\nс внутреннего рынка",
    tabImg: asset("/img/geo/tab-cn.webp"),
    map: asset("/img/geo/map-cn.webp"),
    description:
      "Новые и б/у авто с внутреннего рынка Китая: машины эксплуатировались в мягком климате, не видели солевых зим и жестких реагентов",
    features: ["Новые и б/у\nавтомобили", "Гибриды\nи электромобили", "Турбо-\nкроссоверы", "Богатые\nкомплектации"],
    stats: [
      { value: "от 15 дней", label: "срок под ключ" },
      { value: "2 маршрута", label: "по суше" },
      { value: "от 1,3 млн", label: "цена под ключ" },
    ],
    routes: [
      { kind: "truck", title: "Суйфэньхэ → Владивосток", note: "автовозом, 15-30 дней" },
      { kind: "ship", title: "Суйфэньхэ → Владивосток", note: "автовозом, 15-30 дней" },
    ],
  },
  {
    id: "kr",
    name: "Корея",
    tabText: "Популярные модели\nи редкие комплектации",
    tabImg: asset("/img/geo/tab-kr.webp"),
    // TODO: карта для Кореи — заказчик пришлёт
    map: asset("/img/geo/map-cn.webp"),
    description: "Честный пробег, идеальное состояние, максимальные комплектации, прозрачная история",
    features: ["Новые и б/у\nавтомобили", "Гибриды\nи электромобили", "Надежные\nкроссоверы", "Богатые\nкомплектации"],
    stats: [
      { value: "от 30 дней", label: "срок под ключ" },
      { value: "2 маршрута", label: "по суше" },
      { value: "от 1,5 млн", label: "цена под ключ" },
    ],
    // TODO: в макете маршруты скопированы с Китая
    routes: [
      { kind: "truck", title: "Суйфэньхэ → Владивосток", note: "автовозом, 15-30 дней" },
      { kind: "ship", title: "Суйфэньхэ → Владивосток", note: "автовозом, 15-30 дней" },
    ],
  },
  {
    id: "jp",
    name: "Япония",
    tabText: "Аукционные автомобили\nс прозрачной историей",
    tabImg: asset("/img/geo/tab-jp.webp"),
    // TODO: карта для Японии — заказчик пришлёт
    map: asset("/img/geo/map-cn.webp"),
    description: "Легендарная надежность, честный пробег, строгий техосмотр и идеальное состояние",
    features: ["Новые и б/у\nавтомобили", "Гибриды\nи электромобили", "Надежные\nкроссоверы", "Богатые\nкомплектации"],
    stats: [
      { value: "от 30 дней", label: "срок под ключ" },
      { value: "5 портов", label: "отгрузки еженедельно" },
    ],
    // TODO: в макете маршруты скопированы с Китая
    routes: [
      { kind: "truck", title: "Суйфэньхэ → Владивосток", note: "автовозом, 15-30 дней" },
      { kind: "ship", title: "Суйфэньхэ → Владивосток", note: "автовозом, 15-30 дней" },
    ],
  },
];

const STUB = "Текст преимущества появится после согласования с заказчиком. Здесь будет 2–3 строки описания.";

export const reasons = [
  {
    icon: "shield",
    title: "Проверенные автомобили",
    text: "Проверяем историю, документы и состояние автомобиля до покупки. Вы получаете информацию о выбранном варианте заранее.",
  },
  {
    icon: "calc",
    title: "Понятная стоимость",
    text: "Рассчитываем бюджет под ключ с учётом покупки, доставки и обязательных платежей. Объясняем, из чего складывается итоговая сумма.",
  },
  {
    icon: "doc",
    title: "Официальное оформление",
    text: "Заключаем договор, фиксируем условия сотрудничества и сопровождаем оформление необходимых документов.",
  },
  // TODO: тексты для карточек 4–9
  { icon: "clock", title: "Преимущество 4", text: STUB },
  { icon: "car", title: "Преимущество 5", text: STUB },
  { icon: "pin", title: "Преимущество 6", text: STUB },
  { icon: "badge", title: "Преимущество 7", text: STUB },
  { icon: "ship", title: "Преимущество 8", text: STUB },
  { icon: "check", title: "Преимущество 9", text: STUB },
] as const;

// TODO: все фото отзывов — заказчик пришлёт; пока фото из макета
export const reviews = [
  { photo: asset("/img/clients/client-1.webp"), name: "Клиент", car: "Audi A3" },
  { photo: asset("/img/clients/client-2.webp"), name: "Клиент", car: "Hyundai Elantra" },
  { photo: asset("/img/clients/client-3.webp"), name: "Клиент", car: "Hyundai Elantra" },
  { photo: asset("/img/clients/client-4.webp"), name: "Клиент", car: "Mercedes-Benz CLA" },
  { photo: asset("/img/clients/client-5.webp"), name: "Клиент", car: "Audi A5" },
  { photo: asset("/img/clients/client-6.webp"), name: "Клиент", car: "Kia Sorento" },
  { photo: asset("/img/clients/client-5.webp"), name: "Клиент", car: "Audi A5" },
  { photo: asset("/img/clients/client-6.webp"), name: "Клиент", car: "Kia Sorento" },
];

export const banks = [
  { name: "Сбер", logo: asset("/img/banks/bank-sber.svg"), w: 178 },
  { name: "ВТБ", logo: asset("/img/banks/bank-vtb.svg"), w: 178 },
  { name: "Т-Банк", logo: asset("/img/banks/bank-tbank.svg"), w: 178 },
  { name: "Альфа-Банк", logo: asset("/img/banks/bank-alfa.svg"), w: 178 },
  { name: "Совкомбанк", logo: asset("/img/banks/bank-sovcom.svg"), w: 233 },
  { name: "Локо-Банк", logo: asset("/img/banks/bank-loko.svg"), w: 178 },
  { name: "ОТП Банк", logo: asset("/img/banks/bank-otp.svg"), w: 178 },
  { name: "Кредит Европа Банк", logo: asset("/img/banks/bank-crediteurope.svg"), w: 293 },
];

export const faqCategories = [
  { id: "general", label: "Общее", icon: "info" },
  { id: "warranty", label: "Гарантия", icon: "shield" },
  { id: "payment", label: "Оплата", icon: "card" },
  { id: "logistics", label: "Логистика", icon: "truck" },
  { id: "docs", label: "Документы", icon: "doc" },
  { id: "check", label: "Проверка", icon: "search" },
] as const;

const ANSWER_STUB =
  "Ответ появится после согласования с заказчиком. Здесь будет развёрнутый ответ на вопрос в 2–4 предложения.";

// TODO: все вопросы и ответы по разделам — заказчик пришлёт
export const faq: Record<(typeof faqCategories)[number]["id"], { q: string; a: string }[]> = {
  general: [
    { q: "Почему выгодно покупать автомобиль из Азии, а не в России?", a: ANSWER_STUB },
    { q: "Чем покупка автомобиля через РАНГ АВТО отличается от самостоятельного заказа?", a: ANSWER_STUB },
    { q: "Что значит «проходной» и «непроходной» автомобиль?", a: ANSWER_STUB },
    { q: "Что делать, если выбранный автомобиль не укладывается в мой бюджет?", a: ANSWER_STUB },
    { q: "Как я могу контролировать процесс покупки и доставки своего автомобиля?", a: ANSWER_STUB },
    { q: "Сколько времени занимает покупка и доставка автомобиля?", a: ANSWER_STUB },
  ],
  warranty: [
    { q: "Какая гарантия даётся на двигатель и КПП?", a: ANSWER_STUB },
    { q: "Что делать, если после покупки обнаружилась неисправность?", a: ANSWER_STUB },
  ],
  payment: [
    { q: "Какие этапы оплаты предусмотрены договором?", a: ANSWER_STUB },
    { q: "Можно ли купить автомобиль в кредит?", a: ANSWER_STUB },
  ],
  logistics: [
    { q: "Какими маршрутами доставляются автомобили?", a: ANSWER_STUB },
    { q: "Застрахован ли автомобиль во время доставки?", a: ANSWER_STUB },
  ],
  docs: [
    { q: "Какие документы я получу вместе с автомобилем?", a: ANSWER_STUB },
    { q: "Что такое СБКТС и ЭПТС?", a: ANSWER_STUB },
  ],
  check: [
    { q: "Как проверяется автомобиль перед покупкой?", a: ANSWER_STUB },
    { q: "Как читать аукционный лист?", a: ANSWER_STUB },
  ],
};

// TODO: блок новостей — обсуждаем отдельно; пока карточки из референса в макете
export const news = [
  {
    tag: "Новости",
    date: "12 октября 2026",
    title: "Китай продолжает ужесточать контроль за экспортом автомобилей",
    text: "Правило 180 дней, лицензии экспортёров и проверка сервиса за рубежом: что уже действует и как это отразится на покупателе.",
    img: asset("/img/news/news-1.jpg"),
  },
  {
    tag: "Логистика",
    date: "12 октября 2026",
    title: "Привоз авто через ЕАЭС и Киргизию: как работает схема",
    text: "Почему ввоз авто через ЕАЭС и Киргизию законен, для каких машин он выгоднее прямой растаможки и чем отличается от серых схем.",
    img: asset("/img/news/news-2.jpg"),
  },
  {
    tag: "Растаможка",
    date: "11 октября 2026",
    title: "Утильсбор и пошлина в 2026 году: сколько стоит растаможка авто для физлиц",
    text: "Льготный утильсбор до 160 л.с., ставки выше порога, пошлина по возрасту и объёму и примеры расчётов.",
    img: asset("/img/news/news-3.jpg"),
  },
  {
    tag: "Школа покупателя",
    date: "10 октября 2026",
    title: "Как читать аукционный лист японского аукциона",
    text: "Оценки S, 4,5 и RA, коды A1, U2, W2 и XX, заметки инспектора: разбираем на двух настоящих примерах.",
    img: asset("/img/news/news-4.jpg"),
  },
];
