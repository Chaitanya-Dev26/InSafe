import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logo from "@/assets/logo.svg";

const Splash = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/welcome");
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4 animate-in fade-in duration-1000">
        <img src={logo} alt="InSafe Logo" className="w-32 h-32 object-contain" />
        <div className="text-center">
          <h1 className="text-4xl font-bold text-primary">InSafe</h1>
          <p className="text-lg text-muted-foreground mt-2">Safety is Freedom</p>
        </div>
      </div>
    </div>
  );
};

export default Splash;
