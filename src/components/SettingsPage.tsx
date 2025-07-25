import React, { useState, useEffect } from "react";
import { FUNDING_ACCOUNT_ADDRESSES, SEARCH_UNTIL } from "../logic/config";
import toast from "react-hot-toast";
import { FiExternalLink } from "react-icons/fi";


import { useSettings } from "../context/SettingsContext";

const SettingsPage: React.FC = () => {
    const { setFundingAccountAddresses, setUntilSignature } = useSettings();
    const [fundingAccounts, setFundingAccounts] = useState<string[]>([]);
    const [untilSignature, setLocalUntilSignature] = useState<string>("");

    useEffect(() => {
        const storedFundingAccounts = localStorage.getItem(
            "fundingAccountAddresses"
        );
        console.log("Stored Funding Accounts:", storedFundingAccounts);
        let initialFundingAccounts: string[] = [];
        try {
            const parsedAccounts = storedFundingAccounts ? JSON.parse(storedFundingAccounts) : null;
            if (Array.isArray(parsedAccounts) && parsedAccounts.length > 0) {
                initialFundingAccounts = parsedAccounts;
            } else {
                initialFundingAccounts = FUNDING_ACCOUNT_ADDRESSES;
            }
        } catch (e) {
            console.error("Error parsing stored funding accounts:", e);
            initialFundingAccounts = FUNDING_ACCOUNT_ADDRESSES;
        }
        setFundingAccounts(initialFundingAccounts);
        console.log("Funding Accounts after initialization:", initialFundingAccounts);

        const storedUntilSignature = localStorage.getItem("untilSignature");
        if (storedUntilSignature) {
            setLocalUntilSignature(storedUntilSignature);
        } else {
            setLocalUntilSignature(SEARCH_UNTIL);
            localStorage.setItem("untilSignature", SEARCH_UNTIL);
        }
    }, []);

    const handleAddAccount = () => {
        setFundingAccounts([...fundingAccounts, ""]);
    };

    const handleRemoveAccount = (index: number) => {
        const newAccounts = fundingAccounts.filter((_, i) => i !== index);
        setFundingAccounts(newAccounts);
    };

    const handleAccountChange = (index: number, value: string) => {
        const newAccounts = [...fundingAccounts];
        newAccounts[index] = value;
        setFundingAccounts(newAccounts);
    };

    const handleSave = () => {
        const validAccounts = fundingAccounts.filter(
            (account) => account.trim() !== ""
        );
        setFundingAccountAddresses(validAccounts);
        localStorage.setItem("fundingAccountAddresses", JSON.stringify(validAccounts));

        setUntilSignature(untilSignature.trim());
        localStorage.setItem("untilSignature", untilSignature.trim());
        toast.success("Settings saved!");
    };

    const handleResetDefaults = () => {
        setFundingAccounts(FUNDING_ACCOUNT_ADDRESSES);
        setLocalUntilSignature(SEARCH_UNTIL);
        setFundingAccountAddresses(FUNDING_ACCOUNT_ADDRESSES);
        setUntilSignature(SEARCH_UNTIL);

        localStorage.removeItem("fundingAccountAddresses");
        localStorage.removeItem("untilSignature");
        toast.success("Settings reset to defaults!");
    };

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-2xl font-semibold text-nos-text-light mb-4">
                Settings
            </h2>

            <div className="bg-nos-dark-surface shadow-md rounded-lg p-6 mb-6">
                <h3 className="text-xl font-semibold text-nos-text-light mb-4">
                    Funding Accounts
                </h3>
                {fundingAccounts.map((account, index) => (
                    <div key={index} className="flex items-center space-x-2 mb-2">
                        <input
                            type="text"
                            placeholder="Enter account address"
                            className="px-4 py-2 rounded-lg bg-nos-dark-surface text-nos-text-light border border-nos-text-light focus:outline-none focus:ring-2 focus:ring-neon-green flex-grow"
                            value={account}
                            onChange={(e) => handleAccountChange(index, e.target.value)}
                        />
                        {account.trim() !== "" && (
                            <a
                                href={`https://solscan.io/account/${account}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 rounded-full bg-nos-dark-surface text-nos-text-light hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-neon-green"
                                title="View on Solscan"
                            >
                                <FiExternalLink className="h-5 w-5 text-neon-green" />
                            </a>
                        )}
                        <button
                            onClick={() => handleRemoveAccount(index)}
                            className="px-4 py-2 bg-red-600 text-white rounded-lg shadow-md hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-opacity-75"
                        >
                            Remove
                        </button>
                    </div>
                ))}
                <button
                    onClick={handleAddAccount}
                    className="px-4 py-2 bg-neon-green text-midnight-black rounded-lg shadow-md hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-neon-green focus:ring-opacity-75 mt-4"
                >
                    Add Account
                </button>
            </div>

            <div className="bg-nos-dark-surface shadow-md rounded-lg p-6 mb-6">
                <h3 className="text-xl font-semibold text-nos-text-light mb-4">
                    Until Signature
                </h3>
                <div className="flex items-center space-x-2">
                    <input
                        type="text"
                        placeholder="Enter until signature"
                        className="px-4 py-2 rounded-lg bg-nos-dark-surface text-nos-text-light border border-nos-text-light focus:outline-none focus:ring-2 focus:ring-neon-green flex-grow"
                        value={untilSignature}
                        onChange={(e) => setLocalUntilSignature(e.target.value)}
                    />
                    {untilSignature.trim() !== "" && (
                        <a
                            href={`https://solscan.io/tx/${untilSignature}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 rounded-full bg-nos-dark-surface text-nos-text-light hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-neon-green"
                            title="View on Solscan"
                        >
                            <FiExternalLink className="h-5 w-5 text-neon-green" />
                        </a>
                    )}
                </div>
            </div>

            <div className="flex justify-between mt-6">
                <button
                    onClick={handleSave}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-opacity-75"
                >
                    Save All Settings
                </button>
                <button
                    onClick={handleResetDefaults}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg shadow-md hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-opacity-75"
                >
                    Reset to Defaults
                </button>
            </div>
        </div>
    );
};

export default SettingsPage;
