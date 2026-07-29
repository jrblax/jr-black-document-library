export type AuthorityStatus = "active" | "inactive" | "archived";

export interface PersonAuthority {
  id: string;
  type: "person";
  preferredName: string;
  alternateNames: string[];
  slug: string;
  status: AuthorityStatus;
}

export interface OrganizationAuthority {
  id: string;
  type: "organization";
  preferredName: string;
  alternateNames: string[];
  slug: string;
  status: AuthorityStatus;
}

export interface CollectionAuthority {
  id: string;
  type: "collection";
  preferredName: string;
  description?: string;
  slug: string;
  status: AuthorityStatus;
}

export interface SeriesAuthority {
  id: string;
  type: "series";
  preferredName: string;
  description?: string;
  slug: string;
  status: AuthorityStatus;
}

export type AuthorityRecord =
  | PersonAuthority
  | OrganizationAuthority
  | CollectionAuthority
  | SeriesAuthority;

const AUTHORITY_ID_PATTERNS = {
  person: /^PER-\d{6}$/,
  organization: /^ORG-\d{6}$/,
  collection: /^COL-\d{6}$/,
  series: /^SER-\d{6}$/,
} as const;

export function isValidAuthorityId(
  authorityType: AuthorityRecord["type"],
  authorityId: string,
): boolean {
  return AUTHORITY_ID_PATTERNS[authorityType].test(authorityId);
}

export const jrBlackPerson: PersonAuthority = {
  id: "PER-000001",
  type: "person",
  preferredName: "J. R. Black",
  alternateNames: [],
  slug: "j-r-black",
  status: "active",
};

export const treasuryOfTruthOrganization: OrganizationAuthority = {
  id: "ORG-000001",
  type: "organization",
  preferredName: "Treasury of Truth",
  alternateNames: [],
  slug: "treasury-of-truth",
  status: "active",
};

export const treasuryOfTruthCollection: CollectionAuthority = {
  id: "COL-000001",
  type: "collection",
  preferredName: "Treasury of Truth",
  description:
    "The primary collection of biblical teaching resources preserved and published by the Treasury of Truth ministry.",
  slug: "treasury-of-truth",
  status: "active",
};

export const people: PersonAuthority[] = [jrBlackPerson];

export const organizations: OrganizationAuthority[] = [
  treasuryOfTruthOrganization,
];

export const collections: CollectionAuthority[] = [
  treasuryOfTruthCollection,
];

export const series: SeriesAuthority[] = [];

export function findPersonById(
  personId: string,
): PersonAuthority | undefined {
  return people.find((person) => person.id === personId);
}

export function findOrganizationById(
  organizationId: string,
): OrganizationAuthority | undefined {
  return organizations.find(
    (organization) => organization.id === organizationId,
  );
}

export function findCollectionById(
  collectionId: string,
): CollectionAuthority | undefined {
  return collections.find(
    (collection) => collection.id === collectionId,
  );
}

export function findSeriesById(
  seriesId: string,
): SeriesAuthority | undefined {
  return series.find((item) => item.id === seriesId);
}