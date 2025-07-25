import React from "react";

interface GoodNostronautsTableProps {
  goodNostronauts: Record<string, string>;
}

const GoodNostronautsTable: React.FC<GoodNostronautsTableProps> = ({
  goodNostronauts,
}) => {
  const data = Object.entries(goodNostronauts).map(([publicKey, ata]) => ({
    publicKey,
    ata,
  }));

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-semibold text-nos-text-light mb-4">
        Good Nostronauts (Total Good Nost: {data.length})
      </h2>
      <div className="overflow-x-auto bg-nos-dark-surface shadow-md rounded-lg">
        <table className="min-w-full leading-normal">
          <thead>
            <tr>
              <th className="px-5 py-3 border-b-2 border-nos-dark-surface bg-nos-dark-surface text-left text-xs font-semibold text-nos-text-light uppercase tracking-wider">
                Account Address
              </th>
              <th className="px-5 py-3 border-b-2 border-nos-dark-surface bg-nos-dark-surface text-left text-xs font-semibold text-nos-text-light uppercase tracking-wider">
                Nosana ATA
              </th>
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td
                  colSpan={2}
                  className="px-5 py-5 border-b border-nos-dark-surface bg-nos-dark-surface text-sm text-center text-nos-text-light"
                >
                  No good Nostronauts found. Click "Hard Refresh" to fetch data.
                </td>
              </tr>
            ) : (
              data.map((nostronaut, index) => (
                <tr key={index}>
                  <td className="px-5 py-5 border-b border-nos-dark-surface bg-nos-dark-surface text-sm">
                    <a
                      href={`https://solscan.io/account/${nostronaut.publicKey}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-neon-green hover:underline"
                    >
                      {nostronaut.publicKey}
                    </a>
                  </td>
                  <td className="px-5 py-5 border-b border-nos-dark-surface bg-nos-dark-surface text-sm">
                    <a
                      href={`https://solscan.io/account/${nostronaut.ata}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-neon-green hover:underline"
                    >
                      {nostronaut.ata}
                    </a>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default GoodNostronautsTable;
