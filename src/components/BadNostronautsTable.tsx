import React from "react";

interface BadNostronautsTableProps {
  badNostronauts: Record<string, { ataAddress: string; remarks: string[] }>;
}

const BadNostronautsTable: React.FC<BadNostronautsTableProps> = ({
  badNostronauts,
}) => {
  const data = Object.entries(badNostronauts).map(([publicKey, info]) => ({
    publicKey,
    ata: info.ataAddress,
    remarks: info.remarks,
  }));

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-semibold text-nos-text-light mb-4">
        Bad Nostronauts (Total Bad Nost: {data.length})
      </h2>
      <div className="overflow-x-auto bg-nos-dark-surface shadow-md rounded-lg">
        <table className="min-w-full leading-normal">
          <thead>
            <tr>
              <th className="px-3 py-3 border-b-2 border-nos-dark-surface bg-nos-dark-surface text-left text-xs font-semibold text-nos-text-light uppercase tracking-wider">
                Account Address
              </th>
              <th className="px-3 py-3 border-b-2 border-nos-dark-surface bg-nos-dark-surface text-left text-xs font-semibold text-nos-text-light uppercase tracking-wider">
                Nosana ATA
              </th>
              <th className="px-3 py-3 border-b-2 border-nos-dark-surface bg-nos-dark-surface text-left text-xs font-semibold text-nos-text-light uppercase tracking-wider">
                Remarks
              </th>
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td
                  colSpan={3}
                  className="px-3 py-5 border-b border-nos-dark-surface bg-nos-dark-surface text-sm text-center text-nos-text-light"
                >
                  No bad Nostronauts found. Click "Hard Refresh" to fetch data.
                </td>
              </tr>
            ) : (
              data.map((nostronaut, index) => (
                <tr key={index}>
                  <td className="px-3 py-5 border-b border-nos-dark-surface bg-nos-dark-surface text-sm">
                    <a
                      href={`https://solscan.io/account/${nostronaut.publicKey}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-neon-green hover:underline"
                    >
                      {nostronaut.publicKey}
                    </a>
                  </td>
                  <td className="px-3 py-5 border-b border-nos-dark-surface bg-nos-dark-surface text-sm">
                    <a
                      href={`https://solscan.io/account/${nostronaut.ata}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-neon-green hover:underline"
                    >
                      {nostronaut.ata}
                    </a>
                  </td>
                  <td className="px-3 py-5 border-b border-nos-dark-surface bg-nos-dark-surface text-sm text-nos-text-light whitespace-normal">
                    {nostronaut.remarks.map((remark, remarkIndex) => {
                      if (remark.startsWith("Sent to suspicious accounts: ")) {
                        const addresses = remark
                          .substring("Sent to suspicious accounts: ".length)
                          .split(", ");
                        return (
                          <div key={remarkIndex}>
                            Sent to suspicious accounts:{" "}
                            {addresses.map((address, addrIndex) => (
                              <React.Fragment key={addrIndex}>
                                <a
                                  href={`https://solscan.io/account/${address}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-400 hover:underline"
                                >
                                  {address}
                                </a>
                                {addrIndex < addresses.length - 1 && ", "}
                              </React.Fragment>
                            ))}
                          </div>
                        );
                      }
                      return <div key={remarkIndex}>{remark}</div>;
                    })}
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

export default BadNostronautsTable;
