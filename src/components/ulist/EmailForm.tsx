"use client";

import { useState } from "react";

interface EmailFormProps {
  users: { email: string | null; name: string | null }[];
}

export default function EmailForm({ users }: EmailFormProps) {
  const [to, setTo] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [feedback, setFeedback] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    setFeedback("");

    try {
      const res = await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ to, subject, message }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Error desconocido");

      setStatus("success");
      setFeedback("✅ Email enviado correctamente");
      setSubject("");
      setMessage("");
    } catch (err: unknown) {
      setStatus("error");
      setFeedback(`❌ ${err instanceof Error ? err.message : "Error al enviar"}`);
    }
  };

  const emailOptions = [
    { value: "", label: "Seleccionar destinatario..." },
    ...users
      .filter((u) => u.email)
      .map((u) => ({ value: u.email!, label: `${u.name ?? ""} — ${u.email}` })),
  ];

  return (
    <div className="bg-base-100 rounded-[2rem] shadow-2xl border border-base-300 p-6 md:p-8">
      <h2 className="text-2xl font-bold text-primary mb-1">📧 Enviar Email</h2>
      <p className="text-sm opacity-50 mb-6">Envía un correo a cualquier usuario registrado</p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Destinatario */}
        <div className="form-control gap-1">
          <label className="label label-text font-semibold">Destinatario</label>
          <div className="flex flex-col sm:flex-row gap-2">
            <select
              className="select select-bordered flex-1"
              value={to}
              onChange={(e) => setTo(e.target.value)}
            >
              {emailOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <input
              type="email"
              placeholder="O escribir email manualmente..."
              className="input input-bordered flex-1"
              value={to}
              onChange={(e) => setTo(e.target.value)}
            />
          </div>
        </div>

        {/* Asunto */}
        <div className="form-control gap-1">
          <label className="label label-text font-semibold">Asunto</label>
          <input
            type="text"
            placeholder="Asunto del correo"
            className="input input-bordered w-full"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            required
          />
        </div>

        {/* Mensaje */}
        <div className="form-control gap-1">
          <label className="label label-text font-semibold">Mensaje</label>
          <textarea
            placeholder="Escribe tu mensaje aquí..."
            className="textarea textarea-bordered w-full min-h-[140px]"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
          />
        </div>

        {/* Feedback */}
        {feedback && (
          <div
            className={`alert ${status === "success" ? "alert-success" : "alert-error"} py-2 text-sm`}
          >
            {feedback}
          </div>
        )}

        <button
          type="submit"
          disabled={status === "sending" || !to}
          className="btn btn-primary rounded-xl"
        >
          {status === "sending" ? (
            <span className="loading loading-spinner loading-sm" />
          ) : (
            "Enviar Email"
          )}
        </button>
      </form>
    </div>
  );
}
