"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import useLayoutStore from "@/store/layout-store"; // Enhanced Types
import {
  Bell,
  Calendar,
  ChevronDown,
  CircleUser,
  FolderOpen,
  LayoutDashboard,
  LibraryBig,
  LogOut,
  Receipt,
  Users,
  X,
} from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type React from "react";
import { useMemo } from "react";
import { MdStickyNote2 } from "react-icons/md";
import { FaFileInvoiceDollar } from "react-icons/fa";

interface OptimizedSidebarProps {
  notifications?: number;
  onLogout?: () => void;
  customMenuItems?: Record<string, any>[];
  className?: string;
  children?: React.ReactNode;
}

// Enhanced Active Logic Hook
const useActiveState = (pathname: string) => {
  const isActive = useMemo(() => {
    return (item: Record<string, any>): boolean => {
      if (item.exactMatch) {
        return pathname === item.href;
      }
      if (pathname === item.href) {
        return true;
      }
      if (item.activePatterns) {
        return item.activePatterns.some((pattern: string) => {
          if (pattern.includes("*")) {
            const regex = new RegExp(pattern.replace(/\*/g, ".*"));
            return regex.test(pathname);
          }
          return pathname.includes(pattern);
        });
      }
      if (item.children) {
        return item.children.some((child: Record<string, any>) =>
          isActive(child),
        );
      }
      return false;
    };
  }, [pathname]);

  const isParentActive = useMemo(() => {
    return (item: Record<string, any>): boolean => {
      if (!item.children) return false;
      return item.children.some((child: Record<string, any>) =>
        isActive(child),
      );
    };
  }, [isActive]);

  const getActiveLevel = useMemo(() => {
    return (
      item: Record<string, any>,
    ): "exact" | "parent" | "child" | "none" => {
      if (pathname === item.href) return "exact";
      if (isParentActive(item)) return "parent";

      if (isActive(item)) return "child";
      return "none";
    };
  }, [pathname, isActive, isParentActive]);

  return { isActive, isParentActive, getActiveLevel };
};

