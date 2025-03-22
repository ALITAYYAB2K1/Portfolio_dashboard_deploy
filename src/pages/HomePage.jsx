import React, { useEffect, useState } from "react";
import { Button } from "../components/ui/button";
import { useDispatch, useSelector } from "react-redux";
import { clearAllUserErrors, logout, getUser } from "../store/userSlice";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import {
  FolderGit,
  History,
  Home,
  LayoutGrid,
  LogOut,
  MessagesSquare,
  Package,
  PanelLeft,
  PencilRuler,
  SquareUser,
  User,
} from "lucide-react";
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "../components/ui/tooltip";

import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
  SheetHeader,
} from "../components/ui/sheet";
import Dashboard from "./sub-components/Dashboard";
import { AddProject } from "./sub-components/AddProject";
import { AddSkills } from "./sub-components/AddSkills";
import { AddSoftwareApplications } from "./sub-components/AddApplication";
import { AddTimeline } from "./sub-components/AddTimeline";
import { Messages } from "./sub-components/Messages";
import { Account } from "./sub-components/Account";

function HomePage() {
  const [active, setActive] = useState("Dashboard");
  const dispatch = useDispatch();
  const navigateTo = useNavigate();
  const [isPageLoading, setIsPageLoading] = useState(true);

  const { isAuthenticated, user, error, message, loading } = useSelector(
    (state) => state.user
  );

  useEffect(() => {
    const logData = {
      isAuthenticated,
      userExists: !!user,
      userData: user,
      isLoading: loading || isPageLoading,
    };

    console.log("HomePage state:", logData);

    if (isAuthenticated && !user) {
      console.log("Fetching user data because authenticated but no user data");
      dispatch(getUser());
    }
  }, [isAuthenticated, user, loading, isPageLoading, dispatch]);

  // Debug user data
  useEffect(() => {
    console.log("Redux state:", { isAuthenticated, user, loading });
  }, [isAuthenticated, user, loading]);

  // Handle initial page load
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsPageLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  // Handle errors and messages
  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearAllUserErrors());
    }
    if (!isAuthenticated) {
      navigateTo("/login");
    }
    if (message) {
      toast.success(message);
      dispatch(clearAllUserErrors());
    }
  }, [error, message, isAuthenticated, dispatch, navigateTo]);

  const handleLogout = () => {
    dispatch(logout(navigateTo));
  };

  // Prepare display data with fallbacks
  const displayName = user?.fullname || "User";
  const hasAvatar = user && user.avatar;

  // Check if we're still loading
  const showLoading = isPageLoading || loading;

  // Function to render the active component
  const renderActiveComponent = () => {
    switch (active) {
      case "Dashboard":
        return <Dashboard />;
      case "Add Project":
        return <AddProject />;
      case "Add Skills":
        return <AddSkills />;
      case "Add Application":
        return <AddSoftwareApplications />;
      case "Add Timeline":
        return <AddTimeline />;
      case "Messages":
        return <Messages />;
      case "Account":
        return <Account />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex min-h-screen w-full bg-background text-foreground">
      {/* Desktop Sidebar - Hidden on mobile */}
      <aside className="fixed inset-y-0 left-0 hidden md:flex w-14 flex-col items-center justify-between border-border border-r bg-sidebar text-sidebar-foreground z-50 py-4">
        <div className="flex flex-col items-center">
          <Link
            to="/"
            className="group flex h-9 w-9 items-center justify-center rounded-md transition-all hover:bg-sidebar-accent hover:text-sidebar-accent-foreground mb-4"
          >
            <Package className="h-5 w-5 transition-all group-hover:scale-110" />
            <span className="sr-only">Dashboard</span>
          </Link>

          <nav className="flex flex-col items-center gap-4">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link
                    to="#"
                    className={`flex h-9 w-9 items-center justify-center rounded-md ${
                      active === "Dashboard"
                        ? "bg-sidebar-primary text-sidebar-primary-foreground"
                        : "text-sidebar-foreground/60"
                    } transition-colors hover:text-sidebar-foreground`}
                    onClick={(e) => {
                      e.preventDefault();
                      setActive("Dashboard");
                    }}
                  >
                    <Home className="h-5 w-5" />
                    <span className="sr-only">Dashboard</span>
                  </Link>
                </TooltipTrigger>
                <TooltipContent
                  side="right"
                  className="bg-popover text-popover-foreground"
                >
                  Dashboard
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link
                    to="#"
                    className={`flex h-9 w-9 items-center justify-center rounded-md ${
                      active === "Add Project"
                        ? "bg-sidebar-primary text-sidebar-primary-foreground"
                        : "text-sidebar-foreground/60"
                    } transition-colors hover:text-sidebar-foreground`}
                    onClick={(e) => {
                      e.preventDefault();
                      setActive("Add Project");
                    }}
                  >
                    <FolderGit className="h-5 w-5" />
                    <span className="sr-only">ADD PROJECT</span>
                  </Link>
                </TooltipTrigger>
                <TooltipContent
                  side="right"
                  className="bg-popover text-popover-foreground"
                >
                  Add Project
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link
                    to="#"
                    className={`flex h-9 w-9 items-center justify-center rounded-md ${
                      active === "Add Skills"
                        ? "bg-sidebar-primary text-sidebar-primary-foreground"
                        : "text-sidebar-foreground/60"
                    } transition-colors hover:text-sidebar-foreground`}
                    onClick={(e) => {
                      e.preventDefault();
                      setActive("Add Skills");
                    }}
                  >
                    <PencilRuler className="h-5 w-5" />
                    <span className="sr-only">Add Skills</span>
                  </Link>
                </TooltipTrigger>
                <TooltipContent
                  side="right"
                  className="bg-popover text-popover-foreground"
                >
                  Add Skills
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link
                    to="#"
                    className={`flex h-9 w-9 items-center justify-center rounded-md ${
                      active === "Add Application"
                        ? "bg-sidebar-primary text-sidebar-primary-foreground"
                        : "text-sidebar-foreground/60"
                    } transition-colors hover:text-sidebar-foreground`}
                    onClick={(e) => {
                      e.preventDefault();
                      setActive("Add Application");
                    }}
                  >
                    <LayoutGrid className="h-5 w-5" />
                    <span className="sr-only">Add Application</span>
                  </Link>
                </TooltipTrigger>
                <TooltipContent
                  side="right"
                  className="bg-popover text-popover-foreground"
                >
                  Add Application
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link
                    to="#"
                    className={`flex h-9 w-9 items-center justify-center rounded-md ${
                      active === "Add Timeline"
                        ? "bg-sidebar-primary text-sidebar-primary-foreground"
                        : "text-sidebar-foreground/60"
                    } transition-colors hover:text-sidebar-foreground`}
                    onClick={(e) => {
                      e.preventDefault();
                      setActive("Add Timeline");
                    }}
                  >
                    <History className="h-5 w-5" />
                    <span className="sr-only">Add Timeline</span>
                  </Link>
                </TooltipTrigger>
                <TooltipContent
                  side="right"
                  className="bg-popover text-popover-foreground"
                >
                  Add Timeline
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link
                    to="#"
                    className={`flex h-9 w-9 items-center justify-center rounded-md ${
                      active === "Messages"
                        ? "bg-sidebar-primary text-sidebar-primary-foreground"
                        : "text-sidebar-foreground/60"
                    } transition-colors hover:text-sidebar-foreground`}
                    onClick={(e) => {
                      e.preventDefault();
                      setActive("Messages");
                    }}
                  >
                    <MessagesSquare className="h-5 w-5" />
                    <span className="sr-only">Messages</span>
                  </Link>
                </TooltipTrigger>
                <TooltipContent
                  side="right"
                  className="bg-popover text-popover-foreground"
                >
                  Messages
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link
                    to="#"
                    className={`flex h-9 w-9 items-center justify-center rounded-md ${
                      active === "Account"
                        ? "bg-sidebar-primary text-sidebar-primary-foreground"
                        : "text-sidebar-foreground/60"
                    } transition-colors hover:text-sidebar-foreground`}
                    onClick={(e) => {
                      e.preventDefault();
                      setActive("Account");
                    }}
                  >
                    <SquareUser className="h-5 w-5" />
                    <span className="sr-only">Account</span>
                  </Link>
                </TooltipTrigger>
                <TooltipContent
                  side="right"
                  className="bg-popover text-popover-foreground"
                >
                  Account
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </nav>
        </div>

        {/* Logout button positioned at the bottom */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground h-9 w-9 rounded-md"
                onClick={handleLogout}
              >
                <LogOut className="h-5 w-5" />
                <span className="sr-only">Logout</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent
              side="right"
              className="bg-popover text-popover-foreground"
            >
              Logout
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </aside>

      <div className="flex flex-col flex-1 md:ml-14">
        {/* Mobile-friendly Header */}
        <header
          className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-border bg-background px-4
            md:static md:h-auto md:border-0 md:bg-transparent md:px-6 md:py-4"
        >
          {/* Mobile Menu Button - Only visible on mobile */}
          <Sheet>
            <SheetTrigger asChild>
              <Button
                size="icon"
                variant="outline"
                className="md:hidden border border-input"
              >
                <PanelLeft className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>

            {/* Fixed mobile sidebar with solid background */}
            <SheetContent
              side="left"
              className="w-[80%] max-w-[280px] bg-background border-r border-border"
              style={{
                boxShadow: "4px 0 10px rgba(0, 0, 0, 0.1)",
              }}
            >
              <SheetHeader className="mb-6">
                <SheetTitle className="text-xl text-foreground">
                  Portfolio Dashboard
                </SheetTitle>
              </SheetHeader>

              <div className="py-1">
                <div className="flex items-center mb-6 space-x-3">
                  <div className="bg-primary h-10 w-10 rounded-full flex items-center justify-center">
                    <Package className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <div className="text-lg font-medium text-foreground">
                    {!showLoading && displayName ? displayName : "User"}
                  </div>
                </div>

                <nav className="grid gap-2 text-sm font-medium">
                  <Link
                    to="#"
                    className={`flex items-center gap-3 rounded-md px-3 py-2.5 ${
                      active === "Dashboard"
                        ? "bg-accent text-accent-foreground font-semibold"
                        : "text-foreground hover:bg-accent/50"
                    }`}
                    onClick={(e) => {
                      e.preventDefault();
                      setActive("Dashboard");
                    }}
                  >
                    <Home className="h-5 w-5" />
                    Dashboard
                  </Link>
                  <Link
                    to="#"
                    className={`flex items-center gap-3 rounded-md px-3 py-2.5 ${
                      active === "Add Project"
                        ? "bg-accent text-accent-foreground font-semibold"
                        : "text-foreground hover:bg-accent/50"
                    }`}
                    onClick={(e) => {
                      e.preventDefault();
                      setActive("Add Project");
                    }}
                  >
                    <FolderGit className="h-5 w-5" />
                    Add Project
                  </Link>
                  <Link
                    to="#"
                    className={`flex items-center gap-3 rounded-md px-3 py-2.5 ${
                      active === "Add Skills"
                        ? "bg-accent text-accent-foreground font-semibold"
                        : "text-foreground hover:bg-accent/50"
                    }`}
                    onClick={(e) => {
                      e.preventDefault();
                      setActive("Add Skills");
                    }}
                  >
                    <PencilRuler className="h-5 w-5" />
                    Skills
                  </Link>
                  <Link
                    to="#"
                    className={`flex items-center gap-3 rounded-md px-3 py-2.5 ${
                      active === "Add Application"
                        ? "bg-accent text-accent-foreground font-semibold"
                        : "text-foreground hover:bg-accent/50"
                    }`}
                    onClick={(e) => {
                      e.preventDefault();
                      setActive("Add Application");
                    }}
                  >
                    <LayoutGrid className="h-5 w-5" />
                    Add Application
                  </Link>
                  <Link
                    to="#"
                    className={`flex items-center gap-3 rounded-md px-3 py-2.5 ${
                      active === "Add Timeline"
                        ? "bg-accent text-accent-foreground font-semibold"
                        : "text-foreground hover:bg-accent/50"
                    }`}
                    onClick={(e) => {
                      e.preventDefault();
                      setActive("Add Timeline");
                    }}
                  >
                    <History className="h-5 w-5" />
                    Add Timeline
                  </Link>
                  <Link
                    to="#"
                    className={`flex items-center gap-3 rounded-md px-3 py-2.5 ${
                      active === "Messages"
                        ? "bg-accent text-accent-foreground font-semibold"
                        : "text-foreground hover:bg-accent/50"
                    }`}
                    onClick={(e) => {
                      e.preventDefault();
                      setActive("Messages");
                    }}
                  >
                    <MessagesSquare className="h-5 w-5" />
                    Messages
                  </Link>
                  <Link
                    to="#"
                    className={`flex items-center gap-3 rounded-md px-3 py-2.5 ${
                      active === "Account"
                        ? "bg-accent text-accent-foreground font-semibold"
                        : "text-foreground hover:bg-accent/50"
                    }`}
                    onClick={(e) => {
                      e.preventDefault();
                      setActive("Account");
                    }}
                  >
                    <SquareUser className="h-5 w-5" />
                    Account
                  </Link>
                  <div className="border-t border-border my-2"></div>
                  <Button
                    variant="ghost"
                    className="flex items-center justify-start gap-3 rounded-md px-3 py-2.5 text-destructive hover:bg-destructive/10 w-full"
                    onClick={handleLogout}
                  >
                    <LogOut className="h-5 w-5" />
                    Logout
                  </Button>
                </nav>
              </div>
            </SheetContent>
          </Sheet>

          {/* User Info - Responsive for mobile */}
          <div className="flex items-center gap-3 flex-1">
            <div className="flex-shrink-0">
              {showLoading ? (
                <div className="w-10 h-10 md:w-16 md:h-16 rounded-full bg-muted animate-pulse"></div>
              ) : hasAvatar ? (
                <img
                  src={user.avatar}
                  alt="avatar"
                  className="w-10 h-10 md:w-16 md:h-16 rounded-full object-cover border border-border"
                />
              ) : (
                <div className="w-10 h-10 md:w-16 md:h-16 rounded-full bg-muted flex items-center justify-center border border-border">
                  <User className="h-5 w-5 md:h-8 md:w-8 text-muted-foreground" />
                </div>
              )}
            </div>
            <h1 className="text-xl md:text-3xl font-semibold truncate text-foreground">
              Welcome, {showLoading ? "User" : displayName}
            </h1>
          </div>
        </header>

        {/* Main Content Area - Renders only the active component */}
        <main className="flex-1 p-4 md:p-6 bg-background ">
          {renderActiveComponent()}
        </main>
      </div>
    </div>
  );
}

export default HomePage;
