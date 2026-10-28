// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title ALPOEvidence
 * @notice Registro inmutable de evidencias de riesgo detectadas por ALPO.
 *         Cada evidencia se identifica con un hash SHA-256 y un timestamp.
 * @dev Desplegado en Monad Testnet (chainId: 10143)
 */
contract ALPOEvidence {
    struct Evidence {
        bytes32 hash;
        uint256 timestamp;
        address sender;
    }

    Evidence[] public evidences;

    event EvidenceStored(
        bytes32 indexed hash,
        uint256 timestamp,
        address indexed sender
    );

    /**
     * @notice Almacena un hash de evidencia con su timestamp.
     * @param evidenceHash Hash SHA-256 de la transcripción + timestamp (bytes32)
     * @param timestamp    Momento del evento en milisegundos Unix
     */
    function storeEvidence(bytes32 evidenceHash, uint256 timestamp) external {
        evidences.push(Evidence({
            hash: evidenceHash,
            timestamp: timestamp,
            sender: msg.sender
        }));
        emit EvidenceStored(evidenceHash, timestamp, msg.sender);
    }

    function getEvidenceCount() external view returns (uint256) {
        return evidences.length;
    }

    function getEvidence(uint256 index)
        external
        view
        returns (bytes32 hash, uint256 timestamp, address sender)
    {
        Evidence storage e = evidences[index];
        return (e.hash, e.timestamp, e.sender);
    }
}
