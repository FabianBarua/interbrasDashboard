import { SidebarItem } from "./Slider";

/**
 * Please check the https://nextui.org/docs/guide/routing to have a seamless router integration
 */

export const trainerSidebarItems: SidebarItem[] = [
  {
    key: "dashboard",
    href: "/admin",
    icon: "solar:home-2-outline",
    title: "Dashboard",
  },
  {
    key: "categorias",
    href: "/admin/categorias",
    icon: "solar:layers-minimalistic-outline",
    title: "Categorias",
  },  {
    key: "productos",
    href: "/admin/productos",
    icon: "solar:box-outline",
    title: "Productos",
  },
  {
    key: "variantes",
    href: "/admin/variantes",
    icon: "solar:branching-paths-down-outline",
    title: "Variantes",
  },
  {
    key: "catalogo",
    href: "/admin/catalogo",
    icon: "solar:notebook-square-outline",
    title: "Catálogo"
  }

];

// volt, color, status
export const trainerSidebarItemsSecondary: SidebarItem[] = [
  {
    key: "colores",
    href: "/admin/colores",
    icon: "solar:palette-round-outline",
    title: "Colores",
  },
  {
    key: "estados",
    href: "/admin/estados",
    icon: "solar:archive-up-minimlistic-outline",
    title: "Estados",
  },
  {
    key: "volt",
    href: "/admin/volt",
    icon: "solar:bolt-outline",
    title: "Voltaje",
  }
]


