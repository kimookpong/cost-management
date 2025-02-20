import {
  FiHome,
  FiUserCheck,
  FiUsers,
  FiBriefcase,
  FiArchive,
  FiCalendar,
  FiBarChart2,
  FiSettings,
  FiLock,
  FiBox,
  FiCornerDownRight,
  FiChevronsRight,
} from "react-icons/fi";

const navigation = [
  // { name: "หน้าหลัก", icon: FiHome, href: "/" },
  // { name: "Team", icon: FiUsers, href: "#" },
  // { name: "Projects", icon: FiBriefcase, href: "#" },
  // { name: "Calendar", icon: FiCalendar, href: "#" },
  // { name: "Reports", icon: FiBarChart2, href: "#" },
  {
    id: 1,
    name: "แผนการให้บริการห้องปฎิบัติการ",
    description: "แผนการให้บริการห้องปฎิบัติการ",
    icon: FiSettings,
    child: [
      {
        name: "กำหนดรายวิชา",
        icon: FiChevronsRight,
        href: "/user",
      },
      {
        name: "กำหนดผู้รับผิดชอบ",
        icon: FiChevronsRight,
        href: "/userRole",
      },
      {
        name: "กำหนดแผนการใช้ห้องปฎิบัติการ",
        icon: FiChevronsRight,
        href: "/userRole",
      },
    ],
  },
  {
    id: 2,
    name: "การบริการห้องปฎิบัติการตามปีการศึกษา",
    description: "การบริการห้องปฎิบัติการตามปีการศึกษา",
    icon: FiArchive,
    child: [
      {
        name: "กำหนดรายวิชา",
        icon: FiChevronsRight,
        href: "/user",
      },
      {
        name: "แผนการใช้ทรัพยากร",
        icon: FiChevronsRight,
        href: "/userRole",
      },
      {
        name: "บันทึกการใช้ทรัพยากรตามใบงาน",
        icon: FiChevronsRight,
        href: "/userRole",
      },
    ],
  },
  {
    id: 3,
    name: "จัดการข้อมูล",
    description: "จัดการข้อมูล",
    icon: FiBox,
    child: [
      {
        name: "ครุภัฑณ์",
        icon: FiChevronsRight,
        href: "/user",
      },
      {
        name: "วัสดุสิ้นเปลือง, สารเคมี",
        icon: FiChevronsRight,
        href: "/userRole",
      },
      {
        name: "วัสดุสิ้นไม่เปลือง",
        icon: FiChevronsRight,
        href: "/userRole",
      },
    ],
  },
  {
    id: 4,
    name: "จัดการผู้ใช้งาน",
    description: "จัดการผู้ใช้งาน",
    icon: FiUsers,
    child: [
      {
        name: "รายชื่อผู้ใช้งาน",
        icon: FiUserCheck,
        href: "/user",
      },
      {
        name: "จัดการสิทธิการใช้งาน",
        icon: FiLock,
        href: "/user-role",
      },
    ],
  },
];

const userNavigation = [
  // { name: "Your Profile", href: "#" },
  // { name: "Settings", href: "#" },
  // { name: "Sign out", href: "#" },
];

export { navigation, userNavigation };
