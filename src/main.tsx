// import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
// import App from "./App.tsx";
import PopupChat from "./components/popup-chat";

// createRoot(document.getElementById("root")!).render(
//   <StrictMode>
//     <App />
//   </StrictMode>
// );

window.renderChatbot = function () {
  const container = document.createElement('div')
  container.id = 'chatbot-widget'
  document.body.appendChild(container)

  const root = createRoot(container)
  root.render(<PopupChat />)
};

declare global {
  interface Window {
    renderChatbot: () => void;
  }
}
