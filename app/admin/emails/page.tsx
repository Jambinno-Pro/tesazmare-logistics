"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Mail,
  Send,
  Inbox,
  Plus,
  Search,
  RefreshCw,
  ArrowLeft,
  Reply,
  X,
  MailOpen,
  Loader2,
} from "lucide-react";
import "./emails.css";

type Mailbox = "info" | "booking";

interface EmailSummary {
  id: string;
  senderName: string;
  senderEmail: string;
  subject: string;
  date: string | null;
  isRead: boolean;
}

interface EmailDetails extends EmailSummary {
  recipients: string[];
  textBody: string;
  htmlBody?: string | null;
  messageId?: string | null;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "");

export default function EmailsPage() {
  const [mailbox, setMailbox] = useState<Mailbox>("info");
  const [emails, setEmails] = useState<EmailSummary[]>([]);
  const [selectedEmail, setSelectedEmail] = useState<EmailDetails | null>(null);

  const [loading, setLoading] = useState(true);
  const [loadingMessage, setLoadingMessage] = useState(false);
  const [sending, setSending] = useState(false);

  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const [composeOpen, setComposeOpen] = useState(false);
  const [replyMode, setReplyMode] = useState(false);

  const [recipient, setRecipient] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");

  const unreadCount = emails.filter((email) => !email.isRead).length;

  const apiFetch = useCallback(
    async (path: string, options: RequestInit = {}) => {
      if (!API_URL) {
        throw new Error(
          "NEXT_PUBLIC_API_URL is not configured. Add your backend API URL to the frontend environment variables.",
        );
      }

      const response = await fetch(`${API_URL}${path}`, {
        ...options,
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          ...options.headers,
        },
      });

      if (!response.ok) {
        const message = await response.text();
        throw new Error(message || `Request failed (${response.status})`);
      }

      if (response.status === 204) return null;

      return response.json();
    },
    [],
  );

  const loadInbox = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const data = await apiFetch(
        `/emails/cpanel/inbox?mailbox=${mailbox}&limit=50`,
      );

      setEmails(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load emails.");
    } finally {
      setLoading(false);
    }
  }, [apiFetch, mailbox]);

  useEffect(() => {
    loadInbox();
  }, [loadInbox]);

  const openEmail = async (email: EmailSummary) => {
    setLoadingMessage(true);
    setError("");

    try {
      const data: EmailDetails = await apiFetch(
        `/emails/cpanel/message/${email.id}?mailbox=${mailbox}`,
      );

      setSelectedEmail(data);

      setEmails((previous) =>
        previous.map((item) =>
          item.id === email.id ? { ...item, isRead: true } : item,
        ),
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to open email.");
    } finally {
      setLoadingMessage(false);
    }
  };

  const markUnread = async () => {
    if (!selectedEmail) return;

    try {
      await apiFetch(`/emails/cpanel/message/${selectedEmail.id}/read`, {
        method: "PATCH",
        body: JSON.stringify({
          mailbox,
          isRead: false,
        }),
      });

      setEmails((previous) =>
        previous.map((item) =>
          item.id === selectedEmail.id ? { ...item, isRead: false } : item,
        ),
      );

      setSelectedEmail(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to update email.");
    }
  };

  const openCompose = () => {
    setReplyMode(false);
    setRecipient("");
    setSubject("");
    setBody("");
    setComposeOpen(true);
  };

  const openReply = () => {
    if (!selectedEmail) return;

    setReplyMode(true);
    setRecipient(selectedEmail.senderEmail);
    setSubject(
      selectedEmail.subject.toLowerCase().startsWith("re:")
        ? selectedEmail.subject
        : `Re: ${selectedEmail.subject}`,
    );
    setBody("");
    setComposeOpen(true);
  };

  const sendEmail = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!recipient.trim() || !body.trim()) return;

    setSending(true);
    setError("");

    try {
      if (replyMode && selectedEmail) {
        await apiFetch("/emails/cpanel/reply", {
          method: "POST",
          body: JSON.stringify({
            mailbox,
            id: selectedEmail.id,
            body,
          }),
        });
      } else {
        await apiFetch("/emails/cpanel/send", {
          method: "POST",
          body: JSON.stringify({
            mailbox,
            recipient,
            subject,
            body,
          }),
        });
      }

      setComposeOpen(false);
      setRecipient("");
      setSubject("");
      setBody("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to send email.");
    } finally {
      setSending(false);
    }
  };

  const filteredEmails = emails.filter((email) => {
    const value = search.toLowerCase();

    return (
      email.senderName.toLowerCase().includes(value) ||
      email.senderEmail.toLowerCase().includes(value) ||
      email.subject.toLowerCase().includes(value)
    );
  });

  const formatDate = (date: string | null) => {
    if (!date) return "";

    return new Date(date).toLocaleString("en-ZA", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="emails-page">
      <div className="emails-header">
        <div>
          <h1>Emails Centre</h1>
          <p>Manage and monitor your email communications.</p>
        </div>

        <button className="compose-btn" onClick={openCompose}>
          <Plus size={18} />
          Compose Email
        </button>
      </div>

      {error && (
        <div className="emails-error">
          <span>{error}</span>
          <button onClick={() => setError("")}>
            <X size={16} />
          </button>
        </div>
      )}

      <div className="emails-stats">
        <div className="email-stat-card">
          <div className="email-stat-top">
            <p>Total Inbox Emails</p>
            <div className="email-stat-icon">
              <Mail size={20} />
            </div>
          </div>
          <h2 className="email-stat-value">{emails.length}</h2>
        </div>

        <div className="email-stat-card">
          <div className="email-stat-top">
            <p>Unread Emails</p>
            <div className="email-stat-icon">
              <Inbox size={20} />
            </div>
          </div>
          <h2 className="email-stat-value">{unreadCount}</h2>
        </div>

        <div className="email-stat-card">
          <div className="email-stat-top">
            <p>Active Mailbox</p>
            <div className="email-stat-icon">
              <Send size={20} />
            </div>
          </div>
          <h2 className="email-stat-value">
            {mailbox === "info" ? "Info" : "Booking"}
          </h2>
        </div>
      </div>

      <div className="emails-table-card">
        <div className="emails-table-header">
          <div>
            <h2>{selectedEmail ? "Email Details" : "Inbox"}</h2>
            <p>
              {selectedEmail
                ? "Read and respond to this message."
                : "Messages received in your selected mailbox."}
            </p>
          </div>

          <div className="emails-toolbar">
            <select
              value={mailbox}
              onChange={(event) => {
                setSelectedEmail(null);
                setMailbox(event.target.value as Mailbox);
              }}
              className="emails-mailbox-select"
            >
              <option value="info">info@tesazmarelogistics.co.za</option>
              <option value="booking">booking@tesazmarelogistics.co.za</option>
            </select>

            <button
              className="emails-refresh-btn"
              onClick={loadInbox}
              title="Refresh inbox"
              disabled={loading}
            >
              <RefreshCw size={17} />
            </button>
          </div>
        </div>

        {selectedEmail ? (
          <div className="email-detail">
            <div className="email-detail-actions">
              <button
                className="email-back-btn"
                onClick={() => setSelectedEmail(null)}
              >
                <ArrowLeft size={17} />
                Back to inbox
              </button>

              <button className="email-mark-btn" onClick={markUnread}>
                <MailOpen size={17} />
                Mark unread
              </button>
            </div>

            <h2 className="email-detail-subject">{selectedEmail.subject}</h2>

            <div className="email-detail-meta">
              <div className="email-avatar">
                {selectedEmail.senderName.charAt(0).toUpperCase()}
              </div>

              <div>
                <strong>{selectedEmail.senderName}</strong>
                <p>{selectedEmail.senderEmail}</p>
                <p>To: {selectedEmail.recipients.join(", ")}</p>
              </div>

              <span className="email-detail-date">
                {formatDate(selectedEmail.date)}
              </span>
            </div>

            <div className="email-detail-body">
              {selectedEmail.textBody ||
                "This email has no plain-text content."}
            </div>

            <button className="compose-btn email-reply-btn" onClick={openReply}>
              <Reply size={17} />
              Reply
            </button>
          </div>
        ) : (
          <>
            <div className="emails-search">
              <Search size={18} />
              <input
                type="text"
                placeholder="Search emails by sender or subject..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </div>

            {loading ? (
              <div className="emails-loading">
                <Loader2 size={25} className="emails-spinner" />
                <p>Loading emails...</p>
              </div>
            ) : filteredEmails.length > 0 ? (
              <div className="emails-list">
                {filteredEmails.map((email) => (
                  <button
                    className={`email-list-item ${
                      !email.isRead ? "email-unread" : ""
                    }`}
                    key={email.id}
                    onClick={() => openEmail(email)}
                  >
                    <div className="email-list-avatar">
                      {email.senderName.charAt(0).toUpperCase()}
                    </div>

                    <div className="email-list-content">
                      <div className="email-list-top">
                        <strong>{email.senderName}</strong>
                        <span>{formatDate(email.date)}</span>
                      </div>

                      <p className="email-list-address">{email.senderEmail}</p>

                      <p className="email-list-subject">{email.subject}</p>
                    </div>

                    {!email.isRead && <span className="email-unread-dot" />}
                  </button>
                ))}
              </div>
            ) : (
              <div className="emails-empty">
                <div className="emails-empty-icon">
                  <Mail size={28} />
                </div>
                <h3>{search ? "No matching emails" : "Your inbox is empty"}</h3>
                <p>
                  {search
                    ? "Try searching with another name, email address or subject."
                    : "New messages received by this mailbox will appear here."}
                </p>
              </div>
            )}
          </>
        )}
      </div>

      {loadingMessage && (
        <div className="emails-loading-overlay">
          <Loader2 size={30} className="emails-spinner" />
          <p>Opening email...</p>
        </div>
      )}

      {composeOpen && (
        <div className="email-modal-overlay">
          <div className="email-compose-modal">
            <div className="email-modal-header">
              <div>
                <h2>{replyMode ? "Reply to Email" : "Compose Email"}</h2>
                <p>
                  Sending from{" "}
                  {mailbox === "info"
                    ? "info@tesazmarelogistics.co.za"
                    : "booking@tesazmarelogistics.co.za"}
                </p>
              </div>

              <button
                className="email-modal-close"
                onClick={() => setComposeOpen(false)}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={sendEmail}>
              <label>From</label>
              <input
                value={
                  mailbox === "info"
                    ? "info@tesazmarelogistics.co.za"
                    : "booking@tesazmarelogistics.co.za"
                }
                disabled
              />

              <label>To</label>
              <input
                type="email"
                value={recipient}
                onChange={(event) => setRecipient(event.target.value)}
                placeholder="Recipient email address"
                required
              />

              <label>Subject</label>
              <input
                value={subject}
                onChange={(event) => setSubject(event.target.value)}
                placeholder="Email subject"
                required
              />

              <label>Message</label>
              <textarea
                value={body}
                onChange={(event) => setBody(event.target.value)}
                placeholder="Write your message..."
                rows={8}
                required
              />

              <div className="email-compose-actions">
                <button
                  type="button"
                  className="email-cancel-btn"
                  onClick={() => setComposeOpen(false)}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="compose-btn"
                  disabled={sending}
                >
                  {sending ? (
                    <Loader2 size={17} className="emails-spinner" />
                  ) : (
                    <Send size={17} />
                  )}
                  {sending ? "Sending..." : "Send Email"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
