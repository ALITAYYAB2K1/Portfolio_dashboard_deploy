import React, { useState } from "react";
import { Link } from "react-router-dom";
import Profile from "./Profile";
import UpdateProfile from "./UpdateProfile";
import UpdatePassword from "./UpdatePassword";

export function Account() {
  const [selectedComponent, setSelectedComponent] = useState("Profile");

  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-4 bg-muted/40 p-4 md:gap-8 md:pl-20">
        <div className="w-full max-w-6xl gap-2 pl-4">
          <h1 className="text-3xl font-semibold">Settings</h1>
        </div>
        <div className="w-full max-w-6xl items-start gap-6 pl-4 grid md:grid-cols-[180px_1fr] lg:grid-cols-[250px_1fr]">
          <nav className="grid gap-4 text-sm text-muted-foreground">
            <Link
              to="#"
              className={`hover:text-foreground ${
                selectedComponent === "Profile"
                  ? "font-semibold text-primary"
                  : ""
              }`}
              onClick={(e) => {
                e.preventDefault();
                setSelectedComponent("Profile");
              }}
            >
              Profile
            </Link>
            <Link
              to="#"
              className={`hover:text-foreground ${
                selectedComponent === "Update Profile"
                  ? "font-semibold text-primary"
                  : ""
              }`}
              onClick={(e) => {
                e.preventDefault();
                setSelectedComponent("Update Profile");
              }}
            >
              Update Profile
            </Link>
            <Link
              to="#"
              className={`hover:text-foreground ${
                selectedComponent === "Update Password"
                  ? "font-semibold text-primary"
                  : ""
              }`}
              onClick={(e) => {
                e.preventDefault();
                setSelectedComponent("Update Password");
              }}
            >
              Update Password
            </Link>
          </nav>
          <div className="grid gap-6">
            {(() => {
              switch (selectedComponent) {
                case "Profile":
                  return <Profile />;
                case "Update Profile":
                  return <UpdateProfile />;
                case "Update Password":
                  return <UpdatePassword />;
                default:
                  return <Profile />;
              }
            })()}
          </div>
        </div>
      </main>
    </div>
  );
}

export default Account;
