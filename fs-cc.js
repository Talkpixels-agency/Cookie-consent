{\rtf1\ansi\ansicpg1252\cocoartf2821
\cocoatextscaling0\cocoaplatform0{\fonttbl\f0\fswiss\fcharset0 Helvetica;}
{\colortbl;\red255\green255\blue255;}
{\*\expandedcolortbl;;}
\paperw11900\paperh16840\margl1440\margr1440\vieww11520\viewh8400\viewkind0
\pard\tx720\tx1440\tx2160\tx2880\tx3600\tx4320\tx5040\tx5760\tx6480\tx7200\tx7920\tx8640\pardirnatural\partightenfactor0

\f0\fs24 \cf0 document.addEventListener("DOMContentLoaded", function () \{\
    const COOKIE_NAME = "fs-cc-consent";\
    const DEBUG_MODE = document.querySelector('script[fs-cc-debug="true"]') !== null;\
    const USE_WEBFLOW_INTERACTIONS = document.querySelector('script[fs-cc-webflow="true"]') !== null;\
\
    function logDebug(message) \{\
        if (DEBUG_MODE) \{\
            console.log("[Finsweet Cookie Consent]:", message);\
        \}\
    \}\
\
    function getConsent() \{\
        const consent = localStorage.getItem(COOKIE_NAME);\
        return consent ? JSON.parse(consent) : null;\
    \}\
\
    function setConsent(consent) \{\
        localStorage.setItem(COOKIE_NAME, JSON.stringify(consent));\
        logDebug("Consent updated: " + JSON.stringify(consent));\
    \}\
\
    function applyConsent(consent) \{\
        document.querySelectorAll('script[type="fs-cc"]').forEach(script => \{\
            const categories = script.getAttribute("fs-cc-categories")?.split(",") || [];\
            if (categories.some(cat => consent[cat])) \{\
                let newScript = document.createElement("script");\
                newScript.type = "text/javascript";\
                if (script.src) \{\
                    newScript.src = script.src;\
                \} else \{\
                    newScript.textContent = script.textContent;\
                \}\
                script.parentNode.replaceChild(newScript, script);\
                logDebug(`Activated script: $\{script.src || "inline script"\}`);\
            \}\
        \});\
    \}\
\
    function handleConsentAction(action) \{\
        let consent = getConsent() || \{ essential: true, analytics: false, marketing: false, personalization: false \};\
        if (action === "allow") \{\
            consent = \{ essential: true, analytics: true, marketing: true, personalization: true \};\
        \} else if (action === "deny") \{\
            consent = \{ essential: true, analytics: false, marketing: false, personalization: false \};\
        \}\
        setConsent(consent);\
        applyConsent(consent);\
        if (!USE_WEBFLOW_INTERACTIONS) \{\
            document.querySelector('[fs-cc="banner"]').style.display = "none";\
        \}\
    \}\
\
    function setupEventListeners() \{\
        document.querySelectorAll("[fs-cc]").forEach(element => \{\
            const action = element.getAttribute("fs-cc");\
            element.addEventListener("click", function () \{\
                logDebug(`Triggered action: $\{action\}`);\
                if (["allow", "deny"].includes(action)) \{\
                    handleConsentAction(action);\
                \} else if (action === "close") \{\
                    if (!USE_WEBFLOW_INTERACTIONS) \{\
                        document.querySelector('[fs-cc="banner"]').style.display = "none";\
                    \}\
                \} else if (action === "open-preferences") \{\
                    document.querySelector('[fs-cc="preferences"]').style.display = "block";\
                \} else if (action === "submit") \{\
                    const consent = \{ essential: true \};\
                    document.querySelectorAll('[fs-cc-checkbox]').forEach(checkbox => \{\
                        consent[checkbox.getAttribute("fs-cc-checkbox")] = checkbox.checked;\
                    \});\
                    setConsent(consent);\
                    applyConsent(consent);\
                    document.querySelector('[fs-cc="preferences"]').style.display = "none";\
                \}\
            \});\
        \});\
    \}\
\
    function init() \{\
        const consent = getConsent();\
        if (consent) \{\
            applyConsent(consent);\
            if (!USE_WEBFLOW_INTERACTIONS) \{\
                document.querySelector('[fs-cc="banner"]').style.display = "none";\
            \}\
        \} else \{\
            if (!USE_WEBFLOW_INTERACTIONS) \{\
                document.querySelector('[fs-cc="banner"]').style.display = "block";\
            \}\
        \}\
        setupEventListeners();\
    \}\
\
    init();\
\});\
}