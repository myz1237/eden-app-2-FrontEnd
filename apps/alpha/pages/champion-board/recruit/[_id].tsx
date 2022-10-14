/* eslint-disable no-unused-vars */
import { useQuery } from "@apollo/client";
import {
  FIND_MEMBER,
  FIND_PROJECT,
  MATCH_MEMBERS_TO_SKILLS,
} from "@eden/package-graphql";
import {
  AppUserSubmenuLayout,
  Card,
  ChampionMatchContainer,
  GridItemNine,
  GridItemThree,
  GridLayout,
  ProjectEditSelectorCard,
} from "@eden/package-ui";
// import { LaunchProjectContext } from "@eden/package-context";
import { useRouter } from "next/router";

// import { useContext, useState } from "react";
import type { NextPageWithLayout } from "../../_app";

const ProjectPage: NextPageWithLayout = () => {
  const router = useRouter();
  const { _id } = router.query;
  // const [selectMember, setSelectMember] = useState("");

  // const { matchMembersPage, project, selectedRole } =
  //   useContext(LaunchProjectContext);

  // const { data: dataMember, refetch: refetchMember } = useQuery(FIND_MEMBER, {
  //   variables: {
  //     fields: {
  //       _id: selectMember,
  //     },
  //   },
  //   skip: !selectMember,
  //   context: { serviceName: "soilservice" },
  // });

  const { data: dataProject, refetch: refetchProject } = useQuery(
    FIND_PROJECT,
    {
      variables: {
        fields: {
          _id,
        },
      },
      skip: !_id,
      context: { serviceName: "soilservice" },
    }
  );

  // const { data: matchingMembers } = useQuery(MATCH_MEMBERS_TO_SKILLS, {
  //   variables: {
  //     fields: {
  //       skillsID: selectedRole?.skills?.flatMap(
  //         (skill) => skill?.skillData?._id
  //       ),
  //       hoursPerWeek:
  //         project?.role?.find((role) => role?._id === selectedRole?._id)
  //           ?.hoursPerWeek || null,
  //       budgetAmount:
  //         Number(
  //           project?.role?.find((role) => role?._id === selectedRole?._id)
  //             ?.budget?.perHour
  //         ) || null,
  //       page: matchMembersPage,
  //       limit: 9,
  //     },
  //   },
  //   skip: !selectedRole,
  //   context: { serviceName: "soilservice" },
  // });

  // project data with shortlist
  if (dataProject) console.log("dataProject", dataProject);
  else {
    return null;
  }
  // if (matchingMembers) console.log("matchingMembers", matchingMembers);

  // if (selectedRole) console.log("selectRole", selectedRole);

  return (
    <GridLayout>
      <GridItemThree>
        <Card shadow className="h-8/10 bg-white p-6">
          <ProjectEditSelectorCard
            project={dataProject?.findProject}
            emoji={dataProject?.findProject?.emoji}
            totalDays={dataProject?.findProject?.dates?.kickOff}
            currentDayCount={dataProject?.findProject?.dates?.complition}
            backgroundColor={dataProject?.findProject?.backColorEmoji}
          />
        </Card>
      </GridItemThree>
      <GridItemNine>
        <Card shadow className="h-8/10 overflow-auto bg-white p-6">
          <ChampionMatchContainer project={dataProject.findProject} />
        </Card>
      </GridItemNine>
    </GridLayout>
  );
};

ProjectPage.getLayout = (page) => (
  <AppUserSubmenuLayout showSubmenu={false}>{page}</AppUserSubmenuLayout>
);

export default ProjectPage;

import { IncomingMessage, ServerResponse } from "http";
import { getSession } from "next-auth/react";

export async function getServerSideProps(ctx: {
  req: IncomingMessage;
  res: ServerResponse;
}) {
  const session = await getSession(ctx);

  const url = ctx.req.url?.replace("/", "");

  if (!session) {
    return {
      redirect: {
        destination: `/login?redirect=${url}`,
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
}