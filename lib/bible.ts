export interface BibleBook {
  id: string;
  abbreviation: string;
  name: string;
  testament: "Old Testament" | "New Testament";
  chapters: number;
}

export const bibleBooks: BibleBook[] = [
  {
    id: "GEN",
    abbreviation: "Gen",
    name: "Genesis",
    testament: "Old Testament",
    chapters: 50,
  },
  {
    id: "EXO",
    abbreviation: "Exod",
    name: "Exodus",
    testament: "Old Testament",
    chapters: 40,
  },
  {
    id: "LEV",
    abbreviation: "Lev",
    name: "Leviticus",
    testament: "Old Testament",
    chapters: 27,
  },
  {
    id: "MAT",
    abbreviation: "Matt",
    name: "Matthew",
    testament: "New Testament",
    chapters: 28,
  },
  {
    id: "MRK",
    abbreviation: "Mark",
    name: "Mark",
    testament: "New Testament",
    chapters: 16,
  },
  {
    id: "LUK",
    abbreviation: "Luke",
    name: "Luke",
    testament: "New Testament",
    chapters: 24,
  },
];