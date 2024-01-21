import {
  IC_community,
  IC_create,
  IC_heart,
  IC_home,
  IC_members,
  IC_reply,
  IC_request,
  IC_search,
  IC_tag,
  IC_user,
} from "@/public/assets";

export const sidebarLinks = [
  {
    imgURL: IC_home,
    route: "/",
    label: "Home",
  },
  {
    imgURL: IC_search,
    route: "/search",
    label: "Search",
  },
  {
    imgURL: IC_heart,
    route: "/activity",
    label: "Activity",
  },
  {
    imgURL: IC_create,
    route: "/create-loto",
    label: "Create Loto",
  },
  {
    imgURL: IC_community,
    route: "/communities",
    label: "Communities",
  },
  {
    imgURL: IC_user,
    route: "/profile",
    label: "Profile",
  },
];

export const profileTabs = [
  { value: "loto", label: "Loto", icon: IC_reply },
  { value: "replies", label: "Replies", icon: IC_members },
  { value: "tagged", label: "Tagged", icon: IC_tag },
];

export const communityTabs = [
  { value: "loto", label: "Loto", icon: IC_reply },
  { value: "members", label: "Members", icon: IC_members },
  { value: "requests", label: "Requests", icon: IC_request },
];
