import { useDarkMode } from "@/contexts/DarkModeContext";
import React from "react";

export default function ContactForm() {
  const { currentTheme } = useDarkMode();
  const [form, setForm] = React.useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1200);
  }

  if (submitted) {
    return (
      <div className="text-center py-12">
        <h2
          className="text-2xl font-bold mb-2"
          style={{ color: currentTheme.text.primary }}>
          Merci pour votre message !
        </h2>
        <p style={{ color: currentTheme.text.secondary }}>
          Nous vous répondrons dès que possible.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-xl mx-auto bg-opacity-80 rounded-2xl p-8 flex flex-col gap-6 shadow-md"
      style={{
        background: currentTheme.background.card,
        boxShadow: `0 2px 12px ${currentTheme.border.primary}22`,
      }}>
      <div className="flex flex-col gap-2">
        <label
          htmlFor="name"
          className="font-medium"
          style={{ color: currentTheme.text.primary }}>
          Nom
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          value={form.name}
          onChange={handleChange}
          className="px-4 py-2 rounded border outline-none transition-all"
          style={{
            background: currentTheme.background.secondary,
            color: currentTheme.text.primary,
            borderColor: currentTheme.border.primary,
          }}
        />
      </div>
      <div className="flex flex-col gap-2">
        <label
          htmlFor="email"
          className="font-medium"
          style={{ color: currentTheme.text.primary }}>
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          value={form.email}
          onChange={handleChange}
          className="px-4 py-2 rounded border outline-none transition-all"
          style={{
            background: currentTheme.background.secondary,
            color: currentTheme.text.primary,
            borderColor: currentTheme.border.primary,
          }}
        />
      </div>
      <div className="flex flex-col gap-2">
        <label
          htmlFor="message"
          className="font-medium"
          style={{ color: currentTheme.text.primary }}>
          Message
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          value={form.message}
          onChange={handleChange}
          className="px-4 py-2 rounded border outline-none transition-all resize-none"
          style={{
            background: currentTheme.background.secondary,
            color: currentTheme.text.primary,
            borderColor: currentTheme.border.primary,
          }}
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="mt-2 py-2 px-6 rounded-lg font-semibold transition-all text-white"
        style={{
          background: currentTheme.interactive.primary,
          opacity: loading ? 0.7 : 1,
          cursor: loading ? "not-allowed" : "pointer",
        }}>
        {loading ? "Envoi..." : "Envoyer"}
      </button>
    </form>
  );
}
