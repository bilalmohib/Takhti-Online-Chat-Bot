import Head from 'next/head'
import Image from 'next/image';
import useState from 'react-usestateref';

enum Creator {
  Me = 0,
  Bot = 1
}

interface MessageProps {
  text: string;
  from: Creator;
  key: number;
}

interface InputProps {
  onSend: (input: string) => void;
  disabled: boolean;
}

// One Message in Chat 
const ChatMessage = ({ text, from }: MessageProps) => {
  return (
    <>
      {from == Creator.Me && (
        <div className="bg-white p-4 rounded-lg flex gap-4 items-center whitespace-pre-wrap">
          <Image
            src="/user.jpeg"
            alt="User"
            width={40}
            height={40}
            className="rounded-full"
          />
          <p className='text-gray-700'>
            {text}
          </p>
        </div>
      )}
      {from == Creator.Bot && (
        <div className="bg-gray-100 p-4 rounded-lg flex gap-4 items-center whitespace-pre-wrap">
          <Image
            src="/bot.png"
            alt="Bot"
            width={40}
            height={70}
            className="rounded-full"
          />
          <p className='text-gray-700'>
            {text}
          </p>
        </div>
      )}
    </>
  )
}

// The chat input field
const ChatInput = ({ onSend, disabled }: InputProps) => {
  const [input, setInput] = useState("");

  const sendInput = () => {
    onSend(input);
    setInput("");
  };

  const handleKeyDown = (event: any) => {
    if (event.keyCode === 13) {
      sendInput();
    }
  };

  return (
    <div className='bg-white border-2 p-2 rounded-lg flex justify-center'>
      <input
        value={input}
        onChange={(event) => setInput(event.target.value)}
        className="w-full py-2 px-3 text-gray-800 rounded-lg focus:outline-none"
        type="text"
        placeholder="Ask me anything..."
        disabled={disabled}
        onKeyDown={(ev) => handleKeyDown(ev)}
      />

      {disabled && (
        <button
          onClick={() => sendInput()}
          className="p-2 rounded-md text-gray-500 bottom-1.5 right-1"
        >
          <svg
            xmlns='https://www.w3.org/2000/svg'
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 0 013.27 20.876L5.999 12zm0 0l9 9m0 0l-9-9m9 9V3"
            />
          </svg>
        </button>
      )}
    </div>
  );
};

// Our Page
export default function Home() {
  const [messages, setMessages, messagesRef] = useState<MessageProps[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const callApi = async (input: string) => {
    setLoading(true);

    const myMessage: MessageProps = {
      text: input,
      from: Creator.Me,
      key: new Date().getTime()
    };

    setMessages([...messagesRef.current, myMessage]);

    const response = await fetch('/api/generate-answer', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        prompt: input
      })
    }).then((response) => response.json());

    setLoading(false);

    if (response.text) {
      const botMessage: MessageProps = {
        text: response.text,
        from: Creator.Bot,
        key: new Date().getTime()
      };

      setMessages([...messagesRef.current, botMessage]);
    } else {
      // Show Error
    }
  };

  return (
    <>
      <Head>
        <title>OPEN AI - CHAT BOT</title>
        <meta name="description" content="AI CHAT BOT POWERED BY GPT-3.5 Turbo" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/bot.png" />
      </Head>

      <main
        className="relative max-w-2xl mx-auto">
        <div className='sticky top-0 w-full pt-10 px-4'>
          <ChatInput onSend={(input) => callApi(input)} disabled={loading} />
        </div>

        <div className='mt-10 px-4'>
          {messages.map((message: MessageProps) => (
            <ChatMessage
              key={message.key}
              text={message.text}
              from={message.from}
            />
          ))}
          {(messages.length == 0) && (
            <p className='text-center text-gray-400'>
              I am at your service. Ask me anything.
            </p>
          )}
        </div>
        <br />
      </main>
    </>
  )
}
