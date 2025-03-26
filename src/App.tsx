import HomeLayout from "./components/ui/layouts/home";
import PopupChat from "./components/popup-chat";

export default function App() {
  return (
    <HomeLayout className="items-center">
      <PopupChat />
    </HomeLayout>
  );
}
