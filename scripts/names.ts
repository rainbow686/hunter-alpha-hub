// 150 个最常见的英文名（混合男女名）
export const COMMON_ENGLISH_NAMES = [
  // 男性名
  "James", "John", "Robert", "Michael", "William", "David", "Richard", "Joseph", "Thomas", "Charles",
  "Christopher", "Daniel", "Matthew", "Anthony", "Donald", "Mark", "Paul", "Steven", "Andrew", "Kenneth",
  "Joshua", "Kevin", "Brian", "George", "Timothy", "Ronald", "Edward", "Jason", "Jeffrey", "Ryan",
  "Jacob", "Gary", "Nicholas", "Eric", "Jonathan", "Stephen", "Larry", "Justin", "Scott", "Brandon",
  "Benjamin", "Samuel", "Gregory", "Alexander", "Patrick", "Frank", "Raymond", "Jack", "Dennis", "Jerry",
  "Tyler", "Aaron", "Jose", "Adam", "Henry", "Nathan", "Douglas", "Zachary", "Peter", "Kyle",
  "Walter", "Ethan", "Jeremy", "Harold", "Keith", "Christian", "Roger", "Terry", "Austin", "Sean",
  "Gerald", "Carl", "Dylan", "Aaron", "Jose", "Logan", "Albert", "Bruce", "Willie", "Jordan",

  // 女性名
  "Mary", "Patricia", "Jennifer", "Linda", "Elizabeth", "Barbara", "Susan", "Jessica", "Sarah", "Karen",
  "Nancy", "Lisa", "Betty", "Margaret", "Sandra", "Ashley", "Dorothy", "Kimberly", "Emily", "Donna",
  "Michelle", "Carol", "Amanda", "Melissa", "Deborah", "Stephanie", "Rebecca", "Sharon", "Laura", "Cynthia",
  "Kathleen", "Amy", "Shirley", "Angela", "Helen", "Anna", "Brenda", "Pamela", "Nicole", "Emma",
  "Samantha", "Katherine", "Christine", "Debra", "Rachel", "Carolyn", "Janet", "Catherine", "Maria", "Heather",
  "Diane", "Virginia", "Julie", "Joyce", "Victoria", "Lauren", "Kelly", "Christina", "Joan", "Evelyn",
  "Judith", "Megan", "Cheryl", "Andrea", "Hannah", "Olivia", "Martha", "Jacqueline", "Frances", "Gloria",
  "Ann", "Jean", "Alice", "Kathryn", "Grace", "Judy", "Theresa", "Beverly", "Denise", "Marilyn",
  "Amber", "Danielle", "Brittany", "Diana", "Abigail", "Jane", "Natalie", "Sophia", "Alexis", " Lori",

  // 中性名/其他
  "Alex", "Taylor", "Morgan", "Casey", "Jamie", "Riley", "Avery", "Quinn", "Cameron", "Skyler"
];

export function getRandomName(index?: number): string {
  if (index !== undefined) {
    return COMMON_ENGLISH_NAMES[index % COMMON_ENGLISH_NAMES.length];
  }
  return COMMON_ENGLISH_NAMES[Math.floor(Math.random() * COMMON_ENGLISH_NAMES.length)];
}

export function getNameByIndex(index: number): string {
  return COMMON_ENGLISH_NAMES[index % COMMON_ENGLISH_NAMES.length];
}
