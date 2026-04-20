import { useState } from "react";
import { useToast } from "@/hooks/useToast";

export default function ContactForm() {
  const { success } = useToast();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  return (
    <form
      className="stack-md"
      onSubmit={(event) => {
        event.preventDefault();
        success("Message recorded", "Hook this form to a support service when ready.");
        setName("");
        setEmail("");
        setMessage("");
      }}
    >
      <label className="field">
        <span>Name</span>
        <input value={name} onChange={(e) => setName(e.target.value)} required />
      </label>
      <label className="field">
        <span>Email</span>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      </label>
      <label className="field">
        <span>Message</span>
        <textarea rows={5} value={message} onChange={(e) => setMessage(e.target.value)} required />
      </label>
      <button className="btn btn-primary" type="submit">
        Send message
      </button>
    </form>
  );
}