const OptimizedSidebar: React.FC<OptimizedSidebarProps> = ({
  notifications = 0,
  customMenuItems = [],
  className,
  children,
}) => {
  const t = useTranslations();
  const pathname = usePathname();
  const { state, toggleSidebar } = useSidebar();
  const { isActive, getActiveLevel } = useActiveState(pathname);
  const isCollapsed = state === "collapsed";
  const { user, logout } = useLayoutStore();
  const router = useRouter();

  const defaultItems = useMemo<Record<string, any>[]>(
    () => [
      {
        title: t("Dashboard"),
        icon: <LayoutDashboard className="w-5 h-5" />,
        href: `/${user?.role?.toLowerCase().replace("_", "-")}/dashboard`,
        activePatterns: [
          `/${user?.role?.toLowerCase().replace("_", "-")}/dashboard`,
          `/${user?.role?.toLowerCase().replace("_", "-")}/dashboard/*`,
        ],
        role: ["admin", "SUPER_ADMIN"],
      },
      {
        title: t("Staff"),
        icon: <Users className="w-5 h-5" />,
        href: `/${user?.role?.toLowerCase().replace("_", "-")}/staff`,
        activePatterns: [
          `/${user?.role?.toLowerCase().replace("_", "-")}/staff`,
          `/${user?.role?.toLowerCase().replace("_", "-")}/staff/*`,
        ],
        role: ["admin", "SUPER_ADMIN"],
      },
      {
        title: t("Payment Voucher"),
        icon: <Users className="w-5 h-5" />,
        href: `/${user?.role?.toLowerCase().replace("_", "-")}/payment`,
        activePatterns: [
          `/${user?.role?.toLowerCase().replace("_", "-")}/payment`,
          `/${user?.role?.toLowerCase().replace("_", "-")}/payment/*`,
        ],
        role: ["admin", "SUPER_ADMIN"],
      },
      {
        title: t("Payroll"),
        icon: <FaFileInvoiceDollar className="w-5 h-5" />,
        href: `/${user?.role?.toLowerCase().replace("_", "-")}/payroll`,
        activePatterns: [
          `/${user?.role?.toLowerCase().replace("_", "-")}/payroll`,
          `/${user?.role?.toLowerCase().replace("_", "-")}/payroll/*`,
        ],
        role: ["admin", "SUPER_ADMIN"],
      },
      {
        title: t("Memo"),
        icon: <Receipt className="w-5 h-5" />,
        href: `/${user?.role?.toLowerCase().replace("_", "-")}/memo`,
        activePatterns: [
          `/${user?.role?.toLowerCase().replace("_", "-")}/memo`,
          `/${user?.role?.toLowerCase().replace("_", "-")}/memo/*`,
        ],
        role: ["admin", "SUPER_ADMIN"],
      },
      {
        title: t("Circulars"),
        icon: <MdStickyNote2 className="w-5 h-5" />,
        href: `/${user?.role?.toLowerCase().replace("_", "-")}/circulars`,
        activePatterns: [
          `/${user?.role?.toLowerCase().replace("_", "-")}/circulars`,
          `/${user?.role?.toLowerCase().replace("_", "-")}/circulars/*`,
        ],
        role: ["admin", "SUPER_ADMIN"],
      },
    ],
    [t, user?.role, notifications],
  );

  // Combine all menu items
  const allItems = useMemo(
    () => [...defaultItems, ...customMenuItems],
    [defaultItems, customMenuItems],
  );

  // Render menu item with children
  const renderMenuItem = (item: Record<string, any>) => {
    if (!item.role.includes(user?.role)) return null;
    const itemIsActive = isActive(item);
    const hasChildren = item.children && item.children.length > 0;
    const isParentActive =
      getActiveLevel(item) === "parent" || getActiveLevel(item) === "exact";
    const activeLevel = getActiveLevel(item);

    // Common classes for menu items
    const getMenuItemClasses = (isActive: boolean, isParent = false) => {
      return cn(
        "flex items-center gap-2 h-10 py-7 rounded-lg text-lg text-black font-medium transition-all duration-200 group relative",
        // Collapsed state - center icons and adjust padding
        isCollapsed ? "justify-center px-3" : "px-4",
        // Default inactive state
        "hover:bg-green-600/95 hover:text-white",
        // Active states
        isActive && "bg-green-600 text-white hover:bg-green-800",
        // Parent archived state (subtle background when child is archived)
        isParent &&
          !isActive &&
          "bg-green-600 text-white hover:bg-green-600/20 hover:text-green-600",
      );
    };

    const menuContent = (
      <>
        {item.icon && (
          <span className={cn("flex-shrink-0", isCollapsed && "mx-auto")}>
            {item.icon}
          </span>
        )}

        {!isCollapsed && (
          <>
            <span className="flex-1 truncate text-start">{item.title}</span>
            {item.badge && (
              <Badge
                variant={itemIsActive ? "secondary" : "default"}
                className={cn(
                  "ml-auto h-5 px-1.5 text-xs",
                  itemIsActive && "bg-white text-green-600",
                )}
              >
                {item.badge}
              </Badge>
            )}
            {hasChildren && (
              <ChevronDown
                className={cn(
                  "ml-auto h-4 w-4 transition-transform",
                  isParentActive && "rotate-180",
                )}
              />
            )}
          </>
        )}
      </>
    );

    // For collapsed state, wrap everything in tooltip
    if (isCollapsed) {
      const content = hasChildren ? (
        <button
          className={getMenuItemClasses(
            activeLevel === "exact" || activeLevel === "child",
            activeLevel === "parent",
          )}
          onClick={() => {
            // In collapsed state, clicking parent items could expand sidebar or navigate
            if (!hasChildren) {
              window.location.href = item.href;
            }
          }}
        >
          {menuContent}
        </button>
      ) : (
        <Link href={item.href} className={getMenuItemClasses(itemIsActive)}>
          {menuContent}
        </Link>
      );

      return (
        <div key={item.href} className="relative group/menu-item">
          <Tooltip>
            <TooltipTrigger asChild>{content}</TooltipTrigger>
            <TooltipContent side="right" className="font-medium">
              <div>
                <p className="font-semibold">{item.title}</p>
                {hasChildren && item.children && (
                  <div className="mt-1 space-y-1">
                    {item.children.map((child: Record<string, any>) => (
                      <p key={child.href} className="text-xs opacity-75">
                        • {child.title}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            </TooltipContent>
          </Tooltip>
        </div>
      );
    }

    // Expanded state logic
    const mainLinkOrTrigger = hasChildren ? (
      <CollapsibleTrigger
        className={cn(
          "w-full",
          getMenuItemClasses(
            activeLevel === "exact" || activeLevel === "child",
            activeLevel === "parent",
          ),
        )}
      >
        {menuContent}
      </CollapsibleTrigger>
    ) : (
      <Link
        href={item.href}
        className={cn("w-full", getMenuItemClasses(itemIsActive))}
      >
        {menuContent}
      </Link>
    );

    return (
      <div key={item.href} className="relative group/menu-item">
        {hasChildren ? (
          <Collapsible defaultOpen={true} className="group/collapsible w-full">
            {mainLinkOrTrigger}
            <CollapsibleContent>
              <div className="flex flex-col gap-1 mt-1 ml-6 pl-2 border-l border-gray-200">
                {item.children?.map((child: Record<string, any>) => (
                  <div key={child.href} className="relative">
                    <Link
                      href={child.href}
                      className={cn(
                        "flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group relative",
                        "text-muted-foreground hover:bg-green-600/50 hover:text-white",
                        isActive(child) &&
                          "bg-green-400 text-white hover:bg-green-700",
                      )}
                    >
                      <span className="w-1.5 h-1.5 bg-current rounded-full flex-shrink-0" />
                      <span className="flex-1">{child.title}</span>
                      {child.badge && (
                        <Badge
                          variant={isActive(child) ? "secondary" : "default"}
                          className={cn(
                            "ml-auto h-5 px-1.5 text-xs",
                            isActive(child) && "bg-white text-green-600",
                          )}
                        >
                          {child.badge}
                        </Badge>
                      )}
                    </Link>
                  </div>
                ))}
              </div>
            </CollapsibleContent>
          </Collapsible>
        ) : (
          mainLinkOrTrigger
        )}
      </div>
    );
  };

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <TooltipProvider>
      <Sidebar
        className={cn(
          "border-r bg-white transition-all duration-300",
          isCollapsed ? "w-20" : "w-64",
          className,
        )}
        collapsible="icon"
      >
        <SidebarHeader>
          <div
            className={cn(
              "flex items-center w-full py-4 transition-all duration-300",
              isCollapsed ? "justify-center px-3" : "justify-between px-4",
            )}
          >
            <div
              className={cn(
                "flex items-center gap-2 transition-all duration-300",
                isCollapsed && "justify-center",
              )}
            >
              <LibraryBig className="w-6 h-6 text-primary flex-shrink-0" />
              {!isCollapsed && (
                <h1 className="text-xl font-bold">AIFU Library</h1>
              )}
            </div>
            {!isCollapsed && (
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={toggleSidebar}
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Close Sidebar</span>
              </Button>
            )}
          </div>
        </SidebarHeader>

        <SidebarContent className="hide-scroll">
          <SidebarGroup>
            <SidebarGroupContent className="flex flex-col gap-1">
              {allItems.map((item) => renderMenuItem(item))}
            </SidebarGroupContent>
          </SidebarGroup>

          {/* Custom Children Content - hide in collapsed state */}
          {children && !isCollapsed && (
            <SidebarGroup>
              <SidebarGroupContent className="flex flex-col gap-1">
                {children}
              </SidebarGroupContent>
            </SidebarGroup>
          )}
        </SidebarContent>

        {/* Logout Section */}
        <SidebarFooter>
          <div
            className={cn(
              "mb-3 transition-all duration-300",
              isCollapsed && "px-3 py-4",
            )}
          >
            {isCollapsed ? (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={handleLogout}
                    variant="ghost"
                    className="w-full h-10 px-3 py-2.5 rounded-lg justify-center text-muted-foreground hover:text-white hover:bg-green-600/95"
                  >
                    <LogOut className="w-5 h-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p>{t("logout")}</p>
                </TooltipContent>
              </Tooltip>
            ) : (
              <Button
                variant="ghost"
                onClick={handleLogout}
                className="w-full justify-start gap-2 h-10 px-4 py-2.5 rounded-lg text-muted-foreground hover:text-white hover:bg-green-600/95"
              >
                <LogOut className="w-5 h-5" />
                <span>{t("logout")}</span>
              </Button>
            )}
          </div>
        </SidebarFooter>
      </Sidebar>
    </TooltipProvider>
  );
};

export default OptimizedSidebar;
