import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  addApplication,
  getAllApplications,
  deleteApplication,
  resetApplicationState,
} from "../../store/softwareApplicationSlice";
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
  RefreshCw,
  Upload,
  X,
  Plus,
  AppWindow,
  Grid,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "../../components/ui/dialog";
import { toast } from "react-toastify";

export function AddSoftwareApplications() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const { loading, applications, error, success, deleteLoading } = useSelector(
    (state) => state.softwareApplication
  );

  const [name, setName] = useState("");
  const [svg, setSvg] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");

  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [selectedAppId, setSelectedAppId] = useState(null);

  useEffect(() => {
    dispatch(getAllApplications());
  }, [dispatch]);

  useEffect(() => {
    if (success) {
      resetForm();
      setTimeout(() => {
        dispatch(resetApplicationState());
      }, 3000);
    }
  }, [success, dispatch]);

  const resetForm = () => {
    setName("");
    setSvg(null);
    setPreviewUrl("");
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

  const handleAddApplication = () => {
    if (!name.trim()) {
      toast.error("Name is required");
      return;
    }

    if (!svg) {
      toast.error("Icon is required");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("svg", svg);

    console.log("Submitting form data:", { name, svg });
    dispatch(addApplication(formData));
  };

  const handleDeleteClick = (id) => {
    setSelectedAppId(id);
    setConfirmDeleteOpen(true);
  };

  const confirmDelete = () => {
    if (selectedAppId) {
      dispatch(deleteApplication(selectedAppId));
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
            <AppWindow className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-bold">Software Applications</h1>
          </div>
          <Button
            variant="outline"
            onClick={handleReturnToDashboard}
            className="gap-2"
          >
            Return to Dashboard
          </Button>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {/* Add Application Card */}
          <Card className="md:col-span-1">
            <CardHeader>
              <CardTitle>Add Application</CardTitle>
              <CardDescription>
                Add software applications you're proficient with
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Application Name</Label>
                <Input
                  id="name"
                  placeholder="e.g. VS Code, Figma, etc."
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Application Icon (SVG/PNG)</Label>
                <div className="flex items-center gap-2">
                  <div
                    className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-md p-4 flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-colors w-full h-32"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    {previewUrl ? (
                      <div className="relative w-full h-full flex items-center justify-center">
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
            </CardContent>
            <CardFooter>
              <Button
                className="bg-black hover:bg-gray-800 text-white w-full"
                disabled={loading}
                onClick={handleAddApplication}
              >
                {loading ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Adding...
                  </>
                ) : (
                  "Add Application"
                )}
              </Button>
            </CardFooter>
          </Card>

          {/* Applications List */}
          <div className="md:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-medium">Your Applications</h2>
              <Button
                variant="outline"
                size="sm"
                onClick={() => dispatch(getAllApplications())}
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
                  <p className="text-muted-foreground">
                    Loading applications...
                  </p>
                </div>
              </div>
            ) : applications && applications.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {applications.map((app) => (
                  <Card
                    key={app._id}
                    className="overflow-hidden hover:shadow-md transition-all group"
                  >
                    <div className="p-2 h-32 flex flex-col items-center justify-center text-center">
                      <div className="relative w-16 h-16 mb-2 flex items-center justify-center">
                        <img
                          src={app.svg}
                          alt={app.name}
                          className="max-h-16 max-w-full object-contain"
                        />
                        <Button
                          variant="destructive"
                          size="sm"
                          className="h-6 w-6 p-0 absolute -top-2 -right-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => handleDeleteClick(app._id)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                      <p className="font-medium text-sm truncate w-full">
                        {app.name}
                      </p>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="bg-muted/50">
                <CardContent className="flex flex-col items-center justify-center p-8 text-center">
                  <Grid className="h-12 w-12 text-muted-foreground/50 mb-4" />
                  <h3 className="text-lg font-medium">
                    No applications added yet
                  </h3>
                  <p className="text-muted-foreground text-sm max-w-md mt-2">
                    Add the software applications you're proficient with to
                    showcase your technical skills.
                  </p>
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
              Delete Application
            </DialogTitle>
            <DialogDescription className="text-gray-300">
              Are you sure you want to delete this application? This action
              cannot be undone.
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
              Delete Application
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
