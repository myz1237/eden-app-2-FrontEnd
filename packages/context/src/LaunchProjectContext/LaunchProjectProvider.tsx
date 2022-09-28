import { Project, RoleType } from "@graphql/eden/generated";
import React, { useReducer, useState } from "react";

import { LaunchProjectContext } from "./LaunchProjectContext";

export interface LaunchProjectProviderProps {
  children: React.ReactNode;
}

export enum ProjectActionKind {
  // eslint-disable-next-line no-unused-vars
  SET_NAME = "SET_NAME",
  // eslint-disable-next-line no-unused-vars
  ADD_ROLE = "ADD_ROLE",
  // eslint-disable-next-line no-unused-vars
  SET_ROLE_SKILLS = "SET_ROLE_SKILLS",
  // eslint-disable-next-line no-unused-vars
  SHORTLIST_MEMBER = "SHORTLIST_MEMBER",
  // eslint-disable-next-line no-unused-vars
  REMOVE_SHORTLIST_MEMBER = "REMOVE_SHORTLIST_MEMBER",
}

export interface ProjectAction {
  type: ProjectActionKind;
  payload: any;
}

export enum LaunchProjectModal {
  // eslint-disable-next-line no-unused-vars
  ROLE = "role",
  // eslint-disable-next-line no-unused-vars
  SKILLS = "skills",
  // eslint-disable-next-line no-unused-vars
  ROLE_DETAIL = "role detail",
  // eslint-disable-next-line no-unused-vars
  PROJECT_INFO = "project info",
  // eslint-disable-next-line no-unused-vars
  CONGRATULATIONS = "congratulations",
}

function projectReducer(project: Project, action: ProjectAction): Project {
  switch (action.type) {
    case ProjectActionKind.SET_NAME:
      return { ...project, title: action.payload };
    case ProjectActionKind.ADD_ROLE:
      return { ...project, role: [...project.role!, action.payload] };
    case ProjectActionKind.SET_ROLE_SKILLS:
      return {
        ...project,
        role: project.role?.map((role) => {
          if (role?._id === action.payload._id) {
            return action.payload;
          }
          return role;
        }),
      };
    case ProjectActionKind.SHORTLIST_MEMBER:
      return {
        ...project,
        team: [
          ...project.team!,
          {
            memberInfo: action.payload.member,
            roleID: action.payload.roleId,
            phase: null,
          },
        ],
      };
    case ProjectActionKind.REMOVE_SHORTLIST_MEMBER:
      return {
        ...project,
        team: project.team?.filter(
          (member) =>
            member?.memberInfo?._id !== action.payload.member.memberInfo._id
        ),
      };
    default:
      throw new Error();
  }
}

export const LaunchProjectProvider = ({
  children,
}: LaunchProjectProviderProps) => {
  const [project, dispatchProject] = useReducer(projectReducer, {
    __typename: "Project",
    title: "",
    role: [],
    team: [],
  });
  const [projectEmoji, setProjectEmoji] = useState<string>();
  const [openModal, setOpenModal] = useState<LaunchProjectModal | null>(null);
  const [selectedRole, setSelectedRole] = useState<RoleType | null>(null);
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);
  const [selectedMemberPercentage, setSelectedMemberPercentage] = useState<
    number | null
  >(null);
  const [matchMembersPage, setMatchMembersPage] = useState<number>(0);

  const injectContext = {
    project: project,
    dispatchProject: dispatchProject,
    projectEmoji,
    setProjectEmoji,
    openModal: openModal,
    setOpenModal: setOpenModal,
    selectedRole: selectedRole,
    setSelectedRole: setSelectedRole,
    selectedMemberId: selectedMemberId,
    setSelectedMemberId: setSelectedMemberId,
    selectedMemberPercentage: selectedMemberPercentage,
    setSelectedMemberPercentage: setSelectedMemberPercentage,
    matchMembersPage: matchMembersPage,
    setMatchMembersPage: setMatchMembersPage,
  };

  return (
    <LaunchProjectContext.Provider value={injectContext}>
      {children}
    </LaunchProjectContext.Provider>
  );
};