import WorldWars from "../assets/img/world-wars-banner.png";
import Philosophy from "../assets/img/flammarion-engraving.jpg";
import Policing from "../assets/img/Policing-in-America.png";
import Finance from "../assets/img/personal-finance.png";
import Film from "../assets/img/film-banner.png";
import Epics from "../assets/img/epics-banner.png";
import Programming from "../assets/img/programming-banner.png";
import Survival from "../assets/img/survive-the-world-banner.png";
import Pirates from "../assets/img/pirates.png"
import Disease from "../assets/img/diseases-image.jpg";
import Migration from "../assets/img/migration.jpg";
import HolyLand from "../assets/img/Bunting-Map-of-the-World-around-Jerusalem-site-Keilo-Jack.jpg";
import Government from "../assets/img/Government.jpeg";
import ColdWar from "../assets/img/ColdWar.jpg";
import Ancient from "../assets/img/AncientHistory.webp";
import USHistory from "../assets/img/Fugitives.jpg";
import Debate from "../assets/img/group_discussions.png";
import CRT from "../assets/img/mind-control-swirl1.webp";

import "../../courseTheme.css";
import "../../courseTheme2.css";

export const COURSES = [
  {
    id: 0,
    icon: "📜",
    name: "Philosophy",
    image: Philosophy,
    credit: [<span className="worldHistoryCredit">'World History'</span>],
    theme: (
      <>
        <div id="philosophyColor"></div>
      </>
    ),
    semester: 2,
    featured: false,
    description:
      "The study of the fundamental nature of knowledge, reality, and existence.",
  },
  {
    id: 1,
    icon: "🪖",
    name: "World Wars",
    image: WorldWars,
    credit: ["US History", "World History"],
    theme: (
      <>
        <div id="wwColor"></div>
      </>
    ),
    semester: 2,
    featured: true,
    description:
      "Focusing on the causes, effects, and fascinating details of WWI and WWII. This class will focus on the first and second world wars. We will start by examining the roots of the wars. We will learn about this topic in many different ways including through reading, writing, discussion, film, and role-playing.",
  },
  {
    id: 2,
    icon: "💰",
    name: "Personal Finance",
    image: Finance,
    credit: ["Elective"],
    theme: (
      <>
        <div id="financeColor"></div>
      </>
    ),
    semester: 2,
    featured: false,
    description:
      "Economics studies the choices that we make. What do we do in a world with limited resources and unlimited wants? This class will begin by focusing with a micro-focus on personal finance examining such topics as savings and taxes. Students will identify what kind of careers they might be well-suited for and feel passionate about. They will have the opportunity to identify their passion and channel it into a dream job. The course will continue by studying macroeconomics as we learn about globalization, trade, and development.",
  },
  {
    id: 3,
    icon: "🚔",
    name: "Policing in America",
    image: Policing,
    credit: ["US History"],
    theme: (
      <>
        <div id="policingColor"></div>
      </>
    ),
    semester: 2,
    featured: false,
    description:
      "This class will focus on the history of policing in the United States of America. The modalities for learning about this topic include reading, writing, discussion, film, and simulations. We will aim to ground our learning beyond the classroom through a field trip to the Justice Center as well as hearing from a public defender among other learning activities. We will aim to meet outside when the weather permits.",
    freeContentDescription: "Speak up. Teach about what matters.",
    free: true,
  },
  {
    id: 4,
    icon: "📽",
    name: "Film",
    image: Film,
    credit: ["Elective"],
    theme: (
      <>
        <div id="filmColor"></div>
      </>
    ),
    semester: 2,
    featured: false,
    description:
      "We will learn to unpack and understand film the same way a literature class studies text or an art class examines art. Students will become proficient in their understanding of film techniques. Learners in this class will have an opportunity to do their own research on film directors. Students will express their own original ideas through the process of drafting storyboards as well as screenplays to make their own stop-motion animations as well as live-action movies.",
    free: false,
  },
  {
    id: 5,
    icon: "👩🏿‍💻",
    name: "Programming",
    image: Programming,
    credit: ["Elective"],
    theme: (
      <>
        <span id="programmingColor"></span>
      </>
    ),
    semester: 1,
    featured: false,
    description:
      "This course is designed to start you on a path toward future studies in web development, design, and data science no matter how little experience or technical knowledge you currently have.By the end you’ll be able to describe the structure and functionality of the world wide web and to create dynamic web pages using a combination of HTML, CSS, and JavaScript.",
  },
  {
    id: 6,
    icon: "⚔",
    name: "Epics",
    image: Epics,
    credit: ["Language Arts"],
    theme: (
      <>
        <span id="epicsColor"></span>
      </>
    ),
    semester: 2,
    featured: true,
    description:
      "From the Mahabharata to the Odyssey epic poems are mysterious stories with ancient origins that contain a wealth of insight regarding what it means to be human and the journey we all go on in life. This class will examine relevant historical connections to these stories and study these poems themselves through excerpts, reinterpretations through graphic novels, roleplay, and art.",
  },
  {
    id: 7,
    icon: "🧭",
    name: <span>Survive the World!</span>,
    image: Survival,
    credit: ["Geography"],

    theme: (
      <>
        <span id="stwColor"></span>
      </>
    ),
    semester: 2,
    featured: false,
    description:
      "This is a geography class. Geography is the study of the physical features of the earth and its atmosphere, and of human activity, as it affects and is affected by these, including the distribution of populations and resources, land use, and industries. We will examine this subject through the lens of survival considering how we can deal with our often harsh world. We will participate in the RISE Challenge, a competition to make our community more resilient to natural disasters depending upon students’ interests.",
  },
  {
    id: 8,
    icon: "☠️",
    name: <span>The History of Piracy</span>,
    image: Pirates,
    credit: ["World History", "Geography"],
    theme: (
      <>
        <span id="wwColor"></span>
      </>
    ),
    semester: 2,
    featured: false,
    description:
      "Pirates continue to excite and fascinate us. What has led to the appearance of these outlaws throughout time? What is the truth behind the myths that we know about pirates? This course explores world history, US history, geography, and physical education through the lens of pirates.",
  },
  {
    id: 9,
    icon: "🇺🇲",
    name: <span>US History of the 1800s</span>,
    image: USHistory,
    credit: ["US History"],
    theme: (
      <>
        <span id="stwColor"></span>
      </>
    ),
    semester: 2,
    featured: false,
    description:
      "The history of the United States in the 1800s has been described as “flyover country” by some historians. While often neglected, the events of this time are crucial to understanding some of the most critical issues of our day. Studying this period of time is both recognizably modern and bizarre and alien at times. This class aims to enlighten students about a period of time that precious few understand.",
  },
  {
    id: 10,
    icon: "🗽",
    name: <span>Government</span>,
    image: Government,
    credit: ["Government"],
    theme: (
      <>
        <span id="stwColor"></span>
      </>
    ),
    semester: 2,
    featured: false,
    description:
      "Students will study the purposes, principles, and practices of the American government as established by the Constitution. Students are expected to understand their rights and responsibilities as citizens and how to exercise these rights and responsibilities in local, state, and national government. Students will learn the structure and processes of the government of the state of Colorado and various local governments.",
  },
  {
    id: 11,
    icon: "🧳",
    name: <span>Migration</span>,
    image: Migration,
    credit: ["World History", "Geography", "Government"],
    theme: (
      <>
        <span id="stwColor"></span>
      </>
    ),
    semester: 2,
    featured: false,
    description:
      "This class will explore the role of migration on the local and global scale as well as the increasing role of technology in our lives. This class aims to reveal the geographic and historical forces that shape the issues of immigration today. The main units of study of this course will focus on issues of immigration in North America ( such as Mexico and the Northern Triangle), Africa, the Middle East (Such as the Israeli and Palestinian conflict and the Syrian conflict), and Asia (Including India and Pakistan.)",
  },
  {
    id: 12,
    icon: "🪬",
    name: <span>The Holy Land</span>,
    image: HolyLand,
    credit: ["World History", "Geography"],
    theme: (
      <>
        <span id="stwColor"></span>
      </>
    ),
    semester: 2,
    featured: false,
    description:
      "This class will focus on the hotly contested region of the Levant and look at how this region has been formed by religious, historical, and geographic forces. Never have I witnessed such sincere hospitality and the overwhelming spirit of true brotherhood as is practiced by people of all colours and races here in this ancient Holy Land, the home of Abraham, Muhammad, and all the other prophets of the Holy Scriptures. For the past week, I have been utterly speechless and spellbound by the graciousness I see displayed all around me by people of all colours.~ Malcolm X,The Holy Land... What an experience ~ Justin Timberlake",
  },
  {
    id: 13,
    icon: "🦠",
    name: <span>The History of Disease</span>,
    image: Disease,
    credit: ["World History", "Geography"],
    theme: (
      <>
        <span id="stwColor"></span>
      </>
    ),
    semester: 2,
    featured: false,
    description:
      "Tracing the impact of infectious diseases on societies throughout time. This course will explore an array of diseases and how they have altered the course of history. Embedded in this curriculum is the history of science, intellectual history, as well as themes of social justice.",
  },
  {
    id: 14,
    icon: "☭",
    name: <span>The Cold War</span>,
    image: ColdWar,
    credit: ["World History", "US History"],
    theme: (
      <>
        <span id="stwColor"></span>
      </>
    ),
    semester: 2,
    featured: false,
    description:
      "This class examines the epic military and ideological clash that occurred between the US and the USSR during the 20th century.",
  },
  {
    id: 15,
    icon: "𓀮",
    name: <span>Ancient History</span>,
    image: Ancient,
    credit: ["World History", "Geography"],
    theme: (
      <>
        <span id="stwColor"></span>
      </>
    ),
    semester: 2,
    featured: false,
    description:
      "This course will cover the history and cultures of the ancient world. The primary focus will be on Mesopotamia, Egypt, China, India, the Greek civilizations, and the rise and fall of the Roman Empire. The history, geography, cultural identity, and impact on the modern world will be studied in-depth. Students will reinforce map skills, interpret mythology, and strengthen written and verbal communication of historical information.",
  },
  {
    id: 16,
    icon: "🗣️",
    name: "Speech and Debate",
    image: Debate,
    credit: ["Elective"],
    theme: (
      <>
        <div id="philosophyColor"></div>
      </>
    ),
    semester: 2,
    featured: false,
    description:
      "This course will develop and improve public speaking and critical thinking skills. Students will prepare and deliver speeches and participate in debates and forums on a variety of topics.",
  },
  {
    id: 17,
    icon: "📢",
    name: "Critical Race Theory",
    image: CRT,
    credit: ["Mandatory"],
    theme: (
      <>
        <div id="philosophyColor"></div>
      </>
    ),
    semester: 2,
    featured: false,
    description: "Coming Soon: As soon as we figure out what that means.",
  },
];
