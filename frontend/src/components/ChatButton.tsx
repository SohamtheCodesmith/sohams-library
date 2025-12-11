import "./ChatButton.css";

export default function ChatButton({ onClick }: { onClick: () => void }) {
  return (
    <button className="chat-button" onClick={onClick}>
      💬
    </button>
  );
}