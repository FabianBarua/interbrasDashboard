"use client";

import React, { useEffect } from "react";
import { Icon } from "@iconify/react";

export enum SidebarItemType {
    Nest = "nest",
}

import { ListboxProps, ListboxSectionProps } from "@heroui/react";

export type SidebarItem = {
    key: string;
    title: string;
    icon?: string;
    href?: string;
    type?: SidebarItemType.Nest;
    startContent?: React.ReactNode;
    endContent?: React.ReactNode;
    items?: SidebarItem[];
    className?: string;
};
  
export type SidebarProps = Omit<ListboxProps<SidebarItem>, "children"> & {
items: SidebarItem[];
isCompact?: boolean;
hideEndContent?: boolean;
iconClassName?: string;
sectionClasses?: ListboxSectionProps["classNames"];
classNames?: ListboxProps["classNames"];
keySelected?: SidebarItem;
customLabel: string;
};

import { Listbox, ListboxItem, ListboxSection } from "@heroui/listbox";
import { Tooltip } from "@heroui/tooltip";
import { cn } from "@heroui/theme";
import Link from "next/link";

export const Sidebar = React.forwardRef<HTMLElement, SidebarProps>(
  (
    {
      items,
      isCompact,
      hideEndContent,
      sectionClasses: sectionClassesProp = {},
      itemClasses: itemClassesProp = {},
      iconClassName,
      classNames,
      className,
      keySelected,
      customLabel,
      ...props
    },
    ref
  ) => {

    const sectionClasses = {
      ...sectionClassesProp,
      base: cn(sectionClassesProp?.base, "w-full", {
        "p-0 max-w-[44px]": isCompact,
      }),
      group: cn(sectionClassesProp?.group, {
        "flex flex-col gap-1": isCompact,
      }),
      heading: cn(sectionClassesProp?.heading, {
        hidden: isCompact,
      }),
    };

    const itemClasses = {
      ...itemClassesProp,
      base: cn(itemClassesProp?.base, {
        "w-11 h-11 gap-0 p-0": isCompact,
      }),
    };


    const renderItem = React.useCallback(
      (item: SidebarItem) => {
        return (
          <ListboxItem
            aria-label="listboxitem"
            href={item.href}
            key={item.key}
            endContent={isCompact || hideEndContent ? null : item.endContent ?? null}
            as={Link}
            startContent={isCompact ? null : item.icon ? (
              <Icon
                className={cn(
                  "text-default-500 group-data-[selected=true]:text-foreground",
                  iconClassName
                )}
                icon={item.icon}
                width={24}
              />
            ) : (
              item.startContent ?? null
            )}
            title={
              isCompact ? null : item.title
            }
          >
            {isCompact ? (
              <Tooltip content={item.title} placement="right">
                <div className="flex w-full items-center justify-center">
                  {item.icon ? (
                    <Icon
                      className={cn(
                        "text-default-500 group-data-[selected=true]:text-foreground",
                        iconClassName
                      )}
                      icon={item.icon}
                      width={24}
                    />
                  ) : (
                    item.startContent ?? null
                  )}
                </div>
              </Tooltip>
            ) : null}
          </ListboxItem>
        );
      },
      [isCompact, hideEndContent, iconClassName] 
    );

    const [selectedKeys, setSelectedKeys] = React.useState(new Set([keySelected.key]));
  
    useEffect(() => {
      setSelectedKeys(new Set([keySelected.key]));
    } , [keySelected]);

    return (

      <>

      <Listbox

        key={isCompact ? `compact-${customLabel}` :`default-${customLabel}` }

        onSelectionChange={
          (keys: Set<string>) => {
            setSelectedKeys(keys);
          }
        }
        
        selectedKeys={selectedKeys}

        ref={ref}
        hideSelectedIcon
        as="nav"
        aria-label="Sidebar navigation"
        className={cn("list-none", className)}
        classNames={{
          ...classNames,
          list: cn("items-center", classNames?.list),
        }}
        color="default"
        itemClasses={{
          ...itemClasses,
          base: cn(
            "px-3 min-h-11 rounded-large h-[44px] data-[selected=true]:bg-default-100",
            itemClasses?.base
          ),
          title: cn(
            "text-small font-medium text-default-500 group-data-[selected=true]:text-foreground",
            itemClasses?.title
          ),
        }}
        items={items}
        selectionMode="single"
        variant="flat"
        {...props}
        >


        {items.map((item) => (
          item.items ? (
            <ListboxSection
              key={`${isCompact ? 'compact' : 'default'}-${customLabel}-${Date.now()}`}
              title={item.title}
              classNames={sectionClasses}
            >
              {item.items.map((subItem, index) => renderItem({ ...subItem, key: `${item.key}-${index}` }))}
            </ListboxSection>
          ) : (
            renderItem(item)
          )
        ))}


        

      </Listbox>
        </>
    );
  }
);

Sidebar.displayName = "Sidebar";
