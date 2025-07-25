import React, {
    createContext,
    useContext,
    useState,
    useEffect,
    type ReactNode,
} from "react";
import { FUNDING_ACCOUNT_ADDRESSES, SEARCH_UNTIL } from "../logic/config";

interface SettingsContextType {
    rpcUrl: string;
    setRpcUrl: React.Dispatch<React.SetStateAction<string>>;
    fundingAccountAddresses: string[];
    setFundingAccountAddresses: React.Dispatch<React.SetStateAction<string[]>>;
    untilSignature: string;
    setUntilSignature: React.Dispatch<React.SetStateAction<string>>;
}

const SettingsContext = createContext<SettingsContextType | undefined>(
    undefined
);

interface SettingsProviderProps {
    children: ReactNode;
}

export const SettingsProvider: React.FC<SettingsProviderProps> = ({
    children,
}) => {
    const [rpcUrl, setRpcUrl] = useState<string>(
        localStorage.getItem("rpcUrl") || ""
    );
    const [fundingAccountAddresses, setFundingAccountAddresses] = useState<
        string[]
    >(() => {
        const storedFundingAccounts = localStorage.getItem(
            "fundingAccountAddresses"
        );
        try {
            const parsedAccounts = storedFundingAccounts
                ? JSON.parse(storedFundingAccounts)
                : null;
            if (Array.isArray(parsedAccounts) && parsedAccounts.length > 0) {
                return parsedAccounts;
            }
        } catch (e) {
            console.error("Error parsing stored funding accounts:", e);
        }
        localStorage.setItem(
            "fundingAccountAddresses",
            JSON.stringify(FUNDING_ACCOUNT_ADDRESSES)
        );
        return FUNDING_ACCOUNT_ADDRESSES;
    });
    const [untilSignature, setUntilSignature] = useState<string>(() => {
        const storedUntilSignature = localStorage.getItem("untilSignature");
        if (storedUntilSignature) {
            return storedUntilSignature;
        }
        localStorage.setItem("untilSignature", SEARCH_UNTIL);
        return SEARCH_UNTIL;
    });

    // Load settings from local storage on initial mount (only for fundingAccountAddresses now, as others are initialized directly)
    useEffect(() => {
        // This useEffect is now primarily for ensuring initial defaults are set if local storage is empty
        // and for handling potential parsing errors for fundingAccountAddresses.
        // rpcUrl and untilSignature are now initialized directly in useState.
    }, []);

    // Persist rpcUrl to local storage whenever it changes
    useEffect(() => {
        localStorage.setItem("rpcUrl", rpcUrl);
    }, [rpcUrl]);

    // Persist fundingAccountAddresses to local storage whenever it changes
    useEffect(() => {
        localStorage.setItem(
            "fundingAccountAddresses",
            JSON.stringify(fundingAccountAddresses)
        );
    }, [fundingAccountAddresses]);

    // Persist untilSignature to local storage whenever it changes
    useEffect(() => {
        localStorage.setItem("untilSignature", untilSignature);
    }, [untilSignature]);

    return (
        <SettingsContext.Provider
            value={{
                rpcUrl,
                setRpcUrl,
                fundingAccountAddresses,
                setFundingAccountAddresses,
                untilSignature,
                setUntilSignature,
            }}
        >
            {children}
        </SettingsContext.Provider>
    );
};

export const useSettings = () => {
    const context = useContext(SettingsContext);
    if (context === undefined) {
        throw new Error("useSettings must be used within a SettingsProvider");
    }
    return context;
};
