import rantinghomer from '../assets/img/rantinghomer.gif';
import urges from "../assets/img/urges.jpeg";
import greeks from "../assets/img/greek-philosophers.webp";
import HotTake from "../assets/img/HotTake.jpeg";

export const TAKES = [
  {
    id: 0,
    name: "Mountain Adventure",
    image: rantinghomer,
    featured: false,
    description:
      "Book a 5-day mountain trek with a seasoned outdoor guide! Fly fishing equipment and lessons provided.",
  },
  {
    id: 1,
    name: "Into The Weeds",
    image: urges,
    featured: false,
    description:
      "5 days deep in the Redux National Monument, far from the beaten path, with only a reducer in your backpack. Guide provided.",
  },
  {
    id: 2,
    name: "The Hot Take",
    image: HotTake,
    featured: true,
    description: `Infuse your teaching with insights from the cutting edge`,
  },
  {
    id: 3,
    name: "Asynchronous Rendezvous",
    image: greeks,
    featured: false,
    description:
      "Meet up with your guide at the top of Promise Mountain. Or, try to. Good luck!",
  },
];

export const FEEDBACK = [
  {
    id: 0,
    firstname: "Test",
    lastname: "Test",
    phoneNum: "12345",
    email: "test@test.com",
    agree: true,
    contactType: "Email",
    feedback: "test",
  },
];