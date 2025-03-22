import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getAllProjects, deleteProject } from "../store/projectSlice";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import {
  Trash2,
  PencilLine,
  RefreshCw,
  Plus,
  Code,
  Layers,
  Github,
  ExternalLink,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "../components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../components/ui/tooltip";
import { Link } from "react-router-dom";

export function ManageProjects() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, projects, error, deleteLoading } = useSelector(
    (state) => state.project
  );

  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState(null);

  useEffect(() => {
    dispatch(getAllProjects());
  }, [dispatch]);

  const handleDeleteClick = (id) => {
    setSelectedProjectId(id);
    setConfirmDeleteOpen(true);
  };

  const confirmDelete = () => {
    if (selectedProjectId) {
      dispatch(deleteProject(selectedProjectId));
      setConfirmDeleteOpen(false);
    }
  };

  const handleEdit = (id) => {
    navigate(`/update/project/${id}`);
  };

  const handleAddNew = () => {
    navigate("/add/project");
  };

  const handleReturnToDashboard = () => {
    navigate("/");
  };

  return (
    <div className="min-h-[100vh] p-4 md:p-8 bg-gradient-to-b from-background to-background/80">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-2">
            <Code className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-bold">Manage Projects</h1>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleReturnToDashboard}>
              Return to Dashboard
            </Button>
            <Button
              onClick={handleAddNew}
              className="bg-black hover:bg-gray-800 text-white gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Project
            </Button>
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-medium">Your Projects</h2>
            <Button
              variant="outline"
              size="sm"
              onClick={() => dispatch(getAllProjects())}
              disabled={loading}
              className="flex items-center gap-2"
            >
              <RefreshCw
                className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
              />
              Refresh
            </Button>
          </div>

          {loading ? (
            <div className="flex justify-center p-12">
              <div className="flex flex-col items-center gap-2">
                <RefreshCw className="h-8 w-8 text-primary animate-spin" />
                <p className="text-muted-foreground">Loading projects...</p>
              </div>
            </div>
          ) : projects && projects.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {projects.map((project) => (
                <Card key={project._id} className="overflow-hidden group">
                  <div className="relative aspect-video overflow-hidden bg-black">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover transition-all duration-300 group-hover:scale-105 group-hover:opacity-90"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                      <div className="flex gap-2 justify-end">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="secondary"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => handleEdit(project._id)}
                              >
                                <PencilLine className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Edit Project</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>

                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="destructive"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => handleDeleteClick(project._id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Delete Project</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </div>
                  </div>

                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">{project.title}</CardTitle>
                      <div
                        className={`px-2 py-1 text-xs rounded-full ${
                          project.deployed === "Yes"
                            ? "bg-green-100 text-green-800"
                            : project.deployed === "Upcoming"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {project.deployed === "Yes" ? "Live" : project.deployed}
                      </div>
                    </div>
                    <CardDescription className="flex items-center gap-1">
                      <Layers className="h-3 w-3" />
                      {project.stack}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="pb-2">
                    <p className="text-sm line-clamp-2 text-muted-foreground">
                      {project.description}
                    </p>
                  </CardContent>

                  <CardFooter className="flex gap-2 justify-end pt-0">
                    {project.gitRepoUrl && (
                      <a
                        href={project.gitRepoUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
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
                        className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <ExternalLink className="h-3 w-3" />
                        Live Demo
                      </a>
                    )}
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="bg-muted/50">
              <CardContent className="flex flex-col items-center justify-center p-12 text-center">
                <Code className="h-12 w-12 text-muted-foreground/50 mb-4" />
                <h3 className="text-lg font-medium">No projects yet</h3>
                <p className="text-muted-foreground text-sm max-w-md mt-2 mb-4">
                  Showcase your best work by adding projects to your portfolio.
                </p>
                <Button
                  onClick={handleAddNew}
                  className="bg-black hover:bg-gray-800 text-white"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Your First Project
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Confirmation Dialog */}
      <Dialog open={confirmDeleteOpen} onOpenChange={setConfirmDeleteOpen}>
        <DialogContent className="sm:max-w-md bg-black border-gray-800 text-white">
          <DialogHeader>
            <DialogTitle className="text-white text-xl">
              Delete Project
            </DialogTitle>
            <DialogDescription className="text-gray-300">
              Are you sure you want to delete this project? This action cannot
              be undone and will permanently remove the project and its
              associated images.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex sm:justify-between mt-6">
            <Button
              className="bg-blue-600 text-white hover:bg-blue-700"
              onClick={() => setConfirmDeleteOpen(false)}
            >
              Cancel
            </Button>
            <Button
              className="bg-red-600 text-white hover:bg-red-700 gap-2"
              onClick={confirmDelete}
              disabled={deleteLoading}
            >
              {deleteLoading && <RefreshCw className="h-4 w-4 animate-spin" />}
              Delete Project
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
