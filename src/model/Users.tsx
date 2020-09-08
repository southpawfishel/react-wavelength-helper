import { Record, List, Map } from 'immutable';
import { Guid } from 'guid-typescript'
import { randomElement } from '../util/immutable-shuffle';

export type Team = 'green' | 'blue';

interface IUser {
  id: string;
  guess: number;
  name: string;
  team: Team | null;
}

const randomName = () => {
  const adjectives = List([
    "Adorable", "Adventurous", "Aggressive", "Agreeable", "Alert", "Alive", "Amused", "Angry", "Annoyed", "Annoying", "Anxious", "Arrogant", "Ashamed", "Attractive", "Average", "Awful", "Bad", "Beautiful", "Better", "Bewildered", "Black", "Blue", "Blushing", "Bored", "Brainy", "Brave", "Breakable", "Bright", "Busy", "Calm", "Careful", "Cautious", "Charming", "Cheerful", "Clean", "Clear", "Clever", "Cloudy", "Clumsy", "Colorful", "Combative", "Comfortable", "Concerned", "Condemned", "Confused", "Cooperative", "Courageous", "Crazy", "Creepy", "Crowded", "Cruel", "Curious", "Cute", "Dangerous", "Dark", "Dead", "Defeated", "Defiant", "Delightful", "Depressed", "Determined", "Different", "Difficult", "Disgusted", "Distinct", "Disturbed", "Dizzy", "Doubtful", "Drab", "Dull", "Eager", "Easy", "Elated", "Elegant", "Embarrassed", "Enchanting", "Encouraging", "Energetic", "Enthusiastic", "Envious", "Evil", "Excited", "Expensive", "Exuberant", "Fair", "Faithful", "Famous", "Fancy", "Fantastic", "Fierce", "Filthy", "Fine", "Foolish", "Fragile", "Frail", "Frantic", "Friendly", "Frightened", "Funny", "Gentle", "Gifted", "Glamorous", "Gleaming", "Glorious", "Good", "Gorgeous", "Graceful", "Grieving", "Grotesque", "Grumpy", "Handsome", "Happy", "Healthy", "Helpful", "Helpless", "Hilarious", "Homeless", "Homely", "Horrible", "Hungry", "Hurt", "Ill", "Important", "Impossible", "Inexpensive", "Innocent", "Inquisitive", "Itchy", "Jealous", "Jittery", "Jolly", "Joyous", "Kind", "Lazy", "Light", "Lively", "Lonely", "Long", "Lovely", "Lucky", "Magnificent", "Misty", "Modern", "Motionless", "Muddy", "Mushy", "Mysterious", "Nasty", "Naughty", "Nervous", "Nice", "Nutty", "Obedient", "Obnoxious", "Odd", "Old-fashioned", "Open", "Outrageous", "Outstanding", "Panicky", "Perfect", "Plain", "Pleasant", "Poised", "Poor", "Powerful", "Precious", "Prickly", "Proud", "Putrid", "Puzzled", "Quaint", "Real", "Relieved", "Repulsive", "Rich", "Scary", "Selfish", "Shiny", "Shy", "Silly", "Sleepy", "Smiling", "Smoggy", "Sore", "Sparkling", "Splendid", "Spotless", "Stormy", "Strange", "Successful", "Super", "Talented", "Tame", "Tasty", "Tender", "Tense", "Terrible", "Thankful", "Thoughtful", "Thoughtless", "Tired", "Tough", "Troubled", "Ugliest", "Ugly", "Uninterested", "Unsightly", "Unusual", "Upset", "Uptight", "Vast", "Victorious", "Vivacious", "Wandering", "Weary", "Wicked", "Wide-eyed", "Wild", "Witty", "Worried", "Worrisome", "Wrong", "Zany", "Zealous"
  ]);
  const animals = List([
    "aardvark", "albatross", "alligator", "alpaca", "ant", "anteater", "antelope", "antilopine", "ape", "arachnoid", "armadillo", "baboon", "badger", "barracuda", "bat", "bear", "beaver", "bee", "bird", "bison", "bluebird", "boar", "bobcat", "bovine", "buck", "buffalo", "bull", "butterfly", "calf", "camel", "canine", "capeshark", "capybara", "caracal", "caribou", "cassowary", "cat", "caterpillar", "cattle", "chameleon", "chamois", "cheetah", "chick", "chicken", "chimpanzee", "chinchilla", "cobra", "cockerel", "cockroach", "cod", "colt", "cougar", "cow", "coyote", "crab", "crane", "cricket", "crocodile", "crow", "cub", "cuckoo", "curlew", "deer", "dingo", "dinosaur", "doe", "doeling", "dog", "dogfish", "dole", "dolphin", "donkey", "dove", "dragonfly", "drake", "duck", "dugong", "dunlin", "eagle", "echidna", "eel", "eland", "elephant", "elephant seal", "elk", "emu", "falcon", "farrow", "fawn", "ferret", "finch", "fish", "flamingo", "flapper", "fledgling", "foal", "fox", "frog", "froglet", "gazelle", "gecko", "gerbil", "giant panda", "giraffe", "gnat", "gnu", "goat", "goldfinch", "goosander", "goose", "gorilla", "goshawk", "grasshopper", "grouse", "guanaco", "guinea fowl", "guinea pig", "gull", "ham", "hamster", "hare", "harras", "hart", "hatchling", "hawk", "hedgehog", "hen", "herd", "hermit crab", "heron", "herring", "hippopotamus", "hive", "hog, barrow", "hogget", "hoopoe", "hornet", "horse", "hummingbird", "hyena", "ibex", "ibis", "iguana", "impala", "jackal", "jaguar", "jay", "jellyfish", "kangaroo", "kingfisher", "kinkajou", "kit", "kitten", "koala", "komodo dragon", "kookaburra", "kouprey", "kudu", "lady", "lapwing", "lark", "larva", "lemur", "leopard", "lepe", "lepidopteran", "leporine", "lion", "lizard", "llama", "lobster", "locust", "loris", "louse", "lynx", "lyrebird", "macaque", "macaw", "magpie", "mallard", "mammoth", "manatee", "mandrill", "marmoset", "marmot", "meerkat", "mink", "mole", "mongoose", "monkey", "moose", "mosquito", "mouse", "mutton", "myna", "myrmicine", "narwhal", "newt", "nightingale", "octopus", "opossum", "orangutan", "oryx", "ostrich", "otter", "owl", "owlet", "oyster", "panda", "panther", "parrot", "partridge", "peachick", "peafowl", "peep", "pelican", "penguin", "pheasant", "pig", "pigeon", "piglet", "pika", "pillow", "pony", "porcupine", "porpoise", "prairie dog", "pug", "pullet", "pup", "puppy", "quail", "rabbit", "raccoon", "rag", "ram", "rat", "raven", "red deer", "red panda", "reindeer", "reynard", "rhinoceros", "rigg", "rock salmon", "roo", "rook", "rookery", "rout", "salamander", "salmon", "sand dollar", "sandpiper", "sardine", "sawt", "sea lion", "seahorse", "seal", "serpentine", "shark", "sheep", "shoal", "shrew", "siamang", "skunk", "sloth", "sloth", "snail", "snake", "sneak", "sow", "spider", "squeaker", "squid", "squirrel", "stag", "stand", "starling", "stegosaurus", "stud", "swan", "swarm", "tadpole", "tamarin", "tapir", "tarsier", "termite", "thunder", "tiger", "toad", "toadlet", "toucan", "turkey", "turtle", "umbrellabird", "viper", "vulture", "wallaby", "walrus", "wasp", "water buffalo", "weasel", "whale", "whelp", "wolf", "wolverine", "wombat", "woodpecker", "worm", "wren", "yak", "zebra"
  ]);

  return `${randomElement(adjectives)} ${randomElement(animals)}`;
}

