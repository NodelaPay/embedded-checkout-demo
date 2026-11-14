export const images = {
  heroNewYork: "/images/hero-new-york.jpg",
  heroLosAngeles: "/images/hero-los-angeles.jpg",
  monochrome: "/images/editorial-monochrome.jpg",
  coat: "/images/editorial-coat.jpg",
  red: "/images/editorial-red.jpg",
  leather: "/images/editorial-leather.jpg",
  scarf: "/images/editorial-scarf.jpg",
  black: "/images/editorial-black.jpg",
  shoes: "/images/product-shoes.jpg",
  shoesAlt: "/images/product-shoes-alt.jpg",
  bag: "/images/product-bag.jpg",
  street: "/images/editorial-street.jpg",
  trench: "/images/editorial-trench.jpg",
  redTwo: "/images/editorial-red-2.jpg",
};

export const editorialCopy =
  "A placeholder text is a block of nonsensical or meaningless text that is temporarily used to fill a space where actual content will eventually appear.";

export type Product = {
  id: string;
  category: string;
  title: string;
  price: number;
  image: string;
};

export const products = [
  {
    id: "coat-01",
    category: "COATS",
    title: "PIECE TITLE",
    price: 875,
    image: images.trench,
  },
  {
    id: "coat-02",
    category: "COATS",
    title: "PIECE TITLE",
    price: 875,
    image: images.coat,
  },
  {
    id: "coat-03",
    category: "COATS",
    title: "PIECE TITLE",
    price: 875,
    image: images.scarf,
  },
  {
    id: "bag-01",
    category: "BAGS",
    title: "PIECE TITLE",
    price: 875,
    image: images.bag,
  },
  {
    id: "bag-02",
    category: "BAGS",
    title: "PIECE TITLE",
    price: 875,
    image: images.street,
  },
  {
    id: "bag-03",
    category: "BAGS",
    title: "PIECE TITLE",
    price: 875,
    image: images.leather,
  },
] as const satisfies readonly Product[];
