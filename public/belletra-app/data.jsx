/* Belletra — content model. The one fully-authored line is Verlaine's.
   Learner state (anthology, review queue, rhythm) is kept separate, as the spec asks. */

const VERLAINE = {
  id: "verlaine-pleure",
  // The full couplet — the second line lets the rain Verlaine only echoes finally fall.
  text: "Il pleure dans mon cœur, comme il pleut sur la ville",
  lines: ["Il pleure dans mon cœur,", "comme il pleut sur la ville."],
  teaser: "Il pleure dans mon cœur…",
  tokens: ["Il", "pleure", "dans", "mon", "cœur", "comme", "il", "pleut", "sur", "la", "ville"],
  // Line-level recording. Supply assets/verlaine-pleure.mp3 to replace the live TTS fallback.
  audio: null,
  author: "Paul Verlaine",
  work: "Romances sans paroles",
  year: 1874,
  cefr: "B1",
  feature: "the agentless impersonal",
  curator: "Claire Dubois",
  status: "published",
  human_verified: true,
  depth: "full",
  translation: "It weeps in my heart, as it rains on the town.",
  plain_register: "An ordinary French speaker would simply say « j'ai le cœur gros » — my heart is heavy. Beautiful French refuses to name the self at all: it lets the weeping happen, with no one to blame.",
  hinge_token: "pleure",

  words: {
    "Il": {
      pos: "pronoun",
      gloss: "it — but an « it » that points at no one",
      etymology: {
        surface: "From Latin ille, “that one.” The same root gives English the article-like “the” in other Romance tongues, and the French definite articles le, la.",
        deep: "Latin ille began as a demonstrative — that one, over there. French wore it down to two jobs: the personal il (he), and this colder, emptier il, the grammatical placeholder that fills a subject slot when there is no subject to be found. It is the same word that says « il pleut » — it rains. Verlaine reaches for that second il on purpose: the one that names a weather, not a person."
      }
    },
    "pleure": {
      pos: "verb · 3rd person singular",
      gloss: "weeps, sheds tears",
      etymology: {
        surface: "From Latin plorāre, to wail or lament aloud. A loud, public grief in Latin — softened in French to something quieter and inward.",
        deep: "Plorāre in Latin was not delicate: it meant to cry out, to wail, the grief of mourners. French smoothed the vowel and hushed the sense — pleurer is private, almost soundless. Verlaine sets it one letter away from pleut (rains): pleure / pleut. The ear hears the rain inside the weeping before the mind does. That near-rhyme is the whole poem in miniature."
      }
    },
    "dans": {
      pos: "preposition",
      gloss: "in, inside",
      etymology: {
        surface: "From Latin de intus, “from within.” Two words fused into one small, interior word.",
        deep: "De intus — “from the inside out.” The Latin already carries a direction: not merely located in, but coming from within. So « dans mon cœur » is not a flat address; it leans outward, as if the weeping pressed against the walls of the heart from inside. A lesser preposition (en, à) would have sat still. Dans moves."
      }
    },
    "mon": {
      pos: "possessive",
      gloss: "my",
      etymology: {
        surface: "From Latin meum, “mine.” The single concession to a self in the whole line.",
        deep: "Mon is the only first-person mark Verlaine allows. He will not write je — I weep — but he cannot quite erase himself; the heart is owned. The grief has no agent, yet it has an address. That tension — a self that owns the wound but refuses to claim the act — is exactly what the impersonal il was built to hold."
      }
    },
    "cœur": {
      pos: "noun · masculine",
      gloss: "heart",
      etymology: {
        surface: "From Latin cor, cordis. The same root sits inside English “cordial,” “courage,” and “record” (to bring back through the heart).",
        deep: "Cor was, for the Romans, the seat of thought as much as feeling — to learn by heart, to record (re-cordis, to carry back through the heart). French kept the organ and the metaphor fused. So « mon cœur » is not only where Verlaine feels; it is where he remembers, where the rain has been falling, he says, for a long time. The œ ligature — the manuscript letter — is part of the word's beauty on the page."
      }
    },
    "pleut": {
      pos: "verb · impersonal",
      gloss: "rains — « il pleut », it rains",
      etymology: {
        surface: "From Latin pluere, to rain. The weather-verb that French reserves almost entirely for the empty, agentless « il ».",
        deep: "Pluere gave French pleuvoir, and it is the model case of the impersonal: « il pleut » has a subject that names nobody. In the second line the rain that only echoed inside pleure finally falls, out loud, on the town. Set side by side — pleure / pleut — the verb of grief and the verb of weather are one letter apart, and Verlaine lets us hear that they are, at heart, the same event."
      }
    },
    "ville": {
      pos: "noun · feminine",
      gloss: "town, city",
      etymology: {
        surface: "From Latin villa, a country house or estate — which, over centuries, swelled from a single farmstead into the whole town.",
        deep: "Latin villa was one dwelling in the fields; medieval French widened it to the cluster of houses around it, then to the town entire. So « la ville » still carries a faint memory of the countryside it grew out of. Verlaine needs it for scale: the grief that began « dans mon cœur », in one private heart, widens in the second line until it is raining on a whole town — the inner weather made outer, and shared."
      }
    }
  },

  lenses: {
    swap: {
      prompt: "Three ways to begin the line. One is Verlaine's. Choose, and see what each costs.",
      alternatives: [
        {
          form: "Il pleure dans mon cœur",
          highlight: ["Il", "pleure"],
          is_original: true,
          tag: "the original",
          verdict: "This is the line. The impersonal il pours the weeping into the heart with no hand to do it — grief that simply happens, like weather. Because the same il governs « il pleut », the rain is already implied before Verlaine names it. The self is present only as an address, « mon cœur », never as an actor. That is the achievement: a sorrow with no one to forgive and no one to blame."
        },
        {
          form: "Je pleure dans mon cœur",
          highlight: ["Je"],
          is_original: false,
          tag: "the lesser — it names the self",
          verdict: "« Je pleure » — I weep — is honest, and ordinary, and smaller. The moment a je appears, the grief acquires an owner, a cause, a story. We start to wonder why he weeps, and the poem becomes a complaint. Verlaine's il refuses that. He wants the weeping to be a condition of the air, not a confession. The self that says « je » can be consoled; the weather cannot."
        },
        {
          form: "Il pleut dans mon cœur",
          highlight: ["pleut"],
          is_original: false,
          tag: "the lesser — too literal",
          verdict: "« Il pleut » — it rains in my heart — says the metaphor out loud, and so kills it. The genius of the real line is that pleure only sounds like pleut; the rain stays just under the surface, felt and never stated. Spell it out and the image flattens into a greeting card. Verlaine trusts the ear to do what the words won't."
        }
      ]
    },
    grammar: {
      name: "the impersonal « il »",
      explain: {
        surface: "French keeps a special, hollow il for events with no doer: « il pleut » (it rains), « il faut » (one must), « il y a » (there is). The verb agrees with a subject that refers to nobody. Verlaine borrows this weather-grammar and points it at the heart.",
        deep: "In most sentences a verb needs an agent — someone weeps, something falls. French carved out an exception for phenomena that befall the world with no author: rain, necessity, existence itself. The il in « il pleut » is not “it” pointing at a cloud; it points at nothing. It is pure grammar, a slot that must be filled because French verbs cannot stand without a subject. Verlaine's move is to take this construction — reserved, for centuries, almost entirely for weather — and let it govern « pleure ». The grief inherits the grammar of rain: agentless, causeless, a thing that is simply happening to the world. No language that requires a real subject can do this so quietly."
      },
      rule: "il + impersonal verb = an action with no agent"
    },
    genius: {
      name: "the agentless impersonal",
      claim: {
        surface: "Only French (among the languages most readers know) can let a verb of feeling run on the empty weather-il — so that an emotion arrives like rain, with no one performing it.",
        deep: "English can say “it is raining,” but the moment you reach for a verb of feeling — to weep, to grieve — English demands a who. “It weeps” sounds broken, or gothic; “there is weeping” is a translator's surrender. French alone keeps a grammatical seat reserved for the unowned event and lets Verlaine slide grief into it. The result is untranslatable not because of vocabulary but because of grammar: the line's whole meaning lives in a construction English does not possess. This is what Belletra means by the genius of a language — not its hardest words, but the thoughts only its grammar will let you think."
      },
      contrast: "English: “I weep” — someone must do it. French: « il pleure » — no one need."
    },
    ear: {
      note: {
        surface: "pleure / pleut — the verb is one vowel away from the word for rain. The line rains without ever saying so, all liquid l's and r's.",
        deep: "Read it aloud: « il pleure dans mon cœur ». The mouth never closes hard — it is all l, r, and the soft nasal of mon. Verlaine called this his « art poétique »: music before everything, the odd syllable, the blurred edge. The pleure/pleut shadow-rhyme means the rain is in the sound of the grief, not its statement. And « cœur » lands on a long, open vowel that lets the line — and the ache — hang unresolved."
      }
    },
    turn: {
      note: {
        surface: "The full stanza answers itself: « Il pleure dans mon cœur / Comme il pleut sur la ville. » The second line says aloud what the first only let us hear.",
        deep: "Verlaine builds the poem as an echo. The first line keeps the rain hidden inside pleure; the second, « comme il pleut sur la ville » — as it rains on the town — finally lets it fall, outside, on the roofs. Inner weather, then outer. The simile doesn't explain the grief; it widens it, until the whole town is weeping too. And then the famous turn: « Quelle est cette langueur / Qui pénètre mon cœur? » — a grief so causeless the poet himself has to ask what it is."
      }
    },
    silence: {
      note: {
        surface: "Nothing in the line tells us why. No event, no person, no loss is named. The weeping is given without a cause — and that withholding is the point.",
        deep: "A lesser poet explains. Verlaine refuses: there is no because, no story, no name attached to the sorrow. The famous later line makes the silence explicit — « C'est bien la pire peine / De ne savoir pourquoi… » (it is the worst pain, not to know why). The grammar and the silence agree: an emotion with no agent and no reason, weather of the soul. What the poem withholds — the cause — is exactly what it is about."
      }
    }
  }
};

