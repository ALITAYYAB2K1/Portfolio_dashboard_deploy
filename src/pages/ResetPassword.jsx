import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { resetPassword } from "../store/forgotResetPasswordSlice";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import SpecialLoadingButton from "./sub-components/SpecialLoadingButton";

function ResetPassword() {
  const { token } = useParams();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { loading, error, message } = useSelector(
    (state) => state.forgotPassword
  );
  const { isAuthenticated } = useSelector((state) => state.user);
  const navigateTo = useNavigate();
  const dispatch = useDispatch();
  const handleResetPassword = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      return toast.error("Passwords do not match");
    }
    dispatch(resetPassword(token, password, confirmPassword, navigateTo));
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
          <form className="flex flex-col gap-6" onSubmit={handleResetPassword}>
            <div className="flex flex-col items-center text-center">
              <h1 className="text-2xl font-bold">Reset Password</h1>
              <p className="text-muted-foreground">
                Set a new password for your account
              </p>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Password</Label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Confirm Password</Label>
              <Input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            {loading ? (
              <SpecialLoadingButton content={"Reseting Password"} />
            ) : (
              <Button
                type="submit"
                className="w-full bg-black text-white hover:bg-gray-900 transition cursor-pointer"
              >
                Reset Password
              </Button>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default ResetPassword;
