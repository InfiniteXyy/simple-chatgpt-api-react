import { ChatCompletionRequestMessage, Configuration, OpenAIApi } from "openai";
import { useRef, useState } from "react";
import { flushSync } from "react-dom";
import { createRoot } from "react-dom/client";
const configuration = new Configuration({
  organization: process.env.OPENAI_ORGNIZATION,
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

function App() {
  const [messages, setMessages] = useState<ChatCompletionRequestMessage[]>([]);
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function send() {
    setIsLoading(true);
    const newMessages = [
      ...messages,
      { role: "user", content: input } as const,
    ];
    setMessages(newMessages);
    setInput("");
    const result = await openai.createChatCompletion({
      model: "gpt-3.5-turbo-0301",
      messages: newMessages,
    });
    flushSync(() => {
      setMessages([...newMessages, result.data.choices[0].message!]);
      setIsLoading(false);
    });
    inputRef.current?.focus();
  }

  return (
    <div>
      {messages?.map((i) => (
        <div style={{ marginBottom: 10 }}>
          {i.role}: {i.content}
        </div>
      ))}
      <input
        placeholder="send by press ENTER"
        ref={inputRef}
        autoFocus
        disabled={isLoading}
        onChange={(e) => setInput(e.target.value)}
        value={input}
        onKeyDown={(key) => key.key === "Enter" && send()}
      />
    </div>
  );
}

createRoot(document.querySelector("#root")!).render(<App />);
