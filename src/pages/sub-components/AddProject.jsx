import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addProject, resetProjectState } from "../../store/projectSlice";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { RefreshCw, Upload, X, Code, ArrowLeft } from "lucide-react";
import { toast } from "react-toastify";

export function AddProject() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const { loading, success } = useSelector((state) => state.project);

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

  useEffect(() => {
    if (success) {
      resetForm();
      setTimeout(() => {
        dispatch(resetProjectState());
        navigate("/manage/projects");
      }, 1500);
    }
  }, [success, dispatch, navigate]);

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      projectUrl: "",
      gitRepoUrl: "",
      stack: "",
      deployed: "Yes",
    });
    setImage(null);
    setPreviewUrl("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

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

  const handleAddProject = () => {
    if (
      !formData.title.trim() ||
      !formData.description.trim() ||
      !formData.stack.trim()
    ) {
      toast.error("Title, description and tech stack are required");
      return;
    }

    if (!image) {
      toast.error("Project image is required");
      return;
    }

    const projectFormData = new FormData();
    Object.keys(formData).forEach((key) => {
      projectFormData.append(key, formData[key]);
    });
    projectFormData.append("image", image);

    dispatch(addProject(projectFormData));
  };

  const handleCancel = () => {
    navigate("/manage/projects");
  };

  return (
    <div className="min-h-[100vh] p-4 md:p-8 bg-gradient-to-b from-background to-background/80">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-2 mb-8">
          <Button variant="ghost" onClick={handleCancel} className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Projects
          </Button>
          <div className="flex items-center gap-2">
            <Code className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-bold">Add New Project</h1>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Project Details</CardTitle>
            <CardDescription>
              Showcase your work by adding a new project to your portfolio
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
              <Label>Project Image*</Label>
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
                      <button
                        type="button"
                        className="absolute top-2 right-2 bg-destructive text-white rounded-full p-1"
                        onClick={(e) => {
                          e.stopPropagation();
                          setImage(null);
                          setPreviewUrl("");
                          if (fileInputRef.current) {
                            fileInputRef.current.value = "";
                          }
                        }}
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <>
                      <Upload className="h-10 w-10 text-muted-foreground mb-2" />
                      <p className="text-sm text-muted-foreground">
                        Click to upload project screenshot or thumbnail
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
              className="bg-black hover:bg-gray-800 text-white"
              disabled={loading}
              onClick={handleAddProject}
            >
              {loading ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Adding Project...
                </>
              ) : (
                "Add Project"
              )}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
