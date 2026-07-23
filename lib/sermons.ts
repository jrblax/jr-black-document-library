export type Sermon = {
  slug: string;
  title: string;
  subtitle: string;
  category: string;
  primaryScripture: string;
  summary: string;
  objective: string;
  topics: string[];
};

export const sermons: Sermon[] = [
  {
    slug: "faithful-over-a-few-things",
    title: "Faithful Over A Few Things",
    subtitle: "Small Responsibilities Prepare Us For Greater Things",
    category: "Sermon",
    primaryScripture: "Matthew 25:21",
    summary:
      "A sermon on stewardship, faithfulness, and the reward of serving God well in small responsibilities.",
    objective:
      "To encourage believers to remain faithful in small responsibilities, knowing that God values consistency, stewardship, and obedience.",
    topics: ["Faithfulness", "Stewardship", "Service"],
  },
];

export function getSermonBySlug(slug: string) {
  return sermons.find((sermon) => sermon.slug === slug);
}
