import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import hero from "@/assets/hero-image.jpg";

const Welcome = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <div className="relative flex-1 flex flex-col">
        <div className="relative h-[75vh] overflow-hidden rounded-b-[2rem]">
          <img 
            src={hero} 
            alt="Woman using smartphone safely" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
          
          <div className="absolute bottom-0 left-0 right-0 pb-2 text-center">
            <h1 className="text-7xl font-bold text-white ">
              Stay Safe
            </h1>
          </div>
        </div>

        <div className="">
          <h2 className="text-7xl font-bold  text-center">
            <span className="text-muted-foreground">with </span>
            <span className="text-primary">Insafe</span>
          </h2>
        </div>
      
        <div className="flex-1 flex items-center justify-center px-8 pb-10">
          <Button 
            onClick={() => navigate("/login")}
            size="lg"
            className="min-w-[220px] h-[70px] text-xl font-medium rounded-full bg-foreground text-background hover:bg-foreground/90 flex items-center justify-between px-8 gap-4"
          >
            <span className="flex-1 text-center">Get Started</span>
            <ChevronRight className="h-9 w-9" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
