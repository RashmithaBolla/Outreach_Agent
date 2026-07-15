import {
    createContext,
    useContext,
    useEffect,
    useState
} from "react";

import {
    getLeads,
    getLead,
    enrichLead,
    scoreLead,
    classifyLead,
    draftEmail,
    approveLead,
    rejectLead,
    sendEmail,
    getStats,
    getLogs
} from "../services/api";

const LeadContext = createContext();

export const useLead = () => useContext(LeadContext);

export const LeadProvider = ({ children }) => {

    const [leads, setLeads] = useState([]);
    const [selectedLead, setSelectedLead] = useState(null);

    const [stats, setStats] = useState({});

    const [logs, setLogs] = useState([]);

    const [loading, setLoading] = useState(false);

    // ===========================
    // Initial Load
    // ===========================

    useEffect(() => {
        refreshAll();
    }, []);

    // ===========================
    // Refresh Everything
    // ===========================

    const refreshAll = async () => {

        setLoading(true);

        try {

            const leadData = await getLeads();

            setLeads(leadData);

            if (leadData.length > 0 && !selectedLead) {
                setSelectedLead(leadData[0]);
            }

            const statsData = await getStats();

            setStats(statsData);

            const logData = await getLogs();

            setLogs(logData);

        }

        catch (err) {

            console.error(err);

        }

        setLoading(false);

    };

    // ===========================
    // Refresh One Lead
    // ===========================

    const refreshLead = async (id) => {

        const updated = await getLead(id);

        setSelectedLead(updated);

        setLeads(prev =>
            prev.map(l =>
                l.id === id ? updated : l
            )
        );

        return updated;

    };

    // ===========================
    // Workflow
    // ===========================

    const enrich = async (id) => {

        await enrichLead(id);

        await refreshLead(id);

        await refreshAll();

    };

    const score = async (id) => {

        await scoreLead(id);

        await refreshLead(id);

        await refreshAll();

    };

    const classify = async (id) => {

        await classifyLead(id);

        await refreshLead(id);

        await refreshAll();

    };

    const generateEmail = async (id) => {

        await draftEmail(id);

        await refreshLead(id);

        await refreshAll();

    };

    const approve = async (id) => {

        await approveLead(id);

        await refreshLead(id);

        await refreshAll();

    };

    const reject = async (id) => {

        await rejectLead(id);

        await refreshLead(id);

        await refreshAll();

    };

    const send = async (id) => {

        await sendEmail(id);

        await refreshLead(id);

        await refreshAll();

    };

    return (

        <LeadContext.Provider

            value={{

                leads,

                selectedLead,

                setSelectedLead,

                stats,

                logs,

                loading,

                refreshAll,

                enrich,

                score,

                classify,

                generateEmail,

                approve,

                reject,

                send

            }}

        >

            {children}

        </LeadContext.Provider>

    );

};