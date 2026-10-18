import {
  BadgeCheck,
  Calculator,
  Car,
  Check,
  Clock,
  CreditCard,
  FileText,
  Info,
  MapPin,
  Search,
  ShieldCheck,
  Ship,
  Truck,
  type LucideProps,
} from "lucide-react";

const icons = {
  search: Search,
  doc: FileText,
  check: Check,
  ship: Ship,
  badge: BadgeCheck,
  car: Car,
  shield: ShieldCheck,
  calc: Calculator,
  clock: Clock,
  pin: MapPin,
  info: Info,
  card: CreditCard,
  truck: Truck,
};

export type IconName = keyof typeof icons;

export function Icon({ name, ...props }: { name: IconName } & LucideProps) {
  const Cmp = icons[name];
  return <Cmp aria-hidden strokeWidth={1.8} {...props} />;
}