const DefaultUser: IUser = {
  id: '',
  guess: 0.5,
  name: "defaultName",
  team: null
}

export const CreateUser = (team: Team | null = null) => {
  return new User({
    id: Guid.create().toString(),
    guess: 0.5,
    team: team,
    name: randomName(),
  });
}

export class User extends Record(DefaultUser) { };

export type ConnectionStatus = 'not_connected' | 'connecting' | 'connected';

export interface IUsers {
  localUser: User;
  onlineUsers: Map<string, User>;
  clueGiverId: string | null;
  connectionStatus: ConnectionStatus;
}

export const areWeConnected = (state: Users) => {
  return state.onlineUsers.isEmpty() === false;
}

export const isUserLocal = (user: User, state: Users) => {
  return user.id === state.localUser.id;
}

export const isUserClueGiver = (user: User, state: Users) => {
  if (state.clueGiverId === null) {
    return false;
  }
  return user.id === state.clueGiverId;
}

export const isLocalUserClueGiver = (state: Users) => {
  return isUserClueGiver(state.localUser, state);
}

const DefaultUsers: IUsers = {
  localUser: CreateUser(),
  onlineUsers: Map({}),
  clueGiverId: null,
  connectionStatus: 'not_connected',
}

export class Users extends Record(DefaultUsers) { };

export const CreateUsers = () => {
  return new Users();
}