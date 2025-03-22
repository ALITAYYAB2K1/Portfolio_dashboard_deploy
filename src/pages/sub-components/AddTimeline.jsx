import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  addTimeline,
  getAllTimelines,
  deleteTimeline,
  resetTimelineState,
} from "../../store/timelineSlice";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../components/ui/form";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { Textarea } from "../../components/ui/textarea";
import {
  Calendar,
  Trash2,
  Briefcase,
  MoreHorizontal,
  ChevronRight,
  RefreshCw,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "../../components/ui/dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

const formSchema = z.object({
  title: z.string().min(2, { message: "Title must be at least 2 characters" }),
  description: z
    .string()
    .min(5, { message: "Description must be at least 5 characters" }),
  from: z.string().regex(/^\d{4}$/, { message: "From year must be 4 digits" }),
  to: z
    .string()
    .regex(/^\d{4}$/, { message: "To year must be 4 digits" })
    .optional()
    .or(z.literal("Present")),
});

export function AddTimeline() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, timelines, error, success, deleteLoading } = useSelector(
    (state) => state.timeline
  );

  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [selectedTimelineId, setSelectedTimelineId] = useState(null);

  // Initialize react-hook-form
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      from: "",
      to: "",
    },
  });

  useEffect(() => {
    dispatch(getAllTimelines());
  }, [dispatch]);

  useEffect(() => {
    if (success) {
      form.reset({
        title: "",
        description: "",
        from: "",
        to: "",
      });
      setTimeout(() => {
        dispatch(resetTimelineState());
      }, 3000);
    }
  }, [success, form, dispatch]);

  const onSubmit = (data) => {
    dispatch(addTimeline(data));
  };

  const handleDeleteClick = (id) => {
    setSelectedTimelineId(id);
    setConfirmDeleteOpen(true);
  };

  const confirmDelete = () => {
    if (selectedTimelineId) {
      dispatch(deleteTimeline(selectedTimelineId));
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
            <Briefcase className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-bold">Timeline Management</h1>
          </div>
          <Button
            variant="outline"
            onClick={handleReturnToDashboard}
            className="gap-2"
          >
            Return to Dashboard
          </Button>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          {/* Add Timeline Form */}
          <Card className="md:sticky md:top-4 h-fit">
            <CardHeader>
              <CardTitle>Add Timeline Entry</CardTitle>
              <CardDescription>
                Add educational or work experience to your portfolio timeline.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4"
                >
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g. Bachelor's Degree, Software Engineer"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="from"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>From Year</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. 2018" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="to"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>To Year</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="e.g. 2022 or Present"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Describe your experience or education..."
                            className="min-h-24 resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    className="w-full mt-4 bg-black text-white hover:bg-gray-800"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                        Adding...
                      </>
                    ) : (
                      "Add to Timeline"
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>

          {/* Timeline List */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-medium">Your Timeline</h2>
              <Button
                variant="outline"
                size="sm"
                onClick={() => dispatch(getAllTimelines())}
                disabled={loading}
                className="flex items-center gap-2"
              >
                <RefreshCw
                  className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
                />
                Refresh
              </Button>
            </div>

            {timelines && timelines.length > 0 ? (
              <div className="relative border-l-2 border-gray-200 dark:border-gray-800 pl-6 space-y-8 ml-3">
                {timelines.map((timeline, index) => (
                  <div
                    key={timeline._id}
                    className="relative hover:shadow-md transition-shadow bg-card rounded-lg border p-4"
                  >
                    {/* Timeline dot */}
                    <div className="absolute w-4 h-4 bg-primary rounded-full -left-8 top-4 border-2 border-background"></div>

                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-medium text-lg">
                          {timeline.title}
                        </h3>
                        <p className="text-sm text-muted-foreground flex items-center">
                          <Calendar className="mr-1 h-3 w-3" />
                          {timeline.timeline.from} —{" "}
                          {timeline.timeline.to || "Present"}
                        </p>
                      </div>

                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-destructive hover:text-destructive/90 hover:bg-destructive/10"
                        onClick={() => handleDeleteClick(timeline._id)}
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </div>

                    <p className="mt-2 text-sm text-foreground/80">
                      {timeline.description}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <Card className="bg-muted/50">
                <CardContent className="flex flex-col items-center justify-center p-8 text-center">
                  <Briefcase className="h-12 w-12 text-muted-foreground/50 mb-4" />
                  <h3 className="text-lg font-medium">
                    No timeline entries yet
                  </h3>
                  <p className="text-muted-foreground text-sm max-w-md mt-2">
                    Add your education and work experience to create a timeline
                    of your career journey.
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
              Delete Timeline Entry
            </DialogTitle>
            <DialogDescription className="text-gray-300">
              Are you sure you want to delete this timeline entry? This action
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
              Delete Entry
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
