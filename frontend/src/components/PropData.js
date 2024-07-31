// img,name, age,sex, adress, condition, description, created,

const testAnimals = [
  {
    img: undefined,
    name: "Jeka",
    age: 20,
    sex: "male",
    adress: "BT71 34R London Squer",
    conditions: "not bad",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum",
    created: "12.15.2027",
  },
  {
    img: undefined,
    name: "Miki",
    age: 20,
    sex: "male",
    adress: "BT71 34R London Squer",
    conditions: "good",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum",
    created: "12.15.2027",
  },
  {
    img: undefined,
    name: "Bigbo",
    age: 20,
    sex: "female",
    adress: "BT71 34R London Squer",
    conditions: "bad",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum",
    created: "12.15.2027",
  },
  {
    img: undefined,
    name: "Jeka",
    age: 20,
    sex: "male",
    adress: "BT71 34R London Squer",
    conditions: "good",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum",
    created: "12,15,2027",
  },
  {
    img: undefined,
    name: "Miki",
    age: 20,
    sex: "male",
    adress: "BT71 34R London Squer",
    conditions: "good",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum",
    created: "12.15.2027",
  },
  {
    img: undefined,
    name: "Bigbo",
    age: 20,
    sex: "female",
    adress: "BT71 34R London Squer",
    conditions: "bad",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum",
    created: "12.15.2027",
  },
  {
    img: undefined,
    name: "Jeka",
    age: 20,
    sex: "male",
    adress: "BT71 34R London Squer",
    conditions: "not bad",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum",
    created: "12.15.2027",
  },
  {
    img: undefined,
    name: "Miki",
    age: 20,
    sex: "male",
    adress: "BT71 34R London Squer",
    conditions: "good",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum",
    created: "12.15.2027",
  },
  {
    img: undefined,
    name: "Bigbo",
    age: 20,
    sex: "female",
    adress: "BT71 34R London Squer",
    conditions: "bad",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum",
    created: "12.15.2027",
  },
];

const animals = [
  {
    type: "dog",
    properties: {
      id: 960,
      sex: "male",
      bread: "Pitbull",
      age: 2,
      age_guess: "Adult",
      name: "Buddy",
      description:
        "Buddy is a very friendly dog. He loves to play and run around. He is very good with kids and other dogs. He is a very good",
    },
    media: {
      photos: [
        "https://hips.hearstapps.com/ghk.h-cdn.co/assets/17/30/pit-bull.jpg",
      ],
      videos: [],
    },
    geometry: {
      type: "Point",
      coordinates: [44.483321, 41.337298],
    },
    icon_color: "blue",
  },
  {
    type: "cat",
    properties: {
      id: 961,
      sex: "female",
      bread: "british-shorthair",
      age: 4,
      age_guess: "Adult",
      name: "Sassy",
      description:
        "Sassy is a very friendly cat. She loves to play and run around. She is very good with kids and other cats. She is a very good",
    },
    media: {
      photos: [
        "https://image.petmd.com/files/styles/978x550/public/2023-04/british-shorthair.jpg",
      ],
      videos: [],
    },
    geometry: {
      type: "Point",
      coordinates: [44.383315, 42.347298],
    },
    icon_color: "yellow",
  },
  {
    type: "dog",
    properties: {
      id: 962,
      sex: "male",
      bread: "Poodle",
      age: 1,
      age_guess: "Puppy",
      name: "Max",
      description:
        "Max is a very friendly dog. He loves to play and run around. He is very good with kids and other dogs. He is a very good",
    },
    media: {
      photos: [
        "https://www.thesprucepets.com/thmb/-Bx_TMMdE_hWd2p2x_zKJlbN-EI=/750x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/irish-dog-names-4798912-hero-fedcedd8960f42788c2f58e269952b4a.jpg",
      ],
      videos: [],
    },
    geometry: {
      type: "Point",
      coordinates: [43.38332, 41.3572987],
    },
    icon_color: "green",
  },
];

export { animals, testAnimals };
