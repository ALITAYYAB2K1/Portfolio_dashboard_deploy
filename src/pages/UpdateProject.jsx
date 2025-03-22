import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  getProject,
  updateProject,
  resetProjectState,
} from "../store/projectSlice";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { RefreshCw, Upload, X, ArrowLeft, Code } from "lucide-react";
import { toast } from "react-toastify";

export function UpdateProject() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const fileInputRef = useRef(null);

  const { loading, project, error, success, updateLoading } = useSelector(
    (state) => state.project
  );

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    projectUrl: "",
    gitRepoUrl: "",
    stack: "",
    deployed: "Yes",
  });
  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [dataLoaded, setDataLoaded] = useState(false);

  useEffect(() => {
    if (id) {
      dispatch(getProject(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (project && !dataLoaded) {
      setFormData({
        title: project.title || "",
        description: project.description || "",
        projectUrl: project.projectUrl || "",
        gitRepoUrl: project.gitRepoUrl || "",
        stack: project.stack || "",
        deployed: project.deployed || "Yes",
      });
      setPreviewUrl(project.image || "");
      setDataLoaded(true);
    }
  }, [project, dataLoaded]);

  useEffect(() => {
    if (success) {
      setTimeout(() => {
        dispatch(resetProjectState());
        navigate("/manage/projects");
      }, 1500);
    }
  }, [success, dispatch, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSelectChange = (value) => {
    setFormData({
      ...formData,
      deployed: value,
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);

      // Create a preview for the selected image
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdateProject = () => {
    if (
      !formData.title.trim() ||
      !formData.description.trim() ||
      !formData.stack.trim()
    ) {
      toast.error("Title, description and tech stack are required");
      return;
    }

    const projectFormData = new FormData();
    Object.keys(formData).forEach((key) => {
      projectFormData.append(key, formData[key]);
    });

    if (image) {
      projectFormData.append("image", image);
    }

    dispatch(updateProject(id, projectFormData));
  };

  const handleCancel = () => {
    navigate("/manage/projects");
  };

  if (loading && !project) {
    return (
      <div className="min-h-[100vh] flex justify-center items-center">
        <div className="flex flex-col items-center gap-2">
          <RefreshCw className="h-10 w-10 text-primary animate-spin" />
          <p className="text-muted-foreground">Loading project details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[100vh] p-4 md:p-8 bg-gradient-to-b from-background to-background/80">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-2">
            <Button variant="ghost" onClick={handleCancel} className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            <div className="flex items-center gap-2">
              <Code className="h-6 w-6 text-primary" />
              <h1 className="text-2xl font-bold">Update Project</h1>
            </div>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Edit Project Details</CardTitle>
            <CardDescription>
              Update the information for "{project?.title}"
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Project Title*</Label>
              <Input
                id="title"
                name="title"
                placeholder="e.g. E-commerce Website"
                value={formData.title}
                onChange={handleInputChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description*</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Describe your project, its features, and your role..."
                className="min-h-24 resize-none"
                value={formData.description}
                onChange={handleInputChange}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="projectUrl">Live URL</Label>
                <Input
                  id="projectUrl"
                  name="projectUrl"
                  placeholder="https://myproject.com"
                  value={formData.projectUrl}
                  onChange={handleInputChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="gitRepoUrl">GitHub Repository</Label>
                <Input
                  id="gitRepoUrl"
                  name="gitRepoUrl"
                  placeholder="https://github.com/username/repo"
                  value={formData.gitRepoUrl}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="stack">Tech Stack*</Label>
              <Input
                id="stack"
                name="stack"
                placeholder="e.g. React, Node.js, MongoDB"
                value={formData.stack}
                onChange={handleInputChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="deployed">Deployed Status*</Label>
              <Select
                value={formData.deployed}
                onValueChange={handleSelectChange}
              >
                <SelectTrigger id="deployed">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Yes">Yes - Live</SelectItem>
                  <SelectItem value="No">No - Development</SelectItem>
                  <SelectItem value="Upcoming">Upcoming</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="flex justify-between">
                <span>Project Image</span>
                <span className="text-xs text-muted-foreground">
                  Leave empty to keep current image
                </span>
              </Label>
              <div className="flex items-center gap-2">
                <div
                  className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-md p-4 w-full aspect-video flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-colors"
                  onClick={() => fileInputRef.current?.click()}
                >
                  {previewUrl ? (
                    <div className="relative w-full h-full flex items-center justify-center">
                      <img
                        src={previewUrl}
                        alt="Preview"
                        className="max-h-full max-w-full object-contain"
                      />
                      {image && (
                        <button
                          type="button"
                          className="absolute top-2 right-2 bg-destructive text-white rounded-full p-1"
                          onClick={(e) => {
                            e.stopPropagation();
                            setImage(null);
                            setPreviewUrl(project?.image || "");
                            if (fileInputRef.current) {
                              fileInputRef.current.value = "";
                            }
                          }}
                        >
                          <X className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  ) : (
                    <>
                      <Upload className="h-10 w-10 text-muted-foreground mb-2" />
                      <p className="text-sm text-muted-foreground">
                        Click to upload a new project image
                      </p>
                    </>
                  )}
                </div>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                  className="hidden"
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button
              className="bg-blue-600 hover:bg-blue-700 text-white"
              disabled={updateLoading}
              onClick={handleUpdateProject}
            >
              {updateLoading ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                "Update Project"
              )}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
