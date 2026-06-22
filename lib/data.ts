export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number; // cena w groszach, np. 14900 to 149.00 PLN
  image_url: string;
  category: string;
  stock: number;
}

export const PRODUCTS: Product[] = [
  {
    id: 'prod_1',
    name: 'Bezprzewodowe Słuchawki Premium',
    slug: 'bezprzewodowe-sluchawki-premium',
    description: 'Najwyższej jakości dźwięk z aktywną redukcją szumów (ANC). Wygodne nauszniki i do 30 godzin pracy na jednym ładowaniu.',
    price: 59900, // 599.00 PLN
    image_url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=60',
    category: 'Elektronika',
    stock: 15,
  },
  {
    id: 'prod_2',
    name: 'Minimalistyczny Zegarek Kwarcowy',
    slug: 'minimalistyczny-zegarek-kwarcowy',
    description: 'Elegancki zegarek z kopertą ze stali nierdzewnej i skórzanym paskiem. Idealny zarówno do garnituru, jak i na co dzień.',
    price: 34900, // 349.00 PLN
    image_url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=60',
    category: 'Akcesoria',
    stock: 8,
  },
  {
    id: 'prod_3',
    name: 'Ergonomiczna Mysz Bezprzewodowa',
    slug: 'ergonomiczna-mysz-bezprzewodowa',
    description: 'Zaprojektowana z myślą o wielogodzinnej pracy przy komputerze. Zmniejsza napięcie mięśni nadgarstka, posiada programowalne przyciski.',
    price: 19900, // 199.00 PLN
    image_url: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=500&auto=format&fit=crop&q=60',
    category: 'Elektronika',
    stock: 22,
  },
  {
    id: 'prod_4',
    name: 'Plecak Miejski / Na Laptopa',
    slug: 'plecak-miejski-na-laptopa',
    description: 'Wodoodporny plecak z dedykowaną, bezpieczną przegrodą na laptopa 15.6 cala. Posiada ukryte kieszenie na dokumenty i port USB do powerbanka.',
    price: 24900, // 249.00 PLN
    image_url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&auto=format&fit=crop&q=60',
    category: 'Akcesoria',
    stock: 30,
  }
];