import Head from 'next/head'
import Image from 'next/image';
import useState from 'react-usestateref';
import { useEffect } from 'react';

import { useRouter } from 'next/router';

import LogoutIcon from '@mui/icons-material/Logout';

import {
  db,
  doc,
  collection,
  onSnapshot,
  addDoc,
  query,
  orderBy,
  deleteDoc,
  setDoc,
  Timestamp
} from "../firebase";

import {
  Button,
  Avatar
} from '@mui/material';

// Importing firebase
import {
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  signInWithPopup,
  GoogleAuthProvider,
  FacebookAuthProvider,
  TwitterAuthProvider,
  signInAnonymously
} from "firebase/auth";
import { auth } from "../firebase";

enum Creator {
  Me = 0,
  Bot = 1
}

interface MessageProps {
  text: string;
  from: Creator;
  key: number;
  userPhotoURL: string;
}

interface InputProps {
  onSend: (input: string) => void;
  disabled: boolean;
}

// One Message in Chat 
const ChatMessage = ({
  text,
  from,
  userPhotoURL
}: MessageProps) => {
  return (
    <>
      {from == Creator.Me && (
        <div className="bg-white p-4 rounded-lg flex gap-4 items-center whitespace-pre-wrap">
          <Image
            src={userPhotoURL}
            alt="User"
            width={40}
            height={40}
            className="rounded-full"
          />
          <p className='text-gray-700' style={{ wordSpacing: 2, fontSize: 25 }}>
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
          <p className='text-gray-700 space-x-8 text-lg' style={{ wordSpacing: 2, fontSize: 25 }}>
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
  const router = useRouter();

  const [messages, setMessages, messagesRef] = useState<MessageProps[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  // States for status of login users
  const [signedInUserData, setSignedInUserData] = useState<any>(null);
  const [isSignedIn, setIsSignedIn] = useState<boolean>(false);
  // const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        // If user is signed in Navigate to Home Page
        // navigate('/');
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        const uid = user.uid;
        // When the user state is known, we set the state isSignedIn to true
        if (signedInUserData === null) {
          // If anonymous user is signed in
          // Set the user data to the signed in user
          if (user.isAnonymous) {
            setSignedInUserData(
              {
                displayName: "Anonymous",
                email: "Anonymous",
                photoURL: "Anonymous",
                uid: user.uid
              }
            );
          }
          setSignedInUserData(user);
          console.log("Signed In User Data ==> ", user);
          setIsSignedIn(true);
          // router.push('/');
        }
      } else {
        // User is signed out
        console.log("User is Not Signed In Yet");
        // When the user state is known, we set the state isSignedIn to false
        setIsSignedIn(false);
        // Navigate to Login Page
        // alert("Please Login First")
        router.push('/login');
        // ...
      }
      // When the user state is known, we set the loading state to false
      setLoading(false);
    });
  });

  const callApi = async (input: string) => {
    setLoading(true);

    const myMessage: MessageProps = {
      text: input,
      from: Creator.Me,
      key: new Date().getTime(),
      userPhotoURL: signedInUserData.photoURL
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
        key: new Date().getTime(),
        userPhotoURL: signedInUserData.photoURL
      };

      // Now adding the data to the firestore
      addData(
        {
          "user": signedInUserData.email,
          "uuid": signedInUserData.uid,
          "name": signedInUserData.displayName,
          "photoURL": signedInUserData.photoURL,
          "question": input,
          "answer": response.text,
          "timestamp": new Date().toLocaleString()
        }
      );

      setMessages([...messagesRef.current, botMessage]);
    } else {
      // Show Error
    }
  };

  const addData = (data: any) => {
    if (signedInUserData !== null) {
      ////////////////////////////// For New Version of Firebase(V9) //////////////////////////////
      // ADD JOB TO FIRESTORE
      addDoc(collection(db, `Data/Chat/${signedInUserData.email}`), data)
        .then(() => {
          console.log("Data sent");
          // alert("Your Project is initialized Successfully.Redirecting you to your projects page.");
        })
        .catch(err => {
          console.warn(err);
          alert(`Error creating Job: ${err.message}`);
        });
      //
      ////////////////////////////// For New Version of Firebase(V9) //////////////////////////////

      //Now sending the data for notifications
      // }
      // else {
      //   alert("Please sign in to save project to cloud.")
      // }
      return;
    }
  }

  return (
    <>
      <Head>
        <title>OPEN AI - CHAT BOT</title>
        <meta name="description" content="AI CHAT BOT POWERED BY GPT-3.5 Turbo" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/bot.png" />
      </Head>

      <header>
        <div className="flex items-center justify-between max-w-2xl mx-auto px-4 py-4">
          <div className="flex-col items-center">
            <h2 className="text-2xl font-bold text-gray-800">
              TAKHTI CHAT BOT
            </h2>
            {/* Now display some description about the takhti chat bot */}
            <p className="text-gray-600 ml-2">
              Powered by GPT-3.5 Turbo
            </p>
          </div>

          <div className="flex items-center">
            <Button
              variant="contained"
              sx={{
                backgroundColor: '#f44336 !important',
                color: '#fff',
                '&:hover': {
                  backgroundColor: '#f44336',
                  color: '#fff',
                },
              }}
              onClick={() => {
                // signOut(auth)
                signOut(auth).then(() => {
                  // Sign-out successful.
                  router.push('/login');
                }).catch((error) => {
                  // An error happened.
                  alert("Error Logging Out: " + error.message)
                });
              }}
              endIcon={<LogoutIcon />}>
              Logout
            </Button>
          </div>
        </div>

        {/* Now display the user data */}
        <div className="flex items-center justify-between max-w-2xl mx-auto px-4 py-4">
          {isSignedIn && (
            <>
              <div
                className='flex items-center'
              >
                <Avatar
                  alt={signedInUserData.displayName}
                  src={signedInUserData.photoURL}
                  sx={{ width: 32, height: 32 }}
                />
                <p className="text-gray-600 ml-2">
                  {signedInUserData.displayName}
                </p>
              </div>

              <p
                className="text-gray-600 ml-2"
                style={{ fontSize: "1rem" }}
              >
                {signedInUserData.email}
              </p>

              {/* <p
                className="text-gray-600 ml-2"
                style={{ fontSize: "0.8rem" }}
              >
                {signedInUserData.uid}
              </p> */}
            </>
          )}
        </div>

        {/* Now Display some of the things that the user can ask from the bot */}
        <div className="flex-col items-center justify-between max-w-2xl mx-auto px-4 py-2">
          <p className="text-gray-600 ml-2"
            style={{ fontSize: "1.4rem", borderBottom: "1px solid #ccc", marginBottom: "10px" }}
          >
            You can ask me anything like:
          </p>
          <ul className="text-gray-600 ml-2">
            <li>What is Takhti Online Learning System?</li>
            <li>What is the meaning of universe?</li>
            <li>What is the meaning of science?</li>
            <li>What is the meaning of How do we evolved?</li>
          </ul>
          <p className="text-gray-600 ml-2">
            and many more...
          </p>
        </div>

      </header>
      <main
        className="relative max-w-2xl mx-auto">
        <div className='sticky top-0 w-full pt-5 px-4'>
          <ChatInput onSend={(input) => callApi(input)} disabled={loading} />
        </div>

        <div className='mt-10 px-4'>
          {messages.map((message: MessageProps) => (
            <ChatMessage
              key={message.key}
              text={message.text}
              from={message.from}
              userPhotoURL={signedInUserData?.photoURL}
            />
          ))}
          {(messages.length == 0) && (
            <p className='text-center text-gray-400'>
              I am at your service. Ask me anything.
            </p>
          )}
        </div>
        {/* <h1 className="text-center text-black" style={{fontSize:"3rem"}}>
          Under Development
        </h1> */}
        <br />
      </main>
    </>
  )
}
