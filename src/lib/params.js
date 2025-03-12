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
        name: "กำหนดผู้รับผิดชอบ",
        icon: FiUserCheck,
        href: "/user",
      },
      {
        name: "กำหนดสิทธิการใช้งาน",
        icon: FiLock,
        href: "/user-role",
      },
      {
        name: "ปีการศึกษา",
        icon: FiCalendar,
        // icon: FiLock,
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
      // {
      //   name: "กำหนดผู้รับผิดชอบ",
      //   icon: FiChevronsRight,
      //   href: "/assign-user",
      // },
      {
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
        name: "บันทึกใบงานเตรียมปฏิบัติการ",
        icon: FiChevronsRight,
        href: "/user",
      },
      // {
      //   name: "แผนการใช้ทรัพยากร",
      //   icon: FiChevronsRight,
      //   href: "/userRole",
      // },
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
