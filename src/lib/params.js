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
        id: 41,
        name: "กำหนดผู้รับผิดชอบ",
        icon: FiUserCheck,
        href: "/user",
      },
      {
        id: 42,
        name: "กำหนดสิทธิการใช้งาน",
        icon: FiLock,
        href: "/user-role",
      },
      {
        id: 43,
        name: "กำหนดปีการศึกษา",
        icon: FiCalendar,
        href: "/academic",
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
        id: 31,
        name: "กำหนดค่าตั้งต้น",
        icon: FiSettings,
        href: "/matter",
      },
      {
        id: 32,
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
        id: 11,
        name: "กำหนดรายวิชา",
        icon: FiChevronsRight,
        href: "/assign-course",
      },
      // {
      //   name: "กำหนดผู้รับผิดชอบ",
      //   icon: FiChevronsRight,
      //   href: "/assign-user",
      // },
      {
        id: 12,
        name: "กำหนดแผนการใช้ห้องปฎิบัติการ",
        icon: FiChevronsRight,
        href: "/assign-plan",
      },
    ],
  },
  {
    id: 2,
    name: "การบริการห้องปฏิบัติการตามรายวิชา",
    description: "การบริการห้องปฏิบัติการตามรายวิชา",
    icon: FiArchive,
    child: [
      {
        id: 21,
        name: "บันทึกใบงานเตรียมปฏิบัติการ",
        icon: FiChevronsRight,
        href: "/prepare-lab",
      },
      {
        id: 22,
        name: "บันทึกการใช้ทรัพยากรตามใบงาน",
        icon: FiChevronsRight,
        href: "/prepare-lab",
      },
      // {
      //   name: "บันทึกการใช้ทรัพยากรตามใบงาน",
      //   icon: FiChevronsRight,
      //   href: "/userRole",
      // },
    ],
  },
  {
    id: 5,
    name: "รายงานต้นทุน",
    description: "รายงานต้นทุน",
    icon: FiArchive,
    child: [
      {
        id: 51,
        name: "รายงานแผนการใช้บริการห้องปฎิบัติการ",
        icon: FiChevronsRight,
        href: "/report/assign-course",
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
