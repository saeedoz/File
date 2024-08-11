import {
  BorderAllIcon,
  AlertCircleIcon,
  CircleDotIcon,
  BoxMultiple1Icon,
  AdjustmentsHorizontalIcon,
  LayoutDashboardIcon

} from 'vue-tabler-icons';

export interface menu {
  header?: string;
  title?: string;
  icon?: any;
  to?: string;
  chip?: string;
  chipBgColor?: string;
  chipColor?: string;
  chipVariant?: string;
  chipIcon?: string;
  children?: menu[];
  disabled?: boolean;
  type?: string;
  subCaption?: string;
}

const sidebarItem: menu[] = [
  { header: 'الرئيسية' },
  {
    title: "لوحة التحكم",
    icon: LayoutDashboardIcon,
    to: "/",
  },
  { header: 'القائمة' },
  {
    title: "رفع ملف",
    icon: AlertCircleIcon,
    to: "/FileManger/FileUpload",
  },
  {
    title: "عرض الملفات",
    icon: BoxMultiple1Icon,
    to: "/FileManger/TableManger",
  },
];

export default sidebarItem;
