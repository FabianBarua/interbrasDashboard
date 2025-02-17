'use client';
import {  Button, cn, Spacer, Tooltip, useDisclosure } from "@heroui/react";

import { Sidebar } from "@/components/ui/Slider";
import { SidebarDrawer } from "@/components/ui/SidebarDrawer";

import { ChevronLeft, ChevronRight, LogOut, X } from "lucide-react";

import { useCallback, useEffect, useState } from "react";
import { doLogout } from "../actions";
import { useMediaQuery } from "usehooks-ts";

import { trainerSidebarItems, trainerSidebarItemsSecondary } from "@/components/ui/items";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";

type AppLayoutProps = {
    children: React.ReactNode;
    title: string;
    subtitle: string;
  };

  export default function AppLayout({
    children
  }: AppLayoutProps) {

    const { isOpen, onOpenChange } = useDisclosure();
    const [isCollapsed, setIsCollapsed] = useState(false);
    const isMobile = useMediaQuery("(max-width: 768px)");
    const onToggle = useCallback(() => {
      setIsCollapsed((prev) => !prev);
    }, []);
    
    const session = useSession()
    const router = useRouter()
    
    const pathname = usePathname();
    const key = pathname.split("/")[2] || trainerSidebarItems[0].key
    const [keySelected, setKeySelected] = useState(trainerSidebarItems.find((item) => item.key === key) || trainerSidebarItemsSecondary.find((item) => item.key === key));

    const isSubMenu = pathname.split("/")[3] !== undefined

    useEffect(() => {
      setKeySelected(trainerSidebarItems.find((item) => item.key === key) || trainerSidebarItemsSecondary.find((item) => item.key === key));
    }, [key])
    
    return (
      <div className="flex h-dvh w-full gap-4">
        {/* Sidebar */}
        <SidebarDrawer
          className={cn("min-w-[288px] rounded-lg ", {
            "min-w-[76px]": isCollapsed,
          })}
          hideCloseButton={true}
          isOpen={isOpen}
          onOpenChange={onOpenChange}
        >
          <div
            className={cn(
              "will-change relative flex h-full w-72 flex-col bg-default-100 p-6 transition-width ",
              {
                "w-[83px] items-center px-[6px] py-6": isCollapsed,
              }
            )}
          >
            <div
              className={cn("flex items-center gap-3 pl-2", {
                "justify-center gap-0 pl-0": isCollapsed,
              })}
            >
              <div className="flex h-8 w-8  flex-shrink-0 items-center justify-center rounded-full bg-foreground">
                <Image  src={session.data?.user?.image || '/default-profile.png'} alt="profile" width={32} height={32} className="rounded-full" /> 
              </div>
              <span
                className={cn(
                  "w-full text-small font-bold uppercase opacity-100",
                  {
                    "w-0 opacity-0": isCollapsed,
                  }
                )}
              >
                Dashboard
              </span>
              <div className={cn("flex-end flex", { hidden: isCollapsed })}>
                <ChevronLeft
                  className="cursor-pointer dark:text-primary-foreground/60 [&>g]:stroke-[1px]"
                  width={24}
                  onClick={isMobile ? onOpenChange : onToggle}
                />
              </div>
            </div>
  
            <div className=" overflow-y-auto hideScroll">
            <Spacer y={6} />
  
              <Sidebar
                iconClassName="group-data-[selected=true]:text-default-50"
                isCompact={isCollapsed}
                itemClasses={{
                  base: "px-3 rounded-large data-[selected=true]:!bg-foreground",
                  title: "group-data-[selected=true]:text-default-50",
                }}
                items={trainerSidebarItems}
                keySelected={keySelected}
                customLabel="primary"
              />

              <Spacer y={3} />

              <Sidebar
                iconClassName="group-data-[selected=true]:text-default-50"
                isCompact={isCollapsed}
                itemClasses={{
                  base: "px-3 rounded-large data-[selected=true]:!bg-foreground",
                  title: "group-data-[selected=true]:text-default-50",
                }}
                items={trainerSidebarItemsSecondary}
                keySelected={keySelected}
                customLabel="i18n"
              />


              <Spacer y={8} />

            </div>
  
            <div
              className={cn("mt-auto flex flex-col", {
                "items-center": isCollapsed,
              })}
            >
              {isCollapsed && (
                <Button
                  isIconOnly
                  className="flex h-10 w-10 text-default-600"
                  size="sm"
                  variant="light"
                >
                  <ChevronRight
                    className="cursor-pointer dark:text-primary-foreground/60 [&>g]:stroke-[1px]"
                    height={24}
                    width={24}
                    onClick={onToggle}
                  />
                </Button>
              )}
              <Tooltip
                content="Log Out"
                isDisabled={!isCollapsed}
                placement="right"
              >
                <Button
                  onClick={doLogout}
                  className={cn(
                    "justify-start text-default-500 data-[hover=true]:text-foreground",
                    {
                      "justify-center": isCollapsed,
                    }
                  )}
                  isIconOnly={isCollapsed}
                  startContent={
                    isCollapsed ? null : (
                      <LogOut
                        className="flex-none text-default-500 rotate-180"
                        width={24}
                      />
                    )
                  }
                  variant="light"
                >
                  {isCollapsed ? (
                    <LogOut
                      className="rotate-180 text-default-500"
                      width={24}
                    />
                  ) : (
                    "Log Out"
                  )}
                </Button>
              </Tooltip>
            </div>
          </div>
        </SidebarDrawer>
  
        <div  className=" overflow-auto w-full hideScroll">
          {/*  Content */}
          <div className="w-full max-w-screen-2xl flex-1 p-4 mx-auto flex flex-col  h-full ">
            {/* Title */}
            <div className="flex items-center gap-x-3">
              <Button
                isIconOnly
                className="sm:hidden"
                size="sm"
                variant="flat"
                onPress={onOpenChange}
              >
                <ChevronRight
                  className="text-default-500"
                  width={20}
                />
              </Button>
              <h1 className="text-3xl font-bold leading-9 text-default-foreground">
                {
                  keySelected.title
                }
              </h1>
            
                {
                  keySelected.key !== 'dashboard' && (
                    <Button
                      href={
                        isSubMenu ?  undefined : '/admin'
                      }
                      variant="flat"
                      as={
                        isSubMenu ? 'button' : Link
                      }
                      onPress={
                        isSubMenu ? router.back : undefined
                      }
                      className=" ml-auto"
                    >
                      {
                        isSubMenu ? <>
                        Volver <ChevronLeft height={18}/>
                        </>: <>
                        Cerrar <X height={18}/>
                        </>
                      }
                    </Button>
                  )
                }

                
            </div>
            {children}

          </div>
        </div >
      </div>
    );
  }