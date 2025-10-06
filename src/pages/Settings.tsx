import { ArrowLeft, User, Users, MapPin, Mail, LogOut, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Settings = () => {
  const navigate = useNavigate();

  const settingsItems = [
    {
      icon: User,
      title: "Update Profile",
      description: "View and edit your profile",
      onClick: () => console.log("Update Profile"),
    },
    {
      icon: Users,
      title: "Emergency Contacts",
      description: "Manage your emergency contacts",
      onClick: () => navigate("/contacts"),
    },
    {
      icon: MapPin,
      title: "Show My Location",
      description: "Allow location access",
      onClick: () => console.log("Show My Location"),
    },
    {
      icon: Mail,
      title: "Setup Auto Message",
      description: "Allow location access",
      onClick: () => console.log("Setup Auto Message"),
    },
    {
      icon: LogOut,
      title: "Logout",
      description: "Click here to logout",
      onClick: () => navigate("/login"),
    },
  ];

  return (
    <div className="min-h-screen bg-background p-6">
      {/* Back Button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => navigate("/dashboard")}
        className="w-16 h-16 rounded-2xl bg-card border-2 border-border mb-6"
      >
        <ArrowLeft className="w-6 h-6" />
      </Button>

      {/* Title */}
      <h1 className="text-4xl font-bold text-foreground mb-8">Settings</h1>

      {/* Settings Menu Items */}
      <div className="space-y-4">
        {settingsItems.map((item, index) => (
          <button
            key={index}
            onClick={item.onClick}
            className="w-full bg-card rounded-2xl p-4 flex items-center gap-4 hover:bg-accent/10 transition-colors border-2 border-transparent hover:border-border"
          >
            {/* Icon */}
            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center flex-shrink-0">
              <item.icon className="w-7 h-7 text-primary" />
            </div>

            {/* Text Content */}
            <div className="flex-1 text-left">
              <h3 className="text-lg font-bold text-foreground">{item.title}</h3>
              <p className="text-sm text-muted-foreground">{item.description}</p>
            </div>

            {/* Arrow */}
            <ChevronRight className="w-6 h-6 text-muted-foreground flex-shrink-0" />
          </button>
        ))}
      </div>
    </div>
  );
};

export default Settings;
