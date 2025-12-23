// Maps course IDs to their theme colors and patterns
// Extracted from courseTheme.css for use in components

export const courseThemeColors = {
  0: { // Philosophy
    primary: '#02b5f1',
    secondary: '#0299cc',
    name: 'Philosophy Blue',
    pattern: 'https://www.shutterstock.com/image-vector/lamp-light-bulb-hand-drawn-600w-520326277.jpg'
  },
  1: { // World Wars
    primary: '#f10202',
    secondary: '#cc0101',
    name: 'World Wars Red',
    pattern: 'https://thumbs.dreamstime.com/z/military-aircraft-pattern-seamless-black-military-aircraft-pattern-repeat-seamless-black-color-any-design-vector-geometric-102903104.jpg'
  },
  2: { // Personal Finance
    primary: '#2efa05',
    secondary: '#25cc04',
    name: 'Finance Green',
    pattern: 'https://www.shutterstock.com/image-illustration/leather-purse-pattern-repeat-seamless-600w-1106709062.jpg'
  },
  3: { // Policing in America
    primary: '#ff7b00',
    secondary: '#d66800',
    name: 'Policing Orange',
    pattern: 'https://www.shutterstock.com/image-vector/police-related-icon-set-outline-600w-1042818226.jpg'
  },
  4: { // Film
    primary: '#3c08e8',
    secondary: '#3007c4',
    name: 'Film Purple',
    pattern: 'https://thumbs.dreamstime.com/z/cinema-seamless-pattern-icons-movie-background-tv-show-television-online-entertainment-concept-film-elements-repeating-251720735.jpg'
  },
  5: { // Programming
    primary: '#3c08e8',
    secondary: '#3007c4',
    name: 'Programming Purple',
    pattern: 'https://as1.ftcdn.net/v2/jpg/02/38/22/66/1000_F_238226669_2e3HdJV5zB9LKE2RWaWoDN692MLSnv4g.jpg'
  },
  6: { // Epics
    primary: '#f2ff00',
    secondary: '#d4e000',
    name: 'Epics Yellow',
    pattern: 'https://c8.alamy.com/comp/2GNBWB5/ancient-greece-mythology-history-vector-seamless-pattern-2GNBWB5.jpg'
  },
  7: { // Survive the World
    primary: '#00ff7f',
    secondary: '#00d66b',
    name: 'Survival Green',
    pattern: 'https://image.shutterstock.com/image-vector/seamless-pattern-survival-people-surviving-600w-500423134.jpg'
  },
  8: { // History of Piracy
    primary: '#333333',
    secondary: '#1a1a1a',
    name: 'Pirate Dark',
    pattern: 'http://historyhub.ie/assets/Ortelius-Maris-Pacifici_960b.jpg'
  },
  9: { // US History
    primary: '#c21414',
    secondary: '#a01111',
    name: 'US History Red',
    pattern: 'https://www.fractalcamo.com/uploads/5/9/0/2/5902948/s189772745713394276_p2806_i100_w1000.jpeg'
  },
  10: { // Government
    primary: '#07493a',
    secondary: '#053a2e',
    name: 'Government Teal',
    pattern: 'https://en.pimg.jp/043/069/837/1/43069837.jpg'
  },
  11: { // Migration
    primary: '#177828',
    secondary: '#126320',
    name: 'Migration Green',
    pattern: 'https://www.voicesofyouth.org/sites/voy/files/styles/full_width_image/public/images/2020-01/world_passports_2019_0_0.jpg?itok=oQC2AJnK'
  },
  12: { // Holy Land
    primary: '#3911be',
    secondary: '#2e0e9a',
    name: 'Holy Land Purple',
    pattern: 'https://img.freepik.com/premium-vector/seamless-geometric-pattern-authentic-arabian-style-vector-illustration_151170-1465.jpg?w=740'
  },
  13: { // History of Disease
    primary: '#8b44f7',
    secondary: '#7535d4',
    name: 'Disease Purple',
    pattern: 'https://st2.depositphotos.com/4170955/11531/v/950/depositphotos_115319956-stock-illustration-pink-blue-bacteria-in-repeat.jpg'
  },
  14: { // Cold War
    primary: '#ef2a03',
    secondary: '#c92302',
    name: 'Cold War Red',
    pattern: 'https://d1sxy7l4fhu207.cloudfront.net/uploads/392/conversions/Banner_2_Red_1579264170-1255x780.jpg'
  },
  15: { // Ancient History
    primary: '#d4a76a',
    secondary: '#b88f57',
    name: 'Ancient Gold',
    pattern: 'https://previews.123rf.com/images/paseven/paseven2003/paseven200300111/142997248-vector-seamless-pattern-on-the-ancient-egypt-theme-with-unreadable-notes-hieroglyphs-and-sketches.jpg'
  },
  16: { // Speech and Debate
    primary: '#be111c',
    secondary: '#9e0e17',
    name: 'Debate Red',
    pattern: 'https://img.freepik.com/premium-vector/comic-speech-bubble-set-with-halftone-shadow_6997-2059.jpg?w=360'
  },
  17: { // Critical Race Theory
    primary: '#be111c',
    secondary: '#9e0e17',
    name: 'CRT Red',
    pattern: 'https://i.pinimg.com/originals/a7/ea/f1/a7eaf16988a163f6efb3efd0ba35b690.gif'
  }
};

/**
 * Get the theme color for a course by ID
 * @param {number} courseId - The course ID
 * @returns {object} - Object with primary, secondary colors, and pattern
 */
export const getCourseThemeColor = (courseId) => {
  return courseThemeColors[courseId] || {
    primary: '#00B894',
    secondary: '#009977',
    name: 'Default Green',
    pattern: ''
  };
};
