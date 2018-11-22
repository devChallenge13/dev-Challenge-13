export default function CrosswordDataService() {
  'ngInject';

  return {
    getCrosswordData() {
      return [
        {
          question: 'A tropical bird with a large beak',
          answer: 'Tucan'
        },
        {
          question: 'This free-ranging dog is at home in the outback.',
          answer: 'Dingo'
        },
        {
          question: 'A friendly finned non-fish',
          answer: 'Dolphin'
        },
        {
          question: 'Bosses of the farm in Orwell\'s world',
          answer: 'Pig'
        },
        {
          question: 'Boxing champions of the outback',
          answer: 'Kangaroo'
        },
        {
          question: 'Eight legged sea creature',
          answer: 'Octopus'
        },
        {
          question: 'Furry rodent whose teeth never stop growing',
          answer: 'Hamster'
        },
        {
          question: 'Dating back further than the T-rex, this reptile is a modern day dinosaur',
          answer: 'Alligator'
        },
        {
          question: 'Flightless bird not know for its people skills',
          answer: 'Ostrich'
        },
        {
          question: 'Friendly version of the infamous Australian tourist terrorizing tree-dwellers',
          answer: 'Koala'
        },
        {
          question: 'This poor animal is often the victim of feline aggression and human experimentation',
          answer: 'Mouse'
        },
        {
          question: 'The victim of every lion documentary clip you\'ve ever seen.',
          answer: 'Antelope'
        }
      ];
    }
  };
}
