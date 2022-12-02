/* eslint-disable no-unused-vars */
import { useQuery } from "@apollo/client";
import {
  GrantsContext,
  GrantsModal,
  GrantsProvider,
  UserContext,
  UserProvider,
} from "@eden/package-context";
import { FIND_GRANTS } from "@eden/package-graphql";
import { GrantTemplate } from "@eden/package-graphql/generated";
import {
  AppUserSubmenuLayout,
  Card,
  FillUserProfileContainer,
  GrantsCard,
  GrantsModalContainer,
  GridItemNine,
  GridItemSix,
  GridItemThree,
  GridLayout,
  SEO,
  UserProfileCard,
  ViewUserProfileContainer,
  WarningCard,
} from "@eden/package-ui";
import { useContext, useEffect, useState } from "react";

import type { NextPageWithLayout } from "../_app";

const INITIAL_EXP = {
  title: "",
  skills: [],
  startDate: "",
  endDate: "",
  bio: "",
};

const GrantsPage: NextPageWithLayout = () => {
  const { setOpenModal } = useContext(GrantsContext);
  const { currentUser } = useContext(UserContext);
  const { memberServers } = useContext(UserContext);
  const [nodesID, setNodesID] = useState<string[] | null>(null);
  const [serverID, setServerID] = useState<string | null>(null);
  const [view, setView] = useState<"grants" | "profile">("grants");

  const { data: dataGrants } = useQuery(FIND_GRANTS, {
    variables: {
      fields: {
        _id: null,
        // nodesID: nodesID,
        // TODO: change to selectedServer
        // serverID: serverID,
      },
    },
    // skip: !nodesID || !serverID,
    context: { serviceName: "soilservice" },
  });

  // if (dataGrants) console.log("dataGrants", dataGrants);

  useEffect(() => {
    setOpenModal(GrantsModal.START_INFO);
  }, []);

  useEffect(() => {
    if (memberServers) {
      setServerID(memberServers[1]._id);
    }
  }, [memberServers]);

  // if (memberServers) console.log("memberServers", memberServers[1]._id);

  // ------- PROFILE VIEW -------
  const [step, setStep] = useState(STEPS.ROLE);

  const [state, setState] = useState({
    discordName: currentUser?.discordName,
    discordAvatar: currentUser?.discordAvatar,
    discriminator: currentUser?.discriminator,
    memberRole: currentUser?.memberRole,
    bio: currentUser?.bio as string,
    match: 100,
    hoursPerWeek: currentUser?.hoursPerWeek,
    // expectedSalary: 0,
    links: currentUser?.links,
    background: [{ ...INITIAL_EXP }, { ...INITIAL_EXP }, { ...INITIAL_EXP }] as
      | any[]
      | undefined,
  });
  const [experienceOpen, setExperienceOpen] = useState<number | null>(null);

  useEffect(() => {
    setState({
      ...state,
      discordName: currentUser?.discordName,
      discordAvatar: currentUser?.discordAvatar,
      discriminator: currentUser?.discriminator,
      memberRole: currentUser?.memberRole,
      bio: currentUser?.bio as string,
      match: 100,
      hoursPerWeek: currentUser?.hoursPerWeek,
      //   expectedSalary: 0,
      links: currentUser?.links,
      background:
        currentUser?.previusProjects?.length &&
        currentUser?.previusProjects?.length > 0
          ? currentUser?.previusProjects?.map((proj) => ({
              title: proj?.title,
              bio: proj?.description,
              startDate: proj?.startDate,
              endDate: proj?.endDate,
            }))
          : [{ ...INITIAL_EXP }, { ...INITIAL_EXP }, { ...INITIAL_EXP }],
    });
  }, [currentUser]);

  return (
    <>
      <SEO />
      <GridLayout>
        {view === "grants" && (
          <>
            <GridItemThree>
              <Card className={`h-85 flex flex-col gap-2`}>
                <UserProfileCard />
                {/* {currentUser?.onbording?.percentage! < 50 ||
                  (!currentUser?.onbording?.signup && ( */}
                <WarningCard
                  profilePercentage={20}
                  onClickCompleteProfile={() => setView("profile")}
                />
                {/* ))} */}
              </Card>
            </GridItemThree>
            <GridItemNine>
              <Card
                shadow
                className="scrollbar-hide h-85 overflow-scroll bg-white p-4"
              >
                <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {dataGrants?.findGrants?.map(
                    (grant: GrantTemplate, index: number) => (
                      <GrantsCard key={index} grant={grant} />
                    )
                  )}
                </div>
              </Card>
            </GridItemNine>
          </>
        )}
        {view === "profile" && (
          <>
            <GridItemSix>
              <Card className={"h-85 bg-white shadow"}>
                <FillUserProfileContainer
                  step={step}
                  state={state}
                  setState={setState}
                  setStep={setStep}
                  setExperienceOpen={setExperienceOpen}
                  setView={setView}
                />
              </Card>
            </GridItemSix>
            <GridItemSix>
              <Card className={"h-85 bg-white shadow"}>
                <ViewUserProfileContainer
                  step={step}
                  user={state}
                  experienceOpen={experienceOpen}
                  setExperienceOpen={setExperienceOpen}
                />
              </Card>
            </GridItemSix>
          </>
        )}
      </GridLayout>
      <GrantsModalContainer
        setArrayOfNodes={(val) => {
          // console.log("array of nodes val", val);
          setNodesID(val);
        }}
      />
    </>
  );
};

GrantsPage.getLayout = (page) => (
  <GrantsProvider>
    <UserProvider>
      <AppUserSubmenuLayout showSubmenu={false}>{page}</AppUserSubmenuLayout>
    </UserProvider>
  </GrantsProvider>
);

export default GrantsPage;

import { STEPS } from "@eden/package-ui/utils";
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