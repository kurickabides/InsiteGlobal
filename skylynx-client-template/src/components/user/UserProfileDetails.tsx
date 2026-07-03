// ================================================
// ✅ Component: UserProfileDetails
// Description: Displays SkylynxNet user profile data (read-only view)
// ================================================

import React, { FC } from "react";
import { useAppSelector } from "../../hooks/reduxHooks";
import { selectAuth } from "../auth/authSlice";
import {
  FormRoot,
  Control,
  Label,
  Input,
  SectionTitle,
  FlexRowBetween,
} from "../../theme/appStyles";

const UserProfileDetails: FC = () => {
  const { user } = useAppSelector(selectAuth);
  const profile = user?.profile;

  if (!profile) return <p>No profile data found.</p>;

  return (
    <FormRoot>
      <SectionTitle>User Profile</SectionTitle>

      {/* Profile Picture */}
      <div style={{ textAlign: "center", marginBottom: "1rem" }}>
        <img
          src={profile.photo || "/default-avatar.png"}
          alt="User Photo"
          style={{
            width: "150px",
            height: "150px",
            borderRadius: "50%",
            objectFit: "cover",
          }}
        />
      </div>

      {/* Profile Fields */}
      <FlexRowBetween>
        <div style={{ width: "45%" }}>
          <Control>
            <Label htmlFor="email">Email</Label>
            <Input id="email" value={user.email} disabled />
          </Control>

          <Control>
            <Label htmlFor="firstName">First Name</Label>
            <Input id="firstName" value={profile.firstName || ""} disabled />
          </Control>

          <Control>
            <Label htmlFor="language">Preferred Language</Label>
            <Input
              id="language"
              value={profile.preferredLanguage || ""}
              disabled
            />
          </Control>

          <Control>
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              value={profile.mobilePhone || profile.phoneNumber || ""}
              disabled
            />
          </Control>
        </div>

        <div style={{ width: "45%" }}>
          <Control>
            <Label htmlFor="username">Username</Label>
            <Input id="username" value={profile.username || ""} disabled />
          </Control>

          <Control>
            <Label htmlFor="lastName">Last Name</Label>
            <Input id="lastName" value={profile.lastName || ""} disabled />
          </Control>

          <Control>
            <Label htmlFor="portal">Portal</Label>
            <Input
              id="portal"
              value={`${profile.portalName} (${profile.portalId})`}
              disabled
            />
          </Control>

          <Control>
            <Label htmlFor="created">Portal Created</Label>
            <Input
              id="created"
              value={profile.portalCreatedDate || ""}
              disabled
            />
          </Control>
        </div>
      </FlexRowBetween>

      <Control>
        <Label htmlFor="address">Mailing Address</Label>
        <Input
          id="address"
          value={`${profile.mailingAddress1 || ""} ${profile.city || ""}, ${
            profile.stateProvinceId || ""
          } ${profile.zip || ""}`}
          disabled
        />
      </Control>
    </FormRoot>
  );
};

export default UserProfileDetails;
