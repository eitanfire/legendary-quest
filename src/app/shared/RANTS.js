import spaghetti from '../assets/img/moms-spaghetti.webp';
import secretteacher from "../assets/img/The-Secret-Teacher.webp";
import Nerds from "../assets/img/Nerds.jpeg";
import rantinghomer from "../assets/img/rantinghomer.gif";

export const RANTS = [
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
    name: "The Rant",
    image: rantinghomer,
    featured: true,
    description: (
      <span>
        What the teachers are saying. Teachers pushing back against the
        infantilization of the profession.
        <br></br>
        <br></br>
        Get Up on That Soapbox in
        <a
          href="https://www.reddit.com/r/Teachers/"
          target="_blank"
          rel="noopener noreferrer"
        >
          {` `}r/Teachers
        </a>
      </span>
    ),
  },
];
