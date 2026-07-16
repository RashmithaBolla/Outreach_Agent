import axios from "axios";

const API = axios.create({
    baseURL: "https://pipelineiq-eese.onrender.com",
    headers: {
        "Content-Type": "application/json",
    },
});

// ==============================
// Leads
// ==============================

export const getLeads = async () => {
    const res = await API.get("/leads");
    return res.data;
};

export const getLead = async (id) => {
    const res = await API.get(`/leads/${id}`);
    return res.data;
};

// ==============================
// Workflow
// ==============================

export const enrichLead = async (leadId) => {
    const res = await API.post("/enrich", {
        lead_id: leadId,
    });

    return res.data;
};

export const scoreLead = async (leadId) => {
    const res = await API.post("/score", {
        lead_id: leadId,
    });

    return res.data;
};

export const classifyLead = async (leadId) => {
    const res = await API.post("/classify", {
        lead_id: leadId,
    });

    return res.data;
};

export const draftEmail = async (leadId) => {
    const res = await API.post("/draft-email", {
        lead_id: leadId,
    });

    return res.data;
};

// ==============================
// Approval
// ==============================

export const approveLead = async (leadId) => {
    const res = await API.post("/approve", {
        lead_id: leadId,
        action: "approve",
    });

    return res.data;
};

export const rejectLead = async (leadId) => {
    const res = await API.post("/approve", {
        lead_id: leadId,
        action: "reject",
    });

    return res.data;
};

export const sendEmail = async (leadId) => {
    const res = await API.post("/send-email", {
        lead_id: leadId,
    });

    return res.data;
};

// ==============================
// Logs & Stats
// ==============================

export const getLogs = async () => {
    const res = await API.get("/logs");
    return res.data;
};

export const getStats = async () => {
    const res = await API.get("/stats");
    return res.data;
};

export default API;