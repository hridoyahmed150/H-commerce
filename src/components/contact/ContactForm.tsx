import { useState } from "react";
import { useToast } from "@/hooks/useToast";

const FORMSPREE_ENDPOINT = "https://formspree.io/f/xgorlnbo";

export default function ContactForm() {
  const { success, error } = useToast();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  return (
    <form
      className="stack-md"
      onSubmit={async (event) => {
        event.preventDefault();
        setIsSubmitting(true);
        try {
          const response = await fetch(FORMSPREE_ENDPOINT, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
            body: JSON.stringify({
              name,
              email,
              message,
            }),
          });

          if (!response.ok) {
            throw new Error("Failed to send message");
          }

          success("Message sent", "Thanks! We will get back to you shortly.");
          setName("");
          setEmail("");
          setMessage("");
        } catch (submitError) {
          error(
            "Could not send message",
            submitError instanceof Error ? submitError.message : "Try again in a moment.",
          );
        } finally {
          setIsSubmitting(false);
        }
      }}
    >
      <label className="field">
        <span>Name</span>
        <input
          name="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          disabled={isSubmitting}
        />
      </label>
      <label className="field">
        <span>Email</span>
        <input
          name="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={isSubmitting}
        />
      </label>
      <label className="field">
        <span>Message</span>
        <textarea
          name="message"
          rows={5}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
          disabled={isSubmitting}
        />
      </label>
      <button className="btn btn-primary" type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Sending..." : "Send message"}
      </button>
    </form>
  );
}
