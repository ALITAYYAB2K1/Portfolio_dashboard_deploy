import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { forgotPassword } from "../store/forgotResetPasswordSlice";
//import { user } from "../store/userSlice";
//import { cn } from "../lib/utils";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import SpecialLoadingButton from "./sub-components/SpecialLoadingButton";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const { loading, error, message } = useSelector(
    (state) => state.forgotPassword
  );
  const { isAuthenticated } = useSelector((state) => state.user);

  const dispatch = useDispatch();
  const navigateTo = useNavigate();

  const handleForgotPassword = (e) => {
    e.preventDefault();
    dispatch(forgotPassword(email));
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
    if (message) {
      toast.success(message);
    }
    if (isAuthenticated) {
      navigateTo("/");
    }
  }, [error, message, isAuthenticated, loading, dispatch, navigateTo]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardContent className="p-6 md:p-8">
          <form className="flex flex-col gap-6" onSubmit={handleForgotPassword}>
            <div className="flex flex-col items-center text-center">
              <h1 className="text-2xl font-bold">Password Recovery</h1>
              <p className="text-muted-foreground">
                Enter your email to recover your password
              </p>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="flex justify-end">
              <Link
                to="/login"
                className="text-sm underline-offset-2 hover:underline"
              >
                Remembered your password?
              </Link>
            </div>
            {loading ? (
              <SpecialLoadingButton content={"Sending..."} />
            ) : (
              <Button
                type="submit"
                className="w-full bg-black text-white hover:bg-gray-900 transition cursor-pointer"
              >
                Send Email
              </Button>
            )}
            <div className="text-center text-sm">
              Don&apos;t have an account?{" "}
              <Link to="/signup" className="underline underline-offset-4">
                Sign up
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default ForgotPassword;
