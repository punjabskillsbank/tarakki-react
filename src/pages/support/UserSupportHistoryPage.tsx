import { PageBackground } from "../../components/PageBackground";
import { PageHeader } from "../../components/PageHeader";
import { Navbar } from "../../components/Navbar";
import { SupportSummaryCard } from "../../components/SupportSummaryCard";
import { Inbox, Clock, CircleCheck, Plus } from "lucide-react";
import { PrimaryButton } from "../../components/PrimaryButton";
import { SupportHistoryFilters } from "../../components/SupportHistoryFilters";
import { SupportTicketCard } from "../../components/SupportTicketCard";
import { useEffect, useMemo, useState } from "react";
import SupportServices from "../../services/SupportServices";
import type { SupportTicket } from "../../types/support";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import config from "../../config/indexConfig";

export function UserSupportHistoryPage() {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("ALL");
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [selectedDate, setSelectedDate] = useState("");
  const navigate = useNavigate();

  // Fetch support tickets for the logged-in member
  useEffect(() => {
    const fetchSupportTickets = async () => {
      try {
        const memberId = localStorage.getItem("memberId");

        if (!memberId) {
          toast.error("Member ID not found.");
          return;
        }

        const response = await SupportServices.getMemberSupportTickets(
          memberId
        );

        setTickets(response);
      } catch (error) {
        console.error("Error fetching support tickets:", error);
        toast.error("Failed to fetch support history.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchSupportTickets();
  }, []);

  // Calculate summary values
  const summary = useMemo(() => {
    return {
      allRequests: tickets.length,

      awaitingResponse: tickets.filter(
        (ticket) => ticket.ticketStatus === "OPEN"
      ).length,

      completed: tickets.filter((ticket) =>
        ["RESOLVED", "CLOSED"].includes(ticket.ticketStatus)
      ).length,
    };
  }, [tickets]);

  const filteredTickets = useMemo(() => {
    return tickets.filter((ticket) => {
      // Search by ticket ID, subject or message
      const query = searchQuery.trim().toLowerCase();

      const matchesSearch =
        !query ||
        ticket.ticketId.toLowerCase().includes(query) ||
        ticket.subject.toLowerCase().includes(query) ||
        ticket.message.toLowerCase().includes(query);

      // Filter by status
      const matchesStatus =
        selectedStatus === "ALL" || ticket.ticketStatus === selectedStatus;

      // Filter by category
      const matchesCategory =
        selectedCategory === "ALL" || ticket.issueCategory === selectedCategory;

      // Filter by creation date
      const matchesDate =
        !selectedDate ||
        new Date(ticket.createdAt).toLocaleDateString("en-CA") === selectedDate;

      return matchesSearch && matchesStatus && matchesCategory && matchesDate;
    });
  }, [tickets, searchQuery, selectedStatus, selectedCategory, selectedDate]);

  // Format date returned by backend
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    });
  };

  // Format category and status for UI
  const formatLabel = (value: string) =>
    value
      .replace(/_/g, " ")
      .toLowerCase()
      .replace(/\b\w/g, (char) => char.toUpperCase());

  return (
    <>
      <Navbar />

      <div className="p-6">
        <PageBackground />

        <div className="relative z-10 p-6">
          <div className="relative">
            <PageHeader
              title="Support History"
              subtitle="View and manage your previous support requests."
            />

            <PrimaryButton
              className="absolute right-0 top-0"
              onClick={() => navigate(config.routes.userSupport)}>
              <Plus size={18} />
              New Support Ticket
            </PrimaryButton>
          </div>

          {/* Summary Cards */}
          <div className="mt-8 grid grid-cols-3 gap-4">
            <SupportSummaryCard
              icon={<Inbox size={18} />}
              value={summary.allRequests}
              label="All Requests"
              iconBackground="bg-blue-50"
              iconColor="text-blue-500"
            />

            <SupportSummaryCard
              icon={<Clock size={18} />}
              value={summary.awaitingResponse}
              label="Awaiting Response"
              iconBackground="bg-blue-50"
              iconColor="text-blue-500"
            />

            <SupportSummaryCard
              icon={<CircleCheck size={18} />}
              value={summary.completed}
              label="Completed"
              iconBackground="bg-green-50"
              iconColor="text-green-500"
            />
          </div>

          {/* Filters */}
          <div className="mt-6">
            <SupportHistoryFilters
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              selectedStatus={selectedStatus}
              setSelectedStatus={setSelectedStatus}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
            />
          </div>

          {/* Ticket List */}
          <div className="mt-6 flex flex-col gap-4">
            {isLoading ? (
              <div className="py-12 text-center text-gray-500">
                Loading support history...
              </div>
            ) : tickets.length === 0 ? (
              <div className="rounded-xl bg-white py-12 text-center">
                <Inbox
                  size={40}
                  className="mx-auto mb-3 text-gray-400"
                />
                <h3 className="text-lg font-semibold text-gray-700">
                  No support requests yet
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Your submitted support requests will appear here.
                </p>
              </div>
            ) : filteredTickets.length === 0 ? (
              <div className="rounded-xl bg-white py-12 text-center">
                <h3 className="text-lg font-semibold text-gray-700">
                  No matching support requests
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Try changing your search or filters.
                </p>
              </div>
            ) : (
              filteredTickets.map((ticket) => (
                <SupportTicketCard
                  key={ticket.ticketId}
                  title={ticket.subject}
                  description={ticket.message}
                  category={formatLabel(ticket.issueCategory)}
                  status={formatLabel(ticket.ticketStatus)}
                  createdAt={formatDate(ticket.createdAt)}
                  updatedAt={formatDate(ticket.updatedAt)}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
}
