import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  addSkill,
  getAllSkills,
  deleteSkill,
  updateSkill,
  resetSkillState,
} from "../../store/skillSlice";
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
import {
  Trash2,
  PencilLine,
  Code2,
  RefreshCw,
  Upload,
  X,
  Plus,
  ChevronRight,
  CheckCircle2,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "../../components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../../components/ui/tooltip";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerFooter,
  DrawerClose,
} from "../../components/ui/drawer";
import { Slider } from "../../components/ui/slider";
import { toast } from "react-toastify";

export function AddSkills() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const { loading, skills, error, success, deleteLoading, updateLoading } =
    useSelector((state) => state.skill);

  const [title, setTitle] = useState("");
  const [proficiency, setProficiency] = useState(50);
  const [svg, setSvg] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [selectedSkillId, setSelectedSkillId] = useState(null);
  const [editDrawerOpen, setEditDrawerOpen] = useState(false);

  useEffect(() => {
    dispatch(getAllSkills());
  }, [dispatch]);

  useEffect(() => {
    if (success) {
      resetForm();
      setTimeout(() => {
        dispatch(resetSkillState());
      }, 3000);
    }
  }, [success, dispatch]);

  const resetForm = () => {
    setTitle("");
    setProficiency(50);
    setSvg(null);
    setPreviewUrl("");
    setIsEditing(false);
    setEditingId(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSvg(file);

      // Create a preview for the selected image
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddSkill = () => {
    if (!title.trim()) {
      toast.error("Title is required");
      return;
    }

    if (!svg && !isEditing) {
      toast.error("Icon is required");
      return;
    }

    if (isEditing && editingId) {
      dispatch(
        updateSkill(editingId, { title, proficiency: proficiency.toString() })
      );
      if (editDrawerOpen) {
        setEditDrawerOpen(false);
      }
    } else {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("proficiency", proficiency.toString());
      formData.append("svg", svg);

      dispatch(addSkill(formData));
    }
  };

  const handleEdit = (skill) => {
    setTitle(skill.title);
    setProficiency(parseInt(skill.proficiency));
    setPreviewUrl(skill.svg);
    setIsEditing(true);
    setEditingId(skill._id);
    setEditDrawerOpen(true);
  };

  const handleDeleteClick = (id) => {
    setSelectedSkillId(id);
    setConfirmDeleteOpen(true);
  };

  const confirmDelete = () => {
    if (selectedSkillId) {
      dispatch(deleteSkill(selectedSkillId));
      setConfirmDeleteOpen(false);
    }
  };

  const handleReturnToDashboard = () => {
    navigate("/");
  };

  return (
    <div className="min-h-[100vh] p-4 md:p-8 bg-gradient-to-b from-background to-background/80">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-2">
            <Code2 className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-bold">Skills Management</h1>
          </div>
          <Button
            variant="outline"
            onClick={handleReturnToDashboard}
            className="gap-2"
          >
            Return to Dashboard
          </Button>
        </div>

        <div className="grid gap-8 md:grid-cols-5">
          {/* Add Skill Card */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>
                {isEditing ? "Update Skill" : "Add New Skill"}
              </CardTitle>
              <CardDescription>
                {isEditing
                  ? "Update your skill details"
                  : "Add a new skill to your portfolio"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Skill Name</Label>
                <Input
                  id="title"
                  placeholder="e.g. React, JavaScript, Figma"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="proficiency">
                    Proficiency ({proficiency}%)
                  </Label>
                </div>
                <Slider
                  id="proficiency"
                  min={0}
                  max={100}
                  step={1}
                  value={[proficiency]}
                  onValueChange={(value) => setProficiency(value[0])}
                  className="py-4"
                  // Blue slider track and thumb
                  style={{
                    "--track-color": "rgba(59, 130, 246, 0.2)",
                    "--range-color": "rgb(59, 130, 246)",
                    "--thumb-color": "rgb(59, 130, 246)",
                  }}
                />
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                  <div
                    className="bg-blue-500 h-2.5 rounded-full transition-all duration-300"
                    style={{ width: `${proficiency}%` }}
                  ></div>
                </div>
              </div>

              {!isEditing && (
                <div className="space-y-2">
                  <Label>Skill Icon (SVG/PNG)</Label>
                  <div className="flex items-center gap-2">
                    <div
                      className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-md p-4 flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-colors"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      {previewUrl ? (
                        <div className="relative w-full h-24 flex items-center justify-center">
                          <img
                            src={previewUrl}
                            alt="Preview"
                            className="max-h-20 max-w-full object-contain"
                          />
                          <button
                            type="button"
                            className="absolute -top-2 -right-2 bg-destructive text-white rounded-full p-1"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSvg(null);
                              setPreviewUrl("");
                              if (fileInputRef.current) {
                                fileInputRef.current.value = "";
                              }
                            }}
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ) : (
                        <>
                          <Upload className="h-10 w-10 text-muted-foreground mb-2" />
                          <p className="text-sm text-muted-foreground">
                            Click to upload icon
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
              )}
            </CardContent>
            <CardFooter className="flex justify-between">
              {isEditing && (
                <Button variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
              )}
              <Button
                className={`${
                  isEditing
                    ? "bg-blue-600 hover:bg-blue-700"
                    : "bg-black hover:bg-gray-800"
                } text-white w-full`}
                disabled={loading || updateLoading}
                onClick={handleAddSkill}
              >
                {loading || updateLoading ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    {isEditing ? "Updating..." : "Adding..."}
                  </>
                ) : (
                  <>{isEditing ? "Update Skill" : "Add Skill"}</>
                )}
              </Button>
            </CardFooter>
          </Card>

          {/* Skills List */}
          <div className="md:col-span-3 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-medium">Your Skills</h2>
              <Button
                variant="outline"
                size="sm"
                onClick={() => dispatch(getAllSkills())}
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
                  <p className="text-muted-foreground">Loading skills...</p>
                </div>
              </div>
            ) : skills && skills.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {skills.map((skill) => (
                  <Card
                    key={skill._id}
                    className="overflow-hidden hover:shadow-md transition-all group"
                  >
                    <CardHeader className="pb-2">
                      <div className="flex justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 flex items-center justify-center rounded-md bg-primary/10">
                            <img
                              src={skill.svg}
                              alt={skill.title}
                              className="w-6 h-6 object-contain"
                            />
                          </div>
                          <CardTitle className="text-base">
                            {skill.title}
                          </CardTitle>
                        </div>
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 w-8 p-0 text-blue-600 hover:text-blue-800 hover:bg-blue-100"
                                  onClick={() => handleEdit(skill)}
                                >
                                  <PencilLine className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Edit Skill</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>

                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 w-8 p-0 text-destructive hover:text-destructive/90 hover:bg-destructive/10"
                                  onClick={() => handleDeleteClick(skill._id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Delete Skill</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pb-4">
                      <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">
                            Proficiency
                          </span>
                          <span className="font-medium">
                            {skill.proficiency}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div
                            className="bg-primary h-2 rounded-full"
                            style={{ width: `${skill.proficiency}%` }}
                          ></div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="bg-muted/50">
                <CardContent className="flex flex-col items-center justify-center p-8 text-center">
                  <Code2 className="h-12 w-12 text-muted-foreground/50 mb-4" />
                  <h3 className="text-lg font-medium">No skills added yet</h3>
                  <p className="text-muted-foreground text-sm max-w-md mt-2">
                    Add your technical and soft skills to showcase your
                    expertise to potential employers.
                  </p>
                  <Button variant="outline" className="mt-4" onClick={() => {}}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Your First Skill
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Confirmation Dialog */}
      <Dialog open={confirmDeleteOpen} onOpenChange={setConfirmDeleteOpen}>
        <DialogContent className="sm:max-w-md bg-black border-gray-800 text-white">
          <DialogHeader>
            <DialogTitle className="text-white text-xl">
              Delete Skill
            </DialogTitle>
            <DialogDescription className="text-gray-300">
              Are you sure you want to delete this skill? This action cannot be
              undone.
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
              Delete Skill
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Drawer for Mobile - with black background */}
      <Drawer open={editDrawerOpen} onOpenChange={setEditDrawerOpen}>
        <DrawerContent className="bg-black text-white border-t border-gray-800">
          <DrawerHeader className="border-b border-gray-800">
            <DrawerTitle className="text-white">Edit Skill</DrawerTitle>
            <DrawerDescription className="text-gray-300">
              Update your skill details below.
            </DrawerDescription>
          </DrawerHeader>
          <div className="p-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-title" className="text-white">
                Skill Name
              </Label>
              <Input
                id="edit-title"
                placeholder="e.g. React, JavaScript, Figma"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="bg-gray-900 border-gray-700 text-white"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="edit-proficiency" className="text-white">
                  Proficiency ({proficiency}%)
                </Label>
              </div>
              <Slider
                id="edit-proficiency"
                min={0}
                max={100}
                step={1}
                value={[proficiency]}
                onValueChange={(value) => setProficiency(value[0])}
                className="py-4"
                // White slider track and thumb for visibility in black background
                style={{
                  "--track-color": "rgba(255, 255, 255, 0.2)",
                  "--range-color": "rgb(255, 255, 255)",
                  "--thumb-color": "rgb(255, 255, 255)",
                }}
              />
              <div className="w-full bg-gray-700 rounded-full h-2.5">
                <div
                  className="bg-white h-2.5 rounded-full transition-all duration-300"
                  style={{ width: `${proficiency}%` }}
                ></div>
              </div>
            </div>
          </div>
          <DrawerFooter className="border-t border-gray-800">
            <Button
              className="bg-green-600 text-white w-full hover:bg-green-700"
              disabled={updateLoading}
              onClick={handleAddSkill}
            >
              {updateLoading ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                "Update Skill"
              )}
            </Button>
            <DrawerClose asChild>
              <Button className="bg-red-600 text-white hover:bg-red-700">
                Cancel
              </Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  );
}
