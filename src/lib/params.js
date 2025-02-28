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
  {
    id: 4,
    name: "ตั้งค่าการใช้งาน",
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
  {
    id: 3,
    name: "จัดการข้อมูลพัสดุ ",
    description: "จัดการข้อมูลพัสดุ ",
    icon: FiBox,

    child: [
      {
        name: "กำหนดค่าตั้งต้น",
        icon: FiSettings,
        href: "/matter",
      },
      {
        name: "ข้อมูลพัสดุ",
        icon: FiBox,
        href: "/matter2",
      },
    ],
  },
  {
    id: 1,
    name: "แผนการให้บริการห้องปฎิบัติการ",
    description: "แผนการให้บริการห้องปฎิบัติการ",
    icon: FiSettings,
    child: [
      {
        name: "กำหนดรายวิชา",
        icon: FiChevronsRight,
        href: "/assign-course",
      },
      {
        name: "กำหนดผู้รับผิดชอบ",
        icon: FiChevronsRight,
        href: "/assign-user",
      },
      {
        name: "กำหนดแผนการใช้ห้องปฎิบัติการ",
        icon: FiChevronsRight,
        href: "/assign-plan",
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
];

const userNavigation = [
  // { name: "Your Profile", href: "#" },
  // { name: "Settings", href: "#" },
  // { name: "Sign out", href: "#" },
];

export { navigation, userNavigation };
