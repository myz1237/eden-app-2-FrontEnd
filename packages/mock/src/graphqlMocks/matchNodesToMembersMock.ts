import { MatchMembersToSkillOutput } from "@eden/package-graphql/generated";

import { getSkillsPercentageTypeMockArray } from "../typeMocks";
import { getMatchPercentage } from "./MatchSkillsToMembersMock";
import { getMember } from "./MembersMock";

export const matchNodesToMembersMock = (): MatchMembersToSkillOutput => ({
  matchPercentage: getMatchPercentage(),
  member: getMember(),
  skillsPercentage: getSkillsPercentageTypeMockArray(8),
});

export const matchNodesToMembersMockArray = (
  total: number
): MatchMembersToSkillOutput[] =>
  Array.from({ length: total }, () => matchNodesToMembersMock());
