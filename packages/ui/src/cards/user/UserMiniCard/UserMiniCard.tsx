import { Maybe, Members } from "@eden/package-graphql/generated";
import {
  Avatar,
  Card,
  SocialMediaComp,
  // TextHeading2,
  TextHeading3,
} from "@eden/package-ui";
import { GrExpand } from "react-icons/gr";

export interface UserMiniCardProps {
  member?: Maybe<Members>;
  item?: any;
  onExpand?: () => void;
}

export const UserMiniCard = ({ member, onExpand, item }: UserMiniCardProps) => {
  if (!member && !item) {
    return null;
  }

  return (
    <div>
      <Card border shadow>
        <div className={`flex flex-row justify-between justify-items-stretch`}>
          <div></div>
          <div>
            <div className={`relative flex flex-col items-center`}>
              <div className="relative">
                <Avatar
                  src={
                    (member?.discordAvatar as string) || item?.championPicture
                  }
                />
              </div>
              <div className="flex justify-center">
                <TextHeading3>
                  @{member?.discordName || item?.discordName}
                </TextHeading3>
              </div>
              <div className="flex justify-center">
                <TextHeading3 className="text-sm uppercase text-gray-400">
                  {member?.memberRole?.title || item?.designation}
                </TextHeading3>
              </div>
              <div className="flex justify-center">
                <SocialMediaComp
                  size="sm"
                  title=""
                  links={member?.links || item?.links}
                />
              </div>
            </div>
          </div>
          <div>
            <button
              className={`basis-1/8 w-full text-zinc-400`}
              onClick={onExpand}
            >
              <GrExpand size="15px" />
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
};
