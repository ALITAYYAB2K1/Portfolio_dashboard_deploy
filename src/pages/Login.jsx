import { LoginForm } from "../components/ui/login-form";

export default function Login() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md sm:max-w-lg md:max-w-3xl">
        <LoginForm />
      </div>
    </div>
  );
}
