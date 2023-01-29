import spaghetti from '../assets/img/moms-spaghetti.webp';
import secretteacher from "../assets/img/The-Secret-Teacher.webp";
import Nerds from "../assets/img/Nerds.jpeg";
import rantinghomer from "../assets/img/rantinghomer.gif";

export const PARTNERS = [
  {
    id: 0,
    name: "Bootstrap Outfitters",
    image: spaghetti,
    featured: false,
    description:
      "Bootstrap Outfitters supplies you with the gear you need at prices you can't beat.",
  },
  {
    id: 1,
    name: "Git Out Expeditions",
    image: secretteacher,
    featured: false,
    description:
      "Join Git Out Expeditions to explore new horizons with a group of other adventurers!",
  },
  {
    id: 2,
    name: "Mongo Fly Shop",
    image: Nerds,
    featured: false,
    description:
      "Need a new fishing pole, a tacklebox, or flies of all kinds? Stop by Mongo Fly Shop.",
  },
  {
    id: 3,
    name: "Node Outdoor Apparel",
    image: rantinghomer,
    featured: true,
    description:
      "From polar fleeces to swimsuits, hiking boots to waders, a visit to Node will be sure to get you covered.",
  },
];