/* The library — 100 lines claimed, 6 written to full depth. We render a representative slice;
   only Verlaine is fully authored, the rest are queued spine records. */
const LIBRARY = [
  VERLAINE,
  { id: "valery-mer", text: "La mer, la mer, toujours recommencée", author: "Paul Valéry", work: "Le Cimetière marin", year: 1920, cefr: "B2", feature: "the participle as eternity", status: "queued" },
  { id: "rimbaud-aube", text: "J'ai embrassé l'aube d'été", author: "Arthur Rimbaud", work: "Illuminations", year: 1886, cefr: "B2", feature: "the perfect tense as conquest", status: "queued" },
  { id: "baudelaire-luxe", text: "Luxe, calme et volupté", author: "Charles Baudelaire", work: "L'Invitation au voyage", year: 1857, cefr: "B1", feature: "the asyndetic triad", status: "queued" },
  { id: "proust-longtemps", text: "Longtemps, je me suis couché de bonne heure", author: "Marcel Proust", work: "Du côté de chez Swann", year: 1913, cefr: "B2", feature: "the reflexive past as habit", status: "queued" },
  { id: "eluard-liberte", text: "Sur mes cahiers d'écolier — j'écris ton nom", author: "Paul Éluard", work: "Liberté", year: 1942, cefr: "A2", feature: "anaphora as devotion", status: "queued" },
  { id: "apollinaire-pont", text: "Sous le pont Mirabeau coule la Seine", author: "Guillaume Apollinaire", work: "Alcools", year: 1913, cefr: "B1", feature: "inversion as current", status: "queued" },
  { id: "hugo-demain", text: "Demain, dès l'aube, à l'heure où blanchit la campagne", author: "Victor Hugo", work: "Les Contemplations", year: 1856, cefr: "B2", feature: "the future of resolve", status: "queued" }
];

/* The volume layer — words from earlier sittings due for review */
const REVIEW_QUEUE = [
  { term: "le cœur", gloss: "the heart", from: "Antoine de Saint-Exupéry" },
  { term: "l'aube", gloss: "the dawn", from: "Arthur Rimbaud" },
  { term: "la langueur", gloss: "a soft, aching weariness", from: "Paul Verlaine" },
  { term: "le seuil", gloss: "the threshold", from: "Marcel Proust" }
];

/* Tomorrow's teaser */
const TOMORROW = {
  preview: "« Le vent se lève… il faut tenter de vivre »",
  author: "Paul Valéry",
  meta: "Paul Valéry · arriving tomorrow"
};

/* Anthology seed — lines the learner has already kept */
const ANTHOLOGY_SEED = [
  { text: "Le vent se lève, il faut tenter de vivre", author: "Paul Valéry", theme: "resolve", gilt: false },
  { text: "On ne voit bien qu'avec le cœur", author: "Antoine de Saint-Exupéry", theme: "the unseen", gilt: false }
];

window.BELLETRA_DATA = { VERLAINE, LIBRARY, REVIEW_QUEUE, TOMORROW, ANTHOLOGY_SEED };
