import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { motion } from "framer-motion";

// Icons
import {
  BarChart3,
  Code2,
  Calendar,
  User,
  PenTool,
  ExternalLink,
  Mail,
  Github,
  Layers,
  Trash2,
  Eye,
  Plus,
  PencilLine,
} from "lucide-react";

// UI Components
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Redux actions with corrected names
import { clearSkillErrors, getAllSkills } from "@/store/skillSlice";
import {
  clearApplicationErrors,
  deleteApplication,
  getAllApplications,
  resetApplicationState,
} from "@/store/softwareApplicationSlice";
import { clearTimelineErrors, getAllTimelines } from "@/store/timelineSlice";
import { clearProjectErrors, getAllProjects } from "@/store/projectSlice";
import { getAllMessages } from "@/store/messageSlice";

// Loading button component
import SpecialLoadingButton from "./SpecialLoadingButton";

const Dashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Local loading state
  const [isLoading, setIsLoading] = useState(true);

  // Redux state
  const { user } = useSelector((state) => state.user);
  const { skills = [], error: skillError } = useSelector(
    (state) => state.skill
  );
  const {
    applications = [],
    loading: appLoading,
    error: appError,
    message: appMessage,
  } = useSelector((state) => state.softwareApplication);
  const { timelines = [], error: timelineError } = useSelector(
    (state) => state.timeline
  );
  const { projects = [], error: projectError } = useSelector(
    (state) => state.project
  );
  const { messages = [] } = useSelector(
    (state) => state.message || { messages: [] }
  );

  // Local state
  const [appId, setAppId] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");

  // THIS IS THE CRITICAL FIX - Fetch all data when component mounts
  useEffect(() => {
    // Set loading state while we fetch data
    setIsLoading(true);

    // Create an array of dispatch promises
    const fetchDataPromises = [
      dispatch(getAllSkills()),
      dispatch(getAllProjects()),
      dispatch(getAllTimelines()),
      dispatch(getAllApplications()),
      dispatch(getAllMessages()),
    ];

    // When all data is fetched, set loading to false
    Promise.all(fetchDataPromises).finally(() => {
      setIsLoading(false);
      console.log("All dashboard data loaded");
    });

    // Log current state for debugging
    console.log("Dashboard mounted, fetching data...");

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array ensures this only runs once on mount

  // Log state changes for debugging
  useEffect(() => {
    console.log("Skills data:", skills?.length, "items");
    console.log("Projects data:", projects?.length, "items");
    console.log("Timeline data:", timelines?.length, "items");
    console.log("Applications data:", applications?.length, "items");
  }, [skills, projects, timelines, applications]);

  // Navigation handlers - modified to work with your HomePage
  const navigateTo = (path) => {
    if (path.startsWith("/manage/skills")) {
      return () => {
        const event = new CustomEvent("navigate", { detail: "Add Skills" });
        document.dispatchEvent(event);
      };
    } else if (path.startsWith("/manage/projects")) {
      return () => {
        const event = new CustomEvent("navigate", { detail: "Add Project" });
        document.dispatchEvent(event);
      };
    } else if (path.startsWith("/manage/timeline")) {
      return () => {
        const event = new CustomEvent("navigate", { detail: "Add Timeline" });
        document.dispatchEvent(event);
      };
    } else if (path.startsWith("/add/application")) {
      return () => {
        const event = new CustomEvent("navigate", {
          detail: "Add Application",
        });
        document.dispatchEvent(event);
      };
    } else if (path.startsWith("/profile")) {
      return () => {
        const event = new CustomEvent("navigate", { detail: "Account" });
        document.dispatchEvent(event);
      };
    } else {
      return () => navigate(path);
    }
  };

  // Delete software application
  const handleDeleteSoftwareApp = (id) => {
    setAppId(id);
    dispatch(deleteApplication(id));
  };

  // Error handling
  useEffect(() => {
    if (skillError) {
      toast.error(skillError);
      dispatch(clearSkillErrors());
    }
    if (appError) {
      toast.error(appError);
      dispatch(clearApplicationErrors());
    }
    if (projectError) {
      toast.error(projectError);
      dispatch(clearProjectErrors());
    }
    if (timelineError) {
      toast.error(timelineError);
      dispatch(clearTimelineErrors());
    }

    if (appMessage) {
      toast.success(appMessage);
      setAppId(null);
      dispatch(resetApplicationState());
      dispatch(getAllApplications());
    }
  }, [dispatch, skillError, appError, appMessage, projectError, timelineError]);

  // Get current date
  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Calculate counts and stats
  const totalSkills = skills?.length || 0;
  const totalProjects = projects?.length || 0;
  const totalTimeline = timelines?.length || 0;
  const totalMessages = messages?.length || 0;
  const totalApps = applications?.length || 0;

  // Sort skills by proficiency for top skills
  const topSkills = [...(skills || [])]
    .sort((a, b) => parseInt(b.proficiency) - parseInt(a.proficiency))
    .slice(0, 3);

  // Get latest projects
  const latestProjects = [...(projects || [])].slice(0, 3);

  // Calculate portfolio completion percentage
  const portfolioCompletion = Math.min(
    Math.round(
      (totalSkills > 0 ? 20 : 0) +
        (totalProjects > 0 ? 30 : 0) +
        (totalTimeline > 0 ? 20 : 0) +
        (totalApps > 0 ? 15 : 0) +
        (user?.aboutMe ? 15 : 0) || 0
    ),
    100
  );

  // Show loading state while data is being fetched
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full"></div>
          <p className="text-muted-foreground">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background/50 min-h-screen pb-8">
      {/* Welcome header */}
      <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white py-8 px-6 mb-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold mb-2">
                Welcome back, {user?.name || "Developer"}!
              </h1>
              <p className="text-gray-300">{currentDate}</p>
            </div>
            <div className="flex gap-3 mt-4 md:mt-0">
              <Button
                variant="outline"
                className="bg-white/10 hover:bg-white/20 text-white border-white/20"
                onClick={() => window.open(user?.portfolioUrl || "#", "_blank")}
              >
                <Eye className="mr-2 h-4 w-4" />
                Preview Portfolio
              </Button>
              <Button className="bg-primary hover:bg-primary/90">
                <Mail className="mr-2 h-4 w-4" />
                {totalMessages} Messages
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Dashboard tabs */}
        <div className="flex overflow-x-auto pb-2 mb-6 gap-2">
          <Button
            variant={activeTab === "overview" ? "default" : "outline"}
            onClick={() => setActiveTab("overview")}
            className="gap-2"
          >
            <BarChart3 className="h-4 w-4" />
            Overview
          </Button>
          <Button
            variant={activeTab === "projects" ? "default" : "outline"}
            onClick={() => setActiveTab("projects")}
            className="gap-2"
          >
            <Code2 className="h-4 w-4" />
            Projects
          </Button>
          <Button
            variant={activeTab === "skills" ? "default" : "outline"}
            onClick={() => setActiveTab("skills")}
            className="gap-2"
          >
            <PenTool className="h-4 w-4" />
            Skills
          </Button>
          <Button
            variant={activeTab === "timeline" ? "default" : "outline"}
            onClick={() => setActiveTab("timeline")}
            className="gap-2"
          >
            <Calendar className="h-4 w-4" />
            Timeline
          </Button>
          <Button
            variant={activeTab === "apps" ? "default" : "outline"}
            onClick={() => setActiveTab("apps")}
            className="gap-2"
          >
            <Layers className="h-4 w-4" />
            Applications
          </Button>
        </div>

        {/* Overview tab content */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* Stats cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Card className="border-l-4 border-primary">
                  <CardHeader className="pb-2">
                    <CardDescription>Projects</CardDescription>
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-3xl">
                        {totalProjects}
                      </CardTitle>
                      <Code2 className="h-8 w-8 text-muted-foreground opacity-80" />
                    </div>
                  </CardHeader>
                  <CardFooter>
                    <Button
                      variant="ghost"
                      className="p-0 h-auto text-primary hover:text-primary/90"
                      onClick={navigateTo("/manage/projects")}
                    >
                      Manage Projects{" "}
                      <ChevronRightIcon className="ml-1 h-4 w-4" />
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Card className="border-l-4 border-blue-500">
                  <CardHeader className="pb-2">
                    <CardDescription>Skills</CardDescription>
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-3xl">{totalSkills}</CardTitle>
                      <PenTool className="h-8 w-8 text-muted-foreground opacity-80" />
                    </div>
                  </CardHeader>
                  <CardFooter>
                    <Button
                      variant="ghost"
                      className="p-0 h-auto text-blue-500 hover:text-blue-600"
                      onClick={navigateTo("/manage/skills")}
                    >
                      Manage Skills{" "}
                      <ChevronRightIcon className="ml-1 h-4 w-4" />
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Card className="border-l-4 border-amber-500">
                  <CardHeader className="pb-2">
                    <CardDescription>Timeline Events</CardDescription>
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-3xl">
                        {totalTimeline}
                      </CardTitle>
                      <Calendar className="h-8 w-8 text-muted-foreground opacity-80" />
                    </div>
                  </CardHeader>
                  <CardFooter>
                    <Button
                      variant="ghost"
                      className="p-0 h-auto text-amber-500 hover:text-amber-600"
                      onClick={navigateTo("/manage/timeline")}
                    >
                      Manage Timeline{" "}
                      <ChevronRightIcon className="ml-1 h-4 w-4" />
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Card className="border-l-4 border-green-500">
                  <CardHeader className="pb-2">
                    <CardDescription>Applications</CardDescription>
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-3xl">{totalApps}</CardTitle>
                      <Layers className="h-8 w-8 text-muted-foreground opacity-80" />
                    </div>
                  </CardHeader>
                  <CardFooter>
                    <Button
                      variant="ghost"
                      className="p-0 h-auto text-green-500 hover:text-green-600"
                      onClick={navigateTo("/add/application")}
                    >
                      Add Application{" "}
                      <ChevronRightIcon className="ml-1 h-4 w-4" />
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            </div>

            {/* Portfolio progress */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-center">
                  <CardTitle>Portfolio Completion</CardTitle>
                  <Badge
                    variant={
                      portfolioCompletion === 100 ? "default" : "outline"
                    }
                  >
                    {portfolioCompletion}% Complete
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <Progress value={portfolioCompletion} className="h-2" />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                  <div className="space-y-2">
                    <h3 className="font-medium text-sm flex items-center gap-2">
                      <CheckCircleIcon
                        className={`h-4 w-4 ${
                          totalProjects > 0
                            ? "text-green-500"
                            : "text-muted-foreground"
                        }`}
                      />
                      Projects ({totalProjects > 0 ? "Added" : "Missing"})
                    </h3>
                    <h3 className="font-medium text-sm flex items-center gap-2">
                      <CheckCircleIcon
                        className={`h-4 w-4 ${
                          totalSkills > 0
                            ? "text-green-500"
                            : "text-muted-foreground"
                        }`}
                      />
                      Skills ({totalSkills > 0 ? "Added" : "Missing"})
                    </h3>
                    <h3 className="font-medium text-sm flex items-center gap-2">
                      <CheckCircleIcon
                        className={`h-4 w-4 ${
                          totalTimeline > 0
                            ? "text-green-500"
                            : "text-muted-foreground"
                        }`}
                      />
                      Timeline ({totalTimeline > 0 ? "Added" : "Missing"})
                    </h3>
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-medium text-sm flex items-center gap-2">
                      <CheckCircleIcon
                        className={`h-4 w-4 ${
                          totalApps > 0
                            ? "text-green-500"
                            : "text-muted-foreground"
                        }`}
                      />
                      Applications ({totalApps > 0 ? "Added" : "Missing"})
                    </h3>
                    <h3 className="font-medium text-sm flex items-center gap-2">
                      <CheckCircleIcon
                        className={`h-4 w-4 ${
                          user?.aboutMe
                            ? "text-green-500"
                            : "text-muted-foreground"
                        }`}
                      />
                      About Me ({user?.aboutMe ? "Added" : "Missing"})
                    </h3>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  variant="outline"
                  onClick={navigateTo("/profile")}
                  className="gap-2"
                >
                  <User className="h-4 w-4" />
                  Edit Profile
                </Button>
              </CardFooter>
            </Card>

            {/* Two-column section */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Top skills */}
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>Top Skills</CardTitle>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={navigateTo("/manage/skills")}
                    >
                      View All
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {topSkills.length > 0 ? (
                      topSkills.map((skill) => (
                        <div key={skill._id} className="space-y-2">
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                              {skill.svg && (
                                <img
                                  src={skill.svg}
                                  alt={skill.title}
                                  className="w-5 h-5 object-contain"
                                />
                              )}
                              <span className="font-medium">{skill.title}</span>
                            </div>
                            <span className="text-sm text-muted-foreground">
                              {skill.proficiency}%
                            </span>
                          </div>
                          <Progress
                            value={parseInt(skill.proficiency)}
                            className="h-2"
                          />
                        </div>
                      ))
                    ) : (
                      <div className="py-8 text-center">
                        <PenTool className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
                        <h3 className="text-lg font-medium">
                          No skills added yet
                        </h3>
                        <p className="text-muted-foreground text-sm mt-2">
                          Add your technical skills to showcase your expertise
                        </p>
                        <Button
                          onClick={navigateTo("/manage/skills")}
                          className="mt-4"
                        >
                          <Plus className="mr-2 h-4 w-4" />
                          Add Skills
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Latest projects */}
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>Recent Projects</CardTitle>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={navigateTo("/manage/projects")}
                    >
                      View All
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {latestProjects.length > 0 ? (
                    <div className="space-y-4">
                      {latestProjects.map((project) => (
                        <div
                          key={project._id}
                          className="flex items-start gap-3 p-3 rounded-lg border bg-card/50 hover:bg-card/80 transition-colors"
                        >
                          <div className="w-12 h-12 rounded overflow-hidden shrink-0">
                            <img
                              src={project.image}
                              alt={project.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start">
                              <h3 className="font-medium truncate">
                                {project.title}
                              </h3>
                              <Badge
                                variant="outline"
                                className={`ml-2 shrink-0 ${
                                  project.deployed === "Yes"
                                    ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                                    : "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400"
                                }`}
                              >
                                {project.deployed === "Yes"
                                  ? "Live"
                                  : project.deployed}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground line-clamp-1 mt-1">
                              {project.description}
                            </p>
                            <div className="flex gap-2 mt-2">
                              {project.gitRepoUrl && (
                                <a
                                  href={project.gitRepoUrl}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
                                >
                                  <Github className="h-3 w-3" />
                                  GitHub
                                </a>
                              )}
                              {project.projectUrl && (
                                <a
                                  href={project.projectUrl}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
                                >
                                  <ExternalLink className="h-3 w-3" />
                                  Visit
                                </a>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="py-8 text-center">
                      <Code2 className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
                      <h3 className="text-lg font-medium">
                        No projects added yet
                      </h3>
                      <p className="text-muted-foreground text-sm mt-2">
                        Add projects to showcase your best work
                      </p>
                      <Button
                        onClick={navigateTo("/add/project")}
                        className="mt-4"
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Add Project
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* About me card */}
            <Card>
              <CardHeader>
                <CardTitle>About Me</CardTitle>
              </CardHeader>
              <CardContent>
                {user?.aboutMe ? (
                  <p className="whitespace-pre-line leading-relaxed">
                    {user.aboutMe}
                  </p>
                ) : (
                  <div className="py-6 text-center bg-muted/30 rounded-md">
                    <User className="h-12 w-12 text-muted-foreground/50 mx-auto mb-3" />
                    <p className="text-muted-foreground">
                      You haven't added your bio yet. Add an about me section to
                      make your portfolio more personal.
                    </p>
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Button variant="outline" onClick={navigateTo("/profile")}>
                  <PencilLine className="mr-2 h-4 w-4" />
                  {user?.aboutMe ? "Edit Bio" : "Add Bio"}
                </Button>
              </CardFooter>
            </Card>
          </div>
        )}

        {/* Apps tab content and other tabs... (rest of the code unchanged) */}
        {/* For brevity, I've omitted the other tab content sections */}
      </div>
    </div>
  );
};

// Additional icons
const ChevronRightIcon = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="m9 18 6-6-6-6" />
  </svg>
);

const CheckCircleIcon = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);

export default Dashboard;
