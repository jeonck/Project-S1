const StatusBadge = ({ status }) => {
  const getStatusClass = (status) => {
    const statusClasses = {
      '요구정의': 'status-planned', // Requirements Definition
      '설계': 'status-progress',    // Design
      '종료': 'status-completed',   // Completed
      '진단': 'status-diagnosis',   // Diagnosis/Review - using a new custom class
    };
    return statusClasses[status] || 'status-planned'; // Default to 'planned' if status is not found
  };

  return <span className={getStatusClass(status)}>{status}</span>;
};

export default StatusBadge;
