import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useAuth } from "@/hooks/useAuth";

export default function Navigation() {
  const navigate = useNavigate();
  const { user, logout, isLoading } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <nav className="border-b border-border bg-card">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold text-foreground">
          Spring Boot + React Starter Kit
        </Link>
        <div className="flex gap-4 items-center">
          <Link
            to="/"
            className="text-foreground hover:text-primary transition"
          >
            Home
          </Link>
          {!isLoading && user ? (
            <>
              <Link
                to="/profile"
                className="text-foreground hover:text-primary transition"
              >
                Profile
              </Link>
              <div className="flex items-center gap-2 pl-2 border-l border-border">
                <Avatar>
                  {user.avatar_url && (
                    <AvatarImage
                      src={user.avatar_url}
                      alt={`${user.firstName} ${user.lastName}` || user.email}
                    />
                  )}
                  <AvatarFallback>
                    {(user.firstName || user.email)[0].toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm text-foreground">
                  {`${user.firstName} ${user.lastName}` || user.email}
                </span>
                <Button variant="outline" onClick={handleLogout} size="sm">
                  Logout
                </Button>
              </div>
            </>
          ) : !isLoading ? (
            <Link to="/login">
              <Button>Login</Button>
            </Link>
          ) : null}
        </div>
      </div>
    </nav>
  );
}
